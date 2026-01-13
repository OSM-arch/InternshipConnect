import {SendHorizontal, BadgeCheck, Hourglass} from "lucide-react";
import Link from "next/link"
import {formatDateShort} from "@/utils/formatDateShort";
import React from "react";
import {getUserFromToken} from "@/lib/auth";
import CancelInternshipButton from "@/components/dashboard/cancelInternshipButton";
import NewOfferButton from "@/components/dashboard/newOfferButton";

export default async function CompanyPage() {

    const {user_id} = await getUserFromToken();
    let data = [];
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/dashboard/company/${user_id}`, {
            cache: "no-store"
        });
        data = await res.json();
    }catch (err) {
        console.error(err.message);
    }

    if (!data.data) return (<></>);

    const {user, stats, latestInternships} = data.data;

    return (
        <div className="flex flex-col gap-4 mt-4 px-6">
            <div className="w-full relative overflow-hidden h-max py-6">
                <div className="w-full flex flex-col gap-4 lg:gap-0 lg:flex-row lg:justify-between lg:items-center">
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-2">Welcome back, {user.firstName} {user.lastName}</h2>
                        <p className="text-gray-500 text-sm">
                            Good luck!
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <NewOfferButton />
                    </div>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row lg:justify-evenly lg:items-center gap-4">

                <div className="flex-1 p-6 rounded-xl border border-gray-500 shadow-sm flex flex-col gap-1 group hover:border-blue-500/50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-gray-500 font-medium text-sm">
                            Total Internships
                        </h3>
                        <div className="p-2 bg-blue-900/20 rounded-lg text-blue-500">
                            <span>
                                <SendHorizontal size={20} />
                            </span>
                        </div>
                    </div>
                    <div className="flex items-end gap-3">
                        <span className="text-3xl font-bold text-white">{stats.totalInternships}</span>
                    </div>
                </div>

                <div className="flex-1 p-6 rounded-xl border border-gray-500 shadow-sm flex flex-col gap-1 group hover:border-orange-500/50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-gray-500 font-medium text-sm">Active Internships</h3>
                        <div className="p-2 bg-orange-900/20 rounded-lg text-orange-400">
                            <span>
                                <Hourglass size={20} />
                            </span>
                        </div>
                    </div>
                    <div className="flex items-end gap-3">
                        <span className="text-3xl font-bold text-white">{stats.ongoingInternships}</span>
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
                                        <th className="px-6 py-4 font-medium text-slate-400">Start</th>
                                        <th className="px-6 py-4 font-medium text-slate-400">End</th>
                                        <th className="px-6 py-4 font-medium text-slate-400">Status</th>
                                        <th className="px-6 py-4 font-medium text-right text-slate-400">Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800">
                                    {latestInternships && latestInternships.map((intern, index) => {
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
        status,
        startDate,
        endDate,
        student,
        internshipId
    } = data;
    return (
        <tr className="group transition-colors hover:bg-slate-800/50">
            <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full overflow-hidden bg-indigo-900/30">
                        <span className="text-indigo-400">
                            <img src={student.profileImage ? student.profileImage : "/vector.png"}
                                 alt="Student Profile Image"
                            />
                        </span>
                    </div>
                    <div>
                        <div className="font-semibold text-white">
                            <Link href={`/spectate/student/${student.userId}`} className="hover:text-blue-500 hover:underline">
                                {student.firstName} {student.lastName}
                            </Link>
                        </div>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4 text-slate-300 font-medium">
                {student.schoolName}
            </td>
            <td className="px-6 py-4 text-slate-300 font-medium">
                {formatDateShort(startDate)}
            </td>
            <td className="px-6 py-4 text-slate-300 font-medium">
                {formatDateShort(endDate)}
            </td>
            <td className="px-6 py-4">
                {
                    status === "ongoing" && <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium bg-amber-900/30 text-amber-300">
                        <span className="size-1.5 rounded-full bg-amber-500"></span>
                            Ongoing
                    </span>
                }

                {
                    status === "completed" && <span
                        className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium bg-emerald-900/30 text-emerald-300">
                        <span className="size-1.5 rounded-full bg-emerald-500"></span>
                        Completed
                    </span>
                }

                {
                    status === "cancelled" && <span
                        className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium bg-red-900/30 text-red-300">
                        <span className="size-1.5 rounded-full bg-red-500"></span>
                        Canceled
                    </span>
                }
            </td>
            <td className="px-6 py-4 text-right">
                {
                    status === "completed" ? <CancelInternshipButton internship_id={"."} /> : <CancelInternshipButton internship_id={internshipId} />
                }
            </td>
        </tr>
    )
}