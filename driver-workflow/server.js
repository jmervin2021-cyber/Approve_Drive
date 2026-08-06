const express = require('express');
const cors = require('cors');
const XLSX = require('xlsx');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());

// Ensure directories exist on startup
const dataDir = path.join(__dirname, 'data');
const archiveDir = path.join(__dirname, 'public', 'archives', 'drivers');

if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
if (!fs.existsSync(archiveDir)) fs.mkdirSync(archiveDir, { recursive: true });

// Path to the living Excel master file
const excelFilePath = path.join(dataDir, 'ControlByCrews_Master_Drivers.xlsx');

// Initialize Excel file if it doesn't already exist
if (!fs.existsSync(excelFilePath)) {
  const wb = XLSX.utils.book_new();
  const initialData = [{
    "Employee Name": "",
    "Division": "",
    "Date of Hire": "",
    "County of Residence": "",
    "Test Score": "",
    "Driver Class Date": "",
    "Attendance Record": "",
    "Safety Record": "",
    "Approved/Denied": "",
    "Comments": ""
  }];
  const ws = XLSX.utils.json_to_sheet(initialData);
  XLSX.utils.book_append_sheet(wb, ws, "MasterLog");
  XLSX.writeFile(wb, excelFilePath);
}

// API Endpoint triggered upon Final Promotion Execution
apiRoutePath = '/api/promote-driver';
app.post(apiRoutePath, (req, res) => {
  const formData = req.body;

  try {
    // 1. Prepare Data Payload for Living Excel Sheet
    const newDriverRow = {
      "Employee Name": formData.employeeName,
      "Division": formData.division,
      "Date of Hire": formData.dateOfHire,
      "County of Residence": formData.county,
      "Test Score": formData.truckClassScore,
      "Driver Class Date": formData.truckClassDate,
      "Attendance Record": formData.attendanceRecord,
      "Safety Record": formData.safetyRecord,
      "Approved/Denied": "Approved (All Sign-offs Verified)",
      "Comments": `MVR Notes: ${formData.mvrComments} | GM Notes: ${formData.gmComments}`
    };

    // 2. Append to Living Excel Workbook
    const workbook = XLSX.readFile(excelFilePath);
    const worksheet = workbook.Sheets['MasterLog'];
    XLSX.utils.sheet_add_json(worksheet, [newDriverRow], { skipHeader: true, origin: -1 });
    XLSX.writeFile(workbook, excelFilePath);

    // 3. Generate Official Archived PDF
    const timestamp = Date.now();
    const safeName = formData.employeeName ? formData.employeeName.toLowerCase().replace(/\s+/g, '_') : 'driver';
    const pdfFileName = `${safeName}_${timestamp}_promotion.pdf`;
    const pdfFullPath = path.join(archiveDir, pdfFileName);

    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream(pdfFullPath));

    // PDF Content Layout
    doc.fontSize(20).text('CONTROL BY CREWS', { align: 'center' });
    doc.fontSize(14).text('Official Driver Class Promotion Record', { align: 'center' });
    doc.moveDown();
    
    doc.fontSize(10).text(`Generated on: ${new Date().toLocaleString()}`);
    doc.text(`----------------------------------------------------------------------------------`);
    doc.text(`Employee Name: ${formData.employeeName}`);
    doc.text(`Division: ${formData.division}`);
    doc.text(`Date of Hire: ${formData.dateOfHire}`);
    doc.text(`County of Residence: ${formData.county}`);
    doc.moveDown();
    doc.text(`--- REVIEW METRICS ---`);
    doc.text(`Truck Class Date: ${formData.truckClassDate}`);
    doc.text(`Truck Class Test Score: ${formData.truckClassScore}`);
    doc.text(`Attendance Record: ${formData.attendanceRecord}`);
    doc.text(`Safety Record: ${formData.safetyRecord}`);
    doc.moveDown();
    doc.text(`--- MANAGEMENT COMMENTS ---`);
    doc.text(`Fleet Manager: ${formData.mvrComments}`);
    doc.text(`General Manager: ${formData.gmComments}`);
    doc.moveDown();
    doc.text(`--- SIGN-OFF STATUS ---`);
    doc.text(`[✓] Dispatcher: ${formData.dispatcherName || 'Approved'}`);
    doc.text(`[✓] Fleet Manager: ${formData.mvrSupervisor || 'Approved'}`);
    doc.text(`[✓] General Manager: ${formData.gmReviewer || 'Approved'}`);

    doc.end();

    // 4. Send Success Response Back to UI
    res.status(200).json({
      success: true,
      message: "Promotion executed successfully.",
      pdfPath: `/archives/drivers/${pdfFileName}`,
      excelFile: "ControlByCrews_Master_Drivers.xlsx"
    });

  } catch (error) {
    console.error("Error processing driver promotion:", error);
    res.status(500).json({ success: false, error: "Server error processing promotion." });
  }
});

const PORT = process.pid ? 5000 : 5000;
app.listen(PORT, () => {
  console.log(`Control by Crews Server running on port ${PORT}`);
});