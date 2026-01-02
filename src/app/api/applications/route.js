import {NextResponse} from "next/server";
import {getDB} from "@/lib/db";

export async function POST(req) {
    const {user_id, offer_id} = await req.json();

    try {

        const pool = await getDB();

        // get Student_id
        const [rows] = await pool.query("SELECT student_id FROM students WHERE user_id = ?", [user_id]);
        const {student_id} = rows[0];

        if (!student_id) {
            return NextResponse.json({error: "Student not found"}, {status: 401});
        }

        await pool.query("INSERT INTO applications(student_id, offer_id) VALUES(?, ?)", [student_id, offer_id]);

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