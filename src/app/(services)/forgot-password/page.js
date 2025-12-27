"use client";
import { Info, Mail, KeyRound, ArrowRight, ArrowLeft } from "lucide-react";
import Logo from "@/components/logo";
import {Switch} from "@/components/ui/switch";
import {Label} from "@/components/ui/label";
import {useRef, useState} from "react";
import {useFormStatus} from "react-dom";
import {Spinner} from "@/components/ui/spinner";
import Alert from "@/components/alert";
import Link from "next/link";
import {useRouter} from "next/navigation";

export default function ForgotPage() {

    const router = useRouter();

    const emailRef = useRef(null);
    const keyRef = useRef(null);

    const [isSupervisor, setIsSupervisor] = useState(false);
    const [isMissing, setIsMissing] = useState({
        email: false,
        key: false
    });
    const [error, setError] = useState("");

    const handleChange = () => {
        setIsMissing({
            email: false,
            key: false
        });
        setError("");
    }

    const handleSubmit = async () => {
        const dbError = "User 'Internship_connect_breathing' has exceeded the 'max_user_connections' resource (current value: 5)";
        const email = emailRef.current.value.trim() || null;
        let key;
        let missing = {
            email: false,
            key: false
        };

        // form validation
        if (isSupervisor) {
            key = keyRef.current.value.trim() || null;
        }
        if (!email) {
            missing.email = true;
        }
        if (!key && isSupervisor) {
            missing.key = true;
        }

        if (missing.email|| missing.key) {
            setIsMissing(missing);
            return;
        }

        // send code
        try {
            const res = await fetch("/api/auth/forgot-password/send-code", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(key ? {email, key} : {email})
            });

            const data = await res.json();

            if (data.success) {
                router.replace("/forgot-password/verify");
            }else {
                setError(data.error === dbError ? "Something went wrong! please try again.": data.error);
            }

        }catch (err) {
            console.error(err.message);
        }
    }

    return (
        <div className="flex flex-row justify-center items-center w-full min-h-screen py-6">

            <div className="w-full max-w-[480px] items-center flex flex-col gap-6">
                {/* !--Brand / Logo Section -- */}
                <Logo />
                {/* !--Main Card -- */}
                <div
                    className="bg-slate-950 rounded-xl border-0 shadow-xl overflow-hidden relative">
                    {/* !--Decorative top accent -- */}
                    <div className="h-1 w-full bg-gradient-to-r from-green-500 to-blue-400"></div>
                    <div className="p-8 pt-8">
                        {/* !--Header-- */}
                        <div className="mb-8 text-center">
                            <h1 className="text-2xl font-bold tracking-tight text-blue-200 mb-2">
                                Reset your password
                            </h1>
                            <p className="text-slate-500 text-sm leading-relaxed">
                                Enter your email and school registration key to verify your identity.
                            </p>
                        </div>
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

                        {/* error alert */}
                        {error && <Alert text={error} setState={setError} />}

                        <form className="flex flex-col gap-5" action={handleSubmit} onChange={handleChange}>
                            {/* !--Email Field -- */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email
                                    Address</label>
                                <div
                                    className="relative flex w-full items-center rounded-lg transition-all group focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary">
                                    <input
                                        ref={emailRef}
                                        className={`w-full h-11 bg-blue-900/20 border rounded-lg pl-10 pr-3 text-sm text-blue-200 
                                         focus:outline-none focus:border-primary focus:ring-0 transition-colors ${
                                            isMissing.email ? "border-red-800 placeholder:text-red-800" : "border-slate-200 placeholder:text-slate-600"
                                        }`}
                                        placeholder="name@example.com" required="" type="email"/>
                                    <div
                                        className="absolute left-3 flex items-center justify-center pointer-events-none">
                                        <span className="text-[20px]">
                                            <Mail className={isMissing.email ? "text-red-800" : "text-slate-500"} />
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Switch id="airplane-mode" onClick={() => setIsSupervisor(prev => !prev)} />
                                <Label htmlFor="airplane-mode" className="text-slate-500">Supervisor ?</Label>
                            </div>

                            {/* !--School Key Field -- */}
                            {
                                isSupervisor && <div className="flex flex-col gap-1.5">
                                    <div className="flex justify-between items-center">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">School
                                            Registration Key</label>
                                        <span className="text-xs text-slate-400 cursor-help"
                                              title="Found in your onboarding email">What is this?</span>
                                    </div>
                                    <div
                                        className="relative flex w-full items-center rounded-lg transition-all focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary">
                                        <input
                                            ref={keyRef}
                                            className={`w-full h-11 bg-blue-900/20 border rounded-lg pl-10 pr-3 text-sm text-blue-200
                                            font-mono focus:outline-none focus:border-primary focus:ring-0 transition-colors uppercase"
                                            ${
                                                isMissing.key ? "border-red-800 placeholder:text-red-800" : "border-slate-200 placeholder:text-slate-600"
                                            }
                                            `}
                                            placeholder="SCH-XXXX-XXXX" type="text" />
                                        <div
                                            className="absolute left-3 flex items-center justify-center pointer-events-none">
                                        <span className="text-[20px]">
                                            <KeyRound className={isMissing.key ? "text-red-800" : "text-slate-500"} />
                                        </span>
                                        </div>
                                    </div>
                                </div>
                            }

                            {/* !--Submit Button -- */}
                            <SubmitButton />
                        </form>
                    </div>
                    {/* !--Footer Area -- */}
                    <div
                        className="bg-[#1c2128] border-t border-slate-950 p-4 flex justify-center">
                        <Link className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors flex items-center gap-2 font-medium"
                           href="/auth/login">
                            <span className="text-[16px]">
                                <ArrowLeft />
                            </span>
                            Back to Login
                        </Link>
                    </div>
                </div>
                {/* !--Help / Support Links -- */}
                <div className="flex justify-center gap-6 text-xs text-slate-500 dark:text-slate-600">
                    <a className="hover:text-slate-800 dark:hover:text-slate-400 transition-colors" href="#">Contact
                        Support</a>
                    <a className="hover:text-slate-800 dark:hover:text-slate-400 transition-colors" href="#">Privacy
                        Policy</a>
                    <a className="hover:text-slate-800 dark:hover:text-slate-400 transition-colors" href="#">Terms</a>
                </div>
            </div>
        </div>
    )
}

export function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <button
            disabled={pending}
            className="cursor-pointer mt-2 w-full h-11 bg-gradient-to-r from-green-500 to-blue-400
            text-blue-200 text-sm font-semibold rounded-lg shadow-sm transition-all flex items-center
            justify-center gap-2 group active:scale-[0.98]"
        >
            {pending ? (
                <>
                    Sending <Spinner />
                </>
            ) : (
                <>
                    <span>Send Reset Code</span>
                    <ArrowRight className="text-[15px] group-hover:translate-x-0.5 transition-transform" />
                </>
            )}
        </button>
    );
}