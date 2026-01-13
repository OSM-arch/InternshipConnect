import { NextResponse } from "next/server";
import {getDB} from "@/lib/db";

export async function GET(req, { params }) {
    const { user_id } = await params;

    if (!user_id) {
        return NextResponse.json({ success: false, message: "user_id is required" }, { status: 400 });
    }

    try {
        const pool = await getDB();

        const [row] = await pool.query("SELECT first_name, second_name FROM users WHERE user_id = ?", [user_id]);

        const [rows] = await pool.execute(
            `
                SELECT
                    u.user_id AS student_user_id,
                    u.first_name,
                    u.second_name,
                    u.profile_image_url,
                    sc.school_name,
                    i.internship_status,
                    i.internship_id,
                    DATEDIFF(i.end_date, CURDATE()) AS days_left,
                    i.report_url,
                    e.final_grade
                FROM supervisors s
                         JOIN internships i
                              ON i.supervisor_id = s.supervisor_id
                         JOIN applications a
                              ON a.application_id = i.application_id
                         JOIN students st
                              ON st.student_id = a.student_id
                         JOIN users u
                              ON u.user_id = st.user_id
                         LEFT JOIN schools sc
                                   ON sc.school_id = st.school_id
                         LEFT JOIN evaluations e
                                   ON e.internship_id = i.internship_id
                WHERE s.user_id = ?
                ORDER BY i.start_date DESC;
            `,
            [user_id]
        );

        return NextResponse.json({ success: true, data: {
                user: row,
                internships: rows
            }});
    } catch (error) {
        console.error("DB Error:", error);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
}