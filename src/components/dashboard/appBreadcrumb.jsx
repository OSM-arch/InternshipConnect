"use client";

import React from "react";
import {usePathname} from "next/navigation";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList, BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import Link from "next/link";

export function AppBreadcrumb() {

    const pathname = usePathname();
    const segments = pathname.split("/").filter(Boolean);

    const roles = ["student", "company", "supervisor", "school"];

    return (
        <Breadcrumb>
            <BreadcrumbList>
                {
                    segments.map((segment, index) => {
                        const href = "/" + segments.slice(0, index + 1).join("/");
                        const isLast = index === segments.length - 1;

                        if (roles.includes(segment.toLowerCase())) return <React.Fragment key={index}></React.Fragment>

                        return <React.Fragment key={index}>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                {isLast ? (
                                    <BreadcrumbPage>
                                        {
                                            segment.length > 20 ?
                                                decodeURIComponent(segment.slice(0, 20))+"..."
                                                :
                                                decodeURIComponent(segment)
                                        }
                                    </BreadcrumbPage>
                                ) : (
                                    <BreadcrumbLink asChild>
                                        <Link href={href}>
                                            {
                                                segment.length > 20 ?
                                                    decodeURIComponent(segment.slice(0, 20))+"..."
                                                    :
                                                    decodeURIComponent(segment)
                                            }
                                        </Link>
                                    </BreadcrumbLink>
                                )}
                            </BreadcrumbItem>
                        </React.Fragment>
                    })
                }
            </BreadcrumbList>
        </Breadcrumb>
    )
}