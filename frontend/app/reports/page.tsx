"use client";

import React, { useState, useEffect } from "react";

interface Record {
  id: number;
  patientId: string;
  patientName: string;
  eye: string;
  diagnosis: string;
  confidence: number;
  fundusImagePath: string;
  gradcamImagePath: string;
  notes: string;
  createdAt: string;
}

export default function ReportsPage() {
  const [records, setRecords] = useState<Record[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedRecord, setExpandedRecord] = useState<number | null>(null);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const doctorEmail = localStorage.getItem("doctor_email");
      
      if (!doctorEmail) {
        alert("Please log in to view reports");
        setLoading(false);
        return;
      }

      const res = await fetch(`/api/records?doctorEmail=${encodeURIComponent(doctorEmail)}`);
      if (res.ok) {
        const data = await res.json();
        setRecords(data);
      } else {
        const errorData = await res.json().catch(() => ({ error: "Failed to fetch records" }));
        console.error("Failed to fetch records:", errorData);
      }
    } catch (error) {
      console.error("Error fetching records:", error);
    } finally {
      setLoading(false);
    }
  };

  const getDiagnosisBadgeColor = (diagnosis: string) => {
    const diag = diagnosis?.toLowerCase();
    if (diag === "normal") {
      return "bg-green-100 text-green-800 border-green-200";
    } else if (diag === "early") {
      return "bg-amber-100 text-amber-800 border-amber-200";
    } else if (diag === "advanced") {
      return "bg-red-100 text-red-800 border-red-200";
    }
    return "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getDiagnosisText = (diagnosis: string) => {
    const diag = diagnosis?.toLowerCase();
    if (diag === "normal") return "Normal";
    if (diag === "early") return "Early";
    if (diag === "advanced") return "Advanced";
    return diagnosis;
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const handleViewReport = (recordId: number) => {
    if (expandedRecord === recordId) {
      setExpandedRecord(null);
    } else {
      setExpandedRecord(recordId);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading records...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-gray-800">Reports</h1>
        <p className="text-gray-500 mt-1">View and manage all patient prediction reports</p>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Eye
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prediction
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Confidence
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {records.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    No reports found. Save a report from the Patients page to see it here.
                  </td>
                </tr>
              ) : (
                records.map((record) => (
                  <React.Fragment key={record.id}>
                    <tr
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {record.patientId || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {record.patientName || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {record.eye || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getDiagnosisBadgeColor(
                            record.diagnosis
                          )}`}
                        >
                          {getDiagnosisText(record.diagnosis)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {Math.round((record.confidence || 0) * 100)}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {formatDate(record.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => handleViewReport(record.id)}
                          className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                        >
                          {expandedRecord === record.id ? "Hide Report" : "View Report"}
                        </button>
                      </td>
                    </tr>
                    {/* Expanded Report Section */}
                    {expandedRecord === record.id && (
                      <tr>
                        <td colSpan={7} className="px-6 py-6 bg-gray-50">
                          <div className="space-y-6">
                            {/* Patient Info */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <p className="text-gray-500 font-medium">Patient ID</p>
                                <p className="text-gray-900 mt-1">{record.patientId || "N/A"}</p>
                              </div>
                              <div>
                                <p className="text-gray-500 font-medium">Name</p>
                                <p className="text-gray-900 mt-1">{record.patientName || "N/A"}</p>
                              </div>
                              <div>
                                <p className="text-gray-500 font-medium">Eye</p>
                                <p className="text-gray-900 mt-1">{record.eye || "N/A"}</p>
                              </div>
                              <div>
                                <p className="text-gray-500 font-medium">Date</p>
                                <p className="text-gray-900 mt-1">{formatDate(record.createdAt)}</p>
                              </div>
                            </div>

                            {/* Images Section */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {/* Fundus Image */}
                              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                <div className="bg-gray-100 px-4 py-3 border-b border-gray-200">
                                  <h3 className="text-sm font-semibold text-gray-800">
                                    Fundus Image
                                  </h3>
                                </div>
                                <div className="p-4">
                                  {record.fundusImagePath ? (
                                    <img
                                      src={record.fundusImagePath}
                                      alt="Fundus Image"
                                      className="w-full h-auto rounded-lg border border-gray-200"
                                    />
                                  ) : (
                                    <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                                      No image available
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* GradCAM Image */}
                              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                <div className="bg-gray-100 px-4 py-3 border-b border-gray-200">
                                  <h3 className="text-sm font-semibold text-gray-800">
                                    GradCAM Heatmap
                                  </h3>
                                </div>
                                <div className="p-4">
                                  {record.gradcamImagePath ? (
                                    <img
                                      src={record.gradcamImagePath}
                                      alt="GradCAM Heatmap"
                                      className="w-full h-auto rounded-lg border border-gray-200"
                                    />
                                  ) : (
                                    <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                                      No image available
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Diagnosis and Confidence */}
                            <div className="bg-white rounded-lg border border-gray-200 p-6">
                              <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 mt-1">
                                  <svg
                                    className="h-6 w-6 text-green-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                  </svg>
                                </div>
                                <div className="flex-1">
                                  <p className={`text-xl font-bold mb-2 ${
                                    record.diagnosis?.toLowerCase() === "normal" ? "text-green-600" :
                                    record.diagnosis?.toLowerCase() === "early" ? "text-amber-600" :
                                    record.diagnosis?.toLowerCase() === "advanced" ? "text-red-600" :
                                    "text-gray-600"
                                  }`}>
                                    {getDiagnosisText(record.diagnosis)} – {Math.round((record.confidence || 0) * 100)}%
                                  </p>
                                  <p className="text-gray-600 text-sm">
                                    The AI has analyzed the {record.eye || "N/A"} eye with {Math.round((record.confidence || 0) * 100)}% confidence.
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Notes Section */}
                            <div className="bg-white rounded-lg border border-gray-200 p-6">
                              <h3 className="text-sm font-semibold text-gray-800 mb-3">Notes</h3>
                              <div className="min-h-[100px] p-4 bg-gray-50 rounded-lg border border-gray-200">
                                {record.notes ? (
                                  <p className="text-gray-700 text-sm whitespace-pre-wrap">
                                    {record.notes}
                                  </p>
                                ) : (
                                  <p className="text-gray-400 text-sm italic">
                                    No notes added for this report.
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
