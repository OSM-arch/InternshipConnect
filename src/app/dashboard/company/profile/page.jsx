"use client";
import {UserCog, Building2, LockKeyhole, Pencil} from "lucide-react";
import {useFormStatus} from "react-dom";
import {Spinner} from "@/components/ui/spinner";
import React, {useEffect, useState} from "react";
import Link from "next/link";
import {useRouter} from "next/navigation";
import uploadImage from "@/lib/dashboard/upload_image";
import updateFirstName from "@/lib/dashboard/update/update_firstname";
import updateLastName from "@/lib/dashboard/update/update_lastname";
import updateCompanyName from "@/lib/dashboard/update/update_company_name";
import updateCompanyAddress from "@/lib/dashboard/update/update_company_address";
import updateCompanyIndustry from "@/lib/dashboard/update/update_company_industry";
import updateCompanyDescription from "@/lib/dashboard/update/update_company_description";
import {useAuth} from "@/context/authContext";
import {getProfileForUser} from "@/lib/dashboard/profile/user";
import Loading from "@/app/dashboard/loading";

const fetchIndustries = async (setData) => {
    try {
        const res = await fetch(`/api/industries`);
        const data = await res.json();
        if (data.success) setData(data.data);
    } catch (err) { console.error(err); }
};

export default function ProfilePage() {

    const router = useRouter();
    const {user_id} = useAuth();
    if (!user_id) {
        router.replace("/dashboard/company");
    }

    /* States */
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({});
    const [industries, setIndustries] = useState([]);
    const [error, setError] = useState("");
    const [preview, setPreview] = useState("");

    /* useEffects */
    useEffect(() => {
        getProfileForUser.company(user_id).then((data) => setData(data.company)).then(() => setLoading(false));
    }, [user_id]);
    useEffect(() => {
        if (industries.length === 0) {
            fetchIndustries(setIndustries);
        }
    }, [industries]);

    /* Handlers */
    const handleImagePreview = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        return setPreview(URL.createObjectURL(file));
    }

    const handleSubmit = async (formData) => {
        setError("");

        const firstname = formData.get("firstname");
        const lastname  = formData.get("lastname");
        const user_img = formData.get("user_img");
        const company_name = formData.get("company_name");
        const address = formData.get("address");
        const industry_id = formData.get("industry");
        const description = formData.get("description");

        // upload image || avatar
        if (user_img && !user_img.type.includes("octet-stream")) {
            const d = await uploadImage(data.user_id, data.role, user_img);
            if (d.success) {
                router.refresh();
            }else {
                console.log(d.error);
            }
        }

        // first name
        if (firstname && firstname !== data.first_name) {
            const d = await updateFirstName(data.user_id, firstname);
            if (d.success) {
                router.refresh();
            }
        }

        // last name
        if (lastname && lastname !== data.second_name) {
            const d = await updateLastName(data.user_id, lastname);
            if (d.success) {
                router.refresh();
            }
        }

        // Company name
        if (company_name && company_name !== data.company_name) {
            const d = await updateCompanyName(data.user_id, company_name);
            if (d.success) {
                router.refresh();
            }
        }

        // address
        if (address && address !== data.address) {
            const d = await updateCompanyAddress(data.user_id, address);
            if (d.success) {
                router.refresh();
            }
        }

        // industry
        if (industry_id && Number(industry_id) !== Number(data.industry_id)) {
            const d = await updateCompanyIndustry(data.user_id, industry_id);
            if (d.success) {
                router.refresh();
            }
        }

        // description
        if (description && description !== data.description) {
            const d = await updateCompanyDescription(data.user_id, description);
            if (d.success) {
                router.refresh();
            }
        }
    }

    return (
        <>
            {loading && <Loading />}
            {!loading &&
                <div className="flex-1 flex flex-col w-full overflow-y-auto p-4 md:p-8">
                    <div className="w-full flex flex-col gap-6">
                        <div className="flex flex-col gap-1">
                            <h1 className="text-white text-3xl font-bold leading-tight tracking-[-0.033em]">
                                My Profile
                            </h1>
                            <p className="text-gray-400 text-base font-normal">
                                Manage your account settings and company details
                            </p>
                        </div>
                        <div className="flex flex-row justify-center w-full">
                            <form action={handleSubmit} className="max-w-4xl flex-1 bg-[#1e2532] rounded-xl shadow-sm border border-gray-700 overflow-hidden">

                                <div className="relative flex flex-col items-center justify-center p-8 border-b border-gray-700 bg-gradient-to-b from-[#1e2532] to-[#171c26]">
                                    <div className="relative group">
                                        <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-28 w-28 ring-4 ring-[#1e2532] shadow-md overflow-hidden">
                                            {
                                                preview ?
                                                    <img src={preview} alt={data?.first_name + data?.second_name + "profile picture"} title={data?.first_name + data?.second_name} />
                                                    :
                                                    <img src={data?.profile_image_url ? data.profile_image_url : "/vector.png"} alt={data?.first_name + data?.second_name + "profile picture"} title={data?.first_name + data?.second_name} />
                                            }
                                        </div>
                                        <label htmlFor="file" className="cursor-pointer absolute bottom-1 right-1 bg-gray-700 text-white rounded-full p-1.5 shadow-sm border-2 border-[#1e2532] flex items-center justify-center hover:bg-gray-800 transition-colors">
                                            <input onChange={e => handleImagePreview(e)}
                                                   type="file"
                                                   id="file"
                                                   name="user_img"
                                                   accept="image/*" className="hidden text-transparent" />
                                            <Pencil size={16} />
                                        </label>
                                    </div>
                                    <h2 className="mt-4 text-xl font-bold text-white">
                                        {data?.first_name + " " + data?.second_name}
                                    </h2>
                                    <span className="text-sm text-gray-400">Company ~{data?.industry_name}~</span>
                                </div>

                                <div className="p-6 md:p-10">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">

                                        <div className="flex flex-col gap-6">
                                            <div className="flex items-center gap-2 border-b border-gray-700 pb-2 mb-2">
                                        <span className="text-gray-400">
                                            <UserCog size={24} />
                                        </span>
                                                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">
                                                    Account Settings
                                                </h3>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <label className="text-sm font-medium text-gray-200" htmlFor="firstName">
                                                    First Name
                                                </label>
                                                <input
                                                    className="w-full rounded-md border border-gray-600 bg-[#1a202c] px-3 py-2.5 text-sm text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-gray-400"
                                                    id="firstName" name="firstname" type="text" defaultValue={data?.first_name} autoComplete="off" />
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <label className="text-sm font-medium text-gray-200" htmlFor="lastName">
                                                    Last Name
                                                </label>
                                                <input
                                                    className="w-full rounded-md border border-gray-600 bg-[#1a202c] px-3 py-2.5 text-sm text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-gray-400"
                                                    id="lastName" name="lastname" type="text" defaultValue={data?.second_name} autoComplete="off" />
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <label className="text-sm font-medium text-gray-200" htmlFor="email">
                                                    Email Address
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        className="w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2.5 text-sm text-gray-400 cursor-not-allowed outline-none pr-10"
                                                        disabled={true} id="email" type="email" value={data?.email} autoComplete="off" />
                                                </div>
                                                <p className="text-xs text-gray-400">Contact administration to update your email.</p>
                                            </div>
                                            <div className="pt-2">
                                                <Link href="/forgot-password" >
                                                    <button
                                                        className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-blue-700 transition-colors"
                                                        type="button">
                                            <span>
                                                <LockKeyhole size={24} />
                                            </span>
                                                        Change Password
                                                    </button>
                                                </Link>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-6">
                                            <div
                                                className="flex items-center gap-2 border-b border-gray-700 pb-2 mb-2">
                                        <span className="text-gray-400">
                                            <Building2 size={24} />
                                        </span>
                                                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">
                                                    Company Info
                                                </h3>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <label className="text-sm font-medium text-gray-200" htmlFor="company_name">
                                                    Company name
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        className="w-full rounded-md border border-gray-600 bg-[#1a202c] px-3 py-2.5 text-sm text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-gray-400"
                                                        id="company_name" name="company_name" type="text" defaultValue={data?.company_name} autoComplete="off"
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <label className="text-sm font-medium text-gray-200" htmlFor="address">
                                                    Address
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        className="w-full rounded-md border border-gray-600 bg-[#1a202c] px-3 py-2.5 text-sm text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-gray-400"
                                                        id="address" name="address" type="text" defaultValue={data?.address} autoComplete="off"
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <label className="text-sm font-medium text-gray-200" htmlFor="industry">
                                                    Company Field
                                                </label>
                                                <div className="relative">
                                                    <select
                                                        id="industry"
                                                        name="industry"
                                                        className="w-full rounded-md border border-gray-600 bg-[#1a202c] px-3 py-2.5 text-sm text-white
                                                focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-gray-400"
                                                        defaultValue={data?.industry_id}
                                                    >
                                                        {
                                                            industries.length > 0 && industries.map((industry) => {
                                                                return <option key={industry.industry_id}
                                                                               value={industry.industry_id}>
                                                                    {industry.industry_name}
                                                                </option>
                                                            })
                                                        }
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <label className="text-sm font-medium text-gray-200" htmlFor="description">
                                                    Company description
                                                </label>
                                                <div className="relative">
                                            <textarea
                                                className="w-full min-h-20 rounded-md border border-gray-600 bg-[#1a202c] px-3 py-2.5 text-sm text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-gray-400"
                                                id="description"
                                                name="description"
                                                defaultValue={data?.description}
                                                maxLength={500}
                                                placeholder="Company description..."
                                                autoComplete="off"
                                            />
                                                </div>
                                            </div>
                                        </div>

                                        <div
                                            className="md:col-span-2 flex justify-end pt-6 border-t border-gray-700 mt-2">
                                            <SubmitButton />
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}

export function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <button
            disabled={pending}
            className="cursor-pointer mt-2 w-full h-11 bg-gradient-to-r from-green-500 to-blue-400
            text-blue-200 text-sm font-semibold rounded-lg shadow-sm transition-all flex items-center
            justify-center gap-2 group active:scale-[0.98]"
        >
            {pending ? (
                <>
                    Saving <Spinner />
                </>
            ) : (
                <>
                    <span>Save Changes</span>
                </>
            )}
        </button>
    );
}