"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const menu = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Patients", href: "/patients" },
  { name: "Reports", href: "/reports" },
  { name: "Model Info", href: "/model-info" },   // ✅ added
  { name: "Contact", href: "/contact" },         // ✅ added
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const [doctorName, setDoctorName] = useState<string | null>(null);
  const [doctorEmail, setDoctorEmail] = useState<string | null>(null);

  // ✅ Safe localStorage read (client only)
  useEffect(() => {
    setDoctorName(localStorage.getItem("doctor_name"));
    setDoctorEmail(localStorage.getItem("doctor_email"));
  }, []);

  // ✅ Logout handler
  const handleLogout = () => {
    localStorage.clear();
    router.push("/auth/login");
  };

  return (
    <aside className="h-screen w-64 bg-slate-900 text-slate-200 flex flex-col">
      
      {/* LOGO */}
      <div className="px-6 py-6 border-b border-slate-800">
        <h1 className="text-xl font-semibold text-white">
          Glaucoma XAI
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Doctor Portal
        </p>
      </div>

      {/* MENU */}
      <nav className="flex-1 px-4 py-4 space-y-1">
        {menu.map((item) => {
          const active = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`block px-4 py-2 rounded-md text-sm transition
                ${
                  active
                    ? "bg-blue-600 text-white"
                    : "hover:bg-slate-800 hover:text-white"
                }`}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* PROFILE + LOGOUT */}
      <div className="px-4 py-4 border-t border-slate-800">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white">
            {doctorName ? doctorName.charAt(0).toUpperCase() : "D"}
          </div>
          <div className="text-sm leading-tight">
            <p className="font-medium text-white">
              {doctorName ? `Dr. ${doctorName}` : "Doctor"}
            </p>
            <p className="text-xs text-slate-400">
              {doctorEmail || "Logged in"}
            </p>
          </div>
        </div>

        {/* LOGOUT BUTTON */}
        <button
          onClick={handleLogout}
          className="w-full text-left text-sm px-3 py-2 rounded-md
                     bg-slate-800 hover:bg-red-600 hover:text-white transition"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}