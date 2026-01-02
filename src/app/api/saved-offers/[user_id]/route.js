import {NextResponse} from "next/server";
import {getDB} from "@/lib/db";

export async function GET(req, {params}) {
    const {user_id} = await params;
    try {
        const pool = await getDB();
        const [rows] = await pool.query(`
            SELECT i.*, c.company_name, c.address, c.logo_url, ind.industry_name
            FROM saved_offers so
                 JOIN internship_offers i ON i.offer_id = so.offer_id
                 JOIN companies c ON c.company_id = i.company_id
                 LEFT JOIN industries ind ON ind.industry_id = c.industry_id
            WHERE i.status = 'open' AND so.user_id = ?
        `, [user_id]);

        return NextResponse.json({
            success: true,
            data: [...rows]
        });
    }catch (error) {
        return NextResponse.json({error: error.message}, {status: 500});
    }
}