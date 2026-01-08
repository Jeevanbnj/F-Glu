"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    // 🔒 PROTECT ROUTE
    if (!token) {
      router.push("/auth/login");
      return;
    }

    fetch("http://127.0.0.1:8000/api/dashboard/summary", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error("Unauthorized");
        }
        return res.json();
      })
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch(() => {
        localStorage.clear();
        router.push("/auth/login");
      });
  }, [router]);

  if (loading) {
    return <p className="p-6">Loading dashboard...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-1">
        Doctor Dashboard
      </h1>
      <p className="text-gray-500 mb-6">
        Healthcare analytics & glaucoma overview
      </p>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card title="Total Patients" value={data.total_patients} />
        <Card title="Normal" value={data.normal} />
        <Card title="Early Glaucoma" value={data.early} />
        <Card title="Advanced Glaucoma" value={data.advanced} />
      </div>

      {/* RECENT PATIENTS */}
      <div className="bg-white rounded-lg p-4 shadow">
        <h2 className="font-semibold mb-3">Recent Patients</h2>

        {data.recent_patients.length === 0 ? (
          <p className="text-gray-500">No patients added yet.</p>
        ) : (
          <ul className="space-y-2">
            {data.recent_patients.map((p: any) => (
              <li
                key={p.id}
                className="flex justify-between border-b pb-2 text-sm"
              >
                <span>{p.name}</span>
                <span className="text-gray-500">
                  {p.last_result || "Pending"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function Card({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
