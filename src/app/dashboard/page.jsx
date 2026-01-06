"use client";
import {useAuth} from "@/context/authContext";
import {Spinner} from "@/components/ui/spinner";
import {useRouter} from "next/navigation";

export default function DashboardPage() {

    const {role} = useAuth();
    const router = useRouter();

    if (role) {
        setTimeout(() => router.replace(`/dashboard/${role}`), 500);
    }

    return (<div className="fixed inset-0 z-50 min-h-screen flex flex-row justify-center items-center bg-zinc-900">
        <div className="flex flex-col justify-between items-center">
            <Spinner size={20} />
            <span className="text-lg font-medium text-gray-500">Loading</span>
        </div>
    </div>)
}