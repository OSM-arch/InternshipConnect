import {NextResponse} from "next/server";
import {getDB} from "@/lib/db";

export async function GET(req, {params}) {
    try {
        const {user_id} = await params;
        const pool = await getDB();

        // company_id
        const [row] = await pool.query("SELECT company_id FROM companies WHERE user_id = ?", [user_id]);

        if (!row.length === 0) {
            return NextResponse.json({error: "Company not found!"}, {status: 404});
        }

        const {company_id} = row[0];

        const [rows] = await pool.query(`
            SELECT 
                io.offer_id,
                io.title,
                io.expiration_date,
                io.created_at,
                io.location,
                io.available_slots,
                io.status,
                COUNT(a.offer_id) AS nbr_applications,
                SUM(CASE WHEN a.status = 'accepted' THEN 1 ELSE 0 END) AS nbr_accepted
            FROM internship_offers io
            LEFT JOIN applications a 
                ON a.offer_id = io.offer_id
            WHERE io.company_id = ?
            GROUP BY 
                io.offer_id,
                io.title,
                io.expiration_date,
                io.created_at,
                io.location,
                io.available_slots,
                io.status
            ORDER BY io.created_at DESC
        `, [company_id]);

        if (rows.length === 0) {
            return NextResponse.json({error: "0 offers found!"}, {status: 401});
        }

        return NextResponse.json({
            success: true,
            data: rows
        });
    }catch (error) {
        return NextResponse.json({error: error.message}, {status: 500});
    }
}