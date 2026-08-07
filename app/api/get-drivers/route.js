import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import path from 'path';
import fs from 'fs';

export async function GET() {
  try {
    const dataDir = path.join(process.cwd(), 'data');
    const excelFilePath = path.join(dataDir, 'ControlByCrews_Master_Drivers.xlsx');

    if (!fs.existsSync(excelFilePath)) {
      return NextResponse.json({ success: true, drivers: [] });
    }

    const workbook = XLSX.readFile(excelFilePath);
    const worksheet = workbook.Sheets['MasterLog'] || workbook.Sheets[workbook.SheetNames[0]];
    const drivers = XLSX.utils.sheet_to_json(worksheet);

    const validDrivers = drivers.filter(d => d["Employee Name"] && d["Employee Name"].trim() !== "");

    return NextResponse.json({ success: true, drivers: validDrivers });
  } catch (error) {
    console.error("Error reading drivers log:", error);
    return NextResponse.json({ success: true, drivers: [] });
  }
}
