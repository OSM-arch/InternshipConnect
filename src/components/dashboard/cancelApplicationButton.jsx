"use client";
import {Trash2} from "lucide-react";
import {useState} from "react";
import {Spinner} from "@/components/ui/spinner";
import {useRouter} from "next/navigation";

export default function CancelApplicationButton({application_id, large = false}) {

    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleCancelApp = async () => {
        if (application_id === ".") return;
        setLoading(true);
        try {

            const res = await fetch(`/api/applications/cancel/${application_id}`, {
                method: "DELETE"
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
        <>

            {
                large ?
                    <button
                        disabled={loading}
                        onClick={handleCancelApp}
                        className="inline-flex items-center justify-center rounded-lg p-2 text-slate-400 hover:bg-red-900/20 hover:text-red-400"
                        title="Cancel Application">
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
                    :
                    <button
                        disabled={loading}
                        onClick={handleCancelApp}
                        className="flex w-full items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium shadow-sm transition-colors border-slate-700 bg-slate-800 text-red-400 hover:bg-red-900/20">
                        {
                            loading ?
                                <>
                                    Canceling <Spinner />
                                </>
                                :
                                <span>
                                    <Trash2 size={20} /> Cancel Application
                                </span>
                        }
                    </button>
            }

        </>
    )
}