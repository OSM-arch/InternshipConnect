import {getUserFromToken} from "@/lib/auth";
import {redirect} from "next/navigation";

export default async function SchoolLayout({ children }) {

    const user = await getUserFromToken();

    if (user?.role !== "school") {
        redirect("/dashboard");
    }

    return children
}