"use client";
import Logo from "@/components/logo";
import {Eye, EyeOff, Lock, Mail} from "lucide-react";
import Alert from "@/components/alert";
import {useFormStatus} from "react-dom";
import {Spinner} from "@/components/ui/spinner";
import React, {useRef, useState} from "react";
import {useRouter} from "next/navigation";
import Link from "next/link";

export default function LoginPage() {

    const router = useRouter();

    const emailRef = useRef(null);
    const passwordRef = useRef(null);

    const [error, setError] = useState("");
    const [isMissing, setIsMissing] = useState({
        email: false,
        password: false
    });
    const [locked, setLocked] = useState(true);

    const handleChange = () => {
        setIsMissing({
            email: false,
            password: false
        });
        setError("");
    }

    const handleSubmit = async () => {
        const dbError = "User 'Internship_connect_breathing' has exceeded the 'max_user_connections' resource (current value: 5)";
        const verifiedErr = "User not Verified";

        const email = emailRef.current.value.trim();
        const password = passwordRef.current.value.trim();
        const missing = {
            email: false,
            password: false
        }

        if (!email) {
            missing.email = true;
        }
        if (!password) {
            missing.password = true;
        }
        if (missing.email || missing.password) {
            setIsMissing(missing);
            return;
        }

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (data.success) {
                router.replace("/dashboard");
            } else {
                setError(data.error === dbError ? "Something went wrong! please try again.": data.error);
                if (data.error === verifiedErr) {
                    setError(verifiedErr);
                    setTimeout(() => router.push("/email-verification"), 1000);
                }
            }
        } catch (err) {
            console.error(err);
        }

    }

    return (
        <div className="flex flex-row justify-center items-center w-full min-h-screen py-6">

            <div className="w-full max-w-[480px] items-center flex flex-col gap-6">
                {/* !--Brand / Logo Section -- */}
                <Logo />
                {/* !--Main Card -- */}
                <div
                    className="bg-slate-950 w-full rounded-xl border-0 shadow-xl overflow-hidden relative">
                    {/* !--Decorative top accent -- */}
                    <div className="h-1 w-full bg-gradient-to-r from-green-500 to-blue-400"></div>
                    <div className="p-8 pt-8">
                        {/* !--Header-- */}
                        <div className="mb-8 text-center">
                            <h1 className="text-2xl font-bold tracking-tight text-blue-200 mb-2">
                                Sign in
                            </h1>
                            <p className="text-slate-500 text-sm leading-relaxed">
                                Enter your details to access your account.
                            </p>
                        </div>

                        {/* error alert */}
                        {error && <Alert text={error} setState={setError} />}

                        <form className="flex flex-col gap-5" action={handleSubmit} onChange={handleChange}>
                            {/* !--Email Field -- */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Email Address
                                </label>
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

                            {/* !--Password Field -- */}
                            <div className="flex flex-col gap-1.5">
                                <div className="flex justify-between items-center ml-1">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Password
                                    </label>
                                    <Link className="cursor-pointer text-sm font-medium text-slate-300 hover:text-slate-500
                                            transition-all duration-200" href="/forgot-password">
                                        Forgot password?
                                    </Link>
                                </div>
                                <div
                                    className="relative flex w-full items-center rounded-lg transition-all group focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary">
                                    <input
                                        ref={passwordRef}
                                        className={`w-full h-11 bg-blue-900/20 border rounded-lg pl-10 pr-3 text-sm text-blue-200 
                                         focus:outline-none focus:border-primary focus:ring-0 transition-colors ${
                                            isMissing.password ? "border-red-800" : "border-slate-200"
                                        }`}
                                        required="" type={locked ? "password" : "text"} />
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
                            </div>

                            {/* !--Submit Button -- */}
                            <SubmitButton />
                        </form>
                        <div className="flex items-center justify-center gap-2 pt-4">
                            <p className="text-slate-700 dark:text-[#9db9a8] text-sm">Don&apos;t have an account?</p>
                            <Link className="cursor-pointer text-sm font-medium text-slate-300 hover:text-slate-500
                                            transition-all duration-200"
                                  href="/auth/signup"
                            >
                                Sign Up
                            </Link>
                        </div>
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
                    signing in <Spinner />
                </>
            ) : (
                <>
                    <span>Sign in</span>
                </>
            )}
        </button>
    );
}