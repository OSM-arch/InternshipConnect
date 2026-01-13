"use client";
import {useEffect, useState} from "react";
import Loading from "@/app/dashboard/loading";
import {useAuth} from "@/context/authContext";
import {useRouter} from "next/navigation";
import {internships} from "@/lib/dashboard/internships/internships";
import {Spinner} from "@/components/ui/spinner";
import {formatDateShort} from "@/utils/formatDateShort";

async function fetchSupervisors(user_id) {
    try {
        const res = await fetch(`/api/supervisors/company/${user_id}`);
        return await res.json();
    }catch (err) {
        console.error(err);
    }
}

export default function InternshipsPage() {

    const router = useRouter();
    const {user_id} = useAuth();
    if (!user_id) {
        router.replace("/dashboard/company");
    }

    const active_style = "font-bold text-blue-500 border-b-2 border-blue-500";
    const unactive_style = "pb-4 text-sm font-medium text-slate-400 hover:text-slate-700 transition-colors";

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [statusFilter, SetStatusFilter] = useState("");

    useEffect(() => {
        internships.get(user_id).then((res) => setData(res.data || [])).then(() => setLoading(false));
    }, [user_id]);

    return (
        <>
            {loading && <Loading />}
            {!loading &&
                <div className="flex-grow py-8">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                            <div className="space-y-1">
                                <h1 className="text-3xl font-black tracking-tight text-white">Active
                                    Internships</h1>
                                <p className="text-slate-400 text-base max-w-2xl">Manage accepted interns,
                                    assign supervisors, and set contract end dates to ensure compliance.</p>
                            </div>
                        </div>
                        <div className="border-b border-slate-800 mb-8">
                            <div className="flex gap-8">
                                <button
                                    onClick={() => SetStatusFilter("")}
                                    className={statusFilter === "" ? active_style : unactive_style}>
                                    All Applications
                                </button>
                                <button
                                    onClick={() => SetStatusFilter("ongoing")}
                                    className={statusFilter === "ongoing" ? active_style : unactive_style}>
                                    On Going
                                </button>
                                <button
                                    onClick={() => SetStatusFilter("completed")}
                                    className={statusFilter === "completed" ? active_style : unactive_style}>
                                    Completed
                                </button>
                            </div>
                        </div>
                    </div>
                    {data.length === 0 && <p className="text-sm text-gray-500 pt-5">
                        No active internships.
                    </p>}
                    {
                        data.length > 0 &&
                            data.map((row) => {{
                                if (row.internship_status === statusFilter || statusFilter === "") {
                                    return <ManagementCard key={row.internship_id} data={row} />
                                }
                            }})
                    }
                </div>
            }
        </>
    )
}

function ManagementCard({data}) {

    const {
        internship_id,
        internship_status,
        start_date,
        end_date,
        student_id,
        first_name,
        second_name,
        email,
        profile_image_url,
        offer_title,
        supervisor_id,
        supervisor_name
    } = data;
    
    const {user_id} = useAuth();

    const [supervisors, setSupervisors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchSupervisors(user_id).then((data) => setSupervisors(data.data || []));
    }, [user_id]);

    const updateEndDate = async (end_date) => {
        if (!end_date) return;
        try {
            setError("");
            setLoading(true);
            const res = await internships.update.endDate(internship_id, end_date);

            if (res.success) {
                window.location.reload();
            } else {
                setError(res.error || "Failed to update end date");
                setTimeout(() => setError(""), 3000);
            }
        } catch (err) {
            setError("Something went wrong");
            setTimeout(() => setError(""), 3000);
        } finally {
            setLoading(false);
        }
    };

    const updateAssignedSupervisor = async (supervisor_id) => {
        if (!supervisor_id) return;
        try {
            setError("");
            setLoading(true);
            const res = await internships.update.assignedSupervisor(internship_id, supervisor_id);

            if (res.success) {
                window.location.reload();
            } else {
                setError(res.error || "Failed to assign supervisor");
                setTimeout(() => setError(""), 3000);
            }
        } catch (err) {
            setError("Something went wrong");
            setTimeout(() => setError(""), 3000);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="bg-slate-900 rounded-xl border border-slate-800 my-2 p-5 shadow-sm hover:shadow-md transition-shadow">

            {loading && <div className="flex justify-center items-center text-center bg-zinc-800/20 backdrop-blur-md rounded-md shadow-lg shadow-black px-6 py-2.5">
                <Spinner size={20} /> <span className="ml-4 text-sm text-white">
                Updating...
            </span>
            </div>}
            {error && !loading && <div className="text-center text-rose-500 text-sm bg-zinc-800/20 backdrop-blur-md rounded-md shadow-lg shadow-black px-6 py-2.5">
                {error}
            </div>}

            <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                <div className="flex items-center gap-4 flex-1">
                    <div className="size-10 rounded-full bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700 overflow-hidden">
                        <img className="w-full h-full object-cover"
                             src={profile_image_url ? profile_image_url : "/vector.png"}
                             alt="student profile picture" />
                    </div>
                    <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                            <h3 className="font-bold text-white truncate">{first_name} {second_name}</h3>
                            <span className="px-2 py-0.5 rounded-full bg-indigo-900/30 text-indigo-400 text-[10px] font-bold uppercase tracking-wider">
                                {internship_status}
                            </span>
                        </div>
                        <p className="text-sm font-medium text-slate-300">
                            {offer_title}
                        </p>
                        <p className="text-xs text-slate-500">{email}</p>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 flex-[2]">

                    <div className="flex-1 space-y-1.5">
                        <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 ml-1">
                            Assigned Supervisor
                        </label>
                        <div className="relative">
                            {supervisor_id && <p className="ml-2 text-sm text-slate-200 font-semibold">{supervisor_name}</p>}
                            {!supervisor_id && <select
                                onChange={(e) => updateAssignedSupervisor(e.target.value)}
                                className="w-full appearance-none bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all pr-10">
                                <option className="bg-zinc-800">Assign a supervisor...</option>
                                {
                                    supervisors.length > 0 && supervisors.map(({supervisor_id, first_name, second_name}) => {
                                       return <option key={supervisor_id}
                                                      value={supervisor_id}
                                                      className="bg-zinc-800" selected="">
                                           {first_name} {second_name}
                                       </option>
                                    })
                                }
                            </select>}
                        </div>
                    </div>

                    <div className="flex-1 space-y-1.5">
                        <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 ml-1">
                            Contract End Date
                        </label>
                        <div className="relative">
                            {end_date && <p className="ml-2 text-sm text-slate-200 font-semibold">{formatDateShort(end_date)}</p>}
                            {!end_date && <input className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                               type="date" onChange={(e) => updateEndDate(e.target, e.target.value)} />}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}