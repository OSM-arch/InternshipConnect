import {Search, SendHorizontal, CalendarDays, BadgeCheck, SearchX} from "lucide-react";
import Link from "next/link";
import {getUserFromToken} from "@/lib/auth";
import {formatDateShort} from "@/utils/formatDateShort";
import CancelApplicationButton from "@/components/dashboard/cancelApplicationButton";
import InternshipReportSubmit from "@/components/dashboard/internshipReportSubmit";
import React from "react";

export default async function StudentPage() {

    const {user_id} = await getUserFromToken();
    let data = [];
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/dashboard/student/${user_id}`, {
            cache: "no-store"
        });
        data = await res.json();
    }catch (err) {
        console.error(err.message);
    }

    const {user, stats, latestApplications, currentInternship} = data.data;
    console.log(data.data);

    return (
        <div className="flex flex-col gap-4 mt-4 px-6">
            <div className="w-full relative overflow-hidden h-max py-6">
                <div className="w-full flex flex-col gap-4 lg:gap-0 lg:flex-row lg:justify-between lg:items-center">
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-2">Welcome back, {user.firstName} {user.lastName}</h2>
                        <p className="text-gray-500 text-sm">
                            You have 2 upcoming interviews this week. Good luck!
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Link href="/dashboard/search-offers"
                              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors shadow-md shadow-blue-500/30 flex items-center gap-2">
                            <Search size={16} />
                            Browse New Offers
                        </Link>
                    </div>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row lg:justify-evenly lg:items-center gap-4">

                <div className="flex-1 p-6 rounded-xl border border-gray-500 shadow-sm flex flex-col gap-1 group hover:border-blue-500/50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-gray-500 font-medium text-sm">
                            Applications Sent
                        </h3>
                        <div className="p-2 bg-blue-900/20 rounded-lg text-blue-500">
                            <span>
                                <SendHorizontal size={20} />
                            </span>
                        </div>
                    </div>
                    <div className="flex items-end gap-3">
                        <span className="text-3xl font-bold text-white">{stats.totalApplications}</span>
                    </div>
                </div>

                <div className="flex-1 p-6 rounded-xl border border-gray-500 shadow-sm flex flex-col gap-1 group hover:border-purple-500/50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-gray-500 font-medium text-sm">Pending Applications</h3>
                        <div className="p-2 bg-purple-900/20 rounded-lg text-purple-400">
                            <span>
                                <CalendarDays size={20} />
                            </span>
                        </div>
                    </div>
                    <div className="flex items-end gap-3">
                        <span className="text-3xl font-bold text-white">{stats.pendingApplications}</span>
                    </div>
                </div>

                <div className="flex-1 p-6 rounded-xl border border-gray-500 shadow-sm flex flex-col gap-1 group hover:border-emerald-500/50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-gray-500 font-medium text-sm">Completed Internships</h3>
                        <div className="p-2 bg-emerald-900/20 rounded-lg text-emerald-400">
                            <span>
                                <BadgeCheck size={20} />
                            </span>
                        </div>
                    </div>
                    <div className="flex items-end gap-3">
                        <span className="text-3xl font-bold text-white">{stats.completedInternships}</span>
                    </div>
                </div>

            </div>

            <div className="w-full flex flex-col lg:flex-row gap-6 justify-between lg:items-center pt-4">

                <div className="flex flex-col gap-2 flex-1">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="text-md font-bold text-blue-500">
                            Internship Status
                        </h2>
                    </div>
                    <div className="rounded-xl border border-gray-500 p-6 shadow-sm">

                        {
                            currentInternship ? <>
                                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-500">
                                    <div className="h-10 w-10 bg-black rounded-lg flex items-center justify-center">

                                        <div className="w-6 h-6 rounded-full bg-[#1DB954]"></div>
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold text-white">{currentInternship.company}</h3>
                                        <p className="text-xs text-gray-500">
                                            {currentInternship.title}
                                        </p>
                                    </div>
                                    <span className="ml-auto px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-900/30 text-blue-300">
                                        {currentInternship.status}
                                    </span>
                                </div>
                                <div className="flex flex-row justify-center items-center text-xs gap-0">
                                    {formatDateShort(currentInternship.startDate)}
                                    <div className="rounded-2xl bg-green-400/20 w-full mx-4 h-2"></div>
                                    {formatDateShort(currentInternship.endDate)}
                                </div>
                                {
                                    currentInternship.status === "completed" && <InternshipReportSubmit report={currentInternship.report} internship_id={currentInternship.id} />
                                }
                                </>
                                :
                                <div className="flex flex-col justify-center items-center gap-2">
                                    <div className="text-white text-sm"><SearchX size={50} /></div>
                                    <div className="text-xs text-gray-500">You don’t have an active internship at the moment.</div>
                                    <Link href="/dashboard/search-offers" className="text-sm py-1 text-blue-500 hover:underline">Browse internships</Link>
                                </div>
                        }

                    </div>
                </div>

                <div className="flex flex-col gap-2 flex-1">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="text-md font-bold text-gray-500">
                            Latest Applications
                        </h2>
                        <div className="flex gap-2">
                            <Link href="/dashboard/my-applications" className="text-sm text-blue-500 font-medium hover:underline">View All</Link>
                        </div>
                    </div>
                    <div className="rounded-xl border border-gray-500 p-6 shadow-sm">
                        {
                            latestApplications.length > 0 ?
                                <div className="block overflow-x-auto custom-scrollbar">
                                    <table className="w-full text-left text-xs">
                                        <thead>
                                        <tr className="border-b border-slate-800 bg-slate-800/50">
                                            <th className="px-6 py-4 font-medium text-slate-400">Offer Details</th>
                                            <th className="px-6 py-4 font-medium text-slate-400">Apply Date</th>
                                            <th className="px-6 py-4 font-medium text-slate-400">Salary</th>
                                            <th className="px-6 py-4 font-medium text-slate-400">Status</th>
                                            <th className="px-6 py-4 font-medium text-right text-slate-400">Actions</th>
                                        </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-800">
                                        {latestApplications.map((row, index) => {
                                            return <Row key={index} data={row} />
                                        })}
                                        </tbody>
                                    </table>
                                </div>
                                :
                                <div className="flex flex-col justify-center items-center gap-2">
                                    <div className="text-white text-sm"><SearchX size={50} /></div>
                                    <div className="text-xs text-gray-500">You haven’t submitted any active applications yet.</div>
                                    <Link href="/dashboard/search-offers" className="text-sm py-1 text-blue-500 hover:underline">Browse internships</Link>
                                </div>
                        }
                    </div>
                </div>

            </div>
        </div>
    )
}

export function Row({data}) {
    const {
        id,
        title,
        salary,
        company,
        appliedAt,
        status,
        offerId
    } = data;
    return (
        <tr className="group transition-colors hover:bg-slate-800/50">
            <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-indigo-900/30">
                        <span className="text-indigo-400">
                            <img src={company.logo ? company.logo : "/vector.png"}
                                 alt="company logo"
                            />
                        </span>
                    </div>
                    <div>
                        <div className="font-semibold text-white">
                            <Link href={`/dashboard/search-offers/${offerId}`} className="hover:text-blue-500 hover:underline">
                                {title}
                            </Link>
                        </div>
                        <div className="text-xs text-slate-400">{company.company_name}</div>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4">
                <div className="flex items-center gap-2 text-slate-300">
                    <span className="text-slate-400">
                        <CalendarDays size={20} />
                    </span>
                    <span>{formatDateShort(appliedAt)}</span>
                </div>
            </td>
            <td className="px-6 py-4 text-slate-300 font-medium">
                {Number(salary) === 0 ? "Unpaid" : `MAD${salary}/month`}
            </td>
            <td className="px-6 py-4">
                {
                    status === "pending" && <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium bg-amber-900/30 text-amber-300">
                        <span className="size-1.5 rounded-full bg-amber-500"></span>
                            Pending
                    </span>
                }

                {
                    status === "accepted" && <span
                        className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium bg-emerald-900/30 text-emerald-300">
                        <span className="size-1.5 rounded-full bg-emerald-500"></span>
                        Accepted
                    </span>
                }

                {
                    status === "rejected" && <span
                        className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium bg-red-900/30 text-red-300">
                        <span className="size-1.5 rounded-full bg-red-500"></span>
                        Rejected
                    </span>
                }
            </td>
            <td className="px-6 py-4 text-right">
                {
                    status === "accepted" ? <CancelApplicationButton application_id={"."} large={true} /> : <CancelApplicationButton application_id={id} large={true} />
                }
            </td>
        </tr>
    )
}