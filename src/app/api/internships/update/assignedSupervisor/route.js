import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";

export async function PATCH(req) {
    try {
        const { internship_id, supervisor_id } = await req.json();

        if (!internship_id || !supervisor_id) {
            return NextResponse.json(
                { error: "internship_id and supervisor_id are required" },
                { status: 400 }
            );
        }

        const pool = await getDB();

        await pool.query(
            `
            UPDATE internships
            SET supervisor_id = ?
            WHERE internship_id = ?
            `,
            [supervisor_id, internship_id]
        );

        return NextResponse.json({
            success: true,
            message: "Internship supervisor assigned successfully"
        });

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}