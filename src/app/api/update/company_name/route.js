import {getDB} from "@/lib/db";
import {NextResponse} from "next/server";

export async function POST(req) {
    try {

        const formData = await req.formData();
        const id = formData.get('id');
        const company_name = formData.get('company_name');

        const pool = await getDB();
        await pool.query("UPDATE companies SET company_name = ? WHERE user_id = ?", [company_name, id]);

        return NextResponse.json({success: true});

    }catch (error) {
        return NextResponse.json({error: error.message}, {status: 500});
    }
}