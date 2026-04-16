import { prisma } from "@/lib/prisma";
import { Trophy, Clock, Star, BarChart2 } from "lucide-react";
import { ScoreDistributionChart, PassFailChart, ExamAvgScoreChart } from "@/components/analytics/Charts";

export default async function AdminResultsPage() {
  const attempts = await prisma.attempt.findMany({
    where: { submitted: true },
    include: {
      user: { select: { name: true, email: true } },
      exam: { select: { id: true, title: true } },
    },
    orderBy: { endTime: "desc" },
  });

  const avgScore =
    attempts.length > 0
      ? Math.round(attempts.reduce((s, a) => s + (a.score ?? 0), 0) / attempts.length)
      : 0;
  const passedCount = attempts.filter(a => (a.score ?? 0) >= 50).length;
  const failedCount = attempts.length - passedCount;
  const passRate = attempts.length > 0 ? Math.round((passedCount / attempts.length) * 100) : 0;

  // Score distribution buckets
  const buckets = ["0-20", "21-40", "41-60", "61-80", "81-100"];
  const scoreDistribution = buckets.map(range => {
    const [min, max] = range.split("-").map(Number);
    return {
      range,
      count: attempts.filter(a => (a.score ?? 0) >= min && (a.score ?? 0) <= max).length,
    };
  });

  // Per-exam average score
  const examMap = new Map<string, { title: string; scores: number[] }>();
  for (const attempt of attempts) {
    if (!examMap.has(attempt.examId)) {
      examMap.set(attempt.examId, { title: attempt.exam.title, scores: [] });
    }
    examMap.get(attempt.examId)!.scores.push(attempt.score ?? 0);
  }
  const examAvgData = Array.from(examMap.entries()).map(([, v]) => ({
    exam: v.title.length > 14 ? v.title.slice(0, 13) + "…" : v.title,
    avg: Math.round(v.scores.reduce((s, n) => s + n, 0) / v.scores.length),
  }));

  return (
    <>
      <div className="mb-8">
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-cyan-500">
          Results Analytics
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Monitor student performance across all exams.
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: "Total Submissions", value: attempts.length, icon: Star, color: "text-indigo-500", bg: "bg-indigo-500/10" },
          { label: "Avg Score", value: `${avgScore}%`, icon: BarChart2, color: "text-cyan-500", bg: "bg-cyan-500/10" },
          { label: "Pass Rate", value: `${passRate}%`, icon: Trophy, color: "text-green-500", bg: "bg-green-500/10" },
          { label: "Unique Students", value: new Set(attempts.map(a => a.userId)).size, icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
        ].map((s, i) => (
          <div key={i} className="glass p-6 rounded-2xl flex items-center space-x-4 hover:-translate-y-1 transition-transform">
            <div className={`p-3 rounded-xl ${s.bg} ${s.color}`}>
              <s.icon className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{s.label}</p>
              <p className="text-2xl font-bold">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 glass p-6 rounded-2xl">
          <h3 className="font-bold text-lg mb-1">Score Distribution</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Number of students in each score bracket
          </p>
          {attempts.length === 0 ? (
            <div className="h-[220px] flex items-center justify-center text-gray-500 text-sm">
              No data yet — student results will appear here.
            </div>
          ) : (
            <ScoreDistributionChart data={scoreDistribution} />
          )}
        </div>

        <div className="glass p-6 rounded-2xl">
          <h3 className="font-bold text-lg mb-1">Pass / Fail</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Overall pass rate across all exams
          </p>
          {attempts.length === 0 ? (
            <div className="h-[220px] flex items-center justify-center text-gray-500 text-sm">
              No data yet.
            </div>
          ) : (
            <PassFailChart passed={passedCount} failed={failedCount} />
          )}
        </div>
      </div>

      {examAvgData.length > 0 && (
        <div className="glass p-6 rounded-2xl mb-8">
          <h3 className="font-bold text-lg mb-1">Avg Score by Exam</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Average student score per exam
          </p>
          <ExamAvgScoreChart data={examAvgData} />
        </div>
      )}

      {/* Results Table */}
      <div className="glass rounded-3xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-white/10 flex items-center justify-between">
          <h3 className="font-bold text-lg">All Submissions</h3>
          <span className="text-sm text-gray-500">{attempts.length} entries</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-black/20 text-xs uppercase text-gray-500 dark:text-gray-400">
              <tr>
                <th className="px-6 py-3 text-left">Student</th>
                <th className="px-6 py-3 text-left">Exam</th>
                <th className="px-6 py-3 text-left">Score</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Completed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {attempts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    No submissions yet.
                  </td>
                </tr>
              ) : (
                attempts.map(attempt => {
                  const passed = (attempt.score ?? 0) >= 50;
                  return (
                    <tr key={attempt.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                            {attempt.user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-sm">{attempt.user.name}</p>
                            <p className="text-xs text-gray-500">{attempt.user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">{attempt.exam.title}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-24 h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${passed ? "bg-green-500" : "bg-red-500"}`}
                              style={{ width: `${attempt.score ?? 0}%` }}
                            />
                          </div>
                          <span className={`font-black text-lg ${passed ? "text-green-500" : "text-red-500"}`}>
                            {attempt.score}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${passed ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"}`}>
                          {passed ? "Passed" : "Failed"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {attempt.endTime
                          ? new Date(attempt.endTime).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "—"}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
