import { NextResponse } from "next/server";
import {getDB} from "@/lib/db";

export async function GET(req) {
    try {
        const { search } = Object.fromEntries(req.nextUrl.searchParams);
        if (!search) {
            return NextResponse.json({ success: false, error: "Search query is required" }, { status: 400 });
        }

        const pool = await getDB();
        const [companies] = await pool.query(
            `SELECT c.company_id, c.company_name
            FROM companies c
           WHERE c.company_name LIKE ?`,
                [`%${search}%`]
            );

        return NextResponse.json({ success: true, data: companies });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, error: "Failed to fetch companies" }, { status: 500 });
    }
}
