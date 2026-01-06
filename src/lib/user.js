import {getDB} from "@/lib/db";

export async function getProfileForUser({ role, user_id }) {
    try {

        const pool = await getDB();

        let profile = null;

        if (role === "student") {
            const [rows] = await pool.query(`
                SELECT
                    u.*,
                    s.*,
                    sc.school_name,
                    sg.*
                FROM students s
                     JOIN users u ON u.user_id = s.user_id
                     LEFT JOIN schools sc ON sc.school_id = s.school_id
                     LEFT JOIN student_groups sg ON sg.group_id = s.group_id
                WHERE s.user_id = ?
        `, [user_id]);

            profile = rows[0];
        }

        if (role === "company") {
            const [rows] = await pool.query(`
                SELECT
                    u.*,
                    c.*,
                    i.industry_name,
                    i.industry_id
                FROM companies c
                    JOIN industries i ON i.industry_id = c.industry_id
                    JOIN users u ON u.user_id = c.user_id
                WHERE c.user_id = ?
            `, [user_id]);

            profile = rows[0];
        }

        if (role === "school") {
            const [[row]] = await pool.query(`
            SELECT school_id, school_name, verified
            FROM schools
            WHERE user_id = ?
        `, [user_id]);

            profile = row;
        }

        return profile;

    }catch (error) {
        return {error: error.message};
    }

}