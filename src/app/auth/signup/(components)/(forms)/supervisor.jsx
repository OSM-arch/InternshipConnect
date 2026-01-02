"use client";
import {Mail, Lock, Building2, Eye, EyeOff, Info, KeyRound} from "lucide-react";
import React, { useState } from "react";
import {SubmitButton} from "@/app/auth/signup/page";
import Alert from "@/components/alert";
import {validatePassword} from "@/utils/validatePassword";
import {useRouter} from "next/navigation";
import Success from "@/components/success";

const fetchSchools = async (query, setData, setMessage) => {
    try {
        const res = await fetch(`/api/schools?q=${query}`);
        const data = await res.json();
        if (data.success) setData(data.data);
        else setMessage("School not found!");
    } catch (err) { console.error(err); }
};

export default function SupervisorForm() {

    const router = useRouter();

    // logic and ui states
    const [isMissing, setIsMissing] = useState({
        firstname: false,
        lastname: false,
        email: false,
        password: false,
        school: false,
        sch_key: false
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [locked, setLocked] = useState(true);
    const [message, setMessage] = useState("");

    // data states
    const [query, setQuery] = useState("");
    const [schools, setSchools] = useState([]);

    const handleChange = () => {
        setIsMissing({
            firstname: false,
            lastname: false,
            email: false,
            password: false,
            school: false,
            sch_key: false
        });
        setError("");
        setMessage("");
    }

    const handleSubmit = async (formData) => {
        const firstname = formData.get("firstname");
        const lastname  = formData.get("lastname");
        const email     = formData.get("email");
        const password  = formData.get("password");
        const school = schools.find((s) => s.school_name === query);
        const sch_key  = formData.get("sch_key");

        const missing = {
            firstname: false,
            lastname: false,
            email: false,
            password: false,
            school: false,
            sch_key: false
        }
        if (!firstname) missing.firstname = true;
        if (!lastname) missing.lastname = true;
        if (!email) missing.email = true;
        if (!password) missing.password = true;
        if (!school) missing.school = true;
        if (!sch_key) missing.sch_key = true;

        if (missing.firstname || missing.lastname || missing.email || missing.password || missing.school
            || missing.sch_key) {
            setIsMissing(missing);
            return;
        }

        const {valid, message} = validatePassword(password);
        if (!valid) {
            setError(message);
            return;
        }

        const dbError = "User 'Internship_connect_breathing' has exceeded the 'max_user_connections' resource (current value: 5)";
        try {
            const {school_id} = school;
            const res = await fetch("/api/auth/signup/supervisor", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    firstname,
                    lastname,
                    email,
                    password,
                    school_id,
                    sch_key
                })
            });

            const data = await res.json();
            if (data.success) {
                setSuccess(data.message);
                setTimeout(() => router.push("/auth/login"), 2000);
            }else {
                setError(data.error === dbError ? "Something went wrong! please try again." : data.error);
            }

        }catch (err) {
            console.error(err.message);
        }

    }

    const handleFocus = async () => {
        if (!query || query.length < 3) return;

        setTimeout(async () => {
            await fetchSchools(query, setSchools, setMessage);
        }, 2000);
    }

    return (
        <form className="flex flex-col gap-4" action={handleSubmit} onChange={handleChange}>
            {/* !--Alert Message (Info) -- */}
            <div
                className="mb-6 p-4 rounded-lg bg-blue-900/20 border border-blue-100 flex gap-3 items-start">
                            <span className="material-symbols-outlined text-primary shrink-0 text-[20px] mt-0.5">
                                <Info />
                            </span>
                <div className="text-sm text-blue-200">
                    <span className="font-medium block mb-1">Supervisor Check</span>
                    Please ensure you have your <span
                    className="font-mono text-xs bg-blue-900/40 px-1 py-0.5 rounded text-primary"><code>SCH-KEY</code></span> ready.
                </div>
            </div>

            {success && <Success text={success}/>}
            {error && <Alert text={error} setState={setError} />}

            {/* First & Last name */}
            <div className="flex flex-row gap-2">
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Firstname
                    </label>
                    <div
                        className="relative flex w-full items-center rounded-lg transition-all group focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary">
                        <input
                            name="firstname"
                            className={`w-full h-11 bg-blue-900/20 border rounded-lg pl-10 pr-3 text-sm text-blue-200 
                                         focus:outline-none focus:border-primary focus:ring-0 transition-colors ${
                                isMissing.firstname ? "border-red-800 placeholder:text-red-800" : "border-slate-200 placeholder:text-slate-600"
                            }`}
                            required="" type="text" autoComplete="off" />
                    </div>
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Lastname
                    </label>
                    <div
                        className="relative flex w-full items-center rounded-lg transition-all group focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary">
                        <input
                            name="lastname"
                            className={`w-full h-11 bg-blue-900/20 border rounded-lg pl-10 pr-3 text-sm text-blue-200 
                                         focus:outline-none focus:border-primary focus:ring-0 transition-colors ${
                                isMissing.lastname ? "border-red-800 placeholder:text-red-800" : "border-slate-200 placeholder:text-slate-600"
                            }`}
                            required="" type="text" autoComplete="off" />
                    </div>
                </div>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Email Address
                </label>
                <div
                    className="relative flex w-full items-center rounded-lg transition-all group focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary">
                    <input
                        name="email"
                        className={`w-full h-11 bg-blue-900/20 border rounded-lg pl-10 pr-3 text-sm text-blue-200 
                                         focus:outline-none focus:border-primary focus:ring-0 transition-colors ${
                            isMissing.email ? "border-red-800 placeholder:text-red-800" : "border-slate-200 placeholder:text-slate-600"
                        }`}
                        placeholder="name@example.com" required="" type="email" autoComplete="off" />
                    <div
                        className="absolute left-3 flex items-center justify-center pointer-events-none">
                                        <span className="text-[20px]">
                                            <Mail className={isMissing.email ? "text-red-800" : "text-slate-500"} />
                                        </span>
                    </div>
                </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Password
                </label>
                <div
                    className="relative flex w-full items-center rounded-lg transition-all group focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary">
                    <input
                        name="password"
                        className={`w-full h-11 bg-blue-900/20 border rounded-lg pl-10 pr-3 text-sm text-blue-200 
                                         focus:outline-none focus:border-primary focus:ring-0 transition-colors ${
                            isMissing.password ? "border-red-800" : "border-slate-200"
                        }`}
                        required="" type={locked ? "password" : "text"} autoComplete="off" />
                    <div
                        className="absolute left-3 flex items-center justify-center pointer-events-none">
                                        <span className="text-[20px]">
                                            <Lock className={isMissing.password ? "text-red-800" : "text-slate-500"} />
                                        </span>
                    </div>
                    <div
                        onClick={() => setLocked(prev => !prev)}
                        className="cursor-pointer absolute right-3 flex items-center justify-center">
                                        <span className="text-[20px] text-slate-500">
                                            {
                                                locked ? <Eye /> : <EyeOff />
                                            }
                                        </span>
                    </div>
                </div>
                <p className="font-extralight text-sm text-blue-200 text-pretty">
                    Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.
                </p>
            </div>

            {/* School input */}
            <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    School
                </label>
                <div
                    className="relative flex w-full items-center rounded-lg transition-all group focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary">
                    <input
                        onFocus={handleFocus}
                        onChange={e => setQuery(e.target.value)}
                        type="text" required="" list="schools" autoComplete="off"
                        className={`w-full h-11 bg-blue-900/20 border rounded-lg pl-10 pr-3 text-sm text-blue-200 
                                         focus:outline-none focus:border-primary focus:ring-0 transition-colors ${
                            isMissing.school ? "border-red-800 placeholder:text-red-800" : "border-slate-200 placeholder:text-slate-600"
                        }`}
                    />
                    <datalist id="schools">
                        {schools.map((school, index) => <option key={index} value={school?.school_name} />)}
                    </datalist>
                    <div
                        className="absolute left-3 flex items-center justify-center pointer-events-none">
                                <span className="text-[20px]">
                                    <Building2 className={isMissing.school ? "text-red-800" : "text-slate-500"} />
                                </span>
                    </div>
                </div>
                <p className="text-red-700 text-sm font-semibold ml-1">{message}</p>
            </div>

            {/* SCH-KEY */}
            <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">School
                        Registration Key</label>
                    <span className="text-xs text-slate-400 cursor-help"
                          title="Found in your onboarding email">What is this?</span>
                </div>
                <div
                    className="relative flex w-full items-center rounded-lg transition-all focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary">
                    <input
                        name="sch_key" autoComplete="off"
                        className={`w-full h-11 bg-blue-900/20 border rounded-lg pl-10 pr-3 text-sm text-blue-200
                                            font-mono focus:outline-none focus:border-primary focus:ring-0 transition-colors uppercase"
                                            ${
                            isMissing.sch_key ? "border-red-800 placeholder:text-red-800" : "border-slate-200 placeholder:text-slate-600"
                        }
                                            `}
                        placeholder="SCH-XXXX-XXXX" type="text" />
                    <div
                        className="absolute left-3 flex items-center justify-center pointer-events-none">
                                        <span className="text-[20px]">
                                            <KeyRound className={isMissing.sch_key ? "text-red-800" : "text-slate-500"} />
                                        </span>
                    </div>
                </div>
            </div>

            {/* !--Submit Button -- */}
            <SubmitButton />
        </form>
    );
}