import ConfirmEmail from "@/app/(services)/email/verify/confirm_email";

export default async function EmailVerifyPage({ params }) {

    const {email} = await params;
    const p_email = decodeURIComponent(email);

    return (
        <div className="min-h-screen w-full bg-slate-950 text-white/80">
            <ConfirmEmail email={p_email} />
        </div>
    )
}