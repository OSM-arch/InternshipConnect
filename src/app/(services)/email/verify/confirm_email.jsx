"use client";
import {useState} from "react";
import PinCodeInput from "@/components/pin_code_input";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";

export default function ConfirmEmail({ email }) {

    const router = useRouter();
    const [message, setMessage] = useState("");
    const [success, setSuccess] = useState("");
    const [codeSent, setCodeSent] = useState(false);

    const sendCode = async () => {
        try {
            const res = await fetch("/api/auth/email/send", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();
            if (data.success) {
                setCodeSent(true);
            }else {
                setMessage("We couldn't send you the code.");
            }
        } catch (err) {
            console.error(err);
        }
    };

    const verifyCode = async () => {
        let code = "";
        const inputs = document.querySelectorAll("input[type='text']");
        inputs.forEach(input => {
            if (input.value) {
                code += input.value;
            }
        });

        if (code.length < 6) return;

        try {
            const res = await fetch("/api/auth/email/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code, email }),
            });

            const data = await res.json();
            if (data.success) {
                setSuccess("Email Verified Successfully...");
                setTimeout(() => router.replace("/auth/login"), 2000);
            }else {
                setMessage(data.error);
                if (data.error === "Code expired") {
                    setTimeout(() => {setCodeSent(false)}, 2000);
                }
            }
        }catch (err) {
            console.error(err);
        }
    }

    return (
        <div className="pt-10">
            <div className="flex flex-col gap-4 items-center">
                <h2 className="text-2xl font-bold">Verify your email</h2>
                {!codeSent && (
                    <>
                        <p>Click the button to receive a verification code at <b>{email}</b></p>
                        <Button size="lg"
                                className="border border-white/80 text-foreground bg-background shadow-xs hover:bg-green-800 hover:border-green-800 hover:shadow-md hover:shadow-green-500"
                                onClick={sendCode}>
                            Send Code
                        </Button>
                    </>
                )}

                {codeSent && (
                    <>
                        <PinCodeInput />
                        <Button size="lg"
                                onClick={verifyCode}
                                className="border border-white/80 text-foreground bg-background shadow-xs hover:bg-green-800 hover:border-green-800 hover:shadow-md hover:shadow-green-500">
                            Verify Code
                        </Button>
                    </>
                )}

                {success && <p className="text-green-700">{success}</p>}
                {message && <p className="text-red-700">{message}</p>}
            </div>
        </div>
    )
}