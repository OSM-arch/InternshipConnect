import {NextResponse} from "next/server";
import {supabaseServer} from "@/lib/supabase/server";
import {getDB} from "@/lib/db";

export async function POST(req) {

    const MAX_SIZE_MB = 5 * 1024 * 1024; // 5MB

    try {

        const formData = await req.formData();

        const id = formData.get('id');
        const role = formData.get('role');
        const file = formData.get('file');

        if (!id || role !== "student") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (!file) {
            return NextResponse.json({error: "No file provided"}, {status: 401});
        }

        if (file.type !== "application/pdf") {
            return NextResponse.json({ error: "Only PDF allowed" }, { status: 400 });
        }

        const fileSize = file.size;
        if (fileSize > MAX_SIZE_MB) {
            return NextResponse.json({error: "PDF must be smaller than 5MB", data: fileSize}, {status: 401});
        }

        const fileExt = file.name.split(".").pop();
        const filePath = `${role + "s"}/${id}.${fileExt}`;

        const { error } = await supabaseServer.storage
            .from('cvs')
            .upload(filePath, file, { upsert: true });

        if (error) {
            return NextResponse.json({error: "We could not save the changes"}, {status: 500});
        }

        const { data } = supabaseServer.storage
            .from("cvs")
            .getPublicUrl(filePath);

        if (data) {
            const pool = await getDB();
            await pool.query("UPDATE students SET cv_url = ? WHERE user_id = ?", [data.publicUrl, id]);

            return NextResponse.json({success: true});
        }else {
            return NextResponse.json({error: "Can't get CV public url"}, {status: 401});
        }

    }catch (error) {
        return NextResponse.json({error: error.message}, {status: 500});
    }

}