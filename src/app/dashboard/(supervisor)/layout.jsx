import {getUserFromToken} from "@/lib/auth";
import {redirect} from "next/navigation";

export default async function SupervisorLayout({ children }) {

    const user = await getUserFromToken();

    if (user?.role !== "supervisor") {
        redirect("/dashboard");
    }

    return children
}