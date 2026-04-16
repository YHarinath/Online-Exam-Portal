"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, UploadCloud, Plus } from "lucide-react";
import * as xlsx from "xlsx";

export default function CreateExam() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState("60");
  const [questions, setQuestions] = useState<any[]>([]);

  const handleExcelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      const wb = xlsx.read(bstr, { type: "binary" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = xlsx.utils.sheet_to_json(ws);
      
      const parsedQuestions = data.map((row: any) => ({
        type: row.type || "MCQ",
        text: row.question,
        options: row.type === "MCQ" ? JSON.stringify([row.option_1, row.option_2, row.option_3, row.option_4]) : null,
        correctAnswer: row.answer,
        points: row.points || 1,
      }));

      setQuestions(parsedQuestions);
    };
    reader.readAsBinaryString(file);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/exams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, duration: parseInt(duration), questions, published: true }),
      });

      if (!res.ok) throw new Error("Failed to create exam");
      
      router.push("/admin/exams");
    } catch (err) {
      console.error(err);
      alert("Error saving exam.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="glass p-8 rounded-3xl space-y-6">
        <h2 className="text-2xl font-bold">Create New Exam</h2>
        
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Exam Title</label>
            <input 
              value={title} onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 rounded-xl bg-white/50 dark:bg-black/20 border border-black/10 dark:border-white/10 outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium" 
              placeholder="e.g. Midterm Assessment" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Duration (minutes)</label>
            <input 
              type="number" value={duration} onChange={(e) => setDuration(e.target.value)}
              className="w-full p-3 rounded-xl bg-white/50 dark:bg-black/20 border border-black/10 dark:border-white/10 outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium" 
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 font-bold mt-4">Upload Questions (Excel)</label>
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-8 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors flex flex-col items-center justify-center text-center relative cursor-pointer">
            <input 
              type="file" 
              accept=".xlsx,.xls" 
              onChange={handleExcelUpload} 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <UploadCloud className="w-12 h-12 text-indigo-500 mb-4" />
            <p className="font-semibold text-gray-700 dark:text-gray-300">Click or drag Excel file to upload</p>
            <p className="text-sm text-gray-500 mt-2">Required columns: type, question, option_1...4, answer, points</p>
          </div>
        </div>

        {questions.length > 0 && (
          <div className="bg-green-50 text-green-700 p-4 rounded-xl font-medium border border-green-200">
            Successfully imported {questions.length} questions!
          </div>
        )}

        <div className="flex justify-end pt-4">
          <button 
            onClick={handleSave} 
            disabled={loading || questions.length === 0}
            className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-indigo-500/30 transition-all"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin"/> : <Plus className="w-5 h-5"/>}
            <span>Publish Exam</span>
          </button>
        </div>
      </div>
    </div>
  );
}
