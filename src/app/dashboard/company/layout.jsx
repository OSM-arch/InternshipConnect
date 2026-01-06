"use client";
import {redirect} from "next/navigation";
import {useAuth} from "@/context/authContext";

export default function CompanyLayout({ children }) {

    const { role } = useAuth();

    if (role !== "company") {
        redirect("/dashboard");
    }

    return children
}