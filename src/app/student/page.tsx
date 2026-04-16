import { prisma } from "@/lib/prisma";
import {
  BookOpen,
  Star,
  Trophy,
  Clock,
  Play,
  CheckCircle2,
  Code2,
  Database,
  Globe,
  Cpu,
  FlaskConical,
} from "lucide-react";
import Link from "next/link";
import { headers } from "next/headers";

// Map exam titles to icons & accent colours
const examMeta: Record<string, { icon: React.ElementType; color: string; bg: string; badge: string }> = {
  "Python Fundamentals": {
    icon: Code2,
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
    badge: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
  },
  "Java OOP Concepts": {
    icon: Cpu,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
    badge: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
  },
  "Data Structures & Algorithms": {
    icon: FlaskConical,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    badge: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  },
  "Web Development Basics": {
    icon: Globe,
    color: "text-cyan-500",
    bg: "bg-cyan-500/10",
    badge: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300",
  },
  "SQL & Databases": {
    icon: Database,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  },
};

function getDifficultyLabel(questionCount: number) {
  if (questionCount <= 4) return { label: "Beginner", cls: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300" };
  if (questionCount <= 6) return { label: "Intermediate", cls: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" };
  return { label: "Advanced", cls: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300" };
}

export default async function StudentDashboard() {
  const headersList = await headers();
  const userId = headersList.get("x-user-id");

  const exams = await prisma.exam.findMany({
    where: { published: true },
    orderBy: { createdAt: "asc" },
    include: { questions: true },
  });

  const attempts = await prisma.attempt.findMany({
    where: { userId: userId as string },
    include: { exam: true },
    orderBy: { startTime: "desc" },
  });

  const completedExamIds = new Set(
    attempts.filter((a) => a.submitted).map((a) => a.examId)
  );

  const upcomingExams = exams.filter((e) => !completedExamIds.has(e.id));
  const completedExams = exams.filter((e) => completedExamIds.has(e.id));

  const avgScore =
    attempts.length > 0
      ? Math.round(
          attempts.reduce((acc, curr) => acc + (curr.score || 0), 0) /
            attempts.length
        )
      : null;

  return (
    <>
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-cyan-500">
            Welcome Back!
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Ready to ace your next exam?
          </p>
        </div>
        <Link
          href="/student/exams"
          className="hidden md:flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-indigo-500/25 transition-all"
        >
          <BookOpen className="w-4 h-4" />
          <span>Browse All Exams</span>
        </Link>
      </div>

      {/* ── Stats ──────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
        <div className="glass p-6 rounded-2xl flex items-center space-x-4 hover:shadow-xl transition-all">
          <div className="p-4 rounded-2xl bg-blue-500/10 text-blue-500">
            <Trophy className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Global Rank</p>
            <p className="text-2xl font-extrabold">#42</p>
          </div>
        </div>
        <div className="glass p-6 rounded-2xl flex items-center space-x-4 hover:shadow-xl transition-all">
          <div className="p-4 rounded-2xl bg-indigo-500/10 text-indigo-500">
            <BookOpen className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Exams Taken</p>
            <p className="text-2xl font-extrabold">{attempts.filter((a) => a.submitted).length}</p>
          </div>
        </div>
        <div className="glass p-6 rounded-2xl flex items-center space-x-4 hover:shadow-xl transition-all">
          <div className="p-4 rounded-2xl bg-amber-500/10 text-amber-500">
            <Star className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Average Score</p>
            <p className="text-2xl font-extrabold">
              {avgScore !== null ? `${avgScore}%` : "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* ── Upcoming Exams ─────────────────────────────────── */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-400" />
            Upcoming Exams
            {upcomingExams.length > 0 && (
              <span className="ml-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 text-xs font-bold px-2 py-0.5 rounded-full">
                {upcomingExams.length}
              </span>
            )}
          </h3>
        </div>

        {upcomingExams.length === 0 ? (
          <div className="glass text-center py-14 rounded-2xl border-2 border-dashed border-indigo-200 dark:border-indigo-800">
            <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-3" />
            <p className="font-bold text-gray-700 dark:text-gray-200 text-lg">All caught up!</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">You've completed all available exams.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {upcomingExams.map((exam) => {
              const meta = examMeta[exam.title] ?? {
                icon: BookOpen,
                color: "text-indigo-500",
                bg: "bg-indigo-500/10",
                badge: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300",
              };
              const Icon = meta.icon;
              const diff = getDifficultyLabel(exam.questions.length);
              const codeQs = exam.questions.filter((q) => q.type === "CODE").length;

              return (
                <div
                  key={exam.id}
                  className="glass rounded-2xl overflow-hidden flex flex-col group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-transparent hover:border-indigo-400/30"
                >
                  {/* Card header stripe */}
                  <div className={`${meta.bg} px-6 pt-6 pb-4 flex items-start justify-between`}>
                    <div className={`p-3 rounded-xl ${meta.bg} ${meta.color}`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${diff.cls}`}>
                        {diff.label}
                      </span>
                      {codeQs > 0 && (
                        <span className="text-[11px] font-semibold bg-slate-800/10 dark:bg-white/10 text-slate-600 dark:text-slate-300 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                          <Code2 className="w-3 h-3" /> Coding
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card body */}
                  <div className="px-6 py-4 flex flex-col flex-1">
                    <h4 className="font-bold text-lg text-gray-800 dark:text-white mb-1 group-hover:text-indigo-600 dark:group-hover:text-cyan-400 transition-colors">
                      {exam.title}
                    </h4>

                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-5">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        {exam.duration} min
                      </span>
                      <span className="flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4" />
                        {exam.questions.length} Questions
                      </span>
                    </div>

                    {/* Question types breakdown */}
                    <div className="flex gap-2 mb-5 flex-wrap">
                      {["MCQ", "SHORT", "CODE"].map((type) => {
                        const count = exam.questions.filter((q) => q.type === type).length;
                        if (!count) return null;
                        return (
                          <span
                            key={type}
                            className="text-[11px] font-semibold bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-md"
                          >
                            {count} {type}
                          </span>
                        );
                      })}
                    </div>

                    {/* CTA */}
                    <Link
                      href={`/exam/${exam.id}/start`}
                      className="mt-auto w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-indigo-500/20 transition-all group-hover:shadow-indigo-500/40"
                    >
                      <Play className="w-4 h-4 fill-white" />
                      Take Exam
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Completed + Past Results ────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Completed exams */}
        {completedExams.length > 0 && (
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              Completed Exams
            </h3>
            <div className="glass rounded-2xl divide-y divide-gray-100 dark:divide-white/5 overflow-hidden">
              {completedExams.map((exam) => {
                const attempt = attempts.find((a) => a.examId === exam.id && a.submitted);
                return (
                  <div key={exam.id} className="flex items-center justify-between px-5 py-4 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10 transition-colors">
                    <div>
                      <p className="font-semibold text-sm text-gray-800 dark:text-white">{exam.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {attempt ? new Date(attempt.startTime).toLocaleDateString() : ""}
                      </p>
                    </div>
                    <span className={`font-extrabold text-sm px-3 py-1 rounded-full ${
                      (attempt?.score ?? 0) >= 50
                        ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-red-100 text-red-500 dark:bg-red-900/30 dark:text-red-400"
                    }`}>
                      {attempt?.score !== null ? `${attempt?.score}%` : "—"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Past Results */}
        <div>
          <h3 className="text-xl font-bold mb-4">Past Results</h3>
          <div className="glass rounded-2xl p-5 space-y-3">
            {attempts.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-6 text-sm">
                No past results yet. Take your first exam!
              </p>
            ) : (
              attempts.slice(0, 6).map((attempt) => (
                <div
                  key={attempt.id}
                  className="flex justify-between items-center p-3 hover:bg-white/60 dark:hover:bg-white/5 rounded-xl transition-colors border border-transparent hover:border-indigo-100 dark:hover:border-indigo-900/30"
                >
                  <div>
                    <p className="font-semibold text-sm text-gray-800 dark:text-white">{attempt.exam.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(attempt.startTime).toLocaleDateString("en-US", {
                        day: "numeric", month: "short", year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-bold text-sm ${
                        attempt.score && attempt.score >= 50
                          ? "text-green-500"
                          : attempt.score !== null
                          ? "text-red-500"
                          : "text-gray-400"
                      }`}
                    >
                      {attempt.score !== null ? `${attempt.score}%` : "In Progress"}
                    </span>
                    {attempt.submitted && (
                      <Link
                        href={`/exam/${attempt.examId}/results`}
                        className="text-xs text-indigo-500 hover:underline"
                      >
                        View
                      </Link>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
