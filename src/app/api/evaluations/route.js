import { NextResponse } from "next/server";
import {getDB} from "@/lib/db";

export async function POST(req) {
    try {
        const {
            internship_id,
            technical_score,
            soft_skills_score,
            final_grade,
            feedback
        } = await req.json();

        if (
            !internship_id ||
            technical_score == null ||
            soft_skills_score == null ||
            final_grade == null
        ) {
            return NextResponse.json(
                { success: false, error: "Missing required fields" },
                { status: 400 }
            );
        }

        const pool = await getDB();

        await pool.query(
            `
            INSERT INTO evaluations (
                internship_id,
                technical_score,
                soft_skills_score,
                final_grade,
                feedback
            ) VALUES (?, ?, ?, ?, ?)
            `,
            [
                internship_id,
                technical_score,
                soft_skills_score,
                final_grade,
                feedback || null
            ]
        );

        return NextResponse.json({
            success: true,
            message: "Evaluation submitted successfully"
        });
    } catch (error) {
        console.error("Evaluation insert error:", error);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}