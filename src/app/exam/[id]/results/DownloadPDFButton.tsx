"use client";
import { Download } from "lucide-react";
import jsPDF from "jspdf";

interface Props {
  examTitle: string;
  score: number;
  passed: boolean;
}

export function DownloadPDFButton({ examTitle, score, passed }: Props) {
  const handleDownload = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFillColor(79, 70, 229);
    doc.rect(0, 0, 210, 50, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("Exam Result Certificate", 105, 25, { align: "center" });
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("Exam Assessment Platform", 105, 38, { align: "center" });

    // Content
    doc.setTextColor(17, 24, 39);
    doc.setFontSize(14);
    doc.text(`Exam: ${examTitle}`, 20, 70);
    doc.text(`Final Score: ${score}%`, 20, 85);
    doc.text(`Status: ${passed ? "PASSED ✓" : "FAILED ✗"}`, 20, 100);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 115);

    // Result box
    const color = passed ? [34, 197, 94] : [239, 68, 68];
    doc.setFillColor(color[0], color[1], color[2]);
    doc.roundedRect(70, 130, 70, 30, 5, 5, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text(passed ? "PASSED" : "FAILED", 105, 150, { align: "center" });

    doc.save(`${examTitle.replace(/\s+/g, "_")}_result.pdf`);
  };

  return (
    <button
      onClick={handleDownload}
      className="flex-1 flex items-center justify-center space-x-2 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
    >
      <Download className="w-5 h-5" />
      <span>Download PDF</span>
    </button>
  );
}
