"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Play } from "lucide-react";
import { useExamStore } from "@/store/examStore";

export function StartExamButton({ examId, title, hasAttempt }: { examId: string, title: string, hasAttempt: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const resetExam = useExamStore(state => state.resetExam);

  const startExam = async () => {
    setLoading(true);
    try {
      if (!hasAttempt) {
        // Create new attempt
        const res = await fetch("/api/attempts/start", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ examId }),
        });
        if (!res.ok) throw new Error("Failed to start exam");
        resetExam();
      }
      router.push(`/exam/${examId}`);
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={startExam} 
      disabled={loading}
      className="w-full flex justify-center items-center space-x-2 bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-700 hover:to-cyan-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-indigo-500/30 transition-all disabled:opacity-50 hover:scale-[1.02]"
    >
      {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Play className="w-6 h-6 fill-current" />}
      <span>{hasAttempt ? "Resume Exam" : "Start Exam Now"}</span>
    </button>
  );
}
