import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {getDB} from "@/lib/db";

export async function POST(req) {
    const { code, email } = await req.json();
    const storedCode = (await cookies()).get("email_verification_code")?.value;

    if (!storedCode) {
        return NextResponse.json(
            { error: "Code expired" },
            { status: 400 }
        );
    }

    if (code !== storedCode) {
        return NextResponse.json(
            { error: "Invalid code" },
            { status: 400 }
        );
    }

    try {
        const pool = await getDB();
        const [rows] = await pool.query("UPDATE users SET email_verified = TRUE WHERE email = ?", [email]);

        console.log(rows);

        const res = NextResponse.json({ success: true });
        res.cookies.delete("email_verification_code");
        return res;

    }catch (error) {
        return NextResponse.json({error: error.message}, {status: 500});
    }
}