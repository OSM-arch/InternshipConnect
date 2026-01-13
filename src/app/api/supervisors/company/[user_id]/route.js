import { NextResponse } from "next/server";
import {getDB} from "@/lib/db";

export async function GET(req, { params }) {
    const { user_id } = await params;

    if (!user_id) {
        return NextResponse.json({ success: false, error: "user_id is required" }, { status: 400 });
    }

    try {

        const pool = await getDB();

        const [companies] = await pool.query(
            `SELECT company_id FROM companies WHERE user_id = ?`,
            [user_id]
        );

        if (companies.length === 0) {
            return NextResponse.json({ success: false, error: "Company not found for this user" }, { status: 404 });
        }

        const company_id = companies[0].company_id;

        const [supervisors] = await pool.query(
            `SELECT s.supervisor_id, u.first_name, u.second_name
               FROM supervisors s
               JOIN users u ON u.user_id = s.user_id
               WHERE s.company_id = ?`,
            [company_id]
        );

        return NextResponse.json({ success: true, data: supervisors });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, error: "Failed to fetch supervisors" }, { status: 500 });
    }
}