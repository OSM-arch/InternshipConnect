"use client";
import {ArrowLeft, ArrowRight, Search} from "lucide-react";
import React, {useEffect, useRef, useState} from "react";
import SidebarFilters from "@/components/dashboard/sidebar_filters";
import OfferCard from "@/components/dashboard/offers_card";
import {useFormStatus} from "react-dom";
import {Spinner} from "@/components/ui/spinner";

// fetch Data
const fetchIndustries = async () => {
    try {
        const res = await fetch("/api/industries");
        return await res.json();

    }catch (err) {
        console.error(err.message);
    }
}
const fetchOffers = async (params = {}) => {
    const cleaned = Object.fromEntries(
        Object.entries(params).filter(([_, v]) => v !== "" && v !== null && v !== undefined)
    );

    const query = new URLSearchParams(cleaned).toString();
    const url = `/api/offers?${query || "sort=newest"}`;

    const res = await fetch(url);
    return await res.json();
};

// page
export default function SearchOffers() {

    const formRef = useRef(null);

    const [selectedParams, setSelectedParams] = useState({});
    const [getParams, setGetParams] = useState({
        languages: [],
        requirements: [],
    });
    const [industries, setIndustries] = useState([]);
    const [offers, setOffers] = useState([]);
    const [offersCount, setOffersCount] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (industries.length === 0) {
            fetchIndustries().then(data => setIndustries(data.data));
        }
    }, [industries.length]);

    useEffect(() => {
        setLoading(true);

        fetchOffers(selectedParams).then((data) => {
            if (!data) return;

            setOffers(data.data);
            setOffersCount(data.total["count(*)"]);

        }).finally(() => {
            setLoading(false);
        });
    }, [selectedParams]);

    const handleSearch = (formData) => {
        const nextParams = {};

        const search = formData.get("search_query")?.trim();
        const sort = formData.get("sort")?.trim();
        const role = formData.get("role")?.trim();
        const location = formData.get("location")?.trim();
        const industry = formData.get("industry");

        const languages = getParams.languages.length
            ? getParams.languages.join(",").toLowerCase()
            : null;

        const requirements = getParams.requirements.length
            ? getParams.requirements.join(",").toLowerCase()
            : null;

        if (search) nextParams.search = search;
        if (sort) nextParams.sort = sort;
        if (role) nextParams.role = role;
        if (location) nextParams.location = location;
        if (industry) nextParams.industry = industry;
        if (languages) nextParams.languages = languages;
        if (requirements) nextParams.requirements = requirements;

        nextParams.page = 1;

        setSelectedParams(nextParams);
    };

    const limit = 10;
    const totalPages = Math.ceil(offersCount / limit);
    const currentPage = selectedParams?.page || 1;
    const getPageNumbers = () => {
        const pages = [];
        const windowSize = 5;

        let start = Math.max(1, currentPage - Math.floor(windowSize / 2));
        let end = Math.min(totalPages, start + windowSize - 1);

        if (end - start < windowSize - 1) {
            start = Math.max(1, end - windowSize + 1);
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        return pages;
    };


    return (
        <form action={handleSearch} ref={formRef} className="bg-transparent min-h-screen flex flex-col overflow-hidden">

            {/* !--Top Navigation Bar -- */}
            <div className="flex items-center justify-around border-b border-gray-700 px-6 py-4 z-20 sticky top-0">
                <div className="flex-1 max-w-2xl mx-8">
                    <div className="relative">
                        <input
                            className="block w-full rounded-md border border-gray-600 bg-[#1a202c] pl-10 py-2.5 text-sm text-white
                            focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-gray-400"
                            id="search_query" name="search_query" type="text" autoComplete="off" placeholder="Search for internships..." />
                        <span className="absolute left-3 top-3.5 text-gray-400">
                            <Search size={16} />
                        </span>
                        <span className="absolute right-3 top-3.5 text-gray-400">
                            <SubmitButton />
                        </span>
                    </div>
                    <p className="text-xs text-gray-500 pl-4">Search by keywords, companies...</p>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row overflow-hidden">

                {/* !-- Sidebar Filters -- */}
                <SidebarFilters
                    industries={industries}
                    setGetParams={setGetParams}
                    setSelectedParams={setSelectedParams}
                    formRef={formRef}
                />

                {/* !--Main Content Area -- */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    <div className="max-w-7xl mx-auto">

                        {/* !--Results Header -- */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-white">Internships Found</h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    Showing {offersCount} results based on your filters.
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-gray-500 whitespace-nowrap">Sort by:</span>
                                <div className="relative">
                                    <select
                                        name="sort"
                                        className="w-full rounded-md border border-gray-600 bg-[#1a202c] px-1 py-1.5 text-sm text-white
                                        focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-gray-400">
                                        <option value="newest">Newest First</option>
                                        <option value="oldest">Oldest First</option>
                                        <option value="salary_desc">Salary: High to Low</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* !--Internship Cards Grid -- */}
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

                            {loading && (
                                <>
                                    {[...Array(6)].map((_, i) => (
                                        <div
                                            key={i}
                                            className="h-64 rounded-lg bg-gray-800 border border-gray-700 animate-pulse"
                                        />
                                    ))}
                                </>
                            )}

                            {!loading && offers.length > 0 && offers.map((offer, index) => (
                                <OfferCard key={index} offer={offer} />
                            ))}

                        </div>

                        {/* !--Pagination-- */}
                        <div className="mt-8 flex items-center justify-between border-t border-gray-500 pt-4 mb-8">

                            {/* PREVIOUS */}
                            <button
                                onClick={() =>
                                    setSelectedParams(prev => ({
                                        ...prev,
                                        page: Math.max(1, currentPage - 1),
                                    }))
                                }
                                disabled={currentPage === 1}
                                className={`
                                    ${currentPage === 1 && "cursor-not-allowed opacity-50"}
                                    flex items-center px-4 py-2 text-sm font-medium text-gray-300
                                    bg-gray-800 border border-gray-500 rounded-lg hover:bg-[#111318]
                                `}
                            >
                                <span className="mr-2">
                                    <ArrowLeft size={16} />
                                </span>
                                Previous
                            </button>

                            <div className="hidden md:flex gap-2">
                                {getPageNumbers().map(page => (
                                    <button
                                        key={page}
                                        onClick={() =>
                                            setSelectedParams(prev => ({
                                                ...prev,
                                                page,
                                            }))
                                        }
                                        className={`
                                            px-3 py-1 text-sm font-medium rounded-md
                                            ${page === currentPage
                                            ? "bg-blue-500 text-white"
                                            : "text-gray-300 hover:bg-border-dark"}
                                        `}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>

                            {/* NEXT */}
                            <button
                                onClick={() =>
                                    setSelectedParams(prev => ({
                                        ...prev,
                                        page: Math.min(totalPages, currentPage + 1),
                                    }))
                                }
                                disabled={currentPage === totalPages}
                                className={`
                                ${currentPage === totalPages && "cursor-not-allowed opacity-50"}
                                    flex items-center px-4 py-2 text-sm font-medium text-gray-300
                                    bg-gray-800 border border-gray-500 rounded-lg hover:bg-[#111318]
                                `}
                            >
                                Next
                                <span className="ml-2">
                                    <ArrowRight size={16} />
                                </span>
                            </button>

                        </div>
                    </div>
                </main>

            </div>
        </form>
    )
}

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <button
            disabled={pending}
            className="cursor-pointer w-fit flex flex-row justify-end items-center text-xs font-sans hover:font-medium"
        >
            {pending ? (
                <>
                    Searching <Spinner />
                </>
            ) : (
                <>
                    <span>Search</span>
                </>
            )}
        </button>
    );
}