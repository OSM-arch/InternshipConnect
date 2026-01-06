import {NextResponse} from "next/server";
import {getDB} from "@/lib/db";

export async function POST(req, {params}) {
    const { internship_id } = await params;

    if (!internship_id) return NextResponse.json({error: "Internship ID Is undefined"}, {status: 500});

    try {

        const pool = await getDB();
        await pool.query(
            "UPDATE internships SET internship_status = 'cancelled' WHERE internship_id = ?;",
            [internship_id]
        );

        return NextResponse.json({ success: true });
    }catch (error) {
        return NextResponse.json({error: error.message}, {status: 500});
    }
}