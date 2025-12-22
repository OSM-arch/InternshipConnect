import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req) {
    const { code } = await req.json();
    const storedCode = cookies().get("email_verification_code")?.value;

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

    const res = NextResponse.json({ success: true });
    res.cookies.delete("email_verification_code");

    return res;
}