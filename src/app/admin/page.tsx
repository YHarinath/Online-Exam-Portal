import { prisma } from "@/lib/prisma";
import { Users, BookOpen, Award, Clock } from "lucide-react";
import Link from "next/link";
import { ScoreDistributionChart } from "@/components/analytics/Charts";

export default async function AdminDashboard() {
  const totalExams = await prisma.exam.count();
  const totalStudents = await prisma.user.count({ where: { role: "STUDENT" } });
  const totalAttempts = await prisma.attempt.count({ where: { submitted: true } });
  const recentExams = await prisma.exam.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    include: { questions: true, _count: { select: { attempts: true } } },
  });
  const allAttempts = await prisma.attempt.findMany({
    where: { submitted: true },
    select: { score: true },
  });

  const avgScore =
    allAttempts.length > 0
      ? Math.round(allAttempts.reduce((acc, a) => acc + (a.score ?? 0), 0) / allAttempts.length)
      : 0;

  // Score distribution for chart
  const buckets = ["0-20", "21-40", "41-60", "61-80", "81-100"];
  const scoreDistribution = buckets.map(range => {
    const [min, max] = range.split("-").map(Number);
    return {
      range,
      count: allAttempts.filter(a => (a.score ?? 0) >= min && (a.score ?? 0) <= max).length,
    };
  });

  const stats = [
    { label: "Total Exams", value: totalExams, icon: BookOpen, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Active Students", value: totalStudents, icon: Users, color: "text-indigo-500", bg: "bg-indigo-500/10" },
    { label: "Total Submissions", value: totalAttempts, icon: Award, color: "text-purple-500", bg: "bg-purple-500/10" },
    { label: "Avg Score", value: `${avgScore}%`, icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
  ];

  return (
    <>
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-cyan-500">
            Overview
          </h2>
          <p className="text-gray-500 dark:text-gray-400">Welcome to your admin control panel.</p>
        </div>
        <Link
          href="/admin/exams/create"
          className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-full font-semibold shadow-lg shadow-indigo-500/30 transition-all hover:scale-105 text-sm"
        >
          <BookOpen className="w-4 h-4" />
          <span>New Exam</span>
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="glass p-6 rounded-2xl flex items-center space-x-4 hover:-translate-y-1 transition-transform cursor-default">
              <div className={`p-4 rounded-xl ${s.bg} ${s.color}`}>
                <Icon className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{s.label}</p>
                <p className="text-3xl font-bold text-gray-800 dark:text-gray-100">{s.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts + Recent Exams */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-2">
        {/* Score Distribution Chart */}
        <div className="glass p-6 rounded-2xl">
          <h3 className="text-lg font-bold mb-1">Score Distribution</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Students per score bracket</p>
          {allAttempts.length === 0 ? (
            <div className="h-[220px] flex items-center justify-center text-gray-500 text-sm italic">
              No submissions yet.
            </div>
          ) : (
            <ScoreDistributionChart data={scoreDistribution} />
          )}
        </div>

        {/* Recent Exams */}
        <div className="glass p-6 rounded-2xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">Recent Exams</h3>
            <Link href="/admin/exams" className="text-sm text-indigo-500 hover:text-indigo-400 font-medium transition-colors">
              View all →
            </Link>
          </div>
          <div className="space-y-3">
            {recentExams.length === 0 ? (
              <p className="text-gray-500 text-sm py-8 text-center italic">No exams created yet.</p>
            ) : (
              recentExams.map(exam => (
                <div key={exam.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/50 dark:hover:bg-black/20 transition-colors">
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-indigo-500/10 flex items-center justify-center shrink-0">
                      <BookOpen className="w-5 h-5 text-indigo-500" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm truncate">{exam.title}</p>
                      <p className="text-xs text-gray-500">
                        {exam.questions.length} questions · {exam._count.attempts} attempts
                      </p>
                    </div>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full font-semibold shrink-0 ml-2 ${exam.published ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"}`}>
                    {exam.published ? "Live" : "Draft"}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
