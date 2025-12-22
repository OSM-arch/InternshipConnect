import { NextResponse } from "next/server";
import generateVerificationCode from "@/functions/generate_verification_code";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export async function sendVerificationEmail(to, code) {
    await transporter.sendMail({
        from: `"InternshipConnect" <${process.env.EMAIL_USER}>`,
        to,
        subject: "Your verification code",
        html: `
      <h2>Email Verification</h2>
      <p>Your verification code is:</p>
      <h1>${code}</h1>
      <p>This code expires in 10 minutes.</p>
    `,
    });
}


export async function POST(req) {
    try {
        const { email } = await req.json();

        const code = generateVerificationCode(); // 6 digits

        const response = NextResponse.json({ success: true });

        response.cookies.set("email_verification_code", code, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 10 * 60,
            path: "/",
        });

        await sendVerificationEmail({
            to: email,
            code: code
        });

        return response;
    } catch (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}