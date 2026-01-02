import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const pool = await getDB();

        const location = searchParams.get("location") ? decodeURIComponent(searchParams.get("location")) : null;
        const industry = searchParams.get("industry") ? decodeURIComponent(searchParams.get("industry")) : null;
        const role = searchParams.get("role") ? decodeURIComponent(searchParams.get("role")) : null;
        const languages = searchParams.get("languages") ? decodeURIComponent(searchParams.get("languages")) : null;
        const requirements = searchParams.get("requirements") ? decodeURIComponent(searchParams.get("requirements")) : null;
        const sort = searchParams.get("sort") ? decodeURIComponent(searchParams.get("sort")) : "newest";

        const page = Number(searchParams.get("page") || 1);
        const limit = Number(searchParams.get("limit") || 10);
        const offset = (page - 1) * limit;

        let query = `
            SELECT o.*, c.company_name, c.address, c.logo_url, i.industry_name
            FROM internship_offers o
                     JOIN companies c ON c.company_id = o.company_id
                     JOIN industries i ON i.industry_id = c.industry_id
            WHERE o.status = 'open'
        `;
        const params = [];

        if (location) {
            query += " AND LOWER(c.address) LIKE LOWER(?)";
            params.push(`%${location}%`);
        }

        if (industry) {
            query += " AND i.industry_id = ?";
            params.push(industry);
        }

        if (role) {
            query += " AND LOWER(o.title) LIKE LOWER(?)";
            params.push(`%${role}%`);
        }

        if (languages) {
            const lang_array = languages.split(",") || [];
            query += " AND JSON_OVERLAPS(o.languages, ?)";
            params.push(JSON.stringify(lang_array));
        }

        if (requirements) {
            const req_array = requirements.split(",") || [];
            query += " AND JSON_OVERLAPS(o.required_skills, ?)";
            params.push(JSON.stringify(req_array));
        }

        if (sort === "newest") query += " ORDER BY o.created_at DESC";
        if (sort === "oldest") query += " ORDER BY o.created_at ASC";
        if (sort === "salary_desc") query += " ORDER BY o.salary DESC";

        query += " LIMIT ? OFFSET ?";
        params.push(limit, offset);


        const [rows] = await pool.query(query, params);
        const [total] = await pool.query("SELECT count(*) FROM internship_offers");

        return NextResponse.json({
            data: [...rows],
            total: total[0]
        });

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}