import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getDB } from '@/lib/db';
import {SignJWT} from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function POST(req) {

    try {
        const { email, password } = await req.json();
        const pool = await getDB();

        // Get user by email-verification
        const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

        if (rows.length === 0) {
            return NextResponse.json({ error: 'User not found' }, { status: 401 });
        }

        const user = rows[0];

        // Check if verified
        const isVerified = user.email_verified;
        if (!isVerified) {
            return NextResponse.json({ error: 'User not Verified' }, { status: 401 });
        }

        // Compare stored hashed password
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return NextResponse.json({ error: 'Password incorrect' }, { status: 401 });
        }

        // Generate JWT token
        const token = await new SignJWT({
            user_id: user.user_id,
            role: user.role
        })
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime("24h")
            .sign(secret);

        // Return token in httpOnly cookie
        const response = NextResponse.json({
            success: true,
            user: user,
        });

        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24,
        });

        return response;
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}