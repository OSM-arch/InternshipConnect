import {NextResponse} from "next/server";
import {cookies} from "next/headers";

export async function POST(req) {
    try {

        const { code } = await req.json();

        const cookieCode = (await cookies()).get("email_verification_code")?.value;

        if (!cookieCode) {
            return NextResponse.json({error: "Code expired"}, {status: 401})
        }

        if (code !== cookieCode) {
            return NextResponse.json({ error: "Invalid code" }, { status: 401 });
        }

        const res = NextResponse.json({ success: true });
        res.cookies.delete("email_verification_code");
        return res;

    }catch (error) {
        return NextResponse.json({error: error.message}, {status: 500});
    }
}