import {getUserFromToken} from "@/lib/auth";
import OfferCard from "@/components/dashboard/offers_card";

export default async function SavedJobsPage() {

    const user = await getUserFromToken();
    const {user_id} = user;
    let data = [];
    try {

        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/saved-offers/${user_id}`, {
            cache: "no-store"
        });

        data = await res.json();

    }catch (err) {
        console.error(err.message);
    }

    return (
        <div className="flex-1 flex flex-col w-full overflow-y-auto p-4 md:p-8">
            <div className="w-full flex flex-col gap-6">
                <div className="flex flex-col gap-1">
                    <h1 className="text-white text-3xl font-bold leading-tight tracking-[-0.033em]">
                        Saved Internships Offers
                    </h1>
                    <p className="text-gray-400 text-base font-normal">
                        View your saved offers here.
                    </p>
                </div>
            </div>

            <div className="mt-4">
                {
                    data.data?.length === 0 ? <div className="text-gray-500 text-md">
                        No saved offers.
                    </div> : <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {data.data?.map((item, index) => <OfferCard key={index} offer={item} />)}
                    </div>
                }
            </div>
        </div>
    )
}