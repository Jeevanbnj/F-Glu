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
  const [barData, setBarData] = useState<any[]>([]);
  const [pieData, setPieData] = useState<any[]>([]);

  // ✅ DEFINE FUNCTION FIRST
  const fetchDashboard = async () => {
    try {
      // Fetch all records from the records table
      const recordsRes = await fetch("/api/records");
      const records = await recordsRes.json();

      if (!Array.isArray(records)) {
        console.error("Invalid records data");
        return;
      }

      // Calculate summary from records
      const total = records.length;
      const normal = records.filter((r: any) => r.diagnosis?.toLowerCase() === "normal").length;
      const early = records.filter((r: any) => r.diagnosis?.toLowerCase() === "early").length;
      const advanced = records.filter((r: any) => r.diagnosis?.toLowerCase() === "advanced").length;

      setSummary({
        total_patients: total,
        normal,
        early,
        advanced,
      });

      // Prepare timeline data (patients over time)
      const dateCounts: { [key: string]: number } = {};
      records.forEach((record: any) => {
        try {
          const date = new Date(record.createdAt);
          const dateKey = date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
          dateCounts[dateKey] = (dateCounts[dateKey] || 0) + 1;
        } catch (e) {
          // Skip invalid dates
        }
      });

      const timeline = Object.entries(dateCounts)
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      
      setTimelineData(timeline);

      // Prepare bar chart data
      const bar = [
        { stage: "Normal", value: normal },
        { stage: "Early", value: early },
        { stage: "Advanced", value: advanced },
      ];
      setBarData(bar);

      // Prepare pie chart data
      const pie = [
        { name: "Normal", value: normal },
        { name: "Early", value: early },
        { name: "Advanced", value: advanced },
      ];
      setPieData(pie);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setTimelineData([]);
      setBarData([]);
      setPieData([]);
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
            {barData.length === 0 ? (
              <p className="text-center text-slate-400 mt-24">No data</p>
            ) : (
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
            )}
          </div>
        </div>
      </div>

      <div className="bg-white border p-5 rounded-lg mt-6 h-[350px]">
        <h2 className="mb-4 font-medium">Glaucoma Stage Percentage</h2>
        {pieData.length === 0 || pieData.every((d) => d.value === 0) ? (
          <p className="text-center text-slate-400 mt-24">No data</p>
        ) : (
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
        )}
      </div>
    </div>
  );
}