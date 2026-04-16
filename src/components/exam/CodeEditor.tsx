"use client";
import { default as MonacoEditor } from "@monaco-editor/react";
import { useState } from "react";
import { Play, Loader2 } from "lucide-react";

interface CodeEditorProps {
  language: string;
  code: string;
  onChange: (value: string) => void;
  onRunTestCases?: (code: string) => Promise<{ output: string; error: string; time: string }>;
}

export function CodeEditor({ language, code, onChange, onRunTestCases }: CodeEditorProps) {
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [running, setRunning] = useState(false);

  const handleRun = async () => {
    if (!onRunTestCases) return;
    setRunning(true);
    setError("");
    setOutput("");
    try {
      const res = await onRunTestCases(code);
      setOutput(res.output);
      setError(res.error);
    } catch (e: any) {
      setError(e.message || "Execution failed");
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="flex flex-col h-full border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden bg-[#1e1e1e]">
      <div className="h-12 bg-[#2d2d2d] flex items-center justify-between px-4 border-b border-black/20">
        <div className="text-white text-sm font-medium">Code Editor ({language})</div>
        {onRunTestCases && (
          <button
            onClick={handleRun}
            disabled={running}
            className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-4 py-1.5 rounded-lg text-sm font-bold transition-colors"
          >
            {running ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            <span>Run Code</span>
          </button>
        )}
      </div>

      <div className="flex-1 min-h-[300px]">
        <MonacoEditor
          height="100%"
          language={language.toLowerCase()}
          theme="vs-dark"
          value={code}
          onChange={(val) => onChange(val || "")}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineHeight: 24,
            padding: { top: 16 },
            scrollBeyondLastLine: false,
            smoothScrolling: true,
          }}
        />
      </div>

      <div className="h-[200px] bg-[#1e1e1e] border-t border-black/20 flex flex-col">
        <div className="px-4 py-2 bg-[#2d2d2d] text-xs font-bold text-gray-400">CONSOLE OUTPUT</div>
        <div className="p-4 flex-1 overflow-auto font-mono text-sm">
          {output && <pre className="text-gray-300">{output}</pre>}
          {error && <pre className="text-red-400 mt-2">{error}</pre>}
          {!output && !error && !running && <div className="text-gray-600 italic">Output will appear here...</div>}
          {running && <div className="text-gray-400 animate-pulse">Running test cases...</div>}
        </div>
      </div>
    </div>
  );
}
