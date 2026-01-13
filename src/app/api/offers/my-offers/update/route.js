import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";

export async function PATCH(req) {
    try {
        const formData = await req.formData();

        const offer_id = formData.get("offer_id");
        if (!offer_id) {
            return NextResponse.json({ error: "Offer ID is required" }, { status: 400 });
        }

        const title = formData.get("title");
        const location = formData.get("location");
        const salary = formData.get("salary");
        const available_slots = formData.get("available_slots");
        const description = formData.get("description");
        const expiration_date = formData.get("expiration_date");
        const skills = formData.get("skills");
        const languages = formData.get("languages");

        const fields = [];
        const values = [];

        if (title) {
            fields.push("title = ?");
            values.push(title);
        }
        if (location) {
            fields.push("location = ?");
            values.push(location);
        }
        if (salary) {
            fields.push("salary = ?");
            values.push(salary);
        }
        if (available_slots) {
            fields.push("available_slots = ?");
            values.push(available_slots);
        }
        if (description) {
            fields.push("description = ?");
            values.push(description);
        }
        if (expiration_date) {
            fields.push("expiration_date = ?");
            values.push(expiration_date);
        }
        if (skills) {
            fields.push("required_skills = ?");
            values.push(skills);
        }
        if (languages) {
            fields.push("languages = ?");
            values.push(languages);
        }

        if (fields.length === 0) {
            return NextResponse.json(
                { error: "No fields provided to update" },
                { status: 400 }
            );
        }

        values.push(offer_id);

        const pool = await getDB();

        const sql = `UPDATE internship_offers SET ${fields.join(", ")} WHERE offer_id = ?`;

        const [result] = await pool.query(sql, values);

        if (result.affectedRows === 0) {
            return NextResponse.json({ error: "Offer not found or nothing updated" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Offer updated successfully" });

    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
