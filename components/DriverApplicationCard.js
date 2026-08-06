import React from 'react';

export default function DriverApplicationCard() {
  return (
    <div className="min-h-screen bg-crews-asphalt p-8 text-white font-sans">
      
      {/* HEADER SECTION */}
      <div className="max-w-5xl mx-auto bg-crews-charcoal rounded-xl shadow-2xl border border-crews-slate overflow-hidden">
        <div className="bg-crews-slate px-6 py-4 flex justify-between items-center border-b border-gray-600">
          <div>
            <h1 className="text-2xl font-bold tracking-wider">DRIVER APPLICATION RECORD</h1>
            <p className="text-gray-400 text-sm mt-1">ID: #DA-2026-0412</p>
          </div>
          <div className="bg-crews-yellow text-black px-4 py-2 rounded font-bold tracking-wide flex items-center gap-2 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-black animate-pulse"></span>
            BOARD REVIEW REQUIRED
          </div>
        </div>

        <div className="p-8 space-y-8">

          {/* STEP 1: DISPATCHER REQUEST */}
          <section className="border-l-4 border-crews-slate pl-6">
            <h2 className="text-xl font-bold text-gray-300 mb-4 uppercase tracking-wide">Step 1: Application Request</h2>
            <div className="grid grid-cols-3 gap-6 text-sm">
              <div><span className="text-gray-500 block">Employee Name</span><span className="font-semibold text-lg">Marcus Vance</span></div>
              <div><span className="text-gray-500 block">Division</span><span className="font-semibold text-lg">North Traffic Control</span></div>
              <div><span className="text-gray-500 block">Requesting Dispatcher</span><span className="font-semibold text-lg">Sarah Jenkins</span></div>
              <div><span className="text-gray-500 block">Date of Hire</span><span className="text-gray-200">03/15/2025</span></div>
              <div><span className="text-gray-500 block">County of Residence</span><span className="text-gray-200">Allegheny County, PA</span></div>
              <div><span className="text-gray-500 block">Date of Request</span><span className="text-gray-200">06/04/2026</span></div>
            </div>
          </section>

          {/* STEP 2: MVR REVIEW */}
          <section className="border-l-4 border-crews-orange pl-6 bg-orange-900/10 p-4 rounded-r-lg">
            <h2 className="text-xl font-bold text-crews-orange mb-4 uppercase tracking-wide flex items-center gap-2">
              Step 2: MVR Review & Eligibility
            </h2>
            <div className="grid grid-cols-2 gap-6 text-sm mb-4">
              <div><span className="text-gray-500 block">Date MVR Processed</span><span className="font-semibold">06/05/2026</span></div>
              <div><span className="text-gray-500 block">MVR Supervisor</span><span className="font-semibold">Tom Bradley (Fleet Manager)</span></div>
            </div>
            <div className="mb-4">
              <span className="text-gray-500 block mb-2">MVR Determination</span>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-gray-400 cursor-not-allowed"><input type="radio" disabled /> Approved</label>
                <label className="flex items-center gap-2 text-crews-red font-bold"><input type="radio" checked readOnly className="accent-crews-red" /> Denied (Flagged)</label>
              </div>
            </div>
            <div>
              <span className="text-gray-500 block mb-1">Fleet Manager Comments</span>
              <div className="bg-crews-asphalt p-3 rounded border border-crews-slate text-gray-300 italic">
                "Minor speeding infraction logged from 10 months ago within threshold, but system flagged secondary query review due to commercial insurance policy guidelines. Needs internal review before final clearance."
              </div>
            </div>
          </section>

          {/* STEP 3: GENERAL MANAGER REVIEW */}
          <section className="border-l-4 border-crews-slate pl-6">
            <h2 className="text-xl font-bold text-gray-300 mb-4 uppercase tracking-wide">Step 3: Employee Performance Review</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm mb-6">
              <div><span className="text-gray-500 block">Reviewing Supervisor</span><span className="font-semibold">Dave Miller (GM)</span></div>
              <div><span className="text-gray-500 block">Date of Review</span><span className="font-semibold">06/06/2026</span></div>
              <div><span className="text-gray-500 block">Truck Class Date</span><span className="font-semibold">06/07/2026</span></div>
              <div><span className="text-gray-500 block">Class Test Score</span><span className="text-crews-green font-bold text-lg">92% / Pass</span></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm mb-4">
              <div>
                <span className="text-gray-500 block mb-1">Attendance Record</span>
                <input type="text" readOnly value="98% attendance, 0 unexcused absences" className="w-full bg-crews-asphalt border border-crews-slate rounded p-2 text-gray-200" />
              </div>
              <div>
                <span className="text-gray-500 block mb-1">Safety Record</span>
                <input type="text" readOnly value="Clean record, no safety infractions on active sites" className="w-full bg-crews-asphalt border border-crews-slate rounded p-2 text-gray-200" />
              </div>
            </div>
            <div className="mb-4">
              <span className="text-gray-500 block mb-2">Review Determination</span>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-gray-400 cursor-not-allowed"><input type="radio" disabled /> Approved</label>
                <label className="flex items-center gap-2 text-crews-red font-bold"><input type="radio" checked readOnly className="accent-crews-red" /> Denied (Flagged)</label>
              </div>
            </div>
            <div>
              <span className="text-gray-500 block mb-1">General Manager Comments</span>
              <div className="bg-crews-asphalt p-3 rounded border border-crews-slate text-gray-300 italic">
                "Marcus has solid attendance and passed the truck class training with a strong score. Minor flag on historical MVR is being brought to the 3-party board review meeting for final override consideration."
              </div>
            </div>
          </section>

          {/* STEP 4: FINAL APPROVAL / OVERRIDE */}
          <section className="bg-crews-slate/30 p-6 rounded-lg border border-crews-slate">
            <h2 className="text-2xl font-bold text-white mb-2 uppercase tracking-wide">Step 4: Final Collaborative Sign-Off</h2>
            <p className="text-gray-400 mb-6 text-sm">All three parties must provide digital signature to authorize driver status override.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Dispatcher Sign-off */}
              <div className="bg-crews-asphalt p-4 rounded border border-crews-slate hover:border-crews-orange transition-colors">
                <span className="text-gray-500 block text-xs uppercase mb-2">Dispatcher</span>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="w-5 h-5 accent-crews-orange" />
                  <span className="font-bold text-gray-200">Sarah Jenkins</span>
                </label>
              </div>

              {/* Fleet Manager Sign-off */}
              <div className="bg-crews-asphalt p-4 rounded border border-crews-slate hover:border-crews-orange transition-colors">
                <span className="text-gray-500 block text-xs uppercase mb-2">Fleet Manager</span>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="w-5 h-5 accent-crews-orange" />
                  <span className="font-bold text-gray-200">Tom Bradley</span>
                </label>
              </div>

              {/* GM Sign-off */}
              <div className="bg-crews-asphalt p-4 rounded border border-crews-slate hover:border-crews-orange transition-colors">
                <span className="text-gray-500 block text-xs uppercase mb-2">General Manager</span>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="w-5 h-5 accent-crews-orange" />
                  <span className="font-bold text-gray-200">Dave Miller</span>
                </label>
              </div>
            </div>

            <button className="mt-8 w-full bg-crews-orange hover:bg-orange-600 text-white font-bold py-4 rounded shadow-lg uppercase tracking-widest transition-colors">
              Execute Final Promotion to Driver Class
            </button>
          </section>

        </div>
      </div>
    </div>
  );
}