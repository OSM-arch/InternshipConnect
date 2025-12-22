import {NextResponse} from "next/server";
import {getDB} from "@/lib/db";

export async function GET() {

    try {

        const pool = await getDB();

        // Get industries
        const [rows] = await pool.query("SELECT * FROM industries");

        if (rows.length === 0) {
            return NextResponse.json(
                { error: 'Industries are not available at the moment. please try again' },
                { status: 503 }
            );
        }

        return NextResponse.json({
            success: true,
            data: rows
        });

    }catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}