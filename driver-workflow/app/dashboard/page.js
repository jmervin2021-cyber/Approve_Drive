'use client';
import React, { useState, useEffect } from 'react';

export default function Dashboard() {
  const [drivers, setDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data from an API or read state. For now, we fetch a master JSON endpoint or read directly.
    // Let's fetch from a quick API route or parse the Excel data via an endpoint.
    async function fetchDrivers() {
      try {
        const res = await fetch('/api/get-drivers');
        const data = await res.json();
        if (data.success) {
          setDrivers(data.drivers);
        }
      } catch (err) {
        console.error("Failed to load drivers", err);
      } finally {
        setLoading(false);
      }
    }
    fetchDrivers();
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0E14] p-8 text-white font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">MASTER DRIVER LOG</h1>
            <p className="text-gray-400">Overview of all active and completed promotions.</p>
          </div>
          <a href="/" className="bg-[#166534] hover:bg-[#15803d] text-[#4ADE80] border border-[#22C55E]/40 px-4 py-2 rounded text-sm font-bold transition-colors">
            + New Application
          </a>
        </div>

        <div className="bg-[#121821] rounded-xl border border-gray-800 overflow-hidden shadow-lg">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#1A222D] text-gray-400 text-xs uppercase tracking-wider">
                <th className="p-4">Employee</th>
                <th className="p-4">Division</th>
                <th className="p-4">Date of Hire</th>
                <th className="p-4">Test Score</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 text-sm">
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-500">Loading master records...</td>
                </tr>
              ) : drivers.length > 0 ? drivers.map((driver, index) => (
                <tr key={index} className="hover:bg-[#1A222D]/50">
                  <td className="p-4 font-bold">{driver["Employee Name"] || "N/A"}</td>
                  <td className="p-4 text-gray-300">{driver["Division"] || "N/A"}</td>
                  <td className="p-4 text-gray-300">{driver["Date of Hire"] || "N/A"}</td>
                  <td className="p-4 text-gray-300">{driver["Test Score"] || "N/A"}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 bg-green-900/30 text-green-400 rounded text-xs border border-green-500/30 font-semibold">
                      {driver["Approved/Denied"] || "PROMOTED"}
                    </span>
                  </td>
                  <td className="p-4">
                    <button 
                      onClick={() => setSelectedDriver(driver)}
                      className="text-[#4ADE80] hover:underline cursor-pointer font-medium"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-500">No applications found in master log.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL MODAL */}
      {selectedDriver && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-[#121821] border border-gray-700 rounded-xl max-w-lg w-full p-6 space-y-6 shadow-2xl">
            <div className="flex justify-between items-center border-b border-gray-800 pb-4">
              <h2 className="text-xl font-bold text-white">Driver Promotion Record</h2>
              <button 
                onClick={() => setSelectedDriver(null)}
                className="text-gray-400 hover:text-white text-lg font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Employee Name:</span>
                <span className="font-bold text-white">{selectedDriver["Employee Name"]}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Division:</span>
                <span className="text-gray-200">{selectedDriver["Division"]}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">County of Residence:</span>
                <span className="text-gray-200">{selectedDriver["County of Residence"]}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Date of Hire:</span>
                <span className="text-gray-200">{selectedDriver["Date of Hire"]}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Truck Class Date:</span>
                <span className="text-gray-200">{selectedDriver["Driver Class Date"]}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Test Score:</span>
                <span className="text-gray-200">{selectedDriver["Test Score"]}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Attendance Record:</span>
                <span className="text-gray-200">{selectedDriver["Attendance Record"]}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Safety Record:</span>
                <span className="text-gray-200">{selectedDriver["Safety Record"]}</span>
              </div>
              <div className="pt-2 border-t border-gray-800">
                <span className="text-gray-400 block mb-1">Management Notes:</span>
                <p className="bg-[#0A0E14] p-3 rounded text-xs text-gray-300 font-mono border border-gray-800">
                  {selectedDriver["Comments"]}
                </p>
              </div>
            </div>

            <button 
              onClick={() => setSelectedDriver(null)}
              className="w-full bg-[#1A222D] hover:bg-gray-800 text-white font-bold py-2.5 rounded text-sm transition-colors cursor-pointer border border-gray-700"
            >
              Close Record
            </button>
          </div>
        </div>
      )}
    </div>
  );
}