"use client";
import {UserCog, GraduationCap, LockKeyhole, Link2, Pencil, ArrowDownToLine} from "lucide-react";
import {useFormStatus} from "react-dom";
import {Spinner} from "@/components/ui/spinner";
import React, {useState} from "react";
import {useApp} from "@/context/appContext";
import Link from "next/link";
import {useRouter} from "next/navigation";
import uploadImage from "@/lib/dashboard/upload_image";
import uploadCV from "@/lib/dashboard/upload_cv";
import updateFirstName from "@/lib/dashboard/update/update_firstname";
import updateLastName from "@/lib/dashboard/update/update_lastname";

export default function ProfilePage() {

    const data = useApp();
    const router = useRouter();

    /* States */
    const [error, setError] = useState("");
    const [preview, setPreview] = useState("");

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
        const cv = formData.get("cv");

        // upload image || avatar
        if (user_img && !user_img.type.includes("octet-stream")) {
            const d = await uploadImage(data.user_id, data.role, user_img);
            if (d.success) {
                router.refresh();
            }else {
                console.log(d.error);
            }
        }

        // upload cv
        if (cv && !cv.type.includes("octet-stream")) {
            const d = await uploadCV(data.user_id, data.role, cv);
            if (d.success) {
                router.refresh();
            }else {
                setError(d.error);
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
    }

    return (
        <div className="flex-1 flex flex-col w-full overflow-y-auto p-4 md:p-8">
            <div className="w-full flex flex-col gap-6">
                {/* !--Page Heading -- */}
                <div className="flex flex-col gap-1">
                    <h1 className="text-white text-3xl font-bold leading-tight tracking-[-0.033em]">
                        My Profile
                    </h1>
                    <p className="text-gray-400 text-base font-normal">
                        Manage your account settings and academic details
                    </p>
                </div>
                {/* !--Profile Card -- */}
                <div className="flex flex-row justify-center w-full">
                    <form action={handleSubmit} className="max-w-4xl flex-1 bg-[#1e2532] rounded-xl shadow-sm border border-gray-700 overflow-hidden">

                        {/* !--Header Section with Photo -- */}
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
                            <span className="text-sm text-gray-400">Student</span>
                        </div>

                        {/* !--Two - Column Form -- */}
                        <div className="p-6 md:p-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">

                                {/* !--Left Column: Account Settings -- */}
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

                                {/* !--Right Column: Academic Info -- */}
                                <div className="flex flex-col gap-6">
                                    <div
                                        className="flex items-center gap-2 border-b border-gray-700 pb-2 mb-2">
                                        <span className="text-gray-400">
                                            <GraduationCap size={24} />
                                        </span>
                                        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">
                                            Academic Info
                                        </h3>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-medium text-gray-200" htmlFor="school">
                                            School / University
                                        </label>
                                        <div className="relative">
                                            <input
                                                className="w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2.5 text-sm text-gray-400 cursor-not-allowed outline-none pr-10"
                                                disabled={true} id="school" type="text" value={data?.school_name} autoComplete="off"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-medium text-gray-200"
                                               htmlFor="group">
                                            Student Group / Class
                                        </label>
                                        <div className="relative">
                                            <input
                                                className="w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2.5 text-sm text-gray-400 cursor-not-allowed outline-none pr-10"
                                                disabled={true} id="group" type="text" value={data?.group_name || "No group yet"} autoComplete="off" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-medium text-gray-200" htmlFor="cv">
                                            CV
                                        </label>
                                        <div className="relative">
                                            <input
                                                className="w-full rounded-md border border-gray-600 bg-[#1a202c] pl-10 pr-3 py-2.5 text-sm text-gray-400 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                                id="cv" name="cv" type="file" accept="application/pdf" />
                                            <span className="absolute left-3 top-3.5 text-gray-400">
                                                <Link2 size={16} />
                                            </span>
                                            {
                                                data.cv_url && <span className="absolute right-3 top-3.5 text-gray-400 cursor-pointer hover:text-blue-700">
                                                <Link href={data.cv_url} target="_blank" download>
                                                    <ArrowDownToLine size={16} />
                                                </Link>
                                            </span>
                                            }
                                        </div>
                                        <p className="text-xs text-gray-500">
                                            Add your personal cv
                                            {error && <span className="text-red-700"> ( {error} )</span>}
                                        </p>
                                    </div>
                                </div>

                                {/* !--Footer Actions -- */}
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