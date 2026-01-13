"use client";
import {
    Search, Users, BriefcaseBusiness, EllipsisVertical,
    Pencil, CircleX, Trash2, BadgeCheck, CircleCheck,
    CircleAlert, X, CheckCircle
} from "lucide-react";
import {formatDateShort} from "@/utils/formatDateShort";
import Link from "next/link";
import {useAuth} from "@/context/authContext";
import React, {useEffect, useState} from "react";
import Loading from "@/app/dashboard/loading";
import {updateOffer} from "@/lib/dashboard/update/offer/updateOffer";
import {Spinner} from "@/components/ui/spinner";
import NewOfferButton from "@/components/dashboard/newOfferButton";
import ViewApplicantsButton from "@/components/dashboard/viewApplicantsButton";

async function fetchOffers(user_id, setLoading) {
    try {
        const res = await fetch(`/api/offers/my-offers/${user_id}`, {
            cache: "no-store"
        });

        return await res.json();

    }catch (err) {
        console.error(err.message);
    }finally {
        setLoading(false);
    }
}

export default function MyOffersPage() {

    const {user_id} = useAuth();

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [displayedData, setDisplayedData] = useState([]);

    useEffect(() => {
        fetchOffers(user_id, setLoading).then((d) => setData(d.data));
    }, [user_id]);

    const handleStatusFilter = (status) => {
        switch (status) {
            case "open":
                setDisplayedData(data.filter(offer => offer.status === "open"));
                break;
            case "closed" :
                setDisplayedData(data.filter(offer => offer.status === "closed"));
                break;
            default: setDisplayedData(data);
        }
    }

    const handleSearch = (value) => {
        if (value.length < 3) return setDisplayedData(data);
        setDisplayedData(data.filter(offer => offer.title.toLowerCase().includes(value.toLowerCase())));
    }

    return (
        <div className="text-white overflow-hidden h-screen flex flex-col">
            <div className="flex flex-1 overflow-hidden">
                <div className="flex-1 flex flex-col h-full overflow-hidden relative">

                    <div className="flex-1 overflow-y-auto p-6 md:p-8 lg:px-12">
                        <div className="max-w-6xl mx-auto flex flex-col gap-6">
                            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                                <div className="flex flex-col gap-1">
                                    <h1 className="text-3xl font-bold text-white tracking-tight">
                                        My Offers
                                    </h1>
                                    <p className="text-slate-400">
                                        Manage your internship postings and track applicants.
                                    </p>
                                </div>
                                <NewOfferButton />
                            </div>

                            <div className="bg-slate-850 rounded-xl p-4 shadow-sm border border-slate-700 flex flex-col sm:flex-row gap-4 items-center">
                                <div className="relative flex-1 w-full">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                        <Search size={20} />
                                    </span>
                                    <input
                                        onChange={(e) => handleSearch(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-white placeholder:text-slate-400"
                                        placeholder="Search offers by title..." type="text"/>
                                </div>
                                <div className="flex gap-3 w-full sm:w-auto">
                                    <div className="relative w-full sm:w-48">
                                        <select 
                                            onChange={(e) => handleStatusFilter(e.target.value)}
                                            className="w-full appearance-none pl-4 pr-10 py-2.5 bg-slate-850 border border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-300">
                                            <option className="bg-zinc-800" value="">All Statuses</option>
                                            <option className="bg-zinc-800" value="open">Active</option>
                                            <option className="bg-zinc-800" value="closed">Closed</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-4">
                                {loading && <Loading />}
                                {/* Offers here */}
                                {data?.length === 0 && displayedData.length === 0 && <div className="text-gray-400">No Offers yet.</div>}
                                {data?.length > 0 && displayedData.length === 0 && <>
                                    {
                                        data.map((offer) => {
                                            if (offer.status === "closed") {
                                                return <ClosedOffers key={offer.offer_id} data={offer} />
                                            }else {
                                                return <ActiveOffers key={offer.offer_id} data={offer} />
                                            }
                                        })
                                    }
                                </>}
                                {displayedData.length > 0 && <>
                                    {
                                        displayedData.map((offer) => {
                                            if (offer.status === "closed") {
                                                return <ClosedOffers key={offer.offer_id} data={offer} />
                                            }else {
                                                return <ActiveOffers key={offer.offer_id} data={offer} />
                                            }
                                        })
                                    }
                                </>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function ActiveOffers({data}) {

    const {
        offer_id,
        title,
        expiration_date,
        created_at,
        location,
        available_slots,
        status,
        nbr_applications,
        nbr_accepted
    } = data;

    const [loading, setLoading] = useState({
        close: false,
        delete: false
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const closeOffer = async () => {
        setLoading(prev => {
            return {...prev, close: true}
        });
        await updateOffer.close(offer_id).then((res) => {
            if (res.success) {
                setSuccess(`${title} closed.`);
            }else {
                setError(res.message);
            }
        }).finally(() => setLoading(prev => {
            return {...prev, close: false}
        }));
    }

    const deleteOffer = async () => {
        setLoading(prev => {
            return {...prev, delete: true}
        });
        await updateOffer.delete(offer_id).then((res) => {
            if (res.success) {
                setSuccess(`${title} Deleted.`);
            }else {
                setError(res.message);
            }
        }).finally(() => setLoading(prev => {
            return {...prev, delete: false}
        }));
    }

    return (
        <div className="group relative flex flex-col lg:flex-row lg:items-center gap-5 bg-slate-850 p-5 rounded-xl border border-slate-700 shadow-sm hover:shadow-md hover:border-blue-500/40 transition-all duration-200">

            {error && <div className="fixed bottom-2 right-2 z-50 flex flex-row flex-nowrap items-center gap-4 pl-4 pr-1 py-1.5 text-white border rounded-lg border-red-500/20 bg-red-500/20 shadow-xs shadow-red-500 text-sm">
                <span><CircleAlert size={16} /></span><span>{error}</span>
                <button
                    onClick={() => setError("")}
                    className="relative justify-self-end hover:bg-red-500/40 rounded-lg p-2">
                    <X size={16} />
                </button>
            </div>}

            {success && <div className="fixed bottom-2 right-2 z-50 flex flex-row flex-nowrap items-center gap-4 pl-4 pr-1 py-1.5 text-white border rounded-lg border-green-500/20 bg-green-500/20 shadow-xs shadow-green-500 text-sm">
                <span><CheckCircle size={16} /></span><span>{success}</span>
                <button
                    onClick={() => setSuccess("")}
                    className="relative justify-self-end hover:bg-green-500/40 rounded-lg p-2">
                    <X size={16} />
                </button>
            </div>}

            <div className="flex-1 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                        <span className="size-1.5 rounded-full bg-emerald-500"></span>
                            {status}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">Posted on {formatDateShort(created_at)}
                    </span>
                </div>
                <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-blue-500 transition-colors">
                        {title}
                    </h3>
                    <p className="text-sm font-medium text-slate-400">
                        • {location}
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-y-2 gap-x-6 mt-1">
                    <div className="flex items-center gap-2 text-sm text-slate-300 bg-slate-800/50 px-2 py-1 rounded">
                        <span className="text-slate-400">
                            <Users size={16} />
                        </span>
                        <span className="font-semibold">{nbr_applications}</span> Applicants
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-300 bg-slate-800/50 px-2 py-1 rounded">
                        <span className="text-slate-400">
                            <BriefcaseBusiness size={16} />
                        </span>
                        <span className="font-semibold">{nbr_accepted} / {available_slots}</span> Filled
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4 pt-4 border-t border-slate-800 lg:pt-0 lg:border-t-0 lg:border-l lg:pl-6">
                <div className="flex flex-col items-end gap-0.5 min-w-[80px]">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Expires</span>
                    <span className="text-sm font-semibold text-slate-200">{formatDateShort(expiration_date)}</span>
                </div>

                <ViewApplicantsButton offer_id={offer_id} isdisabled={nbr_applications === 0} />

                <div className="relative group/menu">
                    <button className="p-2 rounded-lg text-slate-400  hover:bg-slate-800 hover:text-slate-200 transition-colors">
                        <span>
                            <EllipsisVertical size={16} />
                        </span>
                    </button>

                    <div className="hidden hover:block group-hover/menu:block absolute right-0 top-full mt-1 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-lg z-10 py-1">
                        <Link href={`/dashboard/company/edit-offer/${offer_id}`}
                            className="flex items-center w-full gap-2 px-4 py-2 text-sm text-slate-200 hover:bg-slate-700/50">
                            <span>
                                <Pencil size={16} />
                            </span>
                            Edit Offer
                        </Link>
                        <button
                            disabled={loading.close}
                            onClick={closeOffer}
                            className="items-center w-full px-4 py-2 text-sm text-slate-200 hover:bg-slate-700/50">
                            <span className="flex items-center gap-2">
                                {
                                    loading.close ? <>
                                        Closing Offer
                                        <span>
                                            <Spinner size={16} />
                                        </span>
                                    </> : <>
                                        <span>
                                            <CircleX size={16} />
                                        </span>
                                        Close Offer
                                    </>
                                }
                            </span>
                        </button>
                        <div className="h-px bg-slate-700 my-1"></div>
                        <button
                            disabled={loading.delete}
                            onClick={deleteOffer}
                            className="items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-900/20">
                            <span className="flex items-center gap-2">
                                {
                                    loading.delete ? <>
                                        Deleting Offer
                                        <span>
                                            <Spinner size={16} />
                                        </span>
                                    </> : <>
                                        <span>
                                            <Trash2 size={16} />
                                        </span>
                                        Delete
                                    </>
                                }
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

function ClosedOffers({data}) {

    const {
        offer_id,
        title,
        expiration_date,
        created_at,
        location,
        available_slots,
        status,
        nbr_applications,
        nbr_accepted
    } = data;

    const [loading, setLoading] = useState({
        open: false,
        delete: false
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const OpenOffer = async () => {
        setLoading(prev => {
            return {...prev, open: true}
        });
        await updateOffer.open(offer_id).then((res) => {
            if (res.success) {
                setSuccess(`${title} Opened.`);
            }else {
                setError(res.message);
            }
        }).finally(() => setLoading(prev => {
            return {...prev, open: false}
        }));
    }

    const deleteOffer = async () => {
        setLoading(prev => {
            return {...prev, delete: true}
        });
        await updateOffer.delete(offer_id).then((res) => {
            if (res.success) {
                setSuccess(`${title} Deleted.`);
            }else {
                setError(res.message);
            }
        }).finally(() => setLoading(prev => {
            return {...prev, delete: false}
        }));
    }

    return (
        <div className="group flex flex-col lg:flex-row lg:items-center gap-5 bg-slate-850 p-5 rounded-xl border border-slate-700 shadow-sm opacity-90 hover:opacity-100 transition-all duration-200">

            {error && <div className="fixed bottom-2 right-2 z-50 flex flex-row flex-nowrap items-center gap-4 pl-4 pr-1 py-1.5 text-white border rounded-lg border-red-500/20 bg-red-500/20 shadow-xs shadow-red-500 text-sm">
                <span><CircleAlert size={16} /></span><span>{error}</span>
                <button
                    onClick={() => setError("")}
                    className="relative justify-self-end hover:bg-red-500/40 rounded-lg p-2">
                    <X size={16} />
                </button>
            </div>}

            {success && <div className="fixed bottom-2 right-2 z-50 flex flex-row flex-nowrap items-center gap-4 pl-4 pr-1 py-1.5 text-white border rounded-lg border-green-500/20 bg-green-500/20 shadow-xs shadow-green-500 text-sm">
                <span><CheckCircle size={16} /></span><span>{success}</span>
                <button
                    onClick={() => setSuccess("")}
                    className="relative justify-self-end hover:bg-green-500/40 rounded-lg p-2">
                    <X size={16} />
                </button>
            </div>}

            <div className="flex-1 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-700 text-slate-300">
                        <span className="size-1.5 rounded-full bg-slate-400"></span>
                        Closed
                    </span>
                    <span className="text-xs text-slate-400 font-medium">Posted on {formatDateShort(created_at)}</span>
                </div>
                <div>
                    <h3 className="text-lg font-bold text-slate-300">
                        {title}
                    </h3>
                    <p className="text-sm font-medium text-slate-400">
                        • {location}
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-y-2 gap-x-6 mt-1 opacity-75">
                    <div className="flex items-center gap-2 text-sm text-slate-300 bg-slate-800/50 px-2 py-1 rounded">
                        <span className="text-slate-400">
                            <Users size={16} />
                        </span>
                        <span className="font-semibold">{nbr_applications}</span> Applicants
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-300 bg-slate-800/50 px-2 py-1 rounded">
                        <span className="text-slate-400 icon-fill">
                            <BadgeCheck size={16} />
                        </span>
                        <span className="font-semibold">{nbr_accepted} / {available_slots}</span> Filled
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-4 pt-4 border-t border-slate-800 lg:pt-0 lg:border-t-0 lg:border-l lg:pl-6">
                <div className="flex flex-col items-end gap-0.5 min-w-[80px]">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Ended</span>
                    <span className="text-sm font-semibold text-slate-200">{formatDateShort(expiration_date)}</span>
                </div>
                <div className="relative group/menu">
                    <button className="p-2 rounded-lg text-slate-400  hover:bg-slate-800 hover:text-slate-200 transition-colors">
                        <span>
                            <EllipsisVertical size={16} />
                        </span>
                    </button>

                    <div className="hidden group-hover/menu:block absolute right-0 top-full mt-1 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-lg z-10 py-1">
                        <button className="flex items-center w-full gap-2 px-4 py-2 text-sm text-slate-200 hover:bg-slate-700/50">
                            <span>
                                <Pencil size={16} />
                            </span>
                            Edit Offer
                        </button>
                        <button
                            disabled={Number(available_slots) === Number(nbr_accepted) || loading.open}
                            onClick={OpenOffer}
                            className="flex items-center w-full gap-2 px-4 py-2 text-sm text-slate-200 hover:bg-slate-700/50">
                            <span className="flex items-center gap-2">
                                {
                                    loading.open ? <>
                                        Opening Offer
                                        <span>
                                            <Spinner size={16} />
                                        </span>
                                    </> : <>
                                        <span>
                                            <CircleCheck size={16} />
                                        </span>
                                        Open Offer
                                    </>
                                }
                            </span>
                        </button>
                        <div className="h-px bg-slate-700 my-1"></div>
                        <button
                            disabled={loading.delete}
                            onClick={deleteOffer}
                            className="items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-900/20">
                            <span className="flex items-center gap-2">
                                {
                                    loading.delete ? <>
                                        Deleting Offer
                                        <span>
                                            <Spinner size={16} />
                                        </span>
                                    </> : <>
                                        <span>
                                            <Trash2 size={16} />
                                        </span>
                                        Delete
                                    </>
                                }
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}