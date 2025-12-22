import {NextResponse} from "next/server";
import {getDB} from "@/lib/db";

export async function GET(request) {
    try {
        const { searchParams } = request.nextUrl;
        const query = `%${searchParams.get("q")}%`;

        const pool = await getDB();
        const [rows] = await pool.query(`SELECT school_id, school_name FROM schools WHERE LOWER(school_name) LIKE LOWER(?) LIMIT ?`, [query, 5]);

        if (rows.length === 0) {
            return NextResponse.json({error: 'School not found'}, {status: 401});
        }

        return NextResponse.json({
            success: true,
            data: rows
        });

    }catch (error) {
        return NextResponse.json({error: error.message}, {status: 500});
    }
}