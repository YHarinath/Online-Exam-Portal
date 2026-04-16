"use client";
import { useEffect } from "react";
import { Clock } from "lucide-react";
import { useExamStore } from "@/store/examStore";

interface TimerProps {
  initialTime: number; // in seconds
  onTimeUp: () => void;
}

export function Timer({ initialTime, onTimeUp }: TimerProps) {
  const { timeLeft, setTimeLeft } = useExamStore();

  useEffect(() => {
    if (timeLeft === null) {
      setTimeLeft(initialTime);
    }
  }, [initialTime, timeLeft, setTimeLeft]);

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(timeLeft - 1);
      if (timeLeft - 1 <= 0) {
        clearInterval(timer);
        onTimeUp();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onTimeUp, setTimeLeft]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    
    if (h > 0) {
      return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const isWarning = timeLeft !== null && timeLeft <= 300; // less than 5 minutes

  return (
    <div className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-mono text-xl font-bold transition-colors ${isWarning ? 'bg-red-500/10 text-red-500 animate-pulse' : 'bg-white/50 dark:bg-black/20 text-gray-800 dark:text-gray-100'}`}>
      <Clock className="w-5 h-5" />
      <span>{timeLeft !== null ? formatTime(timeLeft) : "00:00"}</span>
    </div>
  );
}
