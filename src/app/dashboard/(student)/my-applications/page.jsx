import {CalendarDays} from "lucide-react";
import Link from "next/link";
import {getUserFromToken} from "@/lib/auth";
import {formatDateShort} from "@/utils/formatDateShort";
import CancelApplicationButton from "@/components/dashboard/cancelApplicationButton";
export default async function MyApplicationsPage() {

    const user = await getUserFromToken();
    const {user_id} = user;
    let data = [];
    try {

        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/applications/${user_id}`, {
            cache: "no-store"
        });

        data = await res.json();

    }catch (err) {
        console.error(err.message);
    }

    return (
        <div className="flex-1 flex flex-col w-full overflow-y-auto p-4 md:p-8">
            <div className="w-full flex flex-col gap-6">
                <div className="flex flex-col gap-1">
                    <h1 className="text-white text-3xl font-bold leading-tight tracking-[-0.033em]">
                        My Applications
                    </h1>
                    <p className="text-gray-400 text-base font-normal">
                        Manage your applications.
                    </p>
                </div>
            </div>

            {
                data.data?.length === 0 ? <div className="mt-4 text-gray-500 text-md">
                        No applications.
                    </div>
                    :
                    <div className="mt-4">

                        <div className="overflow-hidden rounded-lg border border-slate-800 bg-slate-900">
                            {/* !--Desktop Table (md+) -- */}
                            <div className="hidden md:block overflow-x-auto custom-scrollbar">
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
                                        {data.data.map((row, index) => {
                                            return <Row key={index} data={row} />
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {/* !--Mobile Stacked View (sm & below) -- */}
                            <div className="md:hidden divide-y divide-slate-800">
                                {data.data.map((row, index) => {
                                    return <Card key={index} data={row} />
                                })}
                            </div>
                        </div>

                    </div>
            }
        </div>
    )
}

function Row({data}) {
    const {
        application_id,
        title,
        salary,
        company_name,
        logo_url,
        apply_date,
        status,
        offer_id
    } = data;
    return (
        <tr className="group transition-colors hover:bg-slate-800/50">
            <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-indigo-900/30">
                        <span className="text-indigo-400">
                            <img src={logo_url ? logo_url : "/vector.png"}
                                 alt="company logo"
                            />
                        </span>
                    </div>
                    <div>
                        <div className="font-semibold text-white">
                            <Link href={`/dashboard/search-offers/${offer_id}`} className="hover:text-blue-500 hover:underline">
                                {title}
                            </Link>
                        </div>
                        <div className="text-xs text-slate-400">{company_name}</div>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4">
                <div className="flex items-center gap-2 text-slate-300">
                    <span className="text-slate-400">
                        <CalendarDays size={20} />
                    </span>
                    <span>{formatDateShort(apply_date)}</span>
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
                <CancelApplicationButton application_id={application_id} large={true} />
            </td>
        </tr>
    )
}

function Card({data}) {
    const {
        application_id,
        title,
        salary,
        company_name,
        logo_url,
        apply_date,
        status,
        offer_id
    } = data;
    return (
        <div className="p-4 space-y-3">
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-indigo-900/30">
                        <span className="text-indigo-400">
                            <img src={logo_url ? logo_url : "/vector.png"}
                                 alt="company logo"
                            />
                        </span>
                    </div>
                    <div>
                        <div className="font-semibold text-white">
                            <Link href={`/dashboard/search-offers/${offer_id}`} className="hover:text-blue-500 hover:underline">
                                {title}
                            </Link>
                        </div>
                        <div className="text-xs text-slate-400">
                            {company_name}
                        </div>
                    </div>
                </div>
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
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                    <p className="text-xs text-slate-400">Apply Date</p>
                    <div className="flex items-center gap-1.5 mt-0.5 text-slate-300">
                        <span className="text-slate-400">
                            <CalendarDays size={20} />
                        </span>
                        {formatDateShort(apply_date)}
                    </div>
                </div>
                <div>
                    <p className="text-xs text-slate-400">Salary</p>
                    <p className="font-medium mt-0.5 text-slate-300">
                        {Number(salary) === 0 ? "Unpaid" : `MAD${salary}/month`}
                    </p>
                </div>
            </div>
            <div className="pt-2 border-t border-slate-800/50">
                <CancelApplicationButton application_id={application_id} />
            </div>
        </div>
    )
}