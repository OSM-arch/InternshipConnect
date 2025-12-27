"use client";
import Logo from "@/components/logo";
import {Mail} from "lucide-react";
import Alert from "@/components/alert";
import {useFormStatus} from "react-dom";
import {Spinner} from "@/components/ui/spinner";
import {useRef, useState} from "react";
import {useRouter} from "next/navigation";

export default function EmailVerificationPage() {

    const router = useRouter();

    const emailRef = useRef(null);

    const [isMissing, setIsMissing] = useState({email: false});
    const [error, setError] = useState("");

    const handleChange = () => {
        setIsMissing({email: false});
        setError("");
    }

    const handleSubmit = async () => {
        const dbError = "User 'Internship_connect_breathing' has exceeded the 'max_user_connections' resource (current value: 5)";
        const email = emailRef.current.value.trim();

        if (!email) {
            setIsMissing({email: true});
            return;
        }

        // send code
        try {
            const res = await fetch("/api/auth/email-verification/send-code", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({email})
            });

            const data = await res.json();

            if (data.success) {
                localStorage.setItem("email", email); // store email
                router.replace("/email-verification/verify-code");
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
                    className="bg-slate-950 w-full rounded-xl border-0 shadow-xl overflow-hidden relative">
                    {/* !--Decorative top accent -- */}
                    <div className="h-1 w-full bg-gradient-to-r from-green-500 to-blue-400"></div>
                    <div className="p-8 pt-8">
                        {/* !--Header-- */}
                        <div className="mb-8 text-center">
                            <h1 className="text-2xl font-bold tracking-tight text-blue-200 mb-2">
                                Email Verification
                            </h1>
                            <p className="text-slate-500 text-sm leading-relaxed">
                                Enter your email to verify your identity.
                            </p>
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

                            {/* !--Submit Button -- */}
                            <SubmitButton />
                        </form>
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
                    <span>Send Verification Code</span>
                </>
            )}
        </button>
    );
}