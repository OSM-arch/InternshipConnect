import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {getDB} from "@/lib/db";

export async function POST(req) {
    const { email } = await req.json();

    try {
        const pool = await getDB();
        await pool.query("UPDATE users SET email_verified = TRUE WHERE email = ?", [email]);

        const res = NextResponse.json({ success: true });
        res.cookies.delete("email_verification_code");
        return res;

    }catch (error) {
        return NextResponse.json({error: error.message}, {status: 500});
    }
}