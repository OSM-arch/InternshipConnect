import {NextResponse} from "next/server";
import {getDB} from "@/lib/db";

export async function GET(req, { params }) {
    const { offer_id } = await params;

    if (!offer_id) {
        return NextResponse.json({error: "Unauthorised"}, {status: 401});
    }

    try {
        const pool = await getDB();
        const [rows] = await pool.query(`
            SELECT o.*, c.company_name, c.address, c.size, c.logo_url, i.industry_name
            FROM internship_offers o
                 JOIN companies c ON c.company_id = o.company_id
                 JOIN industries i ON i.industry_id = c.industry_id
            WHERE o.status = 'open' AND o.offer_id = ?
        `, [offer_id]);

        return NextResponse.json({
            success: true,
            data: rows[0]
        });

    }catch (error) {
        return NextResponse.json({error: error.message}, {status: 500});
    }
}