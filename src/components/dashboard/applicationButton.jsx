"use client";
import {Send} from "lucide-react";
import {useState} from "react";
import {Spinner} from "@/components/ui/spinner";

export default function ApplicationButton({user, offer_id}) {

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setIsLoading] = useState(false);

    const handleApplication = async () => {
        setIsLoading(true);
        setError("");
        setSuccess("");
        try {

            const res = await fetch("/api/applications", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({user_id: user.user_id, offer_id: offer_id})
            });

            const data = await res.json();

            if (data.success) {
                setSuccess("Application sent successfully");
            }else {
                setError(data.error);
            }

        }catch (err) {
            console.error(err.message);
        }finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            <button
                disabled={loading}
                onClick={handleApplication}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-lg transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 active:scale-[0.98]">
                {
                    loading ?
                        <>
                            Applying <Spinner />
                        </>
                        :
                        <>
                        <span>
                            <Send size={20} />
                        </span>
                            Apply Now
                        </>
                }
            </button>
            {error && <p className="text-xs p-0 m-0 translate-y-[-8px] ml-5 text-red-500">{error}</p>}
            {success && <p className="text-xs translate-y-[-8px] ml-5 text-green-500">{success}</p>}
        </>
    )
}