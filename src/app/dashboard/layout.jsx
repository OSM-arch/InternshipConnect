import SideBar from "@/components/dashboard/sideBar";
import {AppBreadcrumb} from "@/components/dashboard/appBreadcrumb";
import {getUserFromToken} from "@/lib/auth";
import AuthProvider from "@/context/authContext";
import {redirect} from "next/navigation";
import {getProfileForUser} from "@/lib/user";
import {AppProvider} from "@/context/appContext";

export default async function DashboardLayout({ children }) {

    const user = await getUserFromToken();

    if (!user) {
        redirect("auth/login");
    }

    const profile = await getProfileForUser(user);

    return (
        <div
            className="
                grid min-h-screen w-full
                grid-cols-[auto_minmax(0,1fr)]
                transition-all duration-300
            "
        >
            <AuthProvider user={user}>
                <AppProvider data={profile}>
                    <SideBar />

                    <main className="p-6 overflow-x-auto min-w-[450px] transition-all duration-300">
                        <AppBreadcrumb />

                        {children}
                    </main>
                </AppProvider>
            </AuthProvider>
        </div>
    );
}