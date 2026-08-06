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
    // Pipeline stages: 'dispatch_draft', 'mvr_review', 'holding_truck_class', 'gm_review', 'completed'
    pipelineStage: 'dispatch_draft', 
    mvrDate: '',
    mvrSupervisor: '',
    mvrStatus: '', 
    mvrComments: '',
    gmReviewer: '',
    gmReviewDate: '',
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

  const handleMoveToMVR = () => {
    if (!formData.employeeName || !formData.division || !formData.dispatcherName) {
      alert("Please fill out Employee Name, Division, and Requesting Dispatcher before moving to MVR.");
      return;
    }

    setFormData((prev) => ({ ...prev, pipelineStage: 'mvr_review' }));
    setNotification({
      type: 'fleet_alert',
      message: `🔔 NOTIFICATION TO FLEET MANAGER: New driver application request submitted for ${formData.employeeName} (${formData.division}). Please review Section 2 (MVR Info).`
    });
  };

  const handleMVRSubmission = () => {
    if (!formData.mvrStatus || !formData.mvrSupervisor) {
      alert("Please complete MVR Determination and enter the Fleet Manager name.");
      return;
    }

    if (formData.mvrStatus === 'denied') {
      setFormData((prev) => ({ ...prev, pipelineStage: 'dispatch_draft' }));
      setNotification({
        type: 'dispatch_alert',
        message: `⚠️ MVR DENIED: Application for ${formData.employeeName} has been returned to Dispatch with an MVR flag.`
      });
    } else {
      setFormData((prev) => ({ ...prev, pipelineStage: 'holding_truck_class' }));
      setNotification({
        type: 'holding_alert',
        message: `✅ MVR APPROVED: Application for ${formData.employeeName} has cleared MVR. It is now holding in Dispatch pending Truck Class evaluation.`
      });
    }
  };

  const handleTruckClassComplete = () => {
    setFormData((prev) => ({ ...prev, pipelineStage: 'gm_review' }));
    setNotification({
      type: 'fleet_alert',
      message: `🔔 NOTIFICATION TO GENERAL MANAGER: Truck class complete and verified. Application moved to GM Performance Review (Step 3).`
    });
  };

  const handleFinalPromotion = () => {
    if (!formData.dispatcherSign || !formData.fleetSign || !formData.gmSign) {
      alert("All three parties (Dispatcher, Fleet Manager, and General Manager) must sign off before executing final promotion.");
      return;
    }
    setFormData((prev) => ({ ...prev, pipelineStage: 'completed' }));
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
          <button 
            onClick={() => setFormData({
              employeeName: '', division: '', dispatcherName: '', dateOfHire: '', county: '', requestDate: '',
              pipelineStage: 'dispatch_draft', mvrDate: '', mvrSupervisor: '', mvrStatus: '', mvrComments: '',
              gmReviewer: '', gmReviewDate: '', truckClassDate: '', truckClassScore: '', attendanceRecord: '',
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

  return (
    <div className="min-h-screen bg-[#0A0E14] p-8 text-white font-sans">
      <div className="max-w-5xl mx-auto bg-[#121821] rounded-xl shadow-2xl border border-gray-800 overflow-hidden">
        
        {/* HEADER & PIPELINE BANNER */}
        <div className="bg-[#1A222D] px-6 py-4 flex justify-between items-center border-b border-gray-800">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#0A0E14] border border-[#22C55E]/40 flex items-center justify-center overflow-hidden shadow-md p-1">
              <img src="/logo.png" alt="Crews Control Logo" className="w-full h-full object-cover scale-110" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-wider text-gray-100">DRIVER PIPELINE WORKFLOW</h1>
              <p className="text-gray-400 text-sm mt-0.5">Control by Crews — Stage Tracking</p>
            </div>
          </div>
          <div className="px-4 py-2 rounded font-bold tracking-wide flex items-center gap-2 shadow-lg text-sm border bg-[#166534] text-[#4ADE80] border-[#22C55E]/30">
            <span className="w-2.5 h-2.5 rounded-full bg-[#4ADE80] animate-pulse"></span>
            Stage: {formData.pipelineStage.replace('_', ' ').toUpperCase()}
          </div>
        </div>

        {/* LIVE NOTIFICATION BANNER */}
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
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

            {formData.pipelineStage === 'dispatch_draft' && (
              <button 
                onClick={handleMoveToMVR}
                className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded text-sm uppercase tracking-wider transition-colors cursor-pointer"
              >
                Move to MVR Review (Notify Fleet Manager) →
              </button>
            )}
          </section>

          {/* STEP 2: MVR REVIEW (FLEET MANAGER) */}
          <section className="border-l-4 border-[#22C55E] bg-[#166534]/5 pl-6 p-4 rounded-r-lg">
            <h2 className="text-xl font-bold mb-4 uppercase tracking-wide text-[#4ADE80]">Step 2: MVR Review & Eligibility (Fleet Manager)</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm mb-4">
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
                <label className="text-gray-400 block mb-1">MVR Determination</label>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
                    <input 
                      type="radio" 
                      name="mvrStatus" 
                      checked={formData.mvrStatus === 'approved'}
                      onChange={() => handleChange('mvrStatus', 'approved')}
                      disabled={formData.pipelineStage !== 'mvr_review'}
                      className="accent-[#22C55E] w-4 h-4" 
                    /> Approved
                  </label>
                  <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
                    <input 
                      type="radio" 
                      name="mvrStatus" 
                      checked={formData.mvrStatus === 'denied'}
                      onChange={() => handleChange('mvrStatus', 'denied')}
                      disabled={formData.pipelineStage !== 'mvr_review'}
                      className="accent-red-500 w-4 h-4" 
                    /> Denied (Flag)
                  </label>
                </div>
              </div>
            </div>
            <div>
              <label className="text-gray-400 block mb-1">Fleet Manager Comments</label>
              <textarea 
                rows="2"
                placeholder="Enter MVR notes or flag details..."
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
                Submit MVR Decision (Update Pipeline)
              </button>
            )}
          </section>

          {/* HOLDING STATUS & TEST BYPASS BUTTON */}
          {formData.pipelineStage === 'holding_truck_class' && (
            <div className="bg-[#1A222D] p-6 rounded-lg border border-amber-500/40 text-center space-y-4">
              <div>
                <h3 className="text-amber-400 font-bold text-lg uppercase tracking-wide">Holding in Dispatch (Pending Truck Class)</h3>
                <p className="text-gray-300 text-sm mt-1">
                  MVR check cleared. Application is waiting for truck class test score, attendance, and safety verification.
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
          {(formData.pipelineStage === 'gm_review' || formData.pipelineStage === 'completed') && (
            <section className="border-l-4 border-gray-700 bg-transparent pl-6 p-4 rounded-r-lg">
              <h2 className="text-xl font-bold mb-4 uppercase tracking-wide text-gray-300">Step 3: Employee Performance Review (GM)</h2>
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
                    /> Approved
                  </label>
                  <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
                    <input 
                      type="radio" 
                      name="gmStatus" 
                      checked={formData.gmStatus === 'denied'}
                      onChange={() => handleChange('gmStatus', 'denied')}
                      className="accent-red-500 w-4 h-4" 
                    /> Denied (Flag)
                  </label>
                </div>
              </div>

              <div>
                <label className="text-gray-400 block mb-1">General Manager Comments</label>
                <textarea 
                  rows="2"
                  placeholder="Enter GM review comments..."
                  value={formData.gmComments}
                  onChange={(e) => handleChange('gmComments', e.target.value)}
                  className="w-full bg-[#0A0E14] border border-gray-700 rounded p-3 text-white focus:outline-none text-sm focus:border-[#22C55E]"
                />
              </div>
            </section>
          )}

          {/* STEP 4: FINAL COLLABORATIVE SIGN-OFF */}
          {(formData.pipelineStage === 'gm_review' || formData.pipelineStage === 'completed') && (
            <section className="bg-[#1A222D]/60 p-6 rounded-lg border border-gray-800">
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
              >const handleFinalPromotion = async () => {
    if (!formData.dispatcherSign || !formData.fleetSign || !formData.gmSign) {
      alert("All three parties (Dispatcher, Fleet Manager, and General Manager) must sign off before executing final promotion.");
      return;
    }

    try {
      const response = await fetch('/api/promote-driver', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
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