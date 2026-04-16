"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

interface ScoreDistributionChartProps {
  data: { range: string; count: number }[];
}

export function ScoreDistributionChart({ data }: ScoreDistributionChartProps) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis dataKey="range" tick={{ fontSize: 12, fill: "#9ca3af" }} />
        <YAxis tick={{ fontSize: 12, fill: "#9ca3af" }} />
        <Tooltip
          contentStyle={{
            backgroundColor: "#1e293b",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "12px",
            color: "#f8fafc",
          }}
        />
        <Bar dataKey="count" fill="#4f46e5" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

interface PassFailChartProps {
  passed: number;
  failed: number;
}

const PASS_FAIL_COLORS = ["#22c55e", "#ef4444"];

export function PassFailChart({ passed, failed }: PassFailChartProps) {
  const data = [
    { name: "Passed", value: passed },
    { name: "Failed", value: failed },
  ];

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={85}
          paddingAngle={4}
          dataKey="value"
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={PASS_FAIL_COLORS[index]} />
          ))}
        </Pie>
        <Legend
          iconType="circle"
          formatter={(value) => (
            <span style={{ color: "#9ca3af", fontSize: 13 }}>{value}</span>
          )}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#1e293b",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "12px",
            color: "#f8fafc",
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

interface ExamTrendChartProps {
  data: { exam: string; avg: number }[];
}

export function ExamAvgScoreChart({ data }: ExamTrendChartProps) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis
          dataKey="exam"
          tick={{ fontSize: 11, fill: "#9ca3af" }}
          interval={0}
          tickLine={false}
        />
        <YAxis
          domain={[0, 100]}
          tick={{ fontSize: 12, fill: "#9ca3af" }}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#1e293b",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "12px",
            color: "#f8fafc",
          }}
          formatter={(val) => [`${Number(val ?? 0)}%`, "Avg Score"]}
        />
        <Bar dataKey="avg" fill="#06b6d4" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
