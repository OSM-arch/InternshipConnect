import { redirect } from 'next/navigation';
import jwt from 'jsonwebtoken';
import {cookies} from "next/headers";

export default async function DashboardPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token');

    if (!token) redirect('/auth/login');

    let user;
    try {
        user = jwt.verify(token.value, process.env.JWT_SECRET);
    } catch (err) {
        redirect('/auth/login');
    }

    return (
        <div>
            <h1>Welcome, {user.email}</h1>
        </div>
    );
}