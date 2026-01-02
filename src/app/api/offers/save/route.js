import {NextResponse} from "next/server";
import {getDB} from "@/lib/db";

export async function POST(req) {
    const {user_id, offer_id} = await req.json();

    try {

        const pool = await getDB();

        await pool.query("INSERT INTO saved_offers(user_id, offer_id) VALUES(?, ?)", [user_id, offer_id]);

        return NextResponse.json({success: true});

    }catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            return NextResponse.json(
                { error: error.message },
                { status: 409 }
            );
        }

        // Other errors
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}