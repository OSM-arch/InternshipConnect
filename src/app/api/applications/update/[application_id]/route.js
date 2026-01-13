import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";

export async function PATCH(req, { params }) {
    try {
        const { application_id } = await params;

        if (!application_id) {
            return NextResponse.json(
                { error: "Application Id is undefined!" },
                { status: 400 }
            );
        }

        const formdata = await req.formData();
        const status = formdata.get("status");

        const allowedStatuses = ["pending", "accepted", "rejected"];
        if (!allowedStatuses.includes(status)) {
            return NextResponse.json(
                { error: "Invalid status value" },
                { status: 400 }
            );
        }

        const pool = await getDB();

        const [result] = await pool.query(
            "UPDATE applications SET status = ? WHERE application_id = ?",
            [status, application_id]
        );

        if (result.affectedRows === 0) {
            return NextResponse.json(
                { error: "Application not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}