"use client";
import { Flag, CheckCircle } from "lucide-react";

interface QuestionPaletteProps {
  questionsCount: number;
  currentIndex: number;
  answers: Record<string, string>;
  flagged: string[];
  questionIds: string[];
  onSelect: (index: number) => void;
}

export function QuestionPalette({ questionsCount, currentIndex, answers, flagged, questionIds, onSelect }: QuestionPaletteProps) {
  return (
    <div className="glass p-4 rounded-2xl h-full flex flex-col">
      <h3 className="font-bold text-lg mb-4 flex justify-between items-center">
        Question Navigator
        <span className="text-sm font-normal text-gray-500 bg-white/50 dark:bg-black/20 px-2 py-1 rounded">
          {Object.keys(answers).length} / {questionsCount} answered
        </span>
      </h3>
      
      <div className="grid grid-cols-4 gap-2 flex-1 content-start overflow-y-auto pr-2">
        {Array.from({ length: questionsCount }).map((_, i) => {
          const id = questionIds[i];
          const isAnswered = !!answers[id] && answers[id].trim() !== "";
          const isFlagged = flagged.includes(id);
          const isCurrent = currentIndex === i;
          
          let bgColor = "bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300"; // not answered
          if (isAnswered) bgColor = "bg-green-500 text-white shadow-md shadow-green-500/20"; // answered
          if (isFlagged) bgColor = "bg-amber-500 text-white shadow-md shadow-amber-500/20"; // flagged

          return (
            <button
              key={i}
              onClick={() => onSelect(i)}
              className={`
                relative h-10 rounded-xl font-bold transition-all
                ${bgColor}
                ${isCurrent ? 'ring-4 ring-indigo-500 ring-offset-2 dark:ring-offset-slate-900 scale-105 z-10' : 'hover:scale-105 opacity-90 hover:opacity-100'}
              `}
            >
              {i + 1}
              {isFlagged && <Flag className="w-3 h-3 absolute top-1 right-1 text-red-500 drop-shadow" fill="currentColor" />}
            </button>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-white/10 grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-400">
        <div className="flex items-center space-x-2"><div className="w-3 h-3 bg-green-500 rounded-sm"></div><span>Answered</span></div>
        <div className="flex items-center space-x-2"><div className="w-3 h-3 bg-amber-500 rounded-sm"></div><span>Flagged</span></div>
        <div className="flex items-center space-x-2"><div className="w-3 h-3 bg-gray-200 dark:bg-gray-800 rounded-sm"></div><span>Not Answered</span></div>
        <div className="flex items-center space-x-2"><div className="w-4 h-4 rounded-sm border-2 border-indigo-500"></div><span>Current</span></div>
      </div>
    </div>
  );
}
