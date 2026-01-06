import {getDB} from "@/lib/db";
import {NextResponse} from "next/server";

export async function POST(req) {
    try {

        const formData = await req.formData();
        const id = formData.get('id');
        const industry_id = formData.get('industry_id');

        const pool = await getDB();
        await pool.query("UPDATE companies SET industry_id = ? WHERE user_id = ?", [industry_id, id]);

        return NextResponse.json({success: true});

    }catch (error) {
        return NextResponse.json({error: error.message}, {status: 500});
    }
}