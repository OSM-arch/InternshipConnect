import {getDB} from "@/lib/db";
import {NextResponse} from "next/server";

export async function POST(req) {
    try {

        const formData = await req.formData();
        const id = formData.get('id');
        const address = formData.get('address');

        const pool = await getDB();
        await pool.query("UPDATE companies SET address = ? WHERE user_id = ?", [address, id]);

        return NextResponse.json({success: true});

    }catch (error) {
        return NextResponse.json({error: error.message}, {status: 500});
    }
}