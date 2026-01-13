import {NextResponse} from "next/server";
import {getDB} from "@/lib/db";

export async function DELETE(req, { params }) {
    const { offer_id } = await params;
    if (!offer_id) {
        return NextResponse.json({error: "Offer not found!"}, {status: 401});
    }

    try {
        const pool = await getDB();
        const [row] = await pool.query("DELETE FROM internship_offers WHERE offer_id = ?", [offer_id]);

        if (row.affectedRows > 0) {
            return NextResponse.json({success: true});
        }else {
            return NextResponse.json({message: "Offer not found or no changes applied"}, {status: 404});
        }
    }catch (error) {
        return NextResponse.json({error: error.message}, {status: 500});
    }
}