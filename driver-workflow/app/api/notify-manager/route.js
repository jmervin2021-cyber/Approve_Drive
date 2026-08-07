import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const { recipientEmail, stepName, employeeName, status } = await request.json();

    // Configure your SMTP transport (using Ethereal for testing or your production SMTP server)
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: 'your-email@ethereal.email',
        pass: 'your-password',
      },
    });

    const info = await transporter.sendMail({
      from: '"Control by Crews Workflow" <noreply@crewscontrol.com>',
      to: recipientEmail,
      subject: `Action Required: Driver Application - ${employeeName} (${stepName})`,
      text: `Hello,\n\nThe driver application for ${employeeName} has reached ${stepName}.\nCurrent Standing: ${status}\n\nPlease log into the portal to review.`,
      html: `<div style="font-family: sans-serif; background: #0A0E14; color: #fff; padding: 20px; border-radius: 8px;">
        <h2 style="color: #4ADE80;">Control by Crews — Workflow Alert</h2>
        <p>The driver application for <strong>${employeeName}</strong> is now at <strong>${stepName}</strong>.</p>
        <p>Current Standing: <span style="color: #FBBF24; font-weight: bold;">${status}</span></p>
      </div>`,
    });

    console.log("Notification email sent: %s", info.messageId);
    return NextResponse.json({ success: true, messageId: info.messageId });
  } catch (error) {
    console.error("Failed to send email:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}