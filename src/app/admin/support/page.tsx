import { prisma } from "@/lib/prisma";
import { Mail, Clock, MessageSquare, CheckCircle2, AlertCircle } from "lucide-react";

export default async function AdminSupportPage() {
  const inquiries = await prisma.supportInquiry.findMany({
    orderBy: { createdAt: "desc" },
  });

  const users = await prisma.user.findMany({
    where: { id: { in: inquiries.map(i => i.userId) } }
  });

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="mb-8">
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-cyan-500">
          Support Inquiries
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Review and respond to help requests from students.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {inquiries.map((inquiry) => {
          const sender = users.find(u => u.id === inquiry.userId);
          const isPending = inquiry.status === "PENDING";
          
          return (
            <div key={inquiry.id} className="glass p-6 rounded-2xl border border-gray-100 dark:border-white/5 hover:border-indigo-500/20 transition-all group">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      isPending ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400" : "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400"
                    }`}>
                      {isPending ? <Clock className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                      {inquiry.status}
                    </span>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-cyan-400 transition-colors">
                      {inquiry.subject}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl">
                    {inquiry.message}
                  </p>
                </div>

                <div className="md:w-64 shrink-0 bg-gray-50/50 dark:bg-black/20 p-4 rounded-xl border border-gray-100 dark:border-white/5">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-indigo-500/10 text-indigo-500 rounded-full flex items-center justify-center text-xs font-bold">
                      {sender?.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800 dark:text-white truncate max-w-[140px]">{sender?.name}</p>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate max-w-[140px]">{sender?.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-gray-400 mt-3 pt-3 border-t border-gray-100 dark:border-white/5">
                    <Clock className="w-3 h-3" />
                    <span>Received {new Date(inquiry.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {isPending && (
                <div className="mt-6 flex items-center gap-3">
                  <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-md shadow-indigo-500/20">
                    Mark as Resolved
                  </button>
                  <button className="text-gray-500 hover:text-indigo-600 text-sm font-medium transition-colors">
                    Send Reply
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {inquiries.length === 0 && (
          <div className="text-center glass p-16 rounded-3xl border-2 border-dashed border-gray-200 dark:border-white/5">
            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-600 dark:text-gray-300">No inquiries yet</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2">All student help requests will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
