import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import os from 'os';

export async function POST(request) {
  try {
    const formData = await request.json();

    const timestamp = Date.now();
    const safeName = formData.employeeName ? formData.employeeName.toLowerCase().replace(/\s+/g, '_') : 'driver';
    
    const tempDir = os.tmpdir();
    const excelFilePath = path.join(tempDir, `ControlByCrews_Master_${timestamp}.xlsx`);
    const archiveDir = path.join(process.cwd(), 'public', 'archives', 'drivers');

    if (!fs.existsSync(archiveDir)) {
      fs.mkdirSync(archiveDir, { recursive: true });
    }

    // Create workbook record
    const workbook = XLSX.utils.book_new();
    const driverData = [{
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
    }];

    const worksheet = XLSX.utils.json_to_sheet(driverData);
    XLSX.utils.book_append_sheet(workbook, worksheet, "PromotionLog");
    XLSX.writeFile(workbook, excelFilePath);

    // Generate PDF archive
    const pdfFileName = `${safeName}_${timestamp}_promotion.pdf`;
    const pdfFullPath = path.join(archiveDir, pdfFileName);

    const doc = new PDFDocument();
    const stream = fs.createWriteStream(pdfFullPath);
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