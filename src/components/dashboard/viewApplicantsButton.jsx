"use client";
import React, {useEffect, useState} from "react";
import Loading from "@/app/dashboard/loading";
import Link from "next/link";
import {formatDateShort} from "@/utils/formatDateShort";
import {formatCreatedAt} from "@/utils/formatCreatedAt";
import {SquareArrowOutUpRight, Check, X} from "lucide-react";
import {updateApplication} from "@/lib/dashboard/update/application/updateApplication";
import {Spinner} from "@/components/ui/spinner";

async function fetchApplications (offer_id, setLoading) {
    try {
        setLoading(true);
        const res = await fetch(`/api/applications/offer/${offer_id}`);
        return await res.json();
    }catch (err) {
        console.error(err);
    }finally {
        setLoading(false);
    }
}

export default function ViewApplicantsButton({offer_id, isdisabled}) {

    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [applications, setApplications] = useState([]);

    useEffect(() => {
        if (!offer_id || !open) return;
        fetchApplications(offer_id, setLoading).then((data) => setApplications(data.data));
    },[offer_id, open]);

    return (
        <>
            <button 
                onClick={() => setOpen(true)}
                disabled={isdisabled}
                className="flex items-center justify-center px-4 py-2 rounded-lg text-blue-500  hover:text-white text-sm font-semibold transition-all bg-blue-500/20 hover:bg-blue-500">
                View Applicants
            </button>
            {
                open &&
                <div className="fixed inset-0 z-50 min-h-screen m-0 py-6 px-0 backdrop-blur-md bg-zinc-800/20 overflow-auto">
                    <div className="border-0 rounded-lg bg-zinc-800 max-w-[960px] w-full lg:mx-auto py-6 px-6">
                        {loading && <Loading />}
                        {!loading &&
                            <>
                                <table className="block overflow-auto w-full text-left text-xs">
                                    <thead>
                                    <tr className="border-b border-slate-800 bg-slate-800/50">
                                        <th className="px-6 py-4 font-medium text-slate-400">Student Name</th>
                                        <th className="px-6 py-4 font-medium text-slate-400">University</th>
                                        <th className="px-6 py-4 font-medium text-slate-400">Applied Date</th>
                                        <th className="px-6 py-4 font-medium text-slate-400">CV</th>
                                        <th className="px-6 py-4 font-medium text-slate-400">Status</th>
                                        <th className="px-6 py-4 font-medium text-right text-slate-400">Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800">
                                    {applications.length > 0 && applications.map((application, index) => {
                                        return <Row key={index} data={application} />
                                    })}
                                    </tbody>
                                </table>
                            </>
                        }
                        <div className="flex items-center flex-wrap justify-end gap-4 pt-3 mt-3 border-t border-[#3a3f4a]">
                            <button
                                onClick={() => setOpen(false)}
                                className="px-3 py-2.5 rounded-lg border border-[#3a3f4a] text-white text-sm font-bold hover:bg-[#2d323c] transition-colors"
                                type="button">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}

export function Row({data}) {

    const {
        application_id,
        first_name,
        second_name,
        profile_image_url,
        cv_url,
        school_name,
        status,
        apply_date
    } = data;

    const [loading, setLoading] = useState({
        all: false,
        accept: false,
        reject: false
    });

    const acceptApplication = async () => {
        setLoading({
            all: true,
            accept: true,
            reject: false
        });
        updateApplication.accept(application_id).then(() => {
            setLoading(prev => {
                return {...prev, all: false, accept: false}
            });
            setTimeout(() => window.location.reload(), 500);
        });
    }

    const rejectApplication = () => {
        setLoading({
            all: true,
            accept: false,
            reject: true
        });
        updateApplication.reject(application_id).then(() => {
            setLoading(prev => {
                return {...prev, all: false, reject: false}
            });
            setTimeout(() => window.location.reload(), 500);
        });
    }

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
                            {first_name} {second_name}
                        </div>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4 text-slate-300 font-medium">
                {school_name}
            </td>
            <td className="px-6 py-4 text-slate-300 font-medium">
                {formatCreatedAt(apply_date)}
            </td>
            <td className="px-6 py-4 text-slate-300 font-medium">
                <Link href={cv_url ? cv_url : "#"} target="_blank">
                    View CV <SquareArrowOutUpRight size={16} />
                </Link>
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
            <td className="px-6 py-4 flex justify-center items-center gap-2">
                {
                    status === "pending" && <>
                        <button
                            disabled={loading.all}
                            onClick={acceptApplication}
                            className="size-9 flex items-center justify-center rounded-lg text-emerald-400 bg-emerald-600 hover:text-white transition-all border border-emerald-800/50">
                            <span className="font-bold">
                                {
                                    loading.accept ? <Spinner className="text-emerald-400" size={16} /> : <Check size={16} />
                                }
                            </span>
                        </button>
                        <button
                            disabled={loading.all}
                            onClick={rejectApplication}
                            className="size-9 flex items-center justify-center rounded-lg bg-rose-900/20 text-rose-400 hover:bg-rose-600 hover:text-white transition-all border border-rose-800/50">
                            <span className="font-bold">
                                {
                                    loading.reject ? <Spinner className="text-rose-400" size={16} /> : <X size={16}/>
                                }
                            </span>
                        </button>
                    </>
                }
            </td>
        </tr>
)
}