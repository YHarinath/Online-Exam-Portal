import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  BookOpen,
  Clock,
  AlertCircle,
  Code2,
  FileText,
  ListChecks,
  Trophy,
  ShieldCheck,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { StartExamButton } from "./StartExamButton";

export default async function ExamStartPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const headersList = await headers();
  const userId = headersList.get("x-user-id");

  if (!userId) redirect("/login");

  const exam = await prisma.exam.findUnique({
    where: { id },
    include: { questions: true },
  });

  if (!exam) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-slate-900">
        <div className="text-center glass p-10 rounded-3xl">
          <AlertCircle className="w-14 h-14 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold">Exam Not Found</h2>
          <Link href="/student" className="mt-4 inline-block text-indigo-500 hover:underline">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const existingAttempt = await prisma.attempt.findFirst({
    where: { examId: id, userId },
  });

  if (existingAttempt?.submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-slate-900 p-4">
        <div className="glass p-10 rounded-3xl max-w-md text-center shadow-2xl">
          <div className="w-20 h-20 rounded-full bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center mx-auto mb-5">
            <AlertCircle className="w-10 h-10 text-amber-500" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Already Completed</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            You have already submitted this exam. Each exam can only be taken once.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href={`/exam/${exam.id}/results`}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold transition-all"
            >
              View Your Results
            </Link>
            <Link
              href="/student"
              className="w-full border-2 border-gray-200 dark:border-white/10 py-3 rounded-xl font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const mcqCount = exam.questions.filter((q) => q.type === "MCQ").length;
  const shortCount = exam.questions.filter((q) => q.type === "SHORT").length;
  const codeCount = exam.questions.filter((q) => q.type === "CODE").length;
  const totalPoints = exam.questions.reduce((s, q) => s + q.points, 0);
  const isResume = !!(existingAttempt && !existingAttempt.submitted);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 dark:from-slate-950 dark:to-indigo-950/30 p-4">
      <div className="w-full max-w-2xl">

        {/* Back link */}
        <Link
          href="/student"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-600 dark:hover:text-cyan-400 mb-6 transition-colors"
        >
          ← Back to Dashboard
        </Link>

        {/* Main card */}
        <div className="glass w-full rounded-3xl overflow-hidden shadow-2xl">

          {/* Gradient top bar */}
          <div className="h-2 bg-gradient-to-r from-indigo-500 via-cyan-400 to-purple-500" />

          <div className="p-8 sm:p-10">
            {/* Exam title */}
            <div className="mb-8">
              {isResume && (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 px-3 py-1 rounded-full mb-3">
                  <Zap className="w-3 h-3" /> In Progress — Resume where you left off
                </span>
              )}
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white leading-tight">
                {exam.title}
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-2">
                Please read the instructions carefully before {isResume ? "resuming" : "starting"}.
              </p>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
              <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-2xl text-center">
                <Clock className="w-6 h-6 text-indigo-500 mx-auto mb-1" />
                <p className="text-lg font-extrabold text-gray-800 dark:text-white">{exam.duration}</p>
                <p className="text-xs text-gray-500">Minutes</p>
              </div>
              <div className="bg-cyan-50 dark:bg-cyan-900/20 p-4 rounded-2xl text-center">
                <BookOpen className="w-6 h-6 text-cyan-500 mx-auto mb-1" />
                <p className="text-lg font-extrabold text-gray-800 dark:text-white">{exam.questions.length}</p>
                <p className="text-xs text-gray-500">Questions</p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-2xl text-center">
                <Trophy className="w-6 h-6 text-purple-500 mx-auto mb-1" />
                <p className="text-lg font-extrabold text-gray-800 dark:text-white">{totalPoints}</p>
                <p className="text-xs text-gray-500">Total Points</p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-2xl text-center">
                <ShieldCheck className="w-6 h-6 text-green-500 mx-auto mb-1" />
                <p className="text-lg font-extrabold text-gray-800 dark:text-white">50%</p>
                <p className="text-xs text-gray-500">Pass Mark</p>
              </div>
            </div>

            {/* Question types */}
            <div className="flex gap-3 flex-wrap mb-8">
              {mcqCount > 0 && (
                <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-xl">
                  <ListChecks className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">{mcqCount} MCQ</span>
                </div>
              )}
              {shortCount > 0 && (
                <div className="flex items-center gap-2 bg-violet-50 dark:bg-violet-900/20 px-4 py-2 rounded-xl">
                  <FileText className="w-4 h-4 text-violet-500" />
                  <span className="text-sm font-semibold text-violet-700 dark:text-violet-300">{shortCount} Short Answer</span>
                </div>
              )}
              {codeCount > 0 && (
                <div className="flex items-center gap-2 bg-rose-50 dark:bg-rose-900/20 px-4 py-2 rounded-xl">
                  <Code2 className="w-4 h-4 text-rose-500" />
                  <span className="text-sm font-semibold text-rose-700 dark:text-rose-300">{codeCount} Coding Challenge</span>
                </div>
              )}
            </div>

            {/* Instructions */}
            <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 rounded-2xl p-5 mb-8">
              <h3 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-500" />
                Important Instructions
              </h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5">•</span>
                  The timer starts immediately once you click the button below.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5">•</span>
                  Do not refresh or close the window — your progress may be lost.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5">•</span>
                  Navigate freely between questions using the Question Palette on the right.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5">•</span>
                  Answers are auto-saved every few seconds.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5">•</span>
                  The exam auto-submits when the timer reaches zero.
                </li>
              </ul>
            </div>

            {/* Start button */}
            <StartExamButton examId={exam.id} title={exam.title} hasAttempt={isResume} />
          </div>
        </div>
      </div>
    </div>
  );
}
