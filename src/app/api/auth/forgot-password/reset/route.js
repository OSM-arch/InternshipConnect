import {NextResponse} from "next/server";
import {getDB} from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req) {
    try {

        const { email, newPwd } = await req.json();

        const pool = await getDB();
        const [rows] = await pool.query("SELECT * FROM users WHERE email-verification = ? LIMIT 1", [email]);

        const user = rows[0];

        // User not exists
        if (!user) {
            return NextResponse.json({error: "User not found"}, {status: 401});
        }

        // Hash password
        const hashed = await bcrypt.hash(newPwd, 10);

        await pool.query(
            "UPDATE users SET password= ? WHERE email-verification= ?",
            [hashed, email]
        );

        return NextResponse.json({success: true});

    }catch (error) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}