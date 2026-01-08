"use client";
import { CartesianGrid } from "recharts";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#22c55e", "#facc15", "#ef4444"];

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [doctorName, setDoctorName] = useState<string | null>(null);

  const [summary, setSummary] = useState({
    total_patients: 0,
    normal: 0,
    early: 0,
    advanced: 0,
  });

  const [timelineData, setTimelineData] = useState<any[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);

  // ✅ DEFINE FUNCTION FIRST
  const fetchDashboard = async () => {
    try {
      const summaryRes = await fetch(
        "http://127.0.0.1:8000/api/dashboard/summary"
      );
      setSummary(await summaryRes.json());

      const timelineRes = await fetch(
        "http://127.0.0.1:8000/api/dashboard/patients-over-time"
      );
      const timelineJson = await timelineRes.json();
      setTimelineData(Array.isArray(timelineJson) ? timelineJson : []);

      const monthRes = await fetch(
        "http://127.0.0.1:8000/api/dashboard/patients-by-month"
      );
      const monthJson = await monthRes.json();
      setMonthlyData(Array.isArray(monthJson) ? monthJson : []);
    } catch (err) {
      console.error(err);
      setTimelineData([]);
      setMonthlyData([]);
    }
  };

  // ✅ useEffect AFTER function
  useEffect(() => {
    setDoctorName(localStorage.getItem("doctor_name"));
    setMounted(true);
    fetchDashboard();
  }, []);

  if (!mounted) return null; // hydration fix

  const today = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const barData = [
    { stage: "Normal", value: summary.normal },
    { stage: "Early", value: summary.early },
    { stage: "Advanced", value: summary.advanced },
  ];

  const pieData = [
    { name: "Normal", value: summary.normal },
    { name: "Early", value: summary.early },
    { name: "Advanced", value: summary.advanced },
  ];

  return (
    <div>
      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">
            Welcome{doctorName ? `, Dr. ${doctorName}` : ""}
          </h1>
          <p className="text-sm text-slate-500">
            Healthcare analytics & glaucoma overview
          </p>
        </div>
        <p className="text-sm text-slate-500">📅 {today}</p>
      </div>

    

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { title: "Total Patients", value: summary.total_patients },
          { title: "Normal", value: summary.normal },
          { title: "Early Glaucoma", value: summary.early },
          { title: "Advanced Glaucoma", value: summary.advanced },
        ].map((card) => (
          <div key={card.title} className="bg-white border p-4 rounded-lg">
            <p className="text-sm text-slate-500">{card.title}</p>
            <p className="text-2xl font-semibold">{card.value}</p>
          </div>
        ))}
      </div>

      {/* CHARTS */}
      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <div className="bg-white border p-5 rounded-lg h-[350px]">
          <h2 className="mb-4 font-medium">Patients Over Time</h2>
          {timelineData.length === 0 ? (
            <p className="text-center text-slate-400 mt-24">No data</p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timelineData}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line dataKey="count" stroke="#2563eb" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white border p-5 rounded-lg h-[350px]">
          <h2 className="mb-4 font-medium">Glaucoma Stage Count</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
              data={barData}
              margin={{ top: 20, right: 20, left: 0, bottom: 30 }}
>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />

              <XAxis
                dataKey="stage"
                tickMargin={10}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip />
            <Bar
    dataKey="value"
    fill="#2563eb"
    radius={[6, 6, 0, 0]}
    barSize={40}
  />
</BarChart>

  </ResponsiveContainer>
</div>

        </div>
      </div>

      <div className="bg-white border p-5 rounded-lg mt-6 h-[350px]">
        <h2 className="mb-4 font-medium">Glaucoma Stage Percentage</h2>
        <ResponsiveContainer width="60%" height="100%">
          <PieChart>
            <Pie data={pieData} dataKey="value" outerRadius={120} label>
              {pieData.map((_, i) => (
                <Cell key={i} fill={COLORS[i]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}