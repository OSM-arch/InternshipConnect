import {NextResponse} from "next/server";
import {getDB} from "@/lib/db";

export async function GET(req, {params}) {
    const {user_id} = await params;

    if (!user_id) {
        return NextResponse.json({}, {status: 401});
    }

    try {
        const pool = await getDB();
        const [rows] = await pool.query("CALL get_company_dashboard(?)", [user_id]);

        const dashboard = {
            user: {
                firstName: rows[0][0]?.first_name || null,
                lastName: rows[0][0]?.second_name || null,
                companyName: rows[1][0]?.company_name || null
            },

            stats: {
                totalInternships: rows[2][0]?.total_internships || 0,
                ongoingInternships: rows[3][0]?.ongoing_internships || 0,
                completedInternships: rows[4][0]?.completed_internships || 0
            },

            latestInternships: rows[5].map(intern => ({
                internshipId: intern.internship_id,
                startDate: intern.start_date,
                endDate: intern.end_date,
                status: intern.internship_status,
                student: {
                    firstName: intern.first_name,
                    lastName: intern.second_name,
                    userId: intern.user_id,
                    profileImage: intern.profile_image_url,
                    schoolName: intern.school_name
                },
                offerId: intern.offer_id
            }))
        };

        return NextResponse.json({
            success: true,
            data: dashboard
        })
    }catch (error) {
        return NextResponse.json({error: error.message}, {status: 500});
    }
}