import {formatDateShort} from "@/utils/formatDateShort";
import React from "react";
import {getUserFromToken} from "@/lib/auth";
import Link from "next/link";
import {SquareArrowOutUpRight} from "lucide-react";

export default async function SupervisorPage() {

    const {user_id} = await getUserFromToken();
    let data = [];
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/dashboard/supervisor/${user_id}`, {
            cache: "no-store"
        });
        data = await res.json();
    }catch (err) {
        console.error(err.message);
    }

    if (!data.data) return (<></>);

    const {user, internships} = data.data;

    return (
        <div className="flex flex-col gap-4 mt-4 px-6">
            <div className="w-full relative overflow-hidden h-max py-6">
                <div className="w-full flex flex-col gap-4 lg:gap-0 lg:flex-row lg:justify-between lg:items-center">
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-2">Welcome back, {user.first_name} {user.second_name}</h2>
                        <p className="text-gray-500 text-sm">
                            Good luck!
                        </p>
                    </div>
                </div>
            </div>

            <div className="mt-6 w-full flex flex-col lg:flex-row gap-6 justify-between lg:items-center pt-4">

                <div className="flex flex-col gap-2 flex-1">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="text-md font-bold text-blue-500">
                            Internships
                        </h2>
                    </div>
                    <div>
                        <div className="overflow-hidden rounded-lg border border-slate-800 bg-slate-900">
                            <div className="block overflow-x-auto custom-scrollbar">
                                <table className="w-full text-left text-xs">
                                    <thead>
                                    <tr className="border-b border-slate-800 bg-slate-800/50">
                                        <th className="px-6 py-4 font-medium text-slate-400">Student Name</th>
                                        <th className="px-6 py-4 font-medium text-slate-400">University</th>
                                        <th className="px-6 py-4 font-medium text-slate-400">Report</th>
                                        <th className="px-6 py-4 font-medium text-slate-400">Days Left</th>
                                        <th className="px-6 py-4 font-medium text-slate-400">Status</th>
                                        <th className="px-6 py-4 font-medium text-right text-slate-400">Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800">
                                    {internships.length > 0 && internships.map((intern, index) => {
                                        return <Row key={index} data={intern} />
                                    })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export function Row({data}) {
    const {
        student_user_id,
        first_name,
        second_name,
        profile_image_url,
        school_name,
        internship_status,
        days_left,
        report_url,
        internship_id,
        final_grade
    } = data;
    return (
        <tr className="group transition-colors hover:bg-slate-800/50">
            <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full overflow-hidden bg-indigo-900/30">
                        <span className="text-indigo-400">
                            <img src={profile_image_url ? profile_image_url : "/vector.png"}
                                 alt="Student Profile Image"
                            />
                        </span>
                    </div>
                    <div>
                        <div className="font-semibold text-white">
                            <div className="hover:text-blue-500 hover:underline">
                                {first_name} {second_name}
                            </div>
                        </div>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4 text-slate-300 font-medium">
                {school_name}
            </td>
            <td className="px-6 py-4 text-right">
                <Link href={report_url ? report_url : "#"} target="_blank" className="flex gap-2">
                    View Report <SquareArrowOutUpRight size={16} />
                </Link>
            </td>
            <td className="px-6 py-4 text-slate-300 font-medium text-center">
                {days_left}
            </td>
            <td className="px-6 py-4">
                {
                    internship_status === "ongoing" && <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium bg-amber-900/30 text-amber-300">
                        <span className="size-1.5 rounded-full bg-amber-500"></span>
                            Ongoing
                    </span>
                }

                {
                    internship_status === "completed" && <span
                        className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium bg-emerald-900/30 text-emerald-300">
                        <span className="size-1.5 rounded-full bg-emerald-500"></span>
                        Completed
                    </span>
                }

                {
                    internship_status === "cancelled" && <span
                        className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium bg-red-900/30 text-red-300">
                        <span className="size-1.5 rounded-full bg-red-500"></span>
                        Canceled
                    </span>
                }
            </td>
            <td className="px-2">
                {final_grade && <div className="text-xl">{final_grade} / 20</div>}
                {!final_grade && internship_status === "completed" && <>
                        <Link href={`/dashboard/supervisor/evaluate/${internship_id}`}>
                            <button className="flex items-center justify-center px-4 py-2 rounded-lg text-blue-500  hover:text-white text-sm font-semibold transition-all bg-blue-500/20 hover:bg-blue-500">
                                Evaluate Internship
                            </button>
                        </Link>
                    </>
                }
            </td>
        </tr>
    )
}