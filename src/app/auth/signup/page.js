"use client";
import Logo from "@/components/logo";
import {useFormStatus} from "react-dom";
import {Spinner} from "@/components/ui/spinner";
import React, {useState} from "react";
import {useRouter} from "next/navigation";
import Link from "next/link";
import RoleRadio from "@/app/auth/signup/(components)/roleRadio";

export default function SignupPage() {

    const router = useRouter();

    const [role, setRole] = useState("student");

    const handleChange = () => {

    }

    const handleSubmit = async () => {

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

                        <RoleRadio setRole={setRole} />

                        <form className="flex flex-col gap-5" action={handleSubmit} onChange={handleChange}>

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
                    signing up <Spinner />
                </>
            ) : (
                <>
                    <span>Sign up</span>
                </>
            )}
        </button>
    );
}