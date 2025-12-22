"use client";
import {useState} from "react";
import PinCodeInput from "@/components/pin_code_input";
import {Button} from "@/components/ui/button";

export default function ConfirmEmail({ email }) {

    const [message, setMessage] = useState("");
    const [codeSent, setCodeSent] = useState(false);

    const sendCode = async () => {
        try {
            const res = await fetch("/api/auth/email/send", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();
            console.log(data);
        } catch (err) {
            console.error(err);
        }
    };

    const verifyCode = () => {}

    return (
        <div className="pt-10">
            <div className="flex flex-col gap-4 items-center">
                <h2 className="text-2xl font-bold">Verify your email</h2>
                <p>Click the button to receive a verification code at <b>{email}</b></p>
                {!codeSent && (
                    <Button variant="outline" onClick={sendCode}>
                        Send Code
                    </Button>
                )}

                {codeSent && (
                    <>
                        <PinCodeInput />
                        <button onClick={verifyCode} className="">
                            Verify Code
                        </button>
                    </>
                )}

                {message && <p className="text-red-700">{message}</p>}
            </div>
        </div>
    )
}