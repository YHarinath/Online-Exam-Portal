"use client";
import { useState } from "react";
import { HelpCircle, ChevronDown, ChevronUp, BookOpen, Settings, Users, BarChart3 } from "lucide-react";

const FAQS = [
  {
    question: "How do I create a new exam?",
    answer: "Navigate to the 'Exams' tab in the sidebar and click the 'Create New Exam' button. You'll need to set a title, duration, and add at least one question before publishing.",
    icon: BookOpen
  },
  {
    question: "Can I edit an exam after it's published?",
    answer: "Currently, exams cannot be edited once published to prevent discrepancies in student scores. Make sure to review all questions before clicking 'Publish'.",
    icon: Settings
  },
  {
    question: "How do I view student results?",
    answer: "Go to the 'Results' tab in the sidebar. You'll see a list of all submitted exam attempts. You can click on any attempt to view the detailed answers and score.",
    icon: BarChart3
  },
  {
    question: "How do I resolve student support inquiries?",
    answer: "Go to the 'Support' tab. You'll see tickets submitted by students. Once you've handled an inquiry (e.g., via email), you can click 'Mark as Resolved'.",
    icon: Users
  }
];

export default function AdminHelpPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="mb-12 text-center">
        <h2 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-cyan-500 to-indigo-500">
          Admin Help Center
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">
          Learn how to manage exams, view results, and support your students.
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-indigo-500" />
          Frequently Asked Questions
        </h3>
        {FAQS.map((faq, idx) => {
          const Icon = faq.icon;
          return (
            <div
              key={idx}
              className="glass rounded-2xl overflow-hidden border border-transparent hover:border-indigo-500/20 transition-all shadow-sm"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between p-5 text-left bg-white/40 dark:bg-slate-900/40 hover:bg-white/60 dark:hover:bg-slate-900/60 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-indigo-500/10 text-indigo-500 rounded-lg">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-gray-800 dark:text-gray-200">{faq.question}</span>
                </div>
                {openFaq === idx ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
              </button>
              {openFaq === idx && (
                <div className="p-5 bg-white/10 dark:bg-black/10 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-100 dark:border-white/5 animate-in fade-in slide-in-from-top-1 duration-200">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
