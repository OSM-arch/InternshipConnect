"use client";
import {redirect} from "next/navigation";
import {useAuth} from "@/context/authContext";

export default function StudentLayout({ children }) {

    const { role } = useAuth();

    if (role !== "student") {
        redirect("/dashboard");
    }

    return children
}