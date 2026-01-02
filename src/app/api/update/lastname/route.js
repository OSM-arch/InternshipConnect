import {getDB} from "@/lib/db";
import {NextResponse} from "next/server";

export async function POST(req) {
    try {

        const formData = await req.formData();
        const id = formData.get('id');
        const lastname = formData.get('lastname');

        const pool = await getDB();
        await pool.query("UPDATE users SET second_name = ? WHERE user_id = ?", [lastname, id]);

        return NextResponse.json({success: true});

    }catch (error) {
        return NextResponse.json({error: error.message}, {status: 500});
    }
}