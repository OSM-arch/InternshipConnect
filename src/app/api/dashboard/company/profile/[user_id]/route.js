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

        const [rows] = await pool.query(`
            SELECT
                u.user_id,
                u.first_name,
                u.second_name,
                u.email,
                u.profile_image_url,
                u.role,
                c.company_name,
                c.address,
                c.description,
                i.industry_name,
                i.industry_id
            FROM companies c
                 JOIN industries i ON i.industry_id = c.industry_id
                 JOIN users u ON u.user_id = c.user_id
            WHERE c.user_id = ?
        `, [user_id]);

        if (!rows.length) {
            return NextResponse.json(
                { error: "Company not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            company: rows[0]
        });

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}