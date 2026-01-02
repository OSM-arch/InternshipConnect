"use client";
import {MapPin, X, BriefcaseBusiness, ChevronsLeftRight} from "lucide-react";
import React, {useEffect, useRef, useState} from "react";
import SkillsOptions from "@/components/dashboard/skills_options";

export default function SidebarFilters({ industries, setGetParams, setSelectedParams, formRef }) {

    const [uiParams, setUiParams] = useState({
        industry: "",
        languages: [],
        requirements: []
    });

    const roleRef = useRef(null);
    const locationRef = useRef(null);

    const resetUiParams = () => {
        roleRef.current.value = "";
        locationRef.current.value = "";
        setUiParams({
            industry: "",
            languages: [],
            requirements: []
        });
    }

    const handleUIParams = (key, value, index = undefined) => {

        // industries
        if (key === "industry") {
            const industry = industries.find((i) => Number(i.industry_id) === Number(value));
            value = industry?.industry_name;
        }

        // languages
        if (key === "languages" && !uiParams.languages.includes(value)) {
            if (!index) {
                const new_value = [...uiParams.languages, value];
                setUiParams(prev => {
                    return {...prev, [key]: new_value}
                });
                return;
            }

            if (index) {
                uiParams.languages.splice(index-1, 1);
                setUiParams(prev => {
                    return {...prev, [key]: [...uiParams.languages]}
                });
                return;
            }
            return;
        }

        // requirements
        if (key === "requirements" && !uiParams.requirements.includes(value)) {
            if (!index) {
                const new_value = [...uiParams.requirements, value];
                setUiParams(prev => {
                    return {...prev, [key]: new_value}
                });
                return;
            }

            if (index) {
                uiParams.requirements.splice(index-1, 1);
                setUiParams(prev => {
                    return {...prev, [key]: [...uiParams.requirements]}
                });
                return;
            }
            return;
        }

        setUiParams(prev => {
            return {...prev, [key]: value}
        });
    }

    useEffect(() => {
        setGetParams(prev => {
            return {...prev, requirements: uiParams.requirements,
                languages: uiParams.languages
            }
        })
    }, [setGetParams, uiParams.languages, uiParams.requirements]);

    return (
        <div className="w-full lg:w-80 flex-shrink-0 lg:border-r border-gray-700 overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-white">Filters</h2>
                <button
                    type="button"
                    onClick={() => {
                        resetUiParams();
                        setSelectedParams({});
                        formRef.current.reset();
                    }}
                    className="text-xs font-medium text-primary hover:text-primary/80">Clear All</button>
            </div>
            <div className="space-y-8">

                {/* !--Location Filter -- */}
                <div className="space-y-3">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary">Location</label>
                    <div className="relative">
                        <input
                            className="w-full rounded-md border border-gray-600 bg-[#1a202c] pl-10 py-2.5 text-sm text-white
                               focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-gray-400"
                            placeholder="City" name="location" type="text" ref={locationRef} />
                        <span className="absolute left-3 top-3.5 text-gray-400">
                            <MapPin size={16} />
                        </span>
                    </div>
                </div>

                {/* !--Industry Filter -- */}
                <div className="space-y-3">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary">Industry</label>
                    <div className="relative">
                        <select
                            onChange={(e) => handleUIParams("industry", e.target.value)}
                            name="industry"
                            defaultValue={""}
                            className="w-full rounded-md border border-gray-600 bg-[#1a202c] px-2 py-2.5 text-sm text-white
                            focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-gray-400">
                            <option value="">Choose an industry</option>
                            {industries && industries.map((industry) => {
                                return (
                                    <option key={industry.industry_id} value={industry.industry_id} >
                                        {industry.industry_name}
                                    </option>
                                )
                            })}
                        </select>
                    </div>
                    {uiParams.industry && <IndustryTicket text={uiParams.industry} k="industry" setState={handleUIParams} />}
                </div>

                {/* !--Role Filter -- */}
                <div className="space-y-3">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary">Role</label>
                    <div className="relative">
                        <input
                            className="w-full rounded-md border border-gray-600 bg-[#1a202c] pl-10 py-2.5 text-sm text-white
                               focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-gray-400"
                               placeholder="e.g. Frontend Developer" name="role" ref={roleRef} type="text"/>
                        <span className="absolute left-3 top-3.5 text-gray-400">
                            <BriefcaseBusiness size={16} />
                        </span>
                    </div>
                </div>

                {/* !--Requirements / Skills Filter -- */}
                <div className="space-y-3">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary">Requirements</label>
                    <div className="relative">
                        <select
                            onChange={(e) => handleUIParams("requirements", e.target.value)}
                            name="requirements"
                            defaultValue={""}
                            className="w-full rounded-md border border-gray-600 bg-[#1a202c] px-2 py-2.5 text-sm text-white
                            focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-gray-400">
                            <option value="" >Add Skills (e.g. React)</option>
                            <SkillsOptions />
                        </select>
                        <span className="absolute left-3 top-3.5 text-gray-400">
                            <ChevronsLeftRight size={16} />
                        </span>
                    </div>
                    {uiParams.requirements.length > 0 && <LanguagesSkillsTicket array={uiParams.requirements} k="requirements" setState={handleUIParams} />}
                </div>

                {/* !--Language Filter -- */}
                <div className="space-y-3">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary">Language</label>
                    <div className="relative">
                        <select
                            onChange={(e) => handleUIParams("languages", e.target.value)}
                            name="languages"
                            defaultValue={""}
                            className="w-full rounded-md border border-gray-600 bg-[#1a202c] px-2 py-2.5 text-sm text-white
                            focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-gray-400">
                            <option value="" >Any Language</option>
                            <option value="English">English</option>
                            <option value="French">French</option>
                            <option value="Arabic">Arabic</option>
                            <option value="German">German</option>
                            <option value="Spanish">Spanish</option>
                        </select>
                    </div>
                    {uiParams.languages.length > 0 && <LanguagesSkillsTicket array={uiParams.languages} k="languages" setState={handleUIParams} />}
                </div>

            </div>
        </div>
    )
}

function IndustryTicket({text, k, setState}) {
    return (
        <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center px-1 py-0.5 rounded text-xs font-medium bg-blue-500/10 text-blue-500 border border-blue-500/20">
                {text}
                <button type="button" className="hover:text-primary-dark" onClick={() => setState(k, "")}>
                    <span>
                        <X size={16} />
                    </span>
                </button>
            </span>
        </div>
    )
}

function LanguagesSkillsTicket({array, k, setState}) {
    return (
        <div className="flex flex-wrap gap-2">
            {array.map((item, index) => {
                return <span key={index} className="inline-flex items-center px-1 py-0.5 rounded text-xs font-medium bg-blue-500/10 text-blue-500 border border-blue-500/20">
                    {item}
                        <button type="button" className="hover:text-primary-dark" onClick={() => setState(k, "", index+1)}>
                        <span>
                            <X size={16} />
                        </span>
                    </button>
                </span>
            })}
        </div>
    )
}