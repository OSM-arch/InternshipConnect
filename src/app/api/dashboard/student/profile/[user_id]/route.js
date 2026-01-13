import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";

export async function GET(req, { params }) {
    try {
        const { user_id } = await params;

        if (!user_id) {
            return NextResponse.json(
                { error: "User ID is required" },
                { status: 400 }
            );
        }

        const pool = await getDB();

        const [rows] = await pool.query(
            `
            SELECT
                s.cv_url,
                u.user_id,
                u.role,
                u.first_name,
                u.second_name,
                u.email,
                u.profile_image_url,
                sc.school_name
            FROM students s
            JOIN users u ON u.user_id = s.user_id
            LEFT JOIN schools sc ON sc.school_id = s.school_id
            WHERE s.user_id = ?
            `,
            [user_id]
        );

        if (!rows.length) {
            return NextResponse.json(
                { error: "Student not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            student: rows[0]
        });

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}