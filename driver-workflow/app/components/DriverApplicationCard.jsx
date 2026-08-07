'use client';
import React, { useState } from 'react';

export default function DriverApplicationCard() {
  const [formData, setFormData] = useState({
    employeeName: '',
    division: '',
    dispatcherName: '',
    dateOfHire: '',
    county: '',
    requestDate: '',
    licenseNumber: '',
    last4SSN: '',
    pipelineStage: 'dispatch_draft', 
    mvrDate: '',
    mvrSupervisor: '',
    fleetManagerEmail: '',
    mvrStatus: '', 
    movingViolations: 0,
    accidents: 0,
    duiDwi: false,
    mvrComments: '',
    gmReviewer: '',
    gmReviewDate: '',
    gmEmail: '',
    truckClassDate: '',
    truckClassScore: '',
    attendanceRecord: '',
    safetyRecord: '',
    gmStatus: '', 
    gmComments: '',
    dispatcherSign: false,
    fleetSign: false,
    gmSign: false,
  });

  const [notification, setNotification] = useState(null);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Matrix calculation algorithm based on the USI Insurance Services table
  const calculateMvrMatrix = (violations, accidents, hasDui) => {
    if (hasDui) return { status: 'Prohibited', color: 'bg-red-600 text-white border-red-500' };
    
    const v = parseInt(violations) || 0;
    const a = parseInt(accidents) || 0;

    if (v >= 5 || a >= 4 || v > 5 || a > 3) return { status: 'Prohibited', color: 'bg-red-600 text-white border-red-500' };

    const grid = {
      0: { 0: 'Clear', 1: 'Acceptable', 2: 'Borderline', 3: 'Prohibited' },
      1: { 0: 'Acceptable', 1: 'Acceptable', 2: 'Borderline', 3: 'Prohibited' },
      2: { 0: 'Acceptable', 1: 'Borderline', 2: 'Prohibited', 3: 'Prohibited' },
      3: { 0: 'Borderline', 1: 'Prohibited', 2: 'Prohibited', 3: 'Prohibited' },
      4: { 0: 'Prohibited', 1: 'Prohibited', 2: 'Prohibited', 3: 'Prohibited' },
      5: { 0: 'Prohibited', 1: 'Prohibited', 2: 'Prohibited', 3: 'Prohibited' },
    };

    const row = grid[Math.min(v, 5)];
    const result = row ? (row[Math.min(a, 3)] || 'Prohibited') : 'Prohibited';

    if (result === 'Clear') return { status: 'Clear', color: 'bg-emerald-800 text-emerald-200 border-emerald-600' };
    if (result === 'Acceptable') return { status: 'Acceptable', color: 'bg-emerald-600 text-white border-emerald-500' };
    if (result === 'Borderline') return { status: 'Borderline (Yellow - Review Needed)', color: 'bg-amber-500 text-black border-amber-400 font-bold' };
    return { status: 'Prohibited (Red - Disqualified / Meeting Required)', color: 'bg-red-600 text-white border-red-500 font-bold animate-pulse' };
  };

  const currentMatrixResult = calculateMvrMatrix(formData.movingViolations, formData.accidents, formData.duiDwi);

  const handleMoveToMVR = async () => {
    if (!formData.employeeName || !formData.division || !formData.dispatcherName) {
      alert("Please fill out Employee Name, Division, and Requesting Dispatcher before moving to MVR.");
      return;
    }

    setFormData((prev) => ({ ...prev, pipelineStage: 'mvr_review' }));
    setNotification({
      type: 'fleet_alert',
      message: `🔔 NOTIFICATION TO FLEET MANAGER: New driver application request submitted for ${formData.employeeName} (${formData.division}).`
    });

    // Trigger Email Notification API
    if (formData.fleetManagerEmail) {
      try {
        await fetch('/api/notify-manager', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            recipientEmail: formData.fleetManagerEmail,
            stepName: 'Step 2: MVR Matrix Review',
            employeeName: formData.employeeName,
            status: 'Pending MVR Evaluation',
          }),
        });
      } catch (err) {
        console.error("Email notification dispatch error:", err);
      }
    }
  };

  const handleMVRSubmission = async () => {
    if (!formData.mvrSupervisor || !formData.licenseNumber || !formData.last4SSN) {
      alert("Please complete Fleet Manager name, License #, and Last 4 of SSN.");
      return;
    }

    setFormData((prev) => ({ ...prev, pipelineStage: 'holding_truck_class', mvrStatus: currentMatrixResult.status }));
    setNotification({
      type: 'holding_alert',
      message: `✅ MVR EVALUATED: Status logged as [${currentMatrixResult.status}]. Application is now holding in Dispatch pending Truck Class evaluation.`
    });
  };

  const handleTruckClassComplete = async () => {
    setFormData((prev) => ({ ...prev, pipelineStage: 'gm_review' }));
    setNotification({
      type: 'fleet_alert',
      message: `🔔 NOTIFICATION TO GENERAL MANAGER: Truck class complete and verified. Application moved to GM Performance Review (Step 3).`
    });

    if (formData.gmEmail) {
      try {
        await fetch('/api/notify-manager', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            recipientEmail: formData.gmEmail,
            stepName: 'Step 3: GM Review & Final Sign-Off',
            employeeName: formData.employeeName,
            status: currentMatrixResult.status,
          }),
        });
      } catch (err) {
        console.error("GM email dispatch error:", err);
      }
    }
  };

  const handleFinalPromotion = async () => {
    if (!formData.dispatcherSign || !formData.fleetSign || !formData.gmSign) {
      alert("All three parties (Dispatcher, Fleet Manager, and General Manager) must sign off before executing final promotion.");
      return;
    }

    try {
      const response = await fetch('/api/promote-driver', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, finalMvrEvaluation: currentMatrixResult.status }),
      });

      const result = await response.json();

      if (result.success) {
        setFormData((prev) => ({ ...prev, pipelineStage: 'completed' }));
      } else {
        alert("Server error: " + (result.error || "Could not execute promotion."));
      }
    } catch (error) {
      console.error("Connection error:", error);
      alert("Could not connect to the Control by Crews server.");
    }
  };

  if (formData.pipelineStage === 'completed') {
    return (
      <div className="min-h-screen bg-[#0A0E14] p-8 text-white font-sans flex items-center justify-center">
        <div className="max-w-2xl w-full bg-[#121821] rounded-xl shadow-2xl border border-[#22C55E]/40 p-8 text-center space-y-6">
          <div className="w-16 h-16 bg-[#166534] text-[#4ADE80] rounded-full flex items-center justify-center mx-auto text-3xl border border-[#22C55E]/50 shadow-lg">
            ✓
          </div>
          <h1 className="text-3xl font-bold tracking-wider text-white">PROMOTION EXECUTED</h1>
          <p className="text-gray-300 text-sm">
            All three approvals have been logged. Master pipeline and Excel records updated.
          </p>
          
          <div className="bg-[#0A0E14] border border-gray-800 p-4 rounded-lg text-left space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Employee:</span>
              <span className="font-bold text-white">{formData.employeeName || "Marcus Vance"}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Final MVR Standing:</span>
              <span className="font-bold text-amber-400">{currentMatrixResult.status}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Master Excel Log:</span>
              <span className="text-[#4ADE80] font-mono text-xs">ControlByCrews_Master_Drivers.xlsx (Updated)</span>
            </div>
          </div>

          <button 
            onClick={() => setFormData({
              employeeName: '', division: '', dispatcherName: '', dateOfHire: '', county: '', requestDate: '',
              licenseNumber: '', last4SSN: '', pipelineStage: 'dispatch_draft', mvrDate: '', mvrSupervisor: '',
              fleetManagerEmail: '', mvrStatus: '', movingViolations: 0, accidents: 0, duiDwi: false, mvrComments: '',
              gmReviewer: '', gmReviewDate: '', gmEmail: '', truckClassDate: '', truckClassScore: '', attendanceRecord: '',
              safetyRecord: '', gmStatus: '', gmComments: '', dispatcherSign: false, fleetSign: false, gmSign: false
            })}
            className="text-gray-400 hover:text-white text-sm underline mt-4 block mx-auto cursor-pointer"
          >
            ← Start New Application
          </button>
        </div>
      </div>
    );
  }

  const isProhibitedOrFlagged = currentMatrixResult.status.includes('Prohibited');

  return (
    <div className="min-h-screen bg-[#0A0E14] p-8 text-white font-sans">
      <div className={`max-w-5xl mx-auto bg-[#121821] rounded-xl shadow-2xl border transition-all duration-300 overflow-hidden ${isProhibitedOrFlagged && formData.pipelineStage !== 'dispatch_draft' && formData.pipelineStage !== 'mvr_review' ? 'border-red-600 ring-2 ring-red-600/50' : 'border-gray-800'}`}>
        
        {/* HEADER & PIPELINE BANNER */}
        <div className="bg-[#1A222D] px-6 py-4 flex justify-between items-center border-b border-gray-800">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#0A0E14] border border-[#22C55E]/40 flex items-center justify-center overflow-hidden shadow-md p-1">
              <img src="/logo.png" alt="Crews Control Logo" className="w-full h-full object-cover scale-110" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-wider text-gray-100">DRIVER APPLICATION REQUEST</h1>
              <p className="text-gray-400 text-sm mt-0.5">Control by Crews — Stage Tracking</p>
            </div>
          </div>
          <div className="px-4 py-2 rounded font-bold tracking-wide flex items-center gap-2 shadow-lg text-sm border bg-[#166534] text-[#4ADE80] border-[#22C55E]/30">
            <span className="w-2.5 h-2.5 rounded-full bg-[#4ADE80] animate-pulse"></span>
            Stage: {formData.pipelineStage.replace('_', ' ').toUpperCase()}
          </div>
        </div>

        {isProhibitedOrFlagged && formData.pipelineStage !== 'dispatch_draft' && formData.pipelineStage !== 'mvr_review' && (
          <div className="bg-red-600 text-white px-6 py-3 font-bold text-center tracking-wider uppercase text-sm border-b border-red-500 animate-pulse">
            ⚠️ WARNING: MVR Matrix Determination is Prohibited / Disqualified. GM Meeting Required Before Approval.
          </div>
        )}

        {notification && (
          <div className="m-6 p-4 rounded-lg border text-sm font-semibold flex items-center justify-between bg-emerald-950/40 border-emerald-500/50 text-emerald-300">
            <span>{notification.message}</span>
            <button onClick={() => setNotification(null)} className="text-xs underline ml-4 cursor-pointer">Dismiss</button>
          </div>
        )}

        <div className="p-8 space-y-8">

          {/* STEP 1: DISPATCHER REQUEST */}
          <section className="border-l-4 border-gray-700 pl-6">
            <h2 className="text-xl font-bold text-gray-300 mb-4 uppercase tracking-wide">Step 1: Dispatcher Application Request</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm mb-4">
              <div>
                <label className="text-gray-400 block mb-1">Employee Name</label>
                <input 
                  type="text" 
                  placeholder="Enter employee name..." 
                  value={formData.employeeName}
                  onChange={(e) => handleChange('employeeName', e.target.value)}
                  disabled={formData.pipelineStage !== 'dispatch_draft'}
                  className="w-full bg-[#0A0E14] border border-gray-700 rounded p-2.5 text-white focus:border-[#22C55E] focus:outline-none disabled:opacity-50"
                />
              </div>
              <div>
                <label className="text-gray-400 block mb-1">Division</label>
                <input 
                  type="text" 
                  placeholder="Enter division..." 
                  value={formData.division}
                  onChange={(e) => handleChange('division', e.target.value)}
                  disabled={formData.pipelineStage !== 'dispatch_draft'}
                  className="w-full bg-[#0A0E14] border border-gray-700 rounded p-2.5 text-white focus:border-[#22C55E] focus:outline-none disabled:opacity-50"
                />
              </div>
              <div>
                <label className="text-gray-400 block mb-1">Requesting Dispatcher</label>
                <input 
                  type="text" 
                  placeholder="Enter dispatcher name..." 
                  value={formData.dispatcherName}
                  onChange={(e) => handleChange('dispatcherName', e.target.value)}
                  disabled={formData.pipelineStage !== 'dispatch_draft'}
                  className="w-full bg-[#0A0E14] border border-gray-700 rounded p-2.5 text-white focus:border-[#22C55E] focus:outline-none disabled:opacity-50"
                />
              </div>
              <div>
                <label className="text-gray-400 block mb-1">Date of Hire</label>
                <input 
                  type="date" 
                  value={formData.dateOfHire}
                  onChange={(e) => handleChange('dateOfHire', e.target.value)}
                  disabled={formData.pipelineStage !== 'dispatch_draft'}
                  className="w-full bg-[#0A0E14] border border-gray-700 rounded p-2.5 text-white focus:border-[#22C55E] focus:outline-none cursor-pointer disabled:opacity-50"
                />
              </div>
              <div>
                <label className="text-gray-400 block mb-1">County of Residence</label>
                <input 
                  type="text" 
                  placeholder="Enter county..." 
                  value={formData.county}
                  onChange={(e) => handleChange('county', e.target.value)}
                  disabled={formData.pipelineStage !== 'dispatch_draft'}
                  className="w-full bg-[#0A0E14] border border-gray-700 rounded p-2.5 text-white focus:border-[#22C55E] focus:outline-none disabled:opacity-50"
                />
              </div>
              <div>
                <label className="text-gray-400 block mb-1">Date of Request</label>
                <input 
                  type="date" 
                  value={formData.requestDate}
                  onChange={(e) => handleChange('requestDate', e.target.value)}
                  disabled={formData.pipelineStage !== 'dispatch_draft'}
                  className="w-full bg-[#0A0E14] border border-gray-700 rounded p-2.5 text-white focus:border-[#22C55E] focus:outline-none cursor-pointer disabled:opacity-50"
                />
              </div>
            </div>

            {/* Dropdown for selecting Fleet Manager routing email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <label className="text-gray-400 block mb-1">Assign Fleet Manager (For Email Notification)</label>
                <select
                  value={formData.fleetManagerEmail}
                  onChange={(e) => handleChange('fleetManagerEmail', e.target.value)}
                  disabled={formData.pipelineStage !== 'dispatch_draft'}
                  className="w-full bg-[#0A0E14] border border-gray-700 rounded p-2.5 text-white focus:border-[#22C55E] focus:outline-none disabled:opacity-50 cursor-pointer"
                >
                  <option value="">Select Fleet Manager...</option>
                  <option value="fleet1@crewscontrol.com">John Mervin (Fleet Ops Lead)</option>
                  <option value="fleet2@crewscontrol.com">Sarah Jenkins (Fleet Safety)</option>
                </select>
              </div>
              <div>
                <label className="text-gray-400 block mb-1">Assign General Manager (For Final Stage Notification)</label>
                <select
                  value={formData.gmEmail}
                  onChange={(e) => handleChange('gmEmail', e.target.value)}
                  disabled={formData.pipelineStage !== 'dispatch_draft'}
                  className="w-full bg-[#0A0E14] border border-gray-700 rounded p-2.5 text-white focus:border-[#22C55E] focus:outline-none disabled:opacity-50 cursor-pointer"
                >
                  <option value="">Select General Manager...</option>
                  <option value="gm1@crewscontrol.com">Dave Wallace (General Manager)</option>
                  <option value="gm2@crewscontrol.com">Mike Ross (Operations GM)</option>
                </select>
              </div>
            </div>

            {formData.pipelineStage === 'dispatch_draft' && (
              <button 
                onClick={handleMoveToMVR}
                className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded text-sm uppercase tracking-wider transition-colors cursor-pointer"
              >
                Move to MVR Review (Notify Fleet Manager) →
              </button>
            )}
          </section>

          {/* STEP 2: MVR REVIEW & MATRIX */}
          <section className="border-l-4 border-[#22C55E] bg-[#166534]/5 pl-6 p-4 rounded-r-lg">
            <h2 className="text-xl font-bold mb-4 uppercase tracking-wide text-[#4ADE80]">Step 2: MVR Matrix Evaluation (Fleet Manager)</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-sm mb-4">
              <div>
                <label className="text-gray-400 block mb-1">Date MVR Processed</label>
                <input 
                  type="date" 
                  value={formData.mvrDate}
                  onChange={(e) => handleChange('mvrDate', e.target.value)}
                  disabled={formData.pipelineStage !== 'mvr_review'}
                  className="w-full bg-[#0A0E14] border border-gray-700 rounded p-2.5 text-white focus:border-[#22C55E] focus:outline-none cursor-pointer disabled:opacity-50"
                />
              </div>
              <div>
                <label className="text-gray-400 block mb-1">MVR Supervisor (Fleet Manager)</label>
                <input 
                  type="text" 
                  placeholder="Enter fleet manager name..." 
                  value={formData.mvrSupervisor}
                  onChange={(e) => handleChange('mvrSupervisor', e.target.value)}
                  disabled={formData.pipelineStage !== 'mvr_review'}
                  className="w-full bg-[#0A0E14] border border-gray-700 rounded p-2.5 text-white focus:border-[#22C55E] focus:outline-none disabled:opacity-50"
                />
              </div>
              <div>
                <label className="text-gray-400 block mb-1">Driver License Number</label>
                <input 
                  type="text" 
                  placeholder="Enter license #..." 
                  value={formData.licenseNumber}
                  onChange={(e) => handleChange('licenseNumber', e.target.value)}
                  disabled={formData.pipelineStage !== 'mvr_review'}
                  className="w-full bg-[#0A0E14] border border-gray-700 rounded p-2.5 text-white focus:border-[#22C55E] focus:outline-none disabled:opacity-50"
                />
              </div>
              <div>
                <label className="text-gray-400 block mb-1">Last 4 of SSN</label>
                <input 
                  type="text" 
                  maxLength="4"
                  placeholder="1234" 
                  value={formData.last4SSN}
                  onChange={(e) => handleChange('last4SSN', e.target.value)}
                  disabled={formData.pipelineStage !== 'mvr_review'}
                  className="w-full bg-[#0A0E14] border border-gray-700 rounded p-2.5 text-white focus:border-[#22C55E] focus:outline-none disabled:opacity-50 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-[#0A0E14] p-4 rounded-lg border border-gray-800 mb-4">
              <div>
                <label className="text-gray-400 block mb-1 text-xs uppercase font-bold">Moving Violations (Past 5 Years)</label>
                <input 
                  type="number" 
                  min="0"
                  max="10"
                  value={formData.movingViolations}
                  onChange={(e) => handleChange('movingViolations', e.target.value)}
                  disabled={formData.pipelineStage !== 'mvr_review'}
                  className="w-full bg-[#121821] border border-gray-700 rounded p-2.5 text-white focus:border-[#22C55E] focus:outline-none disabled:opacity-50"
                />
              </div>
              <div>
                <label className="text-gray-400 block mb-1 text-xs uppercase font-bold">Accidents (Past 5 Years)</label>
                <input 
                  type="number" 
                  min="0"
                  max="10"
                  value={formData.accidents}
                  onChange={(e) => handleChange('accidents', e.target.value)}
                  disabled={formData.pipelineStage !== 'mvr_review'}
                  className="w-full bg-[#121821] border border-gray-700 rounded p-2.5 text-white focus:border-[#22C55E] focus:outline-none disabled:opacity-50"
                />
              </div>
              <div>
                <label className="text-gray-400 block mb-1 text-xs uppercase font-bold text-red-400">DUI / DWI / Death by Vehicle</label>
                <label className="flex items-center gap-2 mt-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={formData.duiDwi}
                    onChange={(e) => handleChange('duiDwi', e.target.checked)}
                    disabled={formData.pipelineStage !== 'mvr_review'}
                    className="accent-red-600 w-5 h-5"
                  />
                  <span className="text-sm font-bold text-red-300">1 or More (Automatic Prohibited)</span>
                </label>
              </div>
            </div>

            <div className="mb-4 flex items-center justify-between bg-[#1A222D] p-4 rounded-lg border border-gray-700">
              <span className="text-sm text-gray-300 font-bold uppercase">Automated Insurance Matrix Determination:</span>
              <span className={`px-4 py-1.5 rounded text-sm border shadow ${currentMatrixResult.color}`}>
                {currentMatrixResult.status}
              </span>
            </div>

            <div>
              <label className="text-gray-400 block mb-1">Fleet Manager Comments</label>
              <textarea 
                rows="2"
                placeholder="Enter MVR insurance notes or discussion flags..."
                value={formData.mvrComments}
                onChange={(e) => handleChange('mvrComments', e.target.value)}
                disabled={formData.pipelineStage !== 'mvr_review'}
                className="w-full bg-[#0A0E14] border border-gray-700 rounded p-3 text-white focus:outline-none text-sm focus:border-[#22C55E] disabled:opacity-50"
              />
            </div>

            {formData.pipelineStage === 'mvr_review' && (
              <button 
                onClick={handleMVRSubmission}
                className="mt-6 bg-[#166534] hover:bg-[#15803d] text-[#4ADE80] border border-[#22C55E]/40 font-bold px-6 py-3 rounded text-sm uppercase tracking-wider transition-colors cursor-pointer"
              >
                Submit MVR Matrix Decision (Proceed to Dispatch Hold)
              </button>
            )}
          </section>

          {/* HOLDING STATUS */}
          {formData.pipelineStage === 'holding_truck_class' && (
            <div className={`p-6 rounded-lg border text-center space-y-4 ${isProhibitedOrFlagged ? 'bg-red-950/30 border-red-500/60' : 'bg-[#1A222D] border-amber-500/40'}`}>
              <div>
                <h3 className={`font-bold text-lg uppercase tracking-wide ${isProhibitedOrFlagged ? 'text-red-400 animate-pulse' : 'text-amber-400'}`}>
                  Holding in Dispatch (Pending Truck Class) {isProhibitedOrFlagged ? '— [FLAGGED FOR GM MEETING]' : ''}
                </h3>
                <p className="text-gray-300 text-sm mt-1">
                  MVR Matrix result logged as: <strong className="underline">{currentMatrixResult.status}</strong>. Application is waiting for truck class test score, attendance, and safety verification.
                </p>
              </div>
              <button 
                onClick={handleTruckClassComplete}
                className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-6 py-2.5 rounded text-sm uppercase tracking-wider transition-colors cursor-pointer"
              >
                Simulate Truck Class & Safety Complete → Move to GM Review
              </button>
            </div>
          )}

          {/* STEP 3: GENERAL MANAGER PERFORMANCE REVIEW */}
          {formData.pipelineStage === 'gm_review' && (
            <section className={`border-l-4 pl-6 p-4 rounded-r-lg ${isProhibitedOrFlagged ? 'border-red-600 bg-red-950/10' : 'border-gray-700 bg-transparent'}`}>
              <h2 className={`text-xl font-bold mb-4 uppercase tracking-wide ${isProhibitedOrFlagged ? 'text-red-400' : 'text-gray-300'}`}>
                Step 3: Employee Performance Review (GM) {isProhibitedOrFlagged ? '— [MEETING REQUIRED]' : ''}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm mb-4">
                <div>
                  <label className="text-gray-400 block mb-1">Reviewing Supervisor (General Manager)</label>
                  <input 
                    type="text" 
                    placeholder="Enter GM name..." 
                    value={formData.gmReviewer}
                    onChange={(e) => handleChange('gmReviewer', e.target.value)}
                    className="w-full bg-[#0A0E14] border border-gray-700 rounded p-2.5 text-white focus:border-[#22C55E] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-gray-400 block mb-1">Date of Review</label>
                  <input 
                    type="date" 
                    value={formData.gmReviewDate}
                    onChange={(e) => handleChange('gmReviewDate', e.target.value)}
                    className="w-full bg-[#0A0E14] border border-gray-700 rounded p-2.5 text-white focus:border-[#22C55E] focus:outline-none cursor-pointer"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm mb-4">
                <div>
                  <label className="text-gray-400 block mb-1">Truck Class Date</label>
                  <input 
                    type="date" 
                    value={formData.truckClassDate}
                    onChange={(e) => handleChange('truckClassDate', e.target.value)}
                    className="w-full bg-[#0A0E14] border border-gray-700 rounded p-2.5 text-white focus:border-[#22C55E] focus:outline-none cursor-pointer"
                  />
                </div>
                <div>
                  <label className="text-gray-400 block mb-1">Truck Class Test Score</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 92% / Pass" 
                    value={formData.truckClassScore}
                    onChange={(e) => handleChange('truckClassScore', e.target.value)}
                    className="w-full bg-[#0A0E14] border border-gray-700 rounded p-2.5 text-white focus:border-[#22C55E] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-gray-400 block mb-1">Attendance Record</label>
                  <input 
                    type="text" 
                    placeholder="Enter attendance notes..." 
                    value={formData.attendanceRecord}
                    onChange={(e) => handleChange('attendanceRecord', e.target.value)}
                    className="w-full bg-[#0A0E14] border border-gray-700 rounded p-2.5 text-white focus:border-[#22C55E] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-gray-400 block mb-1">Safety Record</label>
                  <input 
                    type="text" 
                    placeholder="Enter safety notes..." 
                    value={formData.safetyRecord}
                    onChange={(e) => handleChange('safetyRecord', e.target.value)}
                    className="w-full bg-[#0A0E14] border border-gray-700 rounded p-2.5 text-white focus:border-[#22C55E] focus:outline-none"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="text-gray-400 block mb-1">Review Determination</label>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
                    <input 
                      type="radio" 
                      name="gmStatus" 
                      checked={formData.gmStatus === 'approved'}
                      onChange={() => handleChange('gmStatus', 'approved')}
                      className="accent-[#22C55E] w-4 h-4" 
                    /> Approved (Meeting Held / Overridden)
                  </label>
                  <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
                    <input 
                      type="radio" 
                      name="gmStatus" 
                      checked={formData.gmStatus === 'denied'}
                      onChange={() => handleChange('gmStatus', 'denied')}
                      className="accent-red-500 w-4 h-4" 
                    /> Denied / Disqualified
                  </label>
                </div>
              </div>

              <div>
                <label className="text-gray-400 block mb-1">General Manager Comments (Meeting Notes)</label>
                <textarea 
                  rows="2"
                  placeholder="Enter GM review and meeting notes regarding MVR standing..."
                  value={formData.gmComments}
                  onChange={(e) => handleChange('gmComments', e.target.value)}
                  className="w-full bg-[#0A0E14] border border-gray-700 rounded p-3 text-white focus:outline-none text-sm focus:border-[#22C55E]"
                />
              </div>
            </section>
          )}

          {/* STEP 4: FINAL SIGN-OFF */}
          {formData.pipelineStage === 'gm_review' && (
            <section className={`p-6 rounded-lg border ${isProhibitedOrFlagged ? 'bg-red-950/20 border-red-600/50' : 'bg-[#1A222D]/60 border-gray-800'}`}>
              <h2 className="text-xl font-bold text-white mb-2 uppercase tracking-wide">Step 4: Final Collaborative Sign-Off</h2>
              <p className="text-gray-400 mb-6 text-sm">All three parties must verify and check off to execute final promotion to Driver Class.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#0A0E14] p-4 rounded border border-gray-800 hover:border-[#22C55E] transition-colors">
                  <span className="text-gray-400 block text-xs uppercase mb-2">Dispatcher Sign-Off</span>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={formData.dispatcherSign}
                      onChange={(e) => handleChange('dispatcherSign', e.target.checked)}
                      className="w-5 h-5 accent-[#22C55E]" 
                    />
                    <span className="font-bold text-gray-200">Dispatcher Approval</span>
                  </label>
                </div>

                <div className="bg-[#0A0E14] p-4 rounded border border-gray-800 hover:border-[#22C55E] transition-colors">
                  <span className="text-gray-400 block text-xs uppercase mb-2">Fleet Manager Sign-Off</span>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={formData.fleetSign}
                      onChange={(e) => handleChange('fleetSign', e.target.checked)}
                      className="w-5 h-5 accent-[#22C55E]" 
                    />
                    <span className="font-bold text-gray-200">Fleet Manager Approval</span>
                  </label>
                </div>

                <div className="bg-[#0A0E14] p-4 rounded border border-gray-800 hover:border-[#22C55E] transition-colors">
                  <span className="text-gray-400 block text-xs uppercase mb-2">General Manager Sign-Off</span>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={formData.gmSign}
                      onChange={(e) => handleChange('gmSign', e.target.checked)}
                      className="w-5 h-5 accent-[#22C55E]" 
                    />
                    <span className="font-bold text-gray-200">General Manager Approval</span>
                  </label>
                </div>
              </div>

              <button 
                onClick={handleFinalPromotion}
                className="mt-8 w-full bg-[#166534] hover:bg-[#15803d] text-[#4ADE80] border border-[#22C55E]/40 font-bold py-4 rounded shadow-lg uppercase tracking-widest transition-colors cursor-pointer"
              >
                Execute Final Promotion to Driver Class
              </button>
            </section>
          )}

        </div>
      </div>
    </div>
  );
}