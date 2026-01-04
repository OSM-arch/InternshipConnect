"use client";
import {useState} from "react";
import {useRouter} from "next/navigation";
import Link from "next/link";
import {ArrowDownToLine} from "lucide-react";

export default function InternshipReportSubmit({report, internship_id}) {

    const router = useRouter();
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleReportSubmit = async (e) => {
        setError("");
        setSuccess("");
        const file = e.target.files[0];
        if (!file) return;

        if (file.type !== "application/pdf") {
            setError("Please upload a PDF file only.");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setError("File size must be less than 5MB.");
            return;
        }

        setUploading(true);

        const formData = new FormData();
        formData.append("report", file);
        formData.append("id", internship_id)

        try{
            const res = await fetch("/api/upload/report", {
                method: "POST",
                body: formData
            });
            const data = await res.json();

            if (data.success) {
                setSuccess("Report uploaded successfully.");
                setTimeout(() => router.refresh(), 500);
            }else {
                setError(data.error);
            }
        }catch(err) {
            console.error(err);
        }finally {
            setUploading(false);
        }
    }

    return (
        <div className="text-blue-500 text-xs text-center mt-2">
            <label htmlFor="internshipReport" className="cursor-pointer hover:underline">
                {uploading ? "Uploading..." : "Upload internship report (PDF)"}
            </label>
            {error && <span className="block ml-2 text-xs text-red-500">{error}</span>}
            {success && <span className="block ml-2 text-xs text-green-500">{success}</span>}
            <input disabled={uploading} onChange={(e) => handleReportSubmit(e)} id="internshipReport" type="file" accept=".pdf" className="hidden"/>

            {report && <Link href={report} target="_blank" download
                             className="w-full flex justify-center items-center text-xs text-gray-400 mt-2 hover:text-blue-500"
            >
                <span>Download report</span> <ArrowDownToLine className="ml-2" size={16} />
            </Link>}
        </div>
    )
}