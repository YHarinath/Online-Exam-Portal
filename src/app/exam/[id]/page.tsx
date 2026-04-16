"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useExamStore } from "@/store/examStore";
import { Timer } from "@/components/exam/Timer";
import { QuestionPalette } from "@/components/exam/QuestionPalette";
import { CodeEditor } from "@/components/exam/CodeEditor";
import { executeCode } from "@/lib/piston";
import { Loader2, ChevronLeft, ChevronRight, Send, AlertCircle } from "lucide-react";

export default function ExamPage() {
  const { id } = useParams();
  const router = useRouter();
  const { 
    answers, 
    setAnswer, 
    flagged, 
    toggleFlag, 
    currentQuestionIndex, 
    setCurrentQuestionIndex,
    resetExam 
  } = useExamStore();

  const [exam, setExam] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchExam() {
      try {
        const res = await fetch(`/api/exams/${id}`);
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setExam(data.exam);
      } catch (error) {
        console.error("Failed to fetch exam:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchExam();
  }, [id]);

  const currentQuestion = exam?.questions[currentQuestionIndex];

  const handleSaveAnswer = useCallback(async (ans: string) => {
    if (!currentQuestion) return;
    setAnswer(currentQuestion.id, ans);
    
    // Auto-save to server
    try {
      await fetch(`/api/attempts/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          examId: id, 
          questionId: currentQuestion.id, 
          answer: ans 
        }),
      });
    } catch (e) {
      console.error("Auto-save failed", e);
    }
  }, [currentQuestion, id, setAnswer]);

  const handleSubmitExam = useCallback(async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/attempts/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ examId: id, answers }),
      });
      const data = await res.json();
      resetExam();
      router.push(`/exam/${id}/results`);
    } catch (error) {
      console.error("Submission failed", error);
      setSubmitting(false);
    }
  }, [id, answers, router, resetExam, submitting]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <h1 className="text-2xl font-bold">Exam not found</h1>
        <button onClick={() => router.push("/student")} className="bg-indigo-600 text-white px-4 py-2 rounded-lg">Return to Dashboard</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-slate-950 overflow-hidden font-sans">
      {/* Top Navbar */}
      <header className="h-16 glass border-b flex items-center justify-between px-6 shrink-0 z-50">
        <div className="flex items-center space-x-4">
          <div className="bg-indigo-600 p-2 rounded-lg text-white">
            <Send className="w-5 h-5 -rotate-45" />
          </div>
          <h1 className="font-bold text-lg truncate max-w-[200px] md:max-w-md">{exam.title}</h1>
        </div>
        
        <div className="flex items-center space-x-6">
          <Timer initialTime={exam.duration * 60} onTimeUp={handleSubmitExam} />
          <button 
            onClick={handleSubmitExam}
            disabled={submitting}
            className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white px-6 py-2 rounded-xl font-bold shadow-lg shadow-green-500/20 transition-all disabled:opacity-50"
          >
            {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            <span>Submit Exam</span>
          </button>
        </div>
      </header>

      {/* Main Area Split Screen */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel: Question Details */}
        <div className="w-1/2 flex flex-col border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-900 overflow-y-auto p-8">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-full text-sm font-bold">
                Question {currentQuestionIndex + 1} of {exam.questions.length}
              </span>
              <button 
                onClick={() => toggleFlag(currentQuestion.id)}
                className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium transition-colors ${flagged.includes(currentQuestion.id) ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30' : 'bg-gray-100 text-gray-600 dark:bg-gray-800'}`}
              >
                <AlertCircle className="w-4 h-4" />
                <span>{flagged.includes(currentQuestion.id) ? 'Flagged' : 'Flag for review'}</span>
              </button>
            </div>

            <h2 className="text-2xl font-bold leading-tight">{currentQuestion.text}</h2>

            {currentQuestion.type === "MCQ" && (
              <div className="space-y-4 pt-4">
                {JSON.parse(currentQuestion.options).map((option: string, idx: number) => (
                  <label 
                    key={idx} 
                    className={`flex items-center p-4 rounded-2xl border-2 cursor-pointer transition-all ${answers[currentQuestion.id] === option ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/10 shadow-md' : 'border-gray-100 dark:border-gray-800 hover:border-indigo-200 dark:hover:border-indigo-900/50'}`}
                  >
                    <input 
                      type="radio" 
                      name="mcq" 
                      className="hidden" 
                      checked={answers[currentQuestion.id] === option}
                      onChange={() => handleSaveAnswer(option)}
                    />
                    <div className={`w-5 h-5 rounded-full border-2 mr-4 flex-shrink-0 flex items-center justify-center ${answers[currentQuestion.id] === option ? 'border-indigo-500 bg-indigo-500' : 'border-gray-300'}`}>
                      {answers[currentQuestion.id] === option && <div className="w-2 h-2 bg-white rounded-full"></div>}
                    </div>
                    <span className="text-lg font-medium">{option}</span>
                  </label>
                ))}
              </div>
            )}

            {currentQuestion.type === "SHORT" && (
              <div className="pt-4">
                <textarea 
                  className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-black/20 border-2 border-gray-100 dark:border-gray-800 focus:border-indigo-500 outline-none min-h-[150px] transition-all"
                  placeholder="Type your answer here..."
                  value={answers[currentQuestion.id] || ""}
                  onChange={(e) => handleSaveAnswer(e.target.value)}
                />
              </div>
            )}

            {currentQuestion.type === "CODE" && (
              <div className="bg-indigo-50 dark:bg-indigo-900/10 p-4 rounded-2xl border border-indigo-100 dark:border-indigo-900/30">
                <h4 className="font-bold text-indigo-600 dark:text-indigo-400 mb-2">Instructions</h4>
                <p className="text-sm">Implement the solution in the editor on the right. You can run your code against the provided test cases.</p>
              </div>
            )}
          </div>
          
          <div className="mt-auto pt-8 flex items-center justify-between border-t border-gray-100 dark:border-gray-800">
            <button 
              disabled={currentQuestionIndex === 0}
              onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
              className="flex items-center space-x-2 text-gray-500 hover:text-indigo-600 disabled:opacity-30 font-bold transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Previous</span>
            </button>
            <button 
              disabled={currentQuestionIndex === exam.questions.length - 1}
              onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
              className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 disabled:opacity-30 font-bold transition-colors"
            >
              <span>Next Question</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Right Panel: Navigator & Code Editor */}
        <div className="w-1/2 flex flex-col bg-gray-100 dark:bg-slate-950 p-4 space-y-4 overflow-hidden">
          {currentQuestion.type === "CODE" ? (
            <div className="flex-1 overflow-hidden flex flex-col">
               <CodeEditor 
                 language="python" 
                 code={answers[currentQuestion.id] || ""} 
                 onChange={(val) => handleSaveAnswer(val)}
                 onRunTestCases={async (code) => {
                   return executeCode("python", code);
                 }}
               />
            </div>
          ) : (
            <div className="flex-1 glass rounded-3xl p-12 flex flex-col items-center justify-center text-center">
               <div className="bg-indigo-500/10 p-6 rounded-full mb-6">
                 <AlertCircle className="w-12 h-12 text-indigo-500" />
               </div>
               <h3 className="text-xl font-bold mb-2">Conceptual Question</h3>
               <p className="text-gray-500 max-w-sm">No code editor is required for this type of question. Please provide your answer in the left panel.</p>
            </div>
          )}

          <div className="h-64 shrink-0">
            <QuestionPalette 
              currentIndex={currentQuestionIndex}
              questionsCount={exam.questions.length}
              answers={answers}
              flagged={flagged}
              questionIds={exam.questions.map((q: any) => q.id)}
              onSelect={(idx) => setCurrentQuestionIndex(idx)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
