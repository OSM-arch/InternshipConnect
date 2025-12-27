import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(req) {

    const token = await req.cookies.get("token")?.value;
    const { pathname } = req.nextUrl;

    const isAuthPage =
        pathname.startsWith("/auth/login") ||
        pathname.startsWith("/auth/signup");

    const isDashboardPage = pathname.startsWith("/dashboard");

    if (!token && isDashboardPage) {
        return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    if (token && isAuthPage) {
        try {
            await jwtVerify(token, secret);
            return NextResponse.redirect(new URL("/dashboard", req.url));
        } catch {
            return NextResponse.next();
        }
    }

    if (token && isDashboardPage) {
        try {
            await jwtVerify(token, secret);
            return NextResponse.next();
        } catch {
            return NextResponse.redirect(new URL("/auth/login", req.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/auth/:path*"],
};
