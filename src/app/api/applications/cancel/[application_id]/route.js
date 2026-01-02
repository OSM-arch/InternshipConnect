import {NextResponse} from "next/server";
import {getDB} from "@/lib/db";

export async function DELETE(req, {params}) {
    const { application_id } = await params;

    try {

        const pool = await getDB();
        const [result] = await pool.query(
            "DELETE FROM applications WHERE application_id = ?",
            [application_id]
        );

        if (result.affectedRows === 0) {
            return NextResponse.json(
                { error: "Application not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true });
    }catch (error) {
        return NextResponse.json({error: error.message}, {status: 500});
    }
}