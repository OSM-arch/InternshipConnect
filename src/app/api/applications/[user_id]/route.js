import {getDB} from "@/lib/db";
import {NextResponse} from "next/server";

export async function GET(req, {params}) {
    const {user_id} = await params;

    try {
        const pool = await getDB();

        // get student_id
        const [row] = await pool.query("SELECT student_id FROM students WHERE user_id = ?", [user_id]);
        const {student_id} = row[0];

        if (!student_id) {
            return NextResponse.json({error: "Student not found"}, {status: 401});
        }

        const [rows] = await pool.query(`
            SELECT a.application_id, i.title, i.salary, i.offer_id, c.company_name, c.logo_url, a.apply_date, a.status
            FROM applications a
                     JOIN internship_offers i ON i.offer_id = a.offer_id
                     JOIN companies c ON c.company_id = i.company_id
            WHERE a.student_id = ?
        `, [student_id]);

        return NextResponse.json({
            success: true,
            data: [...rows]
        });
    }catch (error) {
        return NextResponse.json({error: error.message}, {status: 500});
    }
}