import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";

export async function GET(req, {params}) {
    try {
        const {user_id} = await params;

        if (!user_id) {
            return NextResponse.json(
                { error: "User ID is required" },
                { status: 400 }
            );
        }

        const pool = await getDB();

        const [rows] = await pool.query(
            `
            SELECT
                it.internship_id,
                it.internship_status,
                it.start_date,
                it.end_date,

                st.student_id,
                u.first_name,
                u.second_name,
                u.email,
                u.profile_image_url,

                io.title AS offer_title,

                sp.supervisor_id,
                CONCAT(su.first_name, ' ', su.second_name) AS supervisor_name

            FROM internships it
                JOIN applications a ON a.application_id = it.application_id
                JOIN students st ON st.student_id = a.student_id
                JOIN users u ON u.user_id = st.user_id
                JOIN internship_offers io ON io.offer_id = a.offer_id
                JOIN companies c ON c.company_id = io.company_id
    
                LEFT JOIN supervisors sp ON sp.supervisor_id = it.supervisor_id
                LEFT JOIN users su ON su.user_id = sp.user_id
            WHERE c.user_id = ?
            ORDER BY it.start_date DESC
            `,
            [user_id]
        );

        return NextResponse.json({
            success: true,
            data: rows
        });

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}