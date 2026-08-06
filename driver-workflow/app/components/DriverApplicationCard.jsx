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
    // Pipeline stage: 'dispatch_draft', 'mvr_review', 'holding_truck_class', 'completed'
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
      // Approved: sits in dispatch holding until truck class
      setFormData((prev) => ({ ...prev, pipelineStage: 'holding_truck_class' }));
      setNotification({
        type: 'holding_alert',
        message: `✅ MVR APPROVED: Application for ${formData.employeeName} has cleared MVR. It is now holding in Dispatch pending Truck Class evaluation, safety, and attendance sign-off.`
      });
    }
  };

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
          <div className={`m-6 p-4 rounded-lg border text-sm font-semibold flex items-center justify-between ${
            notification.type === 'fleet_alert' ? 'bg-blue-950/40 border-blue-500/50 text-blue-300' :
            notification.type === 'dispatch_alert' ? 'bg-red-950/40 border-red-500/50 text-red-300' :
            'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
          }`}>
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
          <section className={`border-l-4 pl-6 p-4 rounded-r-lg transition-colors duration-300 ${
            formData.pipelineStage === 'dispatch_draft' ? 'border-gray-800 opacity-50' : 'border-[#22C55E] bg-[#166534]/5'
          }`}>
            <h2 className="text-xl font-bold mb-4 uppercase tracking-wide text-[#4ADE80]">Step 2: MVR Review & Eligibility (Fleet Manager)</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm mb-4">
              <div>
                <label className="text-gray-400 block mb-1">Date MVR Processed</label>
                <input 
                  type="date" 
                  value={formData.mvrDate}
                  onChange={(e) => handleChange('mvrDate', e.target.value)}
                  disabled={formData.pipelineStage === 'dispatch_draft'}
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
                  disabled={formData.pipelineStage === 'dispatch_draft'}
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
                      disabled={formData.pipelineStage === 'dispatch_draft'}
                      className="accent-[#22C55E] w-4 h-4" 
                    /> Approved
                  </label>
                  <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
                    <input 
                      type="radio" 
                      name="mvrStatus" 
                      checked={formData.mvrStatus === 'denied'}
                      onChange={() => handleChange('mvrStatus', 'denied')}
                      disabled={formData.pipelineStage === 'dispatch_draft'}
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
                disabled={formData.pipelineStage === 'dispatch_draft'}
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

          {/* HOLDING STATUS INDICATION */}
          {formData.pipelineStage === 'holding_truck_class' && (
            <div className="bg-[#1A222D] p-6 rounded-lg border border-amber-500/40 text-center space-y-2">
              <h3 className="text-amber-400 font-bold text-lg uppercase tracking-wide">Holding in Dispatch (Pending Truck Class)</h3>
              <p className="text-gray-300 text-sm">
                MVR check is complete and approved. This application is now holding in Dispatch until the employee completes their truck class evaluation, safety review, and attendance verification.
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}