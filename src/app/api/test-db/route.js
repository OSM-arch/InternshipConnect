import { NextResponse } from 'next/server';
import { getDB } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function GET() {
    const password = "raja@gmail.com";
    try {
        const pool = await getDB();
        const hashedPassword = await bcrypt.hash(password, 10);

        const [results] = await pool.query(`SELECT * FROM users`);

        return NextResponse.json({
            success: true,
            data: results,
            pwd: hashedPassword
        });
    } catch (error) {
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}