import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";

export async function POST(req) {
    try {
        const {
            user_id,
            title,
            location,
            salary,
            available_slots,
            description,
            expiration_date,
            skills,
            languages
        } = await req.json();

        const pool = await getDB();

        const [rows] = await pool.query(
            "SELECT company_id FROM companies WHERE user_id = ?",
            [user_id]
        );

        if (!rows.length) {
            return NextResponse.json(
                { error: "Company not found!" },
                { status: 404 }
            );
        }

        const { company_id } = rows[0];

        await pool.query(
            `
                INSERT INTO internship_offers (
                    company_id,
                    title,
                    description,
                    required_skills,
                    salary,
                    languages,
                    location,
                    expiration_date,
                    available_slots
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,
            [
                company_id,
                title,
                description,
                JSON.stringify(skills),
                salary,
                JSON.stringify(languages),
                location,
                expiration_date,
                available_slots,
            ]
        );

        return NextResponse.json({success: true});
    } catch (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}