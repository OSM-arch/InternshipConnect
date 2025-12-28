import {NextResponse} from "next/server";
import {getDB} from "@/lib/db";

export async function GET() {
    try {

        const pool = await getDB();
        // Get industries
        const [rows] = await pool.query("SELECT * FROM industries");

        return NextResponse.json({
            success: true,
            data: rows || []
        });

    }catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}