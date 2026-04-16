import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PlusCircle, Clock, CheckCircle, BookOpen } from "lucide-react";

export default async function AdminExamsPage() {
  const exams = await prisma.exam.findMany({
    orderBy: { createdAt: "desc" },
    include: { questions: true }
  });

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-cyan-500">
            Exams Management
          </h2>
          <p className="text-gray-500 dark:text-gray-400">Manage all your platform assessments.</p>
        </div>
        <Link 
          href="/admin/exams/create"
          className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-full font-semibold shadow-lg shadow-indigo-500/30 transition-all hover:scale-105"
        >
          <PlusCircle className="w-5 h-5" />
          <span>Create Exam</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {exams.map(exam => (
          <div key={exam.id} className="glass p-6 rounded-2xl flex flex-col justify-between hover:shadow-xl transition-shadow border-t-4 border-t-indigo-500">
            <div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">{exam.title}</h3>
              <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                <span className="flex items-center"><Clock className="w-4 h-4 mr-1"/> {exam.duration} mins</span>
                <span className="flex items-center"><CheckCircle className="w-4 h-4 mr-1"/> {exam.questions.length} questions</span>
              </div>
            </div>
            <div className="flex justify-end mt-4 pt-4 border-t border-gray-200 dark:border-white/10">
              <span className={`px-3 py-1 text-xs font-semibold rounded-full ${exam.published ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'}`}>
                {exam.published ? 'Published' : 'Draft'}
              </span>
            </div>
          </div>
        ))}

        {exams.length === 0 && (
          <div className="col-span-full glass p-12 rounded-3xl flex flex-col items-center justify-center text-center">
            <BookOpen className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-700 dark:text-gray-200">No exams created yet</h3>
            <p className="text-gray-500 mt-2 mb-6">Create your first exam assessment to get started.</p>
          </div>
        )}
      </div>
    </>
  );
}
