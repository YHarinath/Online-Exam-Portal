"use client";
import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { CheckCircle, XCircle, Info, X } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue>({ showToast: () => {} });

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = "info") => {
    const id = Math.random().toString(36).slice(2);
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const dismiss = (id: string) => setToasts(prev => prev.filter(t => t.id !== id));

  const styles: Record<ToastType, string> = {
    success: "bg-green-600 border-green-500 shadow-green-500/30",
    error: "bg-red-600 border-red-500 shadow-red-500/30",
    info: "bg-indigo-600 border-indigo-500 shadow-indigo-500/30",
  };

  const Icons: Record<ToastType, React.ElementType> = {
    success: CheckCircle,
    error: XCircle,
    info: Info,
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Portal */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col space-y-3 pointer-events-none">
        {toasts.map(t => {
          const Icon = Icons[t.type];
          return (
            <div
              key={t.id}
              className={`flex items-center space-x-3 px-5 py-4 rounded-2xl border text-white shadow-xl pointer-events-auto animate-in slide-in-from-bottom-4 duration-300 ${styles[t.type]}`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <p className="text-sm font-medium flex-1">{t.message}</p>
              <button
                onClick={() => dismiss(t.id)}
                className="opacity-70 hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
