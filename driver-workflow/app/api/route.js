import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import path from 'path';
import fs from 'fs';
import os from 'os';

export async function GET() {
  try {
    const tempDir = os.tmpdir();
    const files = fs.readdirSync(tempDir);
    const excelFiles = files.filter(f => f.startsWith('ControlByCrews_Master_') && f.endsWith('.xlsx'));

    let drivers = [];
    for (const file of excelFiles) {
      const filePath = path.join(tempDir, file);
      const workbook = XLSX.readFile(filePath);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(worksheet);
      drivers.push(...rows);
    }

    return NextResponse.json({ success: true, drivers });
  } catch (error) {
    console.error("Error reading drivers log:", error);
    return NextResponse.json({ success: false, drivers: [] });
  }
}