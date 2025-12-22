import {NextResponse} from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req) {
    const token = req.cookies.get('token');

    if (!token && req.nextUrl.pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/auth/login', req.url));
    }

    try {
        jwt.verify(token.value, process.env.JWT_SECRET);
        return NextResponse.next();
    } catch (err) {
        return NextResponse.redirect(new URL('/auth/login', req.url));
    }
}

export const config = {
    matcher: ['/dashboard/:path*'],
};