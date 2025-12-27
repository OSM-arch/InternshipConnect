import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDB } from '@/lib/db';

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
        const token = jwt.sign(
            { user_id: user.user_id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Return token in httpOnly cookie
        const response = NextResponse.json({
            success: true,
            user: {
                user_id: user.user_id,
                email: user.email,
                role: user.role,
            },
        });

        response.cookies.set('token', token, {
            httpOnly: true,
            path: '/',
            maxAge: 60 * 60, // 1 hour
        });

        return response;
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}