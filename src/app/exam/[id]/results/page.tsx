import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { CheckCircle, XCircle, Download, Trophy, Clock, BarChart2 } from "lucide-react";
import { DownloadPDFButton } from "./DownloadPDFButton";

export default async function ResultsPage({ params }: { params: { id: string } }) {
  const { id: examId } = await params;
  const headersList = await headers();
  const userId = headersList.get("x-user-id");

  if (!userId) redirect("/login");

  const attempt = await prisma.attempt.findFirst({
    where: { examId, userId, submitted: true },
    include: {
      exam: {
        include: {
          questions: true
        }
      },
      answers: true
    },
    orderBy: { endTime: "desc" }
  });

  if (!attempt) redirect(`/student`);

  const passed = (attempt.score ?? 0) >= 50;
  const totalQuestions = attempt.exam.questions.length;
  const correctAnswers = attempt.answers.filter(a => a.isCorrect).length;
  const timeTaken = attempt.endTime
    ? Math.floor((new Date(attempt.endTime).getTime() - new Date(attempt.startTime).getTime()) / 1000)
    : 0;
  const timeTakenStr = `${Math.floor(timeTaken / 60)}m ${timeTaken % 60}s`;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Results Hero Card */}
        <div className={`relative overflow-hidden rounded-3xl p-8 shadow-2xl text-white ${passed ? 'bg-gradient-to-br from-green-500 to-emerald-600' : 'bg-gradient-to-br from-red-500 to-rose-700'}`}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-black mb-1">{attempt.exam.title}</h1>
                <p className="text-white/80">Results Summary</p>
              </div>
              <div className={`flex flex-col items-center justify-center w-28 h-28 rounded-full border-4 ${passed ? 'border-white/50 bg-green-700/50' : 'border-white/30 bg-red-700/50'}`}>
                <span className="text-4xl font-black leading-none">{attempt.score}%</span>
                <span className="text-xs uppercase tracking-widest mt-1">Score</span>
              </div>
            </div>

            <div className="mt-8 flex items-center space-x-4">
              <div className={`flex items-center space-x-2 px-6 py-2 rounded-full font-bold text-lg ${passed ? 'bg-white text-green-600' : 'bg-white text-red-600'}`}>
                {passed ? <CheckCircle className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
                <span>{passed ? 'PASSED' : 'FAILED'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-6">
          {[
            { label: "Correct Answers", value: `${correctAnswers} / ${totalQuestions}`, icon: CheckCircle, color: "text-green-500", bg: "bg-green-500/10" },
            { label: "Time Taken", value: timeTakenStr, icon: Clock, color: "text-blue-500", bg: "bg-blue-500/10" },
            { label: "Final Score", value: `${attempt.score}%`, icon: Trophy, color: "text-amber-500", bg: "bg-amber-500/10" },
          ].map((stat, i) => (
            <div key={i} className="glass p-6 rounded-2xl flex items-center space-x-4">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-7 h-7" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <Link
            href="/student"
            className="flex-1 text-center py-3 border-2 border-indigo-500 text-indigo-600 dark:text-indigo-400 rounded-xl font-bold hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
          >
            Back to Dashboard
          </Link>
          <DownloadPDFButton
            examTitle={attempt.exam.title}
            score={attempt.score ?? 0}
            passed={passed}
          />
          <Link
            href="/student/leaderboard"
            className="flex-1 text-center py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors"
          >
            View Leaderboard
          </Link>
        </div>

        {/* Detailed Review */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center space-x-2">
            <BarChart2 className="w-6 h-6 text-indigo-500" />
            <span>Detailed Answer Review</span>
          </h2>
          {attempt.exam.questions.map((question, idx) => {
            const studentAnswer = attempt.answers.find(a => a.questionId === question.id);
            const isCorrect = studentAnswer?.isCorrect;
            return (
              <div key={question.id} className={`glass p-6 rounded-2xl border-l-4 ${isCorrect ? 'border-l-green-500' : 'border-l-red-500'}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-500 mb-1">Q{idx + 1} · {question.type} · {question.points} pt{question.points !== 1 ? 's' : ''}</p>
                    <p className="font-bold text-lg mb-4">{question.text}</p>

                    <div className="space-y-2">
                      <div className="flex items-start space-x-3">
                        <span className="text-xs font-bold uppercase text-gray-500 w-28 shrink-0 pt-0.5">Your Answer</span>
                        <span className={`text-sm font-medium px-3 py-1 rounded-lg ${isCorrect ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                          {studentAnswer?.studentAnswer || <i className="opacity-60">No answer</i>}
                        </span>
                      </div>
                      {!isCorrect && (
                        <div className="flex items-start space-x-3">
                          <span className="text-xs font-bold uppercase text-gray-500 w-28 shrink-0 pt-0.5">Correct Answer</span>
                          <span className="text-sm font-medium px-3 py-1 rounded-lg bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                            {question.correctAnswer}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className={`shrink-0 p-2 rounded-full ${isCorrect ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'}`}>
                    {isCorrect ? <CheckCircle className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
