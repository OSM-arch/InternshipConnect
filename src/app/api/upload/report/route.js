import {NextResponse} from "next/server";
import {supabaseServer} from "@/lib/supabase/server";
import {getDB} from "@/lib/db";

export async function POST(req) {

    try {

        const formData = await req.formData();

        const id = formData.get('id');
        const file = formData.get('report');

        if (!file) {
            return NextResponse.json({error: "No file provided"}, {status: 401});
        }

        const fileExt = file.name.split(".").pop();
        const filePath = `reports/${id}.${fileExt}`;

        const { error } = await supabaseServer.storage
            .from('reports')
            .upload(filePath, file, { upsert: true });

        if (error) {
            return NextResponse.json({error: "Uploading Failed"}, {status: 500});
        }

        const { data } = supabaseServer.storage
            .from("reports")
            .getPublicUrl(filePath);

        if (data) {
            const pool = await getDB();
            await pool.query("UPDATE internships SET report_url = ? WHERE internship_id = ?", [data.publicUrl, id]);

            return NextResponse.json({success: true});
        }else {
            return NextResponse.json({error: "Can't get Report public url"}, {status: 401});
        }

    }catch (error) {
        return NextResponse.json({error: error.message}, {status: 500});
    }

}