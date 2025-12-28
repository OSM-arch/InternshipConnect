"use client";
import {Mail, Lock, Building2, Eye, EyeOff, MapPin} from "lucide-react";
import React, {useEffect, useState} from "react";
import {SubmitButton} from "@/app/auth/signup/page";
import Alert from "@/components/alert";
import {validatePassword} from "@/functions/validatePassword";
import {useRouter} from "next/navigation";
import Success from "@/components/success";

const fetchIndustries = async (setData) => {
    try {
        const res = await fetch(`/api/industries`);
        const data = await res.json();
        if (data.success) setData(data.data);
    } catch (err) { console.error(err); }
};

export default function CompanyForm() {

    const router = useRouter();

    // logic and ui states
    const [isMissing, setIsMissing] = useState({
        firstname: false,
        lastname: false,
        email: false,
        password: false,
        company_name: false,
        address: false,
        industry: false
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [locked, setLocked] = useState(true);

    const [industries, setIndustries] = useState([]);
    useEffect(() => {
        const getIndustries = async () => {
            if (industries.length > 0) return;
            setTimeout(async () => {
                await fetchIndustries(setIndustries);
            }, 1000);
        }
        getIndustries();
    }, [industries.length]);

    const handleChange = () => {
        setIsMissing({
            firstname: false,
            lastname: false,
            email: false,
            password: false,
            company_name: false,
            address: false,
            industry: false
        });
        setError("");
    }

    const handleSubmit = async (formData) => {
        const firstname = formData.get("firstname");
        const lastname  = formData.get("lastname");
        const email     = formData.get("email");
        const password  = formData.get("password");
        const company_name  = formData.get("company_name");
        const address  = formData.get("address");
        const industry = formData.get("industry");

        const missing = {
            firstname: false,
            lastname: false,
            email: false,
            password: false,
            company_name: false,
            address: false,
            industry: false
        }
        if (!firstname) missing.firstname = true;
        if (!lastname) missing.lastname = true;
        if (!email) missing.email = true;
        if (!password) missing.password = true;
        if (!company_name) missing.company_name = true;
        if (!address) missing.address = true;
        if (!industry) missing.industry = true;

        if (missing.firstname || missing.lastname || missing.email || missing.password ||
            missing.company_name || missing.address || missing.industry) {
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
            const res = await fetch("/api/auth/signup/company", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    firstname,
                    lastname,
                    email,
                    password,
                    company_name,
                    address,
                    industry
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

    return (
        <form className="flex flex-col gap-4" action={handleSubmit} onChange={handleChange}>

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

            {/* Company name */}
            <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Company name
                </label>
                <div
                    className="relative flex w-full items-center rounded-lg transition-all group focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary">
                    <input
                        name="company_name"
                        className={`w-full h-11 bg-blue-900/20 border rounded-lg pl-10 pr-3 text-sm text-blue-200 
                                         focus:outline-none focus:border-primary focus:ring-0 transition-colors ${
                            isMissing.company_name ? "border-red-800 placeholder:text-red-800" : "border-slate-200 placeholder:text-slate-600"
                        }`}
                        required="" type="text" autoComplete="off" />
                    <div
                        className="absolute left-3 flex items-center justify-center pointer-events-none">
                        <span className="text-[20px]">
                            <Building2 className={isMissing.company_name ? "text-red-800" : "text-slate-500"} />
                        </span>
                    </div>
                </div>
            </div>

            {/* Address */}
            <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Address
                </label>
                <div
                    className="relative flex w-full items-center rounded-lg transition-all group focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary">
                    <input
                        name="address"
                        className={`w-full h-11 bg-blue-900/20 border rounded-lg pl-10 pr-3 text-sm text-blue-200 
                                         focus:outline-none focus:border-primary focus:ring-0 transition-colors ${
                            isMissing.address ? "border-red-800 placeholder:text-red-800" : "border-slate-200 placeholder:text-slate-600"
                        }`}
                        required="" type="text" autoComplete="off" />
                    <div
                        className="absolute left-3 flex items-center justify-center pointer-events-none">
                        <span className="text-[20px]">
                            <MapPin className={isMissing.address ? "text-red-800" : "text-slate-500"} />
                        </span>
                    </div>
                </div>
            </div>

            {/* Industry */}
            <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Industry
                </label>
                <div
                    className="relative flex w-full items-center rounded-lg transition-all group focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary">
                    <select
                        name="industry"
                        className={`w-full h-11 flex-1 items-center bg-blue-900/20 border rounded-lg pl-10 pr-3 text-sm text-blue-200 
                                         focus:outline-none focus:border-primary focus:ring-0 transition-colors ${
                            isMissing.industry ? "border-red-800" : "border-slate-200"
                        }`}
                        required="">
                        <option value="" disabled={true} >Choose an industry</option>
                        {
                            industries.map((industry, index) => (
                                <option value={industry.industry_id} key={index}>{industry.industry_name}</option>
                            ))                      }
                    </select>
                </div>
            </div>

            {/* !--Submit Button -- */}
            <SubmitButton />
        </form>
    );
}