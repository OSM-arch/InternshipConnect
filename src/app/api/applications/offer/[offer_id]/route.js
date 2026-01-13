import {NextResponse} from "next/server";
import {getDB} from "@/lib/db";

export async function GET(req, {params}) {
    try {
        const { offer_id } = await params;
        if (!offer_id) {
            return NextResponse.json({error: "Offer Id is undefined!"}, {status: 400});
        }

        const pool = await getDB();
        const [rows] = await pool.query(`
            SELECT u.first_name, u.second_name, u.profile_image_url, s.cv_url, a.application_id, a.status, a.apply_date, sh.school_name
            FROM applications a
                JOIN students s ON s.student_id = a.student_id
                JOIN users u ON u.user_id = s.user_id
                JOIN schools sh ON sh.school_id = s.school_id
            WHERE a.offer_id = ?
        `, [offer_id]);

        return NextResponse.json({success: true, data: rows || []});

    }catch(error) {
        return NextResponse.json({error: error}, {status: 500});
    }
}