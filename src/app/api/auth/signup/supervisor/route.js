import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";

export async function POST(request) {
    try {
        const {
            firstname,
            lastname,
            email,
            password,
            company_id
        } = await request.json();
        const pool = await getDB();

        // Asynchronous password hashing
        const hashed_password = await bcrypt.hash(password, 10);

        await pool.query("CALL register_supervisor(?, ?, ?, ?, ?)", [
            firstname,
            lastname,
            email,
            hashed_password,
            company_id
        ]);

        return NextResponse.json({
            success: true,
            message: "Account created successfully. redirecting..."
        });

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}