"use client";
import PinCodeInput from "@/components/pin_code_input";
import {Spinner} from "@/components/ui/spinner";
import {useFormStatus} from "react-dom";
import {useState} from "react";
import {useRouter} from "next/navigation";
import Alert from "@/components/alert";

export default function VerifyPage() {

    const router = useRouter();

    const [code, setCode] = useState("");
    const [error, setError] = useState("");

    const handleAction  = async () => {
        const expiredErr = "Code expired";
        setError("");
        if (!code || code.length < 6) return;

        try {

            const res = await fetch("/api/auth/forgot-password/verify-code", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({ code })
            });

            const data = await res.json();

            if (data.success) {
                router.replace("/forgot-password/reset");
            }else {
                setError(data.error);
                if (data.error === expiredErr) {
                    setTimeout(() => router.replace("/forgot-password"), 500);
                }
            }

        }catch (err) {
            console.error(err.message);
        }
    }

    return (
        <div className="w-full min-h-screen m-0 py-4 flex flex-row justify-center items-center">
            <form
                className="flex flex-col justify-center items-center"
                action={handleAction}
            >
                <h1 className="text-2xl font-bold tracking-tight text-blue-200 mb-2">
                    Verify code
                </h1>
                <PinCodeInput setCode={setCode} />
                <SubmitButton />
                <div className="fixed right-1 bottom-0 m-0 p-0 translate-y-2">
                    {error && <Alert text={error} setState={setError} />}
                </div>
            </form>
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
                Verifying <Spinner />
            </>
        ) : (
            <>
                <span>Verify Code</span>
            </>
        )}
    </button>)
}