import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ExamState {
  answers: Record<string, string>;
  flagged: string[];
  timeLeft: number | null;
  currentQuestionIndex: number;
  setAnswer: (questionId: string, answer: string) => void;
  toggleFlag: (questionId: string) => void;
  setTimeLeft: (time: number) => void;
  setCurrentQuestionIndex: (index: number) => void;
  resetExam: () => void;
}

export const useExamStore = create<ExamState>()(
  persist(
    (set) => ({
      answers: {},
      flagged: [],
      timeLeft: null,
      currentQuestionIndex: 0,
      setAnswer: (questionId, answer) =>
        set((state) => ({ answers: { ...state.answers, [questionId]: answer } })),
      toggleFlag: (questionId) =>
        set((state) => ({
          flagged: state.flagged.includes(questionId)
            ? state.flagged.filter((id) => id !== questionId)
            : [...state.flagged, questionId],
        })),
      setTimeLeft: (time) => set({ timeLeft: time }),
      setCurrentQuestionIndex: (index) => set({ currentQuestionIndex: index }),
      resetExam: () => set({ answers: {}, flagged: [], timeLeft: null, currentQuestionIndex: 0 }),
    }),
    {
      name: 'exam-storage', 
    }
  )
);
