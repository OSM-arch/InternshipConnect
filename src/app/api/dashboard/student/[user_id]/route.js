import {NextResponse} from "next/server";
import {getDB} from "@/lib/db";

export async function GET(req, {params}) {
    const {user_id} = await params;

    if (!user_id) {
        return NextResponse.json({}, {status: 401});
    }

    try {
        const pool = await getDB();
        const [rows] = await pool.query("CALL get_student_dashboard(?)", [user_id]);

        const dashboard = {
            user: {
                firstName: rows[0][0]?.first_name || null,
                lastName: rows[0][0]?.second_name || null
            },

            stats: {
                completedInternships: rows[1][0]?.completed_internships || 0,
                totalApplications: rows[2][0]?.total_applications || 0,
                pendingApplications: rows[3][0]?.pending_applications || 0
            },

            latestApplications: rows[4].map(app => ({
                id: app.application_id,
                title: app.title,
                salary: app.salary,
                offerId: app.offer_id,
                company: {
                    name: app.company_name,
                    logo: app.logo_url
                },
                appliedAt: app.apply_date,
                status: app.status
            })),

            currentInternship: rows[5][0]
                ? {
                    id: rows[5][0].internship_id,
                    title: rows[5][0].title,
                    company: rows[5][0].company_name,
                    startDate: rows[5][0].start_date,
                    endDate: rows[5][0].end_date,
                    report: rows[5][0].report_url,
                    status: rows[5][0].internship_status
                }
                : null
        };

        return NextResponse.json({
            success: true,
            data: dashboard
        })
    }catch (error) {
        return NextResponse.json({error: error.message}, {status: 500});
    }
}