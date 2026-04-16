"use client";
import { useState } from "react";
import { HelpCircle, ChevronDown, ChevronUp, Mail, MessageSquare, Send, BookOpen, Clock, ShieldCheck } from "lucide-react";
import { useToast } from "@/components/ToastProvider";

const FAQS = [
  {
    question: "How do I start an exam?",
    answer: "Navigate to the 'Dashboard' or 'My Exams' page, find the exam you want to take, and click the 'Take Exam' button. Read the instructions carefully before clicking 'Start Exam'.",
    icon: PlayIcon
  },
  {
    question: "What happens if my internet disconnects during an exam?",
    answer: "Don't worry! Your answers are auto-saved every 3 seconds. If you disconnect, simply log back in and return to the exam page. You'll see a 'Resume' button to continue from where you left off.",
    icon: Clock
  },
  {
    question: "How do coding questions work?",
    answer: "Coding questions provide an integrated code editor. You can write your solution, select your language, and run the code against test cases. Your final submitted code will be graded automatically.",
    icon: BookOpen
  },
  {
    question: "Can I navigate between questions?",
    answer: "Yes, you can use the 'Question Palette' on the right side of the exam screen to jump to any question at any time. You can also flag questions you want to review later.",
    icon: ShieldCheck
  }
];

function PlayIcon(props: any) { return <Send {...props} className={props.className + " rotate-90"} />; }

export default function HelpPage() {
  const { showToast } = useToast();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [loading, setLoading] = useState(false);

  // Support Form
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, message }),
      });
      if (res.ok) {
        showToast("Message sent! We'll get back to you soon.", "success");
        setSubject("");
        setMessage("");
      } else {
        showToast("Failed to send message", "error");
      }
    } catch (err) {
      showToast("Network error", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="mb-12 text-center">
        <h2 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-cyan-500 to-indigo-500">
          How can we help you?
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">
          Find answers to common questions or reach out to our support team.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* FAQs */}
        <div className="lg:col-span-2 space-y-4">
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

        {/* Contact Support */}
        <div className="space-y-6">
          <div className="glass p-8 rounded-3xl relative overflow-hidden border border-indigo-500/20 shadow-xl">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full -mr-12 -mt-12" />
            
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-indigo-500/10 text-indigo-500 rounded-xl">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">Contact Us</h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1.5 ml-1">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-gray-400"
                  placeholder="Need help with..."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1.5 ml-1">Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-gray-400 min-h-[120px] resize-none"
                  placeholder="Describe your issue in detail..."
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/30 active:scale-95 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{loading ? "Sending..." : "Send Message"}</span>
              </button>
            </form>
          </div>

          <div className="glass p-6 rounded-2xl border border-gray-100 dark:border-white/5">
            <h4 className="font-bold text-gray-800 dark:text-white mb-2 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-cyan-500" />
              Live Chat
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              Our support team is available Mon-Fri, 9am - 6pm EST. Average response time is 2 hours.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
