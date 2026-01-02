import {Building2, MapPin, Clock5, Banknote, UsersRound,
    Hourglass, Globe, NotebookText, Code} from "lucide-react";
import Link from "next/link";
import {notFound} from "next/navigation";
import {formatCreatedAt} from "@/utils/formatCreatedAt";
import formatExpirationDate from "@/utils/formatExpirationDate";
import {formatDateYYYYMMDD} from "@/utils/formatDateYMD";
import toCamelcase from "@/utils/toCamelcase";
import ApplicationButton from "@/components/dashboard/applicationButton";
import {getUserFromToken} from "@/lib/auth";
import SaveOfferButton from "@/components/dashboard/saveOfferButton";

export default async function OfferPage({params}) {

    const user = await getUserFromToken();

    const { offer_id } = await params;
    if (!offer_id) return (notFound());

    let data;
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/offers/${offer_id}`,
            {
                cache: "no-cache"
            });
        data = await res.json();
    }catch (err) {
        console.error(err.message);
    }

    const {
        logo_url,
        title,
        company_name,
        location,
        created_at,
        salary,
        available_slots,
        expiration_date,
        languages,
        description,
        required_skills,
        company_id,
        industry_name,
        address,
        size
    } = data.data;

    return (
        <div className="text-white font-display antialiased min-h-screen flex flex-col transition-colors duration-200">
            {/* !--Main Content -- */}
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-10 py-6">
                {/* !--Two Column Layout -- */}
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* !--Left Column (Job Details) -- */}
                    <div className="flex-1 min-w-0">
                        {/* !--Job Header Card -- */}
                        <div
                            className="rounded-xl p-6 md:p-8 shadow-lg shadow-black border border-gray-500 mb-6 relative overflow-hidden group">
                            {/* !--Background decoration -- */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between relative z-10">
                                <div className="flex gap-5 items-start">
                                    <div className="p-2 rounded-xl h-20 w-20 flex-shrink-0 shadow-sm flex items-center justify-center">
                                        <img alt="Company Logo"
                                             className="w-full h-full object-contain rounded-lg"
                                             src={`${logo_url ? logo_url : "/vector.png"}`} />
                                    </div>
                                    <div>
                                        <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight mb-2">
                                            {title}
                                        </h1>
                                        <div
                                            className="flex flex-wrap items-center gap-3 md:gap-4 text-xm md:text-sm text-gray-500">
                                            <div className="flex items-center gap-1">
                                                <span>
                                                    <Building2 size={20} />
                                                </span>
                                                <span className="font-medium text-slate-300">
                                                    {company_name}
                                                </span>
                                            </div>

                                            <span className="hidden md:block w-1 h-1 rounded-full bg-slate-600"></span>

                                            <div className="flex items-center gap-1">
                                                <span className="text-blue-500">
                                                    <MapPin size={20} />
                                                </span>
                                                <span>{location}</span>
                                            </div>
                                            <span
                                                className="hidden md:block w-1 h-1 rounded-full bg-slate-600"></span>
                                            <div className="flex items-center gap-1">
                                                <span>
                                                    <Clock5 size={20} />
                                                </span>
                                                <span>Posted {formatCreatedAt(created_at)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* !--Mobile Actions (Hidden on desktop) -- */}
                                <div className="flex w-full md:hidden gap-3 mt-4 px-4">
                                    <ApplicationButton user={user} offer_id={offer_id} />
                                    <SaveOfferButton user={user} offer_id={offer_id} />
                                </div>
                            </div>
                        </div>
                        {/* !--Quick Stats Grid -- */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">

                            {/* !--Salary-- */}
                            <div className="p-4 rounded-xl shadow-sm shadow-black flex flex-col gap-3 transition-transform hover:-translate-y-1 duration-300">
                                <div className="size-10 rounded-lg bg-emerald-900/30 flex items-center justify-center text-emerald-400">
                                    <span>
                                        <Banknote />
                                    </span>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Salary</p>
                                    <p className="text-white font-bold text-sm">{salary} MAD</p>
                                    <p className="text-xs text-gray-500">Per Month</p>
                                </div>
                            </div>

                            {/* !--Slots-- */}
                            <div className="p-4 rounded-xl shadow-sm shadow-black flex flex-col gap-3 transition-transform hover:-translate-y-1 duration-300 delay-75">
                                <div className="size-10 rounded-lg bg-blue-900/30 flex items-center justify-center text-blue-400">
                                    <span>
                                        <UsersRound />
                                    </span>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Available Slots</p>
                                    <p className="text-white font-bold text-sm">{available_slots} Openings</p>
                                    <p className="text-xs text-gray-500">Apply Fast</p>
                                </div>
                            </div>

                            {/* !--Expires-- */}
                            <div className="p-4 rounded-xl shadow-sm shadow-black flex flex-col gap-3 transition-transform hover:-translate-y-1 duration-300 delay-75">
                                <div className="size-10 rounded-lg bg-amber-900/30 flex items-center justify-center text-amber-400">
                                    <span>
                                        <Hourglass />
                                    </span>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Deadline</p>
                                    <p className="text-white font-bold text-sm">{formatDateYYYYMMDD(expiration_date)}</p>
                                    <p className="text-xs text-gray-500">{formatExpirationDate(expiration_date)} left</p>
                                </div>
                            </div>

                            {/* !--Languages-- */}
                            <div className="p-4 rounded-xl shadow-sm shadow-black flex flex-col gap-3 transition-transform hover:-translate-y-1 duration-300 delay-75">
                                <div className="size-10 rounded-lg bg-purple-900/30 flex items-center justify-center text-purple-400">
                                    <span>
                                        <Globe />
                                    </span>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Languages</p>
                                    <p className="text-white font-bold text-sm">{toCamelcase(languages[0])}</p>
                                    {
                                        languages.length > 1 && languages.map((language, index) => {
                                            if (index !== 0) {
                                                return <p key={index} className="text-xs text-gray-500">& {toCamelcase(language)}</p>
                                            }
                                        })
                                    }
                                </div>
                            </div>
                        </div>

                        {/* !--Description & Content-- */}
                        <div className="rounded-xl p-6 md:p-8">
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <span className="text-blue-500">
                                    <NotebookText />
                                </span>
                                Job Description
                            </h3>
                            <div
                                className="max-w-none text-slate-300 text-base leading-relaxed mb-8">
                                <p className="mb-4 text-pretty">
                                    {description}
                                </p>
                            </div>

                            <hr className="border-gray-500 my-8"/>

                            {/* !--Skills-- */}
                            <div>
                                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                    <span className="text-blue-500">
                                        <Code />
                                    </span>
                                    Required Skills
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {required_skills.map(
                                        (skill, index) => (
                                            <span key={index} className="px-3 py-1.5 rounded-md bg-slate-800 text-slate-300 text-sm font-medium border border-gray-500">
                                                {skill}
                                            </span>
                                        )
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* !--Right Sidebar (Company Info & Desktop Actions) -- */}
                    <div className="lg:w-[340px] flex flex-col gap-6">

                        {/* !--Action Card (Desktop Sticky) -- */}
                        <div className="rounded-xl p-6 border border-gray-500 shadow-sm shadow-black hidden md:flex flex-col gap-2 sticky top-24">
                            <div className="text-lg font-bold text-white">Interested in this role?</div>
                            <p className="text-xs text-gray-500">Review the requirements carefully before applying. Good
                                luck!</p>
                            <div className="flex flex-col gap-3 mt-2">
                                <ApplicationButton user={user} offer_id={offer_id} />
                                <SaveOfferButton user={user} offer_id={offer_id} large={true} />
                            </div>
                        </div>

                        {/* !--Company Info Card -- */}
                        <div className="mt-8 border border-gray-500 rounded-xl p-6 shadow-sm">
                            <h3 className="text-lg font-bold text-white mb-4">About the Company</h3>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="size-12 rounded-lg flex items-center justify-center p-1">
                                    <img alt="Company Logo" className="w-full h-full object-contain"
                                         src={logo_url ? logo_url : "/vector.png"} />
                                </div>
                                <div>
                                    <p className="font-bold text-white">{company_name}</p>
                                    <p className="text-sm text-blue-500 cursor-pointer hover:underline">
                                        <Link href={`/dashboard/company/${company_id}`}>View Profile</Link>
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex gap-3">
                                    <span className="text-gray-500 mt-0.5">
                                        <Building2 size={20} />
                                    </span>
                                    <div>
                                        <p className="text-sm font-medium text-white">Industry</p>
                                        <p className="text-sm text-gray-500">{industry_name}</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <span className=" text-gray-500 mt-0.5">
                                        <MapPin size={20} />
                                    </span>
                                    <div>
                                        <p className="text-sm font-medium text-white">Headquarters</p>
                                        <p className="text-sm text-gray-500">{address}</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <span className="text-gray-500">
                                        <UsersRound size={20} />
                                    </span>
                                    <div>
                                        <p className="text-sm font-medium text-white">Size</p>
                                        <p className="text-sm text-gray-500">
                                            {size ? size : "?"} Employees
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            {/* !--Footer-- */}
            <div className="mt-auto border-t border-gray-500 py-8 px-10">
                <div
                    className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
                    <p>© 2024 Internship Platform. All rights reserved.</p>
                    <div className="flex gap-6">
                        <a className="hover:text-white" href="#">Privacy Policy</a>
                        <a className="hover:text-white" href="#">Terms of Service</a>
                        <a className="hover:text-white" href="#">Help Center</a>
                    </div>
                </div>
            </div>
    </div>)
}