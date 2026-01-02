import Link from "next/link";
import { MapPin, Clock5, Banknote } from "lucide-react";
import formatExpirationDate from "@/utils/formatExpirationDate";
import {formatCreatedAt} from "@/utils/formatCreatedAt";

export default function OfferCard({ offer }) {

    const {
        offer_id,
        logo_url,
        company_name,
        title,
        status,
        address,
        expiration_date,
        salary,
        required_skills,
        languages,
        created_at
    } = offer;

    return (
        <article className="group bg-gray-800 border border-gray-700 rounded-lg p-5 shadow-sm hover:shadow-md hover:border-blue-500/50 transition-all group flex flex-col h-full">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="size-10 rounded bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                        <img
                            src={
                                logo_url ? logo_url : "/vector.png"
                            }
                            alt="Company logo"
                            className="w-full h-full object-cover opacity-80" />
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-white group-hover:text-blue-500 transition-colors">
                            {company_name}
                        </h3>
                        <p className="text-sm text-gray-500 font-medium">
                            {title}
                        </p>
                    </div>
                </div>
                <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-green-900/30 text-green-400">
                    {status}
                </span>
            </div>
            <div className="space-y-2 mb-6 flex-1">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                    <span>
                        <MapPin size={16} />
                    </span>
                    <span>{address}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <span>
                        <Clock5 size={16} />
                    </span>
                    <span>Expires in {formatExpirationDate(expiration_date)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <span>
                        <Banknote size={16} />
                    </span>
                    <span>
                        {Number(salary) !== 0 ? salary : "Unpaid"}
                    </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <span>Posted {formatCreatedAt(created_at)}</span>
                </div>
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
                {
                    required_skills && required_skills.map((skill, index) => (
                        <span key={index} className="inline-flex items-center px-1 py-0.5 rounded text-xs font-medium bg-blue-500/10 text-blue-500 border border-blue-500/20">
                            {skill}
                        </span>
                    ))
                }
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
                {
                    languages && languages.map((language, index) => (
                        <span key={index} className="inline-flex items-center px-1 py-0.5 rounded text-xs font-medium bg-blue-500/10 text-blue-500 border border-blue-500/20">
                            {language}
                        </span>
                    ))
                }
            </div>

            <Link href={`/dashboard/search-offers/${offer_id}`} className="w-full py-2.5 px-4 bg-blue-500/20 text-white text-center text-sm font-semibold rounded group-hover:bg-blue-500/90 transition-colors">
                View Details
            </Link>

        </article>
    )
}