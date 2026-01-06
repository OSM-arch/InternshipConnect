"use client";
import {Trash2} from "lucide-react";
import {useState} from "react";
import {Spinner} from "@/components/ui/spinner";
import {useRouter} from "next/navigation";

export default function CancelInternshipButton({internship_id}) {

    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleCancelApp = async () => {
        if (internship_id === ".") return;
        setLoading(true);
        try {

            const res = await fetch(`/api/internships/cancel/${internship_id}`, {
                method: "POST"
            });

            const data = await res.json();

            if (data.success) {
                setTimeout(() => router.refresh(), 500);
            }

        }catch (err) {
            console.error(err.message);
        }finally {
            setLoading(false);
        }
    }

    return (
        <button
            disabled={loading}
            onClick={handleCancelApp}
            className="inline-flex items-center justify-center rounded-lg p-2 text-slate-400 hover:bg-red-900/20 hover:text-red-400"
            title="Cancel Internship">
            {
                loading ?
                    <>
                        Canceling <Spinner />
                    </>
                    :
                    <span>
                        <span>
                            <Trash2 size={20} />
                        </span>
                    </span>
            }
        </button>
    )
}