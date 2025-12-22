"use client";
import React, {createContext, useState} from "react";
import { LayoutGrid} from "lucide-react";
import Link from "next/link";
import {AlertToast, ErrorToast, SuccessToast} from "@/components/toasts";

export const contextStore = createContext(null);

export default function AuthLayout({ children }) {

    const [isMissing, setIsMissing] = useState({status: false, messages: []});
    const [error, setError] = useState({status: false, message: ""});
    const [success, setSuccess] = useState({status: false, message: ""});

    return (

        <contextStore.Provider value={{
            states:[isMissing, error, success], sets:[setIsMissing, setError, setSuccess]
        }}>

            <main className="bg-[url('/login_background.jpeg')] bg-cover bg-center
                min-h-screen flex items-center justify-center p-4">

                {isMissing.status && <AlertToast />}
                {error.status && <ErrorToast />}
                {success.status && <SuccessToast />}

                <div className="fixed inset-0 z-10 bg-white/20"></div>

                <div className="z-50 w-full max-w-[480px] flex flex-col items-center
            bg-slate-950 rounded-lg border-0 shadow-lg shadow-slate-950 overflow-hidden p-4">

                    <div className="mb-2 flex items-center gap-3">
                        <div className="flex items-center justify-center size-10 rounded-full bg-green-500">
                            <LayoutGrid className="text-green-950" />
                        </div>
                        <h1 className="text-white/70 text-2xl font-bold tracking-tight">StageConnect</h1>
                    </div>
                    <div className="w-full">
                        <div className="p-8 flex flex-col gap-6">
                            {children}
                        </div>
                    </div>
                    <div className="h-1 w-full bg-gradient-to-r from-transparent via-green-500 to-transparent opacity-50"></div>
                    <div className="mt-8 flex gap-6 text-xs text-slate-400 dark:text-slate-600 font-medium">
                        <Link className="hover:text-slate-600 dark:hover:text-slate-400 transition-colors" href="#">Privacy Policy</Link>
                        <Link className="hover:text-slate-600 dark:hover:text-slate-400 transition-colors" href="#">Terms of Service</Link>
                    </div>
                </div>
            </main>

        </contextStore.Provider>


    )
}