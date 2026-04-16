import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { Trophy, Medal, Clock, Star } from "lucide-react";

export default async function LeaderboardPage() {
  const headersList = await headers();
  const currentUserId = headersList.get("x-user-id");

  const attempts = await prisma.attempt.findMany({
    where: { submitted: true },
    include: {
      user: { select: { id: true, name: true } },
      exam: { select: { id: true, title: true } }
    },
    orderBy: [
      { score: "desc" },
      { endTime: "asc" }
    ]
  });

  // Deduplicate: best attempt per user per exam
  const seen = new Map<string, boolean>();
  const uniqueAttempts = attempts.filter(a => {
    const key = `${a.userId}-${a.examId}`;
    if (seen.has(key)) return false;
    seen.set(key, true);
    return true;
  });

  const leaderboard = uniqueAttempts.map((attempt, idx) => {
    const timeTaken = attempt.endTime
      ? Math.floor((new Date(attempt.endTime).getTime() - new Date(attempt.startTime).getTime()) / 1000)
      : 0;
    return {
      rank: idx + 1,
      userId: attempt.userId,
      name: attempt.user.name,
      examTitle: attempt.exam.title,
      score: attempt.score ?? 0,
      timeTakenSeconds: timeTaken,
    };
  });

  const rankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-6 h-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
    if (rank === 3) return <Medal className="w-6 h-6 text-amber-600" />;
    return <span className="font-bold text-gray-500 text-lg w-6 text-center">#{rank}</span>;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="glass rounded-3xl p-8 bg-gradient-to-br from-indigo-600 to-cyan-500 text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-20" style={{backgroundImage: "radial-gradient(circle at 20% 80%, #ffffff 0%, transparent 50%), radial-gradient(circle at 80% 20%, #ffffff 0%, transparent 50%)"}}></div>
          <div className="relative z-10">
            <Trophy className="w-16 h-16 text-yellow-300 mx-auto mb-4 drop-shadow-lg" />
            <h1 className="text-4xl font-black mb-2">Leaderboard</h1>
            <p className="text-white/80 text-lg">Top performers across all exams</p>
          </div>
        </div>

        {/* Top 3 Cards */}
        {leaderboard.length >= 3 && (
          <div className="grid grid-cols-3 gap-4">
            {[leaderboard[1], leaderboard[0], leaderboard[2]].map((entry, idx) => {
              const isTop = entry.rank === 1;
              const heights = ["h-32", "h-40", "h-32"];
              const bgColors = ["bg-gray-200 dark:bg-gray-700", "bg-yellow-400", "bg-amber-600"];
              return (
                <div key={entry.userId} className={`glass rounded-2xl p-4 flex flex-col items-center justify-end text-center relative overflow-hidden ${isTop ? 'shadow-xl shadow-yellow-400/20' : ''}`}>
                  <div className={`${heights[idx]} ${bgColors[idx]} w-full rounded-xl flex flex-col items-center justify-center mb-2 relative`}>
                    <div className={`w-14 h-14 rounded-full bg-white flex items-center justify-center text-2xl font-black shadow-lg ${isTop ? 'text-yellow-600' : 'text-gray-600'}`}>
                      {entry.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="mt-2 text-white font-bold text-sm">{`#${entry.rank}`}</div>
                  </div>
                  <p className="font-bold truncate w-full">{entry.name}</p>
                  <p className="text-indigo-600 dark:text-cyan-400 font-black text-xl">{entry.score}%</p>
                </div>
              );
            })}
          </div>
        )}

        {/* Full Leaderboard Table */}
        <div className="glass rounded-3xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-white/10">
            <h2 className="text-xl font-bold">Full Rankings</h2>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-white/5">
            {leaderboard.length === 0 ? (
              <div className="p-12 text-center text-gray-500">No results yet. Be the first to take an exam!</div>
            ) : leaderboard.map((entry) => {
              const isCurrentUser = entry.userId === currentUserId;
              const mins = Math.floor(entry.timeTakenSeconds / 60);
              const secs = entry.timeTakenSeconds % 60;

              return (
                <div key={`${entry.userId}-${entry.rank}`} className={`flex items-center px-6 py-4 transition-colors ${isCurrentUser ? 'bg-indigo-50 dark:bg-indigo-900/20' : 'hover:bg-gray-50 dark:hover:bg-white/5'}`}>
                  <div className="w-12 flex justify-center shrink-0">
                    {rankIcon(entry.rank)}
                  </div>
                  <div className="flex-1 min-w-0 ml-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {entry.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className={`font-bold ${isCurrentUser ? 'text-indigo-600 dark:text-cyan-400' : ''}`}>
                          {entry.name}{isCurrentUser && <span className="ml-2 text-xs bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-full">You</span>}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{entry.examTitle}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-8 shrink-0">
                    <div className="text-right">
                      <p className="text-xs text-gray-500 mb-0.5 flex items-center justify-end"><Clock className="w-3 h-3 mr-1" /> Time</p>
                      <p className="font-bold">{mins}m {secs}s</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 mb-0.5 flex items-center justify-end"><Star className="w-3 h-3 mr-1" />Score</p>
                      <p className={`text-xl font-black ${entry.score >= 80 ? 'text-green-500' : entry.score >= 50 ? 'text-amber-500' : 'text-red-500'}`}>
                        {entry.score}%
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
