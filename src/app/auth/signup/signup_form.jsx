"use client";
import React, {useContext, useState} from "react";
import Link from "next/link";
import RoleRadio from "@/app/auth/signup/roleRadio";
import StudentFormSection from "@/app/auth/signup/student_form_section";
import {contextStore} from "@/app/auth/layout";
import {useRouter} from "next/navigation";

export default function SignUpForm() {

    const router = useRouter();
    const {states:[isMissing, error, success], sets:[setIsMissing, setError, setSuccess]} = useContext(contextStore);
    const [role, setRole] = useState("");

    const sign_up = async (data) => {
        try {
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    role: role,
                    data: data
                }),
            });

            const d = await res.json();

            if (d.success) {
                setSuccess({status: d.success, message: d.message});
                setTimeout(() => {
                    router.push(`/auth/email/verify/${data.email}`);
                }, 8000);
            } else {
                setError({
                    status: true,
                    message: d.error
                });
            }
        } catch (err) {
            console.error(err);
        }
    }























    const [industries, setIndustries] = useState([]);
    /*
    useEffect( () => {

        if (industries.length > 0) return undefined;

        const getIndustries = async () => {
            try {

                const res = await fetch("/api/industries");
                const data = await res.json();

                if (data.success) {
                    setIndustries(data.data);
                }else {
                    setError({
                        status: true,
                        message: data.error
                    });
                }

            }catch (err) {
                console.error(err);
            }
        }
        getIndustries();

    }, [industries]);

     */

    return (
        <React.Fragment>

            <div className="text-center">
                <h2 className="text-white/70 text-2xl font-bold leading-tight">Join <span className="text-green-600">Us</span></h2>
                <p className="text-slate-700  mt-2 text-sm font-medium">Enter your details to create your account</p>
            </div>

            <RoleRadio setRole={setRole} />

            <form className={`flex flex-col gap-5 ${role === "" ? "hidden" : "block"}`}>

                {role === 'student' && (
                    <StudentFormSection sign_up={sign_up} />
                )}

            </form>
            <div className="flex items-center justify-center gap-2 pt-2">
                <p className="text-slate-700 dark:text-[#9db9a8] text-sm font-medium">Already have an account?</p>
                <Link className="cursor-pointer text-sm font-medium text-green-600 hover:text-green-950
                  hover:underline decoration-2 decoration-green-950 underline-offset-4
                  transition-all duration-200" href="/auth/login"
                >
                    Sign In
                </Link>
            </div>
        </React.Fragment>
    )
}