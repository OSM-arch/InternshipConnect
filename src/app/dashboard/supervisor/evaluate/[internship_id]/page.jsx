"use client";

import {
    BookText,
    Star,
    Users,
    MessageSquareQuote,
    Lock,
    UserCog,
    Send
} from "lucide-react";
import {useState} from "react";
import {useParams, useRouter} from "next/navigation";
import {Spinner} from "@/components/ui/spinner";

const average = (obj) => Object.values(obj).reduce((a, b) => a + b, 0) / Object.values(obj).length;

export default function SupervisorPage() {

    const {internship_id} = useParams();
    const router = useRouter();

    /* ===================== STATE ===================== */

    const [technical, setTechnical] = useState({
        execution: 0,
        tools: 0,
        problemSolving: 0
    });

    const [softSkills, setSoftSkills] = useState({
        communication: 0,
        punctuality: 0,
        autonomy: 0,
        integration: 0
    });

    const [comments, setComments] = useState("");

    const [grade, setGrade] = useState(0);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    /* ===================== HELPERS ===================== */

    const handleStarClick = (category, value) => {
        setTechnical(prev => ({ ...prev, [category]: value }));
    };

    const handleSoftSkill = (skill, value) => {
        setSoftSkills(prev => ({ ...prev, [skill]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!internship_id) return;
        if (grade < 0 || grade > 20) return;

        setLoading(true);
        const technical_score = Number(average(technical).toFixed(2));
        const soft_skills_score = Number(average(softSkills).toFixed(2));

        const payload = {
            internship_id,
            technical_score,
            soft_skills_score,
            final_grade: Number(grade),
            feedback: comments || null
        };

        try {
            const res = await fetch("/api/evaluations", {
                method: "POST",
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (!data.success) {
                throw new Error(data.error || "Failed to submit evaluation");
            }

            setSubmitted(true);
            setTimeout(() => router.replace("/dashboard/supervisor"), 1000);
        } catch (err) {
            console.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    /* ===================== UI ===================== */

    return (
        <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-10">
            <div className="mb-10">
                <div className="flex items-center gap-2 text-blue-500 font-semibold text-xs mb-2 uppercase tracking-wider">
                    <BookText size={16} />
                    Evaluation Process
                </div>
                <h1 className="text-3xl font-black text-white tracking-tight mb-2">
                    Internship Evaluation Form
                </h1>
            </div>

            <form className="space-y-8" onSubmit={handleSubmit}>

                {/* ================= Technical Skills ================= */}
                <section className="border border-slate-800 rounded-xl shadow-sm overflow-hidden">
                    <div className="px-6 py-5 border-b border-slate-800 flex items-center gap-3 bg-slate-900/50">
                        <UserCog size={20} className="text-blue-500" />
                        <h2 className="text-xl font-bold text-white">Technical Skills</h2>
                    </div>

                    <div className="p-6 space-y-8">
                        {[
                            ["execution", "Task Execution & Accuracy"],
                            ["tools", "Tool & Software Mastery"],
                            ["problemSolving", "Problem Solving Proficiency"]
                        ].map(([key, label]) => (
                            <div key={key} className="flex justify-between items-center gap-4">
                                <h3 className="text-white font-semibold">{label}</h3>
                                <div className="flex gap-1">
                                    {[1,2,3,4,5].map(i => (
                                        <button
                                            key={i}
                                            type="button"
                                            onClick={() => handleStarClick(key, i)}
                                            className={i <= technical[key] ? "text-blue-500" : "text-slate-700"}
                                        >
                                            <Star />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ================= Soft Skills ================= */}
                <section className="border border-slate-800 rounded-xl shadow-sm overflow-hidden">
                    <div className="px-6 py-5 border-b border-slate-800 flex items-center gap-3 bg-slate-900/50">
                        <Users size={20} className="text-blue-500" />
                        <h2 className="text-xl font-bold text-white">Soft Skills & Professionalism</h2>
                    </div>

                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                        {Object.keys(softSkills).map(skill => (
                            <div key={skill} className="space-y-2">
                                <div className="flex justify-between text-sm text-slate-300 uppercase">
                                    <span>{skill.replace(/([A-Z])/g, " $1")}</span>
                                    <span className="text-blue-500">{softSkills[skill]}/5</span>
                                </div>
                                <div className="flex gap-2">
                                    {[1,2,3,4,5].map(i => (
                                        <button
                                            key={i}
                                            type="button"
                                            onClick={() => handleSoftSkill(skill, i)}
                                            className={`flex-1 h-2 rounded-full ${
                                                i <= softSkills[skill] ? "bg-blue-500" : "bg-slate-800"
                                            }`}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ================= Comments ================= */}
                <section className="border border-slate-800 rounded-xl shadow-sm overflow-hidden">
                    <div className="px-6 py-5 border-b border-slate-800 flex items-center gap-3 bg-slate-900/50">
                        <MessageSquareQuote size={20} className="text-blue-500" />
                        <h2 className="text-xl font-bold text-white">Qualitative Observations</h2>
                    </div>
                    <div className="p-6">
                        <textarea
                            rows="6"
                            defaultValue={comments}
                            onChange={e => setComments(e.target.value)}
                            placeholder="Provide a summary of the student's strengths and areas for development during the internship period..."
                            className="w-full border-slate-800 rounded-lg text-white outline-none"
                        />
                    </div>
                </section>

                {/* ================= Final Grade ================= */}
                <section className="border border-blue-500/20 rounded-xl shadow-lg overflow-hidden text-white">
                    <div className="p-8 flex justify-between items-center gap-8">
                        <div>
                            <h2 className="text-xl font-bold">Final Assessment</h2>
                            <p className="text-xs text-slate-400">Cumulative evaluation</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <input
                                type="number"
                                step="0.5"
                                min="0"
                                max="20"
                                value={grade}
                                onChange={e => setGrade(Number(e.target.value))}
                                className="w-20 bg-slate-900 border-slate-800 rounded-lg text-xl text-center"
                            />
                            <div className="text-xl">/20</div>
                            <button
                                type="submit"
                                disabled={loading || submitted}
                                className="px-6 py-3 bg-blue-500 rounded-lg font-bold flex gap-2 items-center"
                            >
                                {loading && <Spinner />}
                                {submitted ? "Submitted" : "Submit"}
                                <Send size={18} />
                            </button>
                        </div>
                    </div>
                </section>

                <div className="flex justify-center text-xs text-slate-500 gap-2">
                    <Lock size={14} />
                    Once submitted, this evaluation is final.
                </div>
            </form>
        </div>
    );
}