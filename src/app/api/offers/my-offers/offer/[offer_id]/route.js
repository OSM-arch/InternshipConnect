import {NextResponse} from "next/server";
import {getDB} from "@/lib/db";

export async function GET(req, {params}) {
    try {
        const {offer_id} = await params;
        if (!offer_id) {
            return NextResponse.json({error: "Offer not found!"}, {status: 404});
        }

        const pool = await getDB();
        const [row] = await pool.query("SELECT title, description, expiration_date, salary, location, available_slots, required_skills, languages FROM internship_offers WHERE offer_id = ?", [offer_id]);

        return NextResponse.json({success: true, data: row[0] || {}});

    }catch (error) {
        return NextResponse.json({error: error.message}, {status: 500});
    }
}