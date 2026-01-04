"use client";
import {
    PanelRightClose,
    PanelRightOpen,
    LogOut,
    LayoutGrid,
    LayoutDashboard,
    Search,
    BriefcaseBusiness, Bookmark, MessageSquareText,
    User
} from "lucide-react";
import Link from "next/link";
import clsx from "clsx";
import {useState} from "react";
import {useAuth} from "@/context/authContext";
import {Spinner} from "@/components/ui/spinner";
import {useRouter} from "next/navigation";

export default function SideBar() {

    const { role } = useAuth();
    const router = useRouter();

    const [collapsed, setCollapsed] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigation = {
        student: [
            {icon: <Search size={20} />, display: "Search Offers", path: "/dashboard/search-offers"},
            {icon: <BriefcaseBusiness size={20} />, display: "My Applications", path: "/dashboard/my-applications"},
            {icon: <Bookmark size={20} />, display: "Saved Offers", path: "/dashboard/saved-offers"}
        ]
    };

    const handleLogout = async () => {
        try {
            setLoading(true);

            await fetch("/api/auth/logout", {
                method: "GET",
                credentials: "include",
            });

            router.refresh();

        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            setLoading(false);
        }
    };


    return (
        <aside
            className={clsx(
                "min-h-screen border-r border-gray-700 shadow-r shadow-xl shadow-black",
                "transition-all duration-300 ease-in-out text-sm",
                collapsed ? "w-16" : "w-50"
            )}
        >
            {/* Toggle */}
            <button
                onClick={() => setCollapsed(!collapsed)}
                className={`flex flex-row p-3 text-gray-400 hover:text-white 
                ${collapsed ? "justify-self-center" : "justify-self-end"}`}
            >
                {collapsed ? <PanelRightClose size={20} /> : <PanelRightOpen size={20} />}
            </button>

            {/* Navigation */}
            <ul className="mt-6 space-y-2 px-2">
                <li>
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-3 p-2 text-white rounded-lg hover:bg-gray-700"
                    >
                        <LayoutDashboard size={20} />
                        {!collapsed && <span>Dashboard</span>}
                    </Link>
                </li>
            </ul>

            {/* Links */}
            {
                role && navigation[role].map((n, index) => (
                    <ul className="pt-2 space-y-2 px-2" key={index}>
                        <li>
                            <Link
                                href={n.path}
                                className="flex items-center gap-3 p-2 text-white rounded-lg hover:bg-gray-700"
                            >
                                {n.icon}
                                {!collapsed && <span>{n.display}</span>}
                            </Link>
                        </li>
                    </ul>
                ))
            }

            {/* Profile */}
            <ul className="mt-6 space-y-2 px-2 border-t-2 border-gray-700">
                {!collapsed && <li className="pt-2">Settings</li>}
            </ul>
            <ul className="space-y-2 px-2 pt-2">
                <li>
                    <Link
                        href="/dashboard/profile"
                        className="flex items-center gap-3 p-2 text-white rounded-lg hover:bg-gray-700"
                    >
                        <User size={20} />
                        {!collapsed && <span>Profile</span>}
                    </Link>
                </li>
            </ul>

            {/* Bottom */}
            <div className="fixed bottom-4 px-3">
                <button
                    onClick={handleLogout}
                    disabled={loading}
                    className="flex items-center gap-3 p-2 w-full text-white rounded-lg hover:bg-red-700/20">
                    {
                        loading ? <>
                                {!collapsed && <span>Logging out</span>}
                                <Spinner size={20} />
                            </>
                            :
                            <>
                                <LogOut size={20} />
                                {!collapsed && <span>Log Out</span>}
                            </>
                    }
                </button>

                <div className="mt-4 flex items-center gap-3 text-white">
                    <div className="bg-green-500 size-8 rounded-full flex items-center justify-center">
                        <LayoutGrid className="text-green-950" />
                    </div>
                    {!collapsed && <span className="font-semibold">StageConnect</span>}
                </div>
            </div>
        </aside>
    );
}