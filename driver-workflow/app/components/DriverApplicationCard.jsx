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

  // State to track if the application has been successfully submitted/promoted
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

 const handleFinalPromotion = async () => {
    // Validate that all 3 sign-offs are checked
    if (!formData.dispatcherSign || !formData.fleetSign || !formData.gmSign) {
      alert("All three parties (Dispatcher, Fleet Manager, and General Manager) must sign off before executing final promotion.");
      return;
    }

    try {
      // Send data to our Node.js backend server
      const response = await fetch('http://localhost:5000/api/promote-driver', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        // Transition to success screen with real data paths returned from server
        setIsSubmitted(true);
      } else {
        alert("Error executing promotion on server.");
      }
    } catch (error) {
      console.error("Connection error:", error);
      alert("Could not connect to the Control by Crews server. Make sure server.js is running.");
    }
  };

  // SUCCESS SCREEN VIEW (When all 3 approve and submit)
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#0A0E14] p-8 text-white font-sans flex items-center justify-center">
        <div className="max-w-2xl w-full bg-[#121821] rounded-xl shadow-2xl border border-[#22C55E]/40 p-8 text-center space-y-6">
          <div className="w-16 h-16 bg-[#166534] text-[#4ADE80] rounded-full flex items-center justify-center mx-auto text-3xl border border-[#22C55E]/50 shadow-lg">
            ✓
          </div>
          <h1 className="text-3xl font-bold tracking-wider text-white">PROMOTION EXECUTED</h1>
          <p className="text-gray-300 text-sm">
            All three approvals have been logged. A PDF was generated and the updated promotion file is found here:
          </p>
          
          <div className="bg-[#0A0E14] border border-gray-800 p-4 rounded-lg text-left space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Employee:</span>
              <span className="font-bold text-white">{formData.employeeName || "Marcus Vance"}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Archived PDF:</span>
              <a href="#download" onClick={(e) => e.preventDefault()} className="text-[#4ADE80] underline hover:text-green-400">
                /archives/drivers/{formData.employeeName ? formData.employeeName.toLowerCase().replace(/\s+/g, '_') : 'driver'}_promotion.pdf
              </a>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Master Excel Log:</span>
              <span className="text-[#4ADE80] font-mono text-xs">ControlByCrews_Master_Drivers.xlsx (Updated)</span>
            </div>
          </div>

          <button 
            onClick={() => setIsSubmitted(false)}
            className="text-gray-400 hover:text-white text-sm underline mt-4 block mx-auto cursor-pointer"
          >
            ← Back to Application Form
          </button>
        </div>
      </div>
    );
  }

  // STANDARD FORM VIEW
  return (
    <div className="min-h-screen bg-[#0A0E14] p-8 text-white font-sans">
      
      {/* HEADER SECTION WITH LOGO */}
      <div className="max-w-5xl mx-auto bg-[#121821] rounded-xl shadow-2xl border border-gray-800 overflow-hidden">
        <div className="bg-[#1A222D] px-6 py-4 flex justify-between items-center border-b border-gray-800">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#0A0E14] border border-[#22C55E]/40 flex items-center justify-center overflow-hidden shadow-md p-1">
              <img 
                src="/logo.png" 
                alt="Crews Control Logo" 
                className="w-full h-full object-cover scale-110"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-wider text-gray-100">DRIVER APPLICATION RECORD</h1>
              <p className="text-gray-400 text-sm mt-0.5">Control by Crews — Master Pipeline</p>
            </div>
          </div>
          <div className={`px-4 py-2 rounded font-bold tracking-wide flex items-center gap-2 shadow-lg text-sm border ${
            formData.mvrStatus === 'denied' || formData.gmStatus === 'denied'
              ? 'bg-red-950/80 text-red-400 border-red-500/40 animate-pulse'
              : 'bg-[#166534] text-[#4ADE80] border-[#22C55E]/30'
          }`}>
            <span className={`w-2.5 h-2.5 rounded-full ${
              formData.mvrStatus === 'denied' || formData.gmStatus === 'denied' ? 'bg-red-500' : 'bg-[#4ADE80] animate-pulse'
            }`}></span>
            {formData.mvrStatus === 'denied' || formData.gmStatus === 'denied' ? 'BOARD REVIEW FLAGGED' : 'ACTIVE PIPELINE ENTRY'}
          </div>
        </div>

        <div className="p-8 space-y-8">

          {/* STEP 1: DISPATCHER REQUEST */}
          <section className="border-l-4 border-gray-700 pl-6">
            <h2 className="text-xl font-bold text-gray-300 mb-4 uppercase tracking-wide">Step 1: Application Request</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div>
                <label className="text-gray-400 block mb-1">Employee Name</label>
                <input 
                  type="text" 
                  placeholder="Enter employee name..." 
                  value={formData.employeeName}
                  onChange={(e) => handleChange('employeeName', e.target.value)}
                  className="w-full bg-[#0A0E14] border border-gray-700 rounded p-2.5 text-white focus:border-[#22C55E] focus:outline-none"
                />
              </div>
              <div>
                <label className="text-gray-400 block mb-1">Division</label>
                <input 
                  type="text" 
                  placeholder="Enter division..." 
                  value={formData.division}
                  onChange={(e) => handleChange('division', e.target.value)}
                  className="w-full bg-[#0A0E14] border border-gray-700 rounded p-2.5 text-white focus:border-[#22C55E] focus:outline-none"
                />
              </div>
              <div>
                <label className="text-gray-400 block mb-1">Requesting Dispatcher</label>
                <input 
                  type="text" 
                  placeholder="Enter dispatcher name..." 
                  value={formData.dispatcherName}
                  onChange={(e) => handleChange('dispatcherName', e.target.value)}
                  className="w-full bg-[#0A0E14] border border-gray-700 rounded p-2.5 text-white focus:border-[#22C55E] focus:outline-none"
                />
              </div>
              <div>
                <label className="text-gray-400 block mb-1">Date of Hire</label>
                <input 
                  type="date" 
                  value={formData.dateOfHire}
                  onChange={(e) => handleChange('dateOfHire', e.target.value)}
                  className="w-full bg-[#0A0E14] border border-gray-700 rounded p-2.5 text-white focus:border-[#22C55E] focus:outline-none cursor-pointer"
                />
              </div>
              <div>
                <label className="text-gray-400 block mb-1">County of Residence</label>
                <input 
                  type="text" 
                  placeholder="Enter county..." 
                  value={formData.county}
                  onChange={(e) => handleChange('county', e.target.value)}
                  className="w-full bg-[#0A0E14] border border-gray-700 rounded p-2.5 text-white focus:border-[#22C55E] focus:outline-none"
                />
              </div>
              <div>
                <label className="text-gray-400 block mb-1">Date of Request</label>
                <input 
                  type="date" 
                  value={formData.requestDate}
                  onChange={(e) => handleChange('requestDate', e.target.value)}
                  className="w-full bg-[#0A0E14] border border-gray-700 rounded p-2.5 text-white focus:border-[#22C55E] focus:outline-none cursor-pointer"
                />
              </div>
            </div>
          </section>

          {/* STEP 2: MVR REVIEW */}
          <section className={`border-l-4 pl-6 p-4 rounded-r-lg transition-colors duration-300 ${
            formData.mvrStatus === 'denied' 
              ? 'border-red-500 bg-red-950/20 shadow-[inset_0_0_15px_rgba(239,68,68,0.1)]' 
              : 'border-[#22C55E] bg-[#166534]/5'
          }`}>
            <h2 className={`text-xl font-bold mb-4 uppercase tracking-wide flex items-center justify-between ${
              formData.mvrStatus === 'denied' ? 'text-red-400' : 'text-[#4ADE80]'
            }`}>
              <span>Step 2: MVR Review & Eligibility</span>
              {formData.mvrStatus === 'denied' && <span className="text-xs bg-red-500 text-black px-2 py-0.5 rounded font-bold tracking-wider">FLAGGED REVIEW</span>}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm mb-4">
              <div>
                <label className="text-gray-400 block mb-1">Date MVR Processed</label>
                <input 
                  type="date" 
                  value={formData.mvrDate}
                  onChange={(e) => handleChange('mvrDate', e.target.value)}
                  className="w-full bg-[#0A0E14] border border-gray-700 rounded p-2.5 text-white focus:border-[#22C55E] focus:outline-none cursor-pointer"
                />
              </div>
              <div>
                <label className="text-gray-400 block mb-1">MVR Supervisor (Fleet Manager)</label>
                <input 
                  type="text" 
                  placeholder="Enter fleet manager name..." 
                  value={formData.mvrSupervisor}
                  onChange={(e) => handleChange('mvrSupervisor', e.target.value)}
                  className="w-full bg-[#0A0E14] border border-gray-700 rounded p-2.5 text-white focus:border-[#22C55E] focus:outline-none"
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
                      className="accent-[#22C55E] w-4 h-4" 
                    /> Approved
                  </label>
                  <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
                    <input 
                      type="radio" 
                      name="mvrStatus" 
                      checked={formData.mvrStatus === 'denied'}
                      onChange={() => handleChange('mvrStatus', 'denied')}
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
                className={`w-full bg-[#0A0E14] border rounded p-3 text-white focus:outline-none text-sm ${
                  formData.mvrStatus === 'denied' ? 'border-red-500/60 focus:border-red-500' : 'border-gray-700 focus:border-[#22C55E]'
                }`}
              />
            </div>
          </section>

          {/* STEP 3: GENERAL MANAGER REVIEW */}
          <section className={`border-l-4 pl-6 p-4 rounded-r-lg transition-colors duration-300 ${
            formData.gmStatus === 'denied' 
              ? 'border-red-500 bg-red-950/20 shadow-[inset_0_0_15px_rgba(239,68,68,0.1)]' 
              : 'border-gray-700 bg-transparent'
          }`}>
            <h2 className={`text-xl font-bold mb-4 uppercase tracking-wide flex items-center justify-between ${
              formData.gmStatus === 'denied' ? 'text-red-400' : 'text-gray-300'
            }`}>
              <span>Step 3: Employee Performance Review</span>
              {formData.gmStatus === 'denied' && <span className="text-xs bg-red-500 text-black px-2 py-0.5 rounded font-bold tracking-wider">FLAGGED REVIEW</span>}
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
                className={`w-full bg-[#0A0E14] border rounded p-3 text-white focus:outline-none text-sm ${
                  formData.gmStatus === 'denied' ? 'border-red-500/60 focus:border-red-500' : 'border-gray-700 focus:border-[#22C55E]'
                }`}
              />
            </div>
          </section>

          {/* STEP 4: FINAL APPROVAL / SIGN-OFFS */}
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
            >
              Execute Final Promotion to Driver Class
            </button>
          </section>

        </div>
      </div>
    </div>
  );
}