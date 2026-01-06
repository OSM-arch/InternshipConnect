import {getDB} from "@/lib/db";
import {NextResponse} from "next/server";

export async function POST(req) {
    try {

        const formData = await req.formData();
        const id = formData.get('id');
        const description = formData.get('description');

        const pool = await getDB();
        await pool.query("UPDATE companies SET description = ? WHERE user_id = ?", [description, id]);

        return NextResponse.json({success: true});

    }catch (error) {
        return NextResponse.json({error: error.message}, {status: 500});
    }
}