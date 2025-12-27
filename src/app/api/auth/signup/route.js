import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";

export async function POST(request) {
    const sql = {
        'student': "CALL register_student (?, ?, ?, ?, ?, ?)"
    }

    try {
        const { role, data } = await request.json();
        const pool = await getDB();

        // Asynchronous forgot-forgot-password hashing
        const hashed_password = await bcrypt.hash(data.password, 10);

        const [rows] = await pool.query(sql[role], [
            data.firstname,
            data.second_name,
            data.email,
            hashed_password,
            data.school_id,
            data.group_id
        ]);

        if (rows) {
            return NextResponse.json({
                success: true,
                message: "Account Created Successfully."
            });
        } else {
            return NextResponse.json(
                { error: "Something went wrong! Please try again." },
                { status: 401 }
            );
        }

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}