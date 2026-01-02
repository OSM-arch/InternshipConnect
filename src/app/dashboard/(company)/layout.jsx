import {getUserFromToken} from "@/lib/auth";
import {redirect} from "next/navigation";

export default async function CompanyLayout({ children }) {

    const user = await getUserFromToken();

    if (user?.role !== "company") {
        redirect("/dashboard");
    }

    return children
}