import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";

export async function PATCH(req) {
    try {
        const { internship_id, end_date } = await req.json();

        if (!internship_id || !end_date) {
            return NextResponse.json(
                { error: "internship_id and end_date are required" },
                { status: 400 }
            );
        }

        const pool = await getDB();

        const [[internship]] = await pool.query(
            `
            SELECT start_date
            FROM internships
            WHERE internship_id = ?
            `,
            [internship_id]
        );

        if (!internship) {
            return NextResponse.json(
                { error: "Internship not found" },
                { status: 404 }
            );
        }

        const startDate = new Date(internship.start_date);
        const endDate = new Date(end_date);
        const today = new Date();

        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);

        if (endDate < today) {
            return NextResponse.json(
                { error: "End date cannot be in the past" },
                { status: 400 }
            );
        }

        if (endDate <= startDate) {
            return NextResponse.json(
                { error: "End date must be after start date" },
                { status: 400 }
            );
        }

        const minEndDate = new Date(startDate);
        minEndDate.setMonth(minEndDate.getMonth() + 1);

        if (endDate < minEndDate) {
            return NextResponse.json(
                { error: "Internship must last at least 1 month" },
                { status: 400 }
            );
        }

        await pool.query(
            `
            UPDATE internships
            SET end_date = ?
            WHERE internship_id = ?
            `,
            [end_date, internship_id]
        );

        return NextResponse.json({
            success: true,
            message: "Internship end date updated successfully"
        });

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}