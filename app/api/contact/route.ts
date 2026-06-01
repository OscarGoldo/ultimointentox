import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export async function POST(req: NextRequest) {
  try {
    const { nombre, telefono, email, motivo, mensaje } = await req.json();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER2,
        pass: process.env.SMTP_PASS2,
      },
    });

    await transporter.sendMail({
      from: `"Web Dra. Hilda Díaz" <${process.env.SMTP_USER2}>`,
      to: "doc.hildadiaz@gmail.com",
      subject: `Nueva solicitud de cita — ${esc(nombre)}`,
      html: `
        <h2 style="color:#f06292;font-family:sans-serif">Nueva solicitud de cita</h2>
        <table style="font-family:sans-serif;font-size:14px;border-collapse:collapse">
          <tr><td style="padding:6px 12px 6px 0;color:#666"><strong>Nombre</strong></td><td>${esc(nombre)}</td></tr>
          <tr><td style="padding:6px 12px 6px 0;color:#666"><strong>Teléfono</strong></td><td>${esc(telefono)}</td></tr>
          <tr><td style="padding:6px 12px 6px 0;color:#666"><strong>Email</strong></td><td>${esc(email || "No indicado")}</td></tr>
          <tr><td style="padding:6px 12px 6px 0;color:#666"><strong>Motivo</strong></td><td>${esc(motivo)}</td></tr>
          <tr><td style="padding:6px 12px 6px 0;color:#666"><strong>Mensaje</strong></td><td>${esc(mensaje || "Sin mensaje adicional")}</td></tr>
        </table>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Error enviando email:", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
