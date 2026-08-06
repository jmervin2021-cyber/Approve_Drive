import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

export async function POST(request) {
  try {
    const formData = await request.json();

    const dataDir = path.join(process.cwd(), 'data');
    const archiveDir = path.join(process.cwd(), 'public', 'archives', 'drivers');

    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    if (!fs.existsSync(archiveDir)) {
      fs.mkdirSync(archiveDir, { recursive: true });
    }

    const excelFilePath = path.join(dataDir, 'ControlByCrews_Master_Drivers.xlsx');

    // Initialize or read Excel workbook
    let workbook;
    let worksheet;
    
    if (!fs.existsSync(excelFilePath)) {
      workbook = XLSX.utils.book_new();
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
      worksheet = XLSX.utils.json_to_sheet(initialData);
      XLSX.utils.book_append_sheet(workbook, worksheet, "MasterLog");
    } else {
      workbook = XLSX.readFile(excelFilePath);
      worksheet = workbook.Sheets['MasterLog'] || workbook.Sheets[workbook.SheetNames[0]];
    }

    // Prepare Excel row payload
    const newDriverRow = {
      "Employee Name": formData.employeeName || "N/A",
      "Division": formData.division || "N/A",
      "Date of Hire": formData.dateOfHire || "N/A",
      "County of Residence": formData.county || "N/A",
      "Test Score": formData.truckClassScore || "N/A",
      "Driver Class Date": formData.truckClassDate || "N/A",
      "Attendance Record": formData.attendanceRecord || "N/A",
      "Safety Record": formData.safetyRecord || "N/A",
      "Approved/Denied": "Approved (All Sign-offs Verified)",
      "Comments": `MVR: ${formData.mvrComments || 'None'} | GM: ${formData.gmComments || 'None'}`
    };

    // Append row and save Excel file
    XLSX.utils.sheet_add_json(worksheet, [newDriverRow], { skipHeader: true, origin: -1 });
    XLSX.writeFile(workbook, excelFilePath);

    // Generate PDF using a Promise wrapper to catch stream completion errors
    const timestamp = Date.now();
    const safeName = formData.employeeName ? formData.employeeName.toLowerCase().replace(/\s+/g, '_') : 'driver';
    const pdfFileName = `${safeName}_${timestamp}_promotion.pdf`;
    const pdfFullPath = path.join(archiveDir, pdfFileName);

    await new Promise((resolve, reject) => {
      const doc = new PDFDocument();
      const stream = fs.createWriteStream(pdfFullPath);
      
      stream.on('finish', resolve);
      stream.on('error', reject);

      doc.pipe(stream);

      doc.fontSize(20).text('CONTROL BY CREWS', { align: 'center' });
      doc.fontSize(14).text('Official Driver Class Promotion Record', { align: 'center' });
      doc.moveDown();
      doc.fontSize(10).text(`Generated on: ${new Date().toLocaleString()}`);
      doc.text(`----------------------------------------------------------------------------------`);
      doc.text(`Employee Name: ${formData.employeeName || 'N/A'}`);
      doc.text(`Division: ${formData.division || 'N/A'}`);
      doc.text(`Date of Hire: ${formData.dateOfHire || 'N/A'}`);
      doc.text(`County of Residence: ${formData.county || 'N/A'}`);
      doc.moveDown();
      doc.text(`--- REVIEW METRICS ---`);
      doc.text(`Truck Class Date: ${formData.truckClassDate || 'N/A'}`);
      doc.text(`Truck Class Test Score: ${formData.truckClassScore || 'N/A'}`);
      doc.text(`Attendance Record: ${formData.attendanceRecord || 'N/A'}`);
      doc.text(`Safety Record: ${formData.safetyRecord || 'N/A'}`);
      doc.moveDown();
      doc.text(`--- MANAGEMENT COMMENTS ---`);
      doc.text(`Fleet Manager: ${formData.mvrComments || 'None'}`);
      doc.text(`General Manager: ${formData.gmComments || 'None'}`);
      
      doc.end();
    });

    return NextResponse.json({
      success: true,
      message: "Promotion executed successfully.",
      pdfPath: `/archives/drivers/${pdfFileName}`,
    });

  } catch (error) {
    console.error("CRITICAL API ERROR IN /api/promote-driver:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}