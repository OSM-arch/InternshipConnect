"use client";
import React, {useContext, useState} from "react";
import {useRef} from "react";
import {useRouter} from "next/navigation";
import { Mail, Lock, LockOpen } from "lucide-react";
import Link from "next/link";
import {AlertToast, ErrorToast, SuccessToast} from "@/components/toasts";
import {contextStore} from "@/app/auth/layout";
import validateForm from "@/functions/validate_form";

export default function LoginForm() {

    const router = useRouter();
    const {states:[isMissing, error, success], sets:[setIsMissing, setError, setSuccess]} = useContext(contextStore);

    const emailRef = useRef(null);
    const passwordRef = useRef(null);

    const [locked, setLocked] = useState(true);

    const login = async () => {
        const email = emailRef.current.value.trim() || null;
        const password = passwordRef.current.value.trim() || null;

        const labels = ["Email", "Password"];
        const array = [email, password];

        const isValid = validateForm(labels, array, setIsMissing);
        if (!isValid) return;

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (data.success) {
                setSuccess({status: data.success, message: data.message});
                setTimeout(() => {
                    router.replace("/dashboard");
                }, 2000);
            } else {
                setError({
                    status: true,
                    message: data.error
                });
            }
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <React.Fragment>

            {isMissing.status && <AlertToast />}
            {error.status && <ErrorToast />}
            {success.status && <SuccessToast />}

            <div className="text-center">
                <h2 className="text-white/70 text-2xl font-bold leading-tight">Welcome <span className="text-green-600">back</span></h2>
                <p className="text-slate-700  mt-2 text-sm font-medium">Enter your details to access your account</p>
            </div>

            <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                    <label className="text-slate-700 text-sm font-semibold ml-1" htmlFor="email">Email Address</label>
                    <div className="relative flex items-center">
                    <span className="absolute right-4 text-green-600">
                        <Mail />
                    </span>
                        <input ref={emailRef} className="w-full rounded-2xl py-3.5 pl-5 pr-4 text-white/70
                        focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-primary
                        transition-all duration-500 ease-out"
                               id="email" type="email" autoComplete="off"
                        />
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center ml-1">
                        <label className="text-slate-700 text-sm font-semibold" htmlFor="password">Password</label>
                        <Link className="cursor-pointer text-sm font-medium text-slate-700 hover:text-green-950
                        hover:underline decoration-2 decoration-green-950 underline-offset-4
                        transition-all duration-200" href="#">
                            Forgot password?
                        </Link>
                    </div>
                    <div className="relative flex items-center">
                    <span
                        onClick={() => {setLocked(prevState => !prevState);}}
                        className="absolute right-4 text-green-600 cursor-pointer">
                        {
                            locked === true ? <Lock /> : <LockOpen />
                        }
                    </span>
                        <input ref={passwordRef} className="w-full rounded-2xl py-3.5 pl-5 pr-4 text-white/70
                        focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-primary
                        transition-all duration-500 ease-out"
                               id="password" type={locked ? "password" : "text"} autoComplete="off"
                        />
                    </div>
                </div>
                <button
                    className="mt-2 flex w-full cursor-pointer items-center justify-center
                rounded-full bg-primary h-12 px-6 text-[#102217] text-base font-bold tracking-wide
                hover:bg-[#20d86a] hover:shadow-lg hover:shadow-primary/20 transition-all
                duration-500 ease-in-out active:scale-[0.98]"
                    onClick={login}
                >
                    Sign In
                </button>
            </div>

            <div className="flex items-center justify-center gap-2 pt-2">
                <p className="text-slate-700 dark:text-[#9db9a8] text-sm font-medium">Don&apos;t have an account?</p>
                <Link className="cursor-pointer text-sm font-medium text-green-600 hover:text-green-950
                  hover:underline decoration-2 decoration-green-950 underline-offset-4
                  transition-all duration-200" href="/auth/signup"
                >
                    Sign Up
                </Link>
            </div>
        </React.Fragment>
    )
}