"use client";
import {Bookmark} from "lucide-react";
import {useState} from "react";
import {Spinner} from "@/components/ui/spinner";

export default function SaveOfferButton({user, offer_id, large = false}) {

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setIsLoading] = useState(false);

    const handleSaveOffer = async () => {
        setIsLoading(true);
        setError("");
        setSuccess("");
        try {

            const res = await fetch("/api/offers/save", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({user_id: user.user_id, offer_id: offer_id})
            });

            const data = await res.json();

            if (data.success) {
                setSuccess("Offer saved successfully");
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
            {
                large ?
                    <button
                        disabled={loading}
                        onClick={handleSaveOffer}
                        className="group w-full hover:bg-slate-800 text-slate-300 font-medium py-2 rounded-lg border border-gray-500 transition-all flex items-center justify-center gap-2">
                        {
                            loading ?
                                <>
                                    Saving <Spinner />
                                </>
                                :
                                <>
                                    <span>
                                        <Bookmark className="group-hover:fill-slate-300" size={20} />
                                    </span>
                                    Save Offer
                                </>
                        }
                    </button>
                    :
                    <button
                        disabled={loading}
                        onClick={handleSaveOffer}
                        className="bg-slate-800 text-slate-300 hover:bg-slate-700 p-2.5 rounded-lg border border-gray-800 transition-all">
                        {
                            loading ?
                                <>
                                    Saving <Spinner />
                                </>
                                :
                                <span>
                                    <Bookmark className="hover:fill-slate-300" size={16} />
                                </span>
                        }
                    </button>
            }
            {error && <p className="text-xs p-0 m-0 translate-y-[-8px] ml-5 text-red-500">{error}</p>}
            {success && <p className="text-xs translate-y-[-8px] ml-5 text-green-500">{success}</p>}
        </>
    )
}