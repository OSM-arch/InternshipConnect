"use client";
import {Plus} from "lucide-react";
import React, {useState} from "react";
import {MapPin, X, CalendarDays} from "lucide-react";
import {useFormStatus} from "react-dom";
import {Spinner} from "@/components/ui/spinner";
import SkillsOptions from "@/components/dashboard/skills_options";
import {updateOffer} from "@/lib/dashboard/update/offer/updateOffer";
import {useAuth} from "@/context/authContext";

export default function NewOfferButton() {

    const {user_id} = useAuth();

    const [posted, setPosted] = useState(false);
    const [message, setMessage] = useState("");
    const [open, setOpen] = useState(false);
    const [skills, setSkills] = useState([]);
    const [languages, setLanguages] = useState([]);

    const postOffer = async (formData) => {
        setPosted(false);
        setMessage("");
        const title = formData.get("title");
        const location = formData.get("location");
        const salary = formData.get("salary");
        const available_slots = formData.get("available_slots");
        const description = formData.get("description");
        const expiration_date = formData.get("expiration_date");
        const skills_arr = skills;
        const languages_arr = languages;

        if (title && location && salary && available_slots && description && expiration_date &&
            skills_arr.length > 0 && languages_arr.length > 0) {

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const expiration = new Date(expiration_date);
            expiration.setHours(0, 0, 0, 0);

            if (expiration <= today) {
                setMessage("Expiration date must be in the future.");
                return;
            }

            const res = await updateOffer.add(
                {
                    user_id,
                    title,
                    location,
                    salary,
                    available_slots,
                    description,
                    expiration_date,
                    skills: skills_arr,
                    languages: languages_arr
                }
            );
            setPosted(res);
        }

    }

    const addSkill = (value) => {
        if (value === "") return;
        if (skills.length >= 5) return;
        if (skills.includes(value)) return;
        setSkills(prev => [...prev, value]);
    }
    const addLanguage = (value) => {
        if (value === "") return;
        if (languages.length >= 5) return;
        if (languages.includes(value)) return;
        setLanguages(prev => [...prev, value]);
    }

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors shadow-md shadow-blue-500/30 flex items-center gap-2">
                <Plus size={16} />
                Post New Offer
            </button>
            {
                open && <div className="fixed inset-0 z-50 min-h-screen m-0 py-12 px-0 backdrop-blur-md bg-zinc-800/20 overflow-y-auto">
                    <div className="border-0 rounded-lg bg-zinc-800 max-w-[960px] mx-auto py-12 px-6">

                        <div className="mb-10">
                            <h1 className="text-white text-2xl font-black leading-tight tracking-[-0.033em]">
                                Post New Internship
                            </h1>
                            <p className="text-gray-400 text-md font-normal mt-2">
                                Create a high-impact opportunity and connect with top emerging talent.
                            </p>
                        </div>

                        <div className="rounded-xl shadow-sm">
                            <form action={postOffer} className="p-8 space-y-8">

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-white text-sm font-semibold">
                                            Job Title
                                        </label>
                                        <input className="w-full h-12 rounded-lg border border-[#3a3f4a] bg-[#21242c] text-white outline-0 focus:ring-2 focus:ring-blue-500 transition-all px-4"
                                            name="title" placeholder="e.g. Senior UX Design Intern" type="text"/>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-white text-sm font-semibold">
                                            Location / City
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                                <MapPin size={16} />
                                            </span>
                                            <input className="w-full h-12 rounded-lg border border-[#3a3f4a] bg-[#21242c] text-white outline-0 focus:ring-2 focus:ring-blue-500 transition-all pl-10 pr-4"
                                                name="location" type="text"/>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-white text-sm font-semibold">
                                            Monthly Salary (MAD)
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">$</span>
                                            <input className="w-full h-12 rounded-lg border border-[#3a3f4a] bg-[#21242c] text-white outline-0 focus:ring-2 focus:ring-blue-500 transition-all pl-8 pr-4"
                                                name="salary" placeholder="2500" min={0} type="number"/>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-white text-sm font-semibold">
                                            Available Slots
                                        </label>
                                        <input className="w-full h-12 rounded-lg border border-[#3a3f4a] bg-[#21242c] text-white outline-0 focus:ring-2 focus:ring-blue-500 transition-all px-4"
                                            name="available_slots" placeholder="3" min={0} type="number" />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2 pt-2">
                                    <label className="text-white text-sm font-semibold">
                                        Internship Description
                                    </label>
                                    <textarea className="w-full min-h-[180px] rounded-lg border border-[#3a3f4a] bg-[#21242c] text-white outline-0 focus:ring-2 focus:ring-blue-500 transition-all p-4 resize-none"
                                        name="description" placeholder="Outline the core responsibilities, specific projects, and expected outcomes of this internship..." />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-white text-sm font-semibold">
                                            Required Skills
                                        </label>
                                        <select
                                            onChange={(e) => addSkill(e.target.value)}
                                            className="w-full h-12 rounded-lg border border-[#3a3f4a] bg-[#21242c] text-white outline-0 focus:ring-2 focus:ring-blue-500 transition-all px-4 appearance-none"
                                            name="skill" defaultValue="">
                                            <option value="">Add Skill...</option>
                                            <SkillsOptions />
                                        </select>
                                        <p className="text-xs text-gray-400">
                                            max.5
                                        </p>
                                        <div className="flex gap-2 flex-wrap">
                                            {
                                                skills.map((skill, index) => {
                                                    return <Ticket text={skill} key={index} setState={setSkills} />
                                                })
                                            }
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-white text-sm font-semibold">Languages</label>
                                        <select
                                            onChange={(e) => addLanguage(e.target.value)}
                                            className="w-full h-12 rounded-lg border border-[#3a3f4a] bg-[#21242c] text-white outline-0 focus:ring-2 focus:ring-blue-500 transition-all px-4 appearance-none"
                                            name="language" defaultValue="">
                                            <option value="">Add language...</option>
                                            <option value="arabic">arabic</option>
                                            <option value="english">english</option>
                                            <option value="french">french</option>
                                            <option value="german">german</option>
                                            <option value="spanish">spanish</option>
                                        </select>
                                        <p className="text-xs text-gray-400">
                                            max.5
                                        </p>
                                        <div className="flex gap-2 flex-wrap">
                                            {
                                                languages.map((language, index) => {
                                                    return <Ticket text={language} key={index} setState={setLanguages} />
                                                })
                                            }
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2 pt-2">
                                    <label className="text-white text-sm font-semibold">
                                        Expiration Date
                                    </label>
                                    <div className="relative max-w-sm">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                            <CalendarDays size={16} />
                                        </span>
                                        <input className="w-full h-12 rounded-lg border border-[#3a3f4a] bg-[#21242c] text-white outline-0 focus:ring-2 focus:ring-blue-500 transition-all pl-10 pr-4"
                                            name="expiration_date" type="date"/>
                                    </div>
                                    <p className="text-xs text-gray-400">
                                        The offer will automatically close on this date.
                                    </p>
                                    {
                                        message && <p className="text-xs text-red-400">
                                            {message}
                                        </p>
                                    }
                                </div>

                                <div className="flex items-center flex-wrap justify-end gap-4 pt-6 mt-6 border-t border-[#3a3f4a]">
                                    <button
                                        onClick={() => setOpen(false)}
                                        className="px-3 py-2.5 rounded-lg border border-[#3a3f4a] text-white text-sm font-bold hover:bg-[#2d323c] transition-colors"
                                        type="button">
                                        Cancel
                                    </button>
                                    <SubmitButton />
                                </div>
                                {
                                    posted && <p className="text-right text-xs text-green-400">
                                        Internship posted successfully.
                                    </p>
                                }
                            </form>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}

function SubmitButton() {
    const {pending} = useFormStatus();
    return (
        <button
            disabled={pending}
            className="flex items-center justify-center gap-3 px-3 py-2.5 rounded-lg bg-blue-500 text-white text-sm font-bold hover:bg-blue-700 transition-all shadow-md active:scale-[0.98]"
            type="submit">
            {
                pending ? <>
                    Posting Offer <Spinner size={16} />
                </> : <>
                    Post Offer
                </>
            }
        </button>
    )
}

function Ticket({text, setState}) {

    const remove = () => {
        setState(
            prev => {
                return prev.filter((skill) => skill !== text);
            }
        );
    }

    return (
        <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center px-1 py-0.5 rounded text-xs font-medium bg-blue-500/10 text-blue-500 border border-blue-500/20">
                {text}
                <button
                    onClick={remove}
                    type="button" className="hover:text-blue-500-dark">
                    <span>
                        <X size={16} />
                    </span>
                </button>
            </span>
        </div>
    )
}