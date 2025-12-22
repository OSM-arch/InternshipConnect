import {NextResponse} from "next/server";
import {getDB} from "@/lib/db";

export async function GET(request, {params}) {
    try {
        const {id: school_id} = await params;
        const { searchParams } = request.nextUrl;
        const query = `%${searchParams.get("q")}%`;

        const pool = await getDB();
        const [rows] = await pool.query(`SELECT group_id, group_name FROM student_groups WHERE school_id = ? AND LOWER(group_name) LIKE LOWER(?)`, [school_id, query]);

        if (rows.length === 0) {
            return NextResponse.json({error: 'No group was found'}, {status: 401});
        }

        return NextResponse.json({
            success: true,
            data: rows
        });

    }catch (error) {
        return NextResponse.json({error: error.message}, {status: 500});
    }
}