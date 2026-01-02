import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function getUserFromToken() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) return null;

        const { payload } = await jwtVerify(token, secret);

        return {
            user_id: payload.user_id,
            role: payload.role,
        };
    } catch (error) {
        return null;
    }
}
