"use client";
import Logo from "@/components/logo";
import {Mail, Eye, EyeOff, Lock} from "lucide-react";
import Alert from "@/components/alert";
import {useRef, useState} from "react";
import {useFormStatus} from "react-dom";
import {Spinner} from "@/components/ui/spinner";
import {useRouter} from "next/navigation";
import {validatePassword} from "@/utils/validatePassword";

export default function ResetPasswordPage() {

    const router = useRouter();

    const [locked_1, setLocked_1] = useState(true);
    const [locked_2, setLocked_2] = useState(true);
    const [error, setError] = useState("");
    const [isMissing, setIsMissing] = useState({
        email: false,
        newPassword: false,
        confirmPassword: false
    });

    const emailRef = useRef(null);
    const newPwdRef = useRef(null);
    const confirmPwdRef = useRef(null);

    const handleChange = () => {
        setIsMissing({
            email: false,
            newPassword: false,
            confirmPassword: false
        });
        setError("");
    }

    const handleSubmit = async () => {
        const dbError = "User 'Internship_connect_breathing' has exceeded the 'max_user_connections' resource (current value: 5)";
        const email = emailRef.current.value.trim();
        const newPwd = newPwdRef.current.value.trim();
        const confirmPwd = confirmPwdRef.current.value.trim();
        let missing = {
            email: false,
            newPassword: false,
            confirmPassword: false
        }

        if (!email) {
            missing.email = true;
        }
        if (!newPwd) {
            missing.newPassword = true;
        }
        if (!confirmPwd) {
            missing.confirmPassword = true;
        }

        if (missing.newPassword || missing.confirmPassword || missing.email) {
            setIsMissing(missing);
            return;
        }

        const {valid, message} = validatePassword(newPwd);
        if (!valid) {
            setError(message);
            return;
        }

        if (newPwd !== confirmPwd) {
            setError("The passwords do not match. Please make sure both fields are identical.");
            return;
        }

        try {

            const res = await fetch("/api/auth/forgot-password/reset", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({email, newPwd})
            });

            const data = await res.json();
            if (data.success) {
                router.replace("/auth/login");
            }else {
                setError(data.error === dbError ? "Something went wrong! please try again.": data.error);
            }

        }catch (err) {
            console.error(err.message);
        }
    }

    return (
        <div className="flex flex-row justify-center items-center w-full min-h-screen py-4">

            <div className="w-full max-w-[480px] items-center flex flex-col gap-6">
                {/* !--Brand / Logo Section -- */}
                <Logo />
                {/* !--Main Card -- */}
                <div
                    className="bg-slate-950 w-full max-w-[450px] rounded-xl border-0 shadow-xl overflow-hidden relative">
                    {/* !--Decorative top accent -- */}
                    <div className="h-1 w-full bg-gradient-to-r from-green-500 to-blue-400"></div>
                    <div className="p-8 pt-8">
                        {/* !--Header-- */}
                        <div className="mb-8 text-center">
                            <h1 className="text-2xl font-bold tracking-tight text-blue-200 mb-2">
                                Reset your password
                            </h1>
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

                            {/* !--New Password Field -- */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    New password
                                </label>
                                <div
                                    className="relative flex w-full items-center rounded-lg transition-all group focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary">
                                    <input
                                        ref={newPwdRef}
                                        className={`w-full h-11 bg-blue-900/20 border rounded-lg pl-10 pr-3 text-sm text-blue-200 
                                         focus:outline-none focus:border-primary focus:ring-0 transition-colors ${
                                            isMissing.newPassword ? "border-red-800" : "border-slate-200"
                                        }`}
                                        required="" type={locked_1 ? "password" : "text"} />
                                    <div
                                        className="absolute left-3 flex items-center justify-center pointer-events-none">
                                        <span className="text-[20px]">
                                            <Lock className={isMissing.newPassword ? "text-red-800" : "text-slate-500"} />
                                        </span>
                                    </div>
                                    <div
                                        onClick={() => setLocked_1(prev => !prev)}
                                        className="cursor-pointer absolute right-3 flex items-center justify-center">
                                        <span className="text-[20px] text-slate-500">
                                            {
                                                locked_1 ? <Eye /> : <EyeOff />
                                            }
                                        </span>
                                    </div>
                                </div>
                                <p className="font-extralight text-sm text-blue-200 text-pretty">
                                    Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.
                                </p>
                            </div>

                            {/* !--Confirm Password Field -- */}
                            <div className="flex flex-col gap-1.5">
                                <div className="flex justify-between items-center">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Confirm new password
                                    </label>
                                </div>
                                <div
                                    className="relative flex w-full items-center rounded-lg transition-all focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary">
                                    <input
                                        ref={confirmPwdRef}
                                        className={`w-full h-11 bg-blue-900/20 border rounded-lg pl-10 pr-3 text-sm text-blue-200
                                            focus:outline-none focus:border-primary focus:ring-0 transition-colors"
                                            ${
                                            isMissing.confirmPassword ? "border-red-800" : "border-slate-200"
                                        }
                                            `}
                                        type={locked_2 ? "password" : "text"} />
                                    <div
                                        className="absolute left-3 flex items-center justify-center pointer-events-none">
                                        <span className="text-[20px]">
                                            <Lock className={isMissing.confirmPassword ? "text-red-800" : "text-slate-500"} />
                                        </span>
                                    </div>
                                    <div
                                        onClick={() => setLocked_2(prev => !prev)}
                                        className="cursor-pointer absolute right-3 flex items-center justify-center">
                                        <span className="text-[20px] text-slate-500">
                                            {
                                                locked_2 ? <Eye /> : <EyeOff />
                                            }
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

    const {pending} = useFormStatus();


    return (<button
        disabled={pending}
        className="cursor-pointer mt-2 w-full h-11 bg-gradient-to-r from-green-500 to-blue-400
            text-blue-200 text-sm font-semibold rounded-lg shadow-sm transition-all flex items-center
            justify-center gap-2 group active:scale-[0.98]"
    >
        {pending ? (
            <>
                Submitting <Spinner />
            </>
        ) : (
            <>
                <span>Submit</span>
            </>
        )}
    </button>)
}