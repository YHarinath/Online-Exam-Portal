import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  BookOpen,
  Trophy,
  Code2,
  Database,
  Globe,
  Cpu,
  FlaskConical,
  FileSearch,
  TrendingUp,
  Star,
} from "lucide-react";

const examMeta: Record<
  string,
  { icon: React.ElementType; color: string; bg: string; gradient: string }
> = {
  "Python Fundamentals": {
    icon: Code2,
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
    gradient: "from-yellow-400/20 to-yellow-600/5",
  },
  "Java OOP Concepts": {
    icon: Cpu,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
    gradient: "from-orange-400/20 to-orange-600/5",
  },
  "Data Structures & Algorithms": {
    icon: FlaskConical,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    gradient: "from-purple-400/20 to-purple-600/5",
  },
  "Web Development Basics": {
    icon: Globe,
    color: "text-cyan-500",
    bg: "bg-cyan-500/10",
    gradient: "from-cyan-400/20 to-cyan-600/5",
  },
  "SQL & Databases": {
    icon: Database,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    gradient: "from-emerald-400/20 to-emerald-600/5",
  },
};

function scoreColor(score: number) {
  if (score >= 80) return "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30";
  if (score >= 50) return "text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30";
  return "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30";
}

function gradeLabel(score: number) {
  if (score >= 90) return { label: "Excellent", cls: "text-green-600 dark:text-green-400" };
  if (score >= 75) return { label: "Good", cls: "text-blue-600 dark:text-blue-400" };
  if (score >= 50) return { label: "Pass", cls: "text-amber-600 dark:text-amber-400" };
  return { label: "Fail", cls: "text-red-600 dark:text-red-400" };
}

function timeDiff(start: Date, end: Date | null) {
  if (!end) return "—";
  const mins = Math.floor((end.getTime() - start.getTime()) / 60000);
  return `${mins} min`;
}

export default async function StudentExamsPage() {
  const headersList = await headers();
  const userId = headersList.get("x-user-id");

  // Only submitted (completed) attempts
  const completedAttempts = await prisma.attempt.findMany({
    where: { userId: userId!, submitted: true },
    include: { exam: { include: { questions: true } } },
    orderBy: { endTime: "desc" },
  });

  const avgScore =
    completedAttempts.length > 0
      ? Math.round(
          completedAttempts.reduce((s, a) => s + (a.score ?? 0), 0) /
            completedAttempts.length
        )
      : null;

  const bestScore =
    completedAttempts.length > 0
      ? Math.max(...completedAttempts.map((a) => a.score ?? 0))
      : null;

  return (
    <>
      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-cyan-500">
            Exams Taken
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Your completed exam history and scores.
          </p>
        </div>

        <Link
          href="/student"
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-indigo-500/25 transition-all shrink-0 text-sm"
        >
          <BookOpen className="w-4 h-4" />
          Browse Upcoming Exams
        </Link>
      </div>

      {/* ── Summary Stats ───────────────────────────────────────────── */}
      {completedAttempts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="glass p-5 rounded-2xl flex items-center gap-4">
            <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-500">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Exams Completed</p>
              <p className="text-2xl font-extrabold text-gray-800 dark:text-white">{completedAttempts.length}</p>
            </div>
          </div>
          <div className="glass p-5 rounded-2xl flex items-center gap-4">
            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Average Score</p>
              <p className="text-2xl font-extrabold text-gray-800 dark:text-white">
                {avgScore !== null ? `${avgScore}%` : "—"}
              </p>
            </div>
          </div>
          <div className="glass p-5 rounded-2xl flex items-center gap-4">
            <div className="p-3 rounded-xl bg-yellow-500/10 text-yellow-500">
              <Star className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Best Score</p>
              <p className="text-2xl font-extrabold text-gray-800 dark:text-white">
                {bestScore !== null ? `${bestScore}%` : "—"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── Completed Exams Grid ─────────────────────────────────────── */}
      {completedAttempts.length === 0 ? (
        <div className="glass rounded-3xl p-16 text-center border-2 border-dashed border-indigo-200 dark:border-indigo-800">
          <FileSearch className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-600 dark:text-gray-300 mb-2">
            No completed exams yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
            Go to the Dashboard to find and take your first exam.
          </p>
          <Link
            href="/student"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/25"
          >
            <BookOpen className="w-4 h-4" />
            Find Exams
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {completedAttempts.map((attempt) => {
            const exam = attempt.exam;
            const score = attempt.score ?? 0;
            const grade = gradeLabel(score);
            const meta = examMeta[exam.title] ?? {
              icon: BookOpen,
              color: "text-indigo-500",
              bg: "bg-indigo-500/10",
              gradient: "from-indigo-400/20 to-indigo-600/5",
            };
            const Icon = meta.icon;
            const totalPts = exam.questions.reduce((s, q) => s + q.points, 0);
            const earnedPts = Math.round((score / 100) * totalPts);
            const taken = timeDiff(attempt.startTime, attempt.endTime ?? null);
            const dateStr = new Date(attempt.endTime ?? attempt.startTime).toLocaleDateString("en-US", {
              day: "numeric", month: "short", year: "numeric",
            });

            return (
              <div
                key={attempt.id}
                className="glass rounded-2xl overflow-hidden flex flex-col hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-green-200/60 dark:border-green-900/30"
              >
                {/* Gradient header */}
                <div className={`bg-gradient-to-br ${meta.gradient} px-6 pt-6 pb-5 flex items-start justify-between`}>
                  <div className={`p-3 rounded-2xl ${meta.bg}`}>
                    <Icon className={`w-7 h-7 ${meta.color}`} />
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <span className="flex items-center gap-1 text-[11px] font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 px-2.5 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3" /> Completed
                    </span>
                    <span className={`text-xs font-bold ${grade.cls}`}>{grade.label}</span>
                  </div>
                </div>

                {/* Body */}
                <div className="px-6 py-5 flex flex-col flex-1">
                  <h3 className="font-bold text-xl text-gray-800 dark:text-white mb-1">
                    {exam.title}
                  </h3>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mb-5">{dateStr}</p>

                  {/* Score bar */}
                  <div className="mb-5">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Score</span>
                      <span className={`text-sm font-extrabold px-2.5 py-0.5 rounded-full ${scoreColor(score)}`}>
                        {score}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          score >= 80 ? "bg-green-500" : score >= 50 ? "bg-amber-500" : "bg-red-500"
                        }`}
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </div>

                  {/* Meta row */}
                  <div className="grid grid-cols-3 gap-3 mb-6 text-center">
                    <div className="bg-gray-50 dark:bg-white/5 p-2.5 rounded-xl">
                      <Trophy className="w-4 h-4 mx-auto mb-1 text-indigo-400" />
                      <p className="text-xs font-bold text-gray-700 dark:text-gray-200">{earnedPts}/{totalPts}</p>
                      <p className="text-[10px] text-gray-400">Points</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-white/5 p-2.5 rounded-xl">
                      <Clock className="w-4 h-4 mx-auto mb-1 text-cyan-400" />
                      <p className="text-xs font-bold text-gray-700 dark:text-gray-200">{taken}</p>
                      <p className="text-[10px] text-gray-400">Time</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-white/5 p-2.5 rounded-xl">
                      <BookOpen className="w-4 h-4 mx-auto mb-1 text-purple-400" />
                      <p className="text-xs font-bold text-gray-700 dark:text-gray-200">{exam.questions.length}</p>
                      <p className="text-[10px] text-gray-400">Questions</p>
                    </div>
                  </div>

                  {/* View Results CTA */}
                  <Link
                    href={`/exam/${exam.id}/results`}
                    className="mt-auto w-full flex items-center justify-center gap-2 border-2 border-green-400 dark:border-green-600 text-green-600 dark:text-green-400 py-3 rounded-xl font-bold hover:bg-green-50 dark:hover:bg-green-900/10 transition-all"
                  >
                    <FileSearch className="w-4 h-4" />
                    View Results
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
