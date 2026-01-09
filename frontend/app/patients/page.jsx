"use client";

import { useState } from "react";

export default function AddPatientPage() {
  const [isSaved, setIsSaved] = useState(false);

  // Patient details
  const [patientId, setPatientId] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("Male");

  // Clinical info
  const [eye, setEye] = useState("Left");
  const [iop, setIop] = useState("");
  const [cdr, setCdr] = useState("");
  const [symptoms, setSymptoms] = useState("");

  // ✅ Save handler
  const handleSavePatient = async () => {
    if (isSaved) return;

    const res = await fetch("/api/patients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        patientId,
        name,
        age,
        gender,
        eye,
        iop,
        cdr,
        symptoms,
      }),
    });

    if (res.ok) {
      setIsSaved(true);
      alert("Patient saved successfully");
    } else {
      const err = await res.json();
      alert(err.error || "Failed to save patient");
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold">New Patient Registration</h1>
        <p className="text-gray-500">Enter patient and clinical details</p>
      </div>

      {/* Patient + Clinical Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Patient Details */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Patient Details</h2>

          <div className="space-y-4">
            <input
              className="input"
              placeholder="Patient Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            {/* ✅ AGE FIXED */}
            <input
              type="number"
              className="input"
              placeholder="Age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />

            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Gender</span>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="gender"
                  checked={gender === "Male"}
                  onChange={() => setGender("Male")}
                />
                Male
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="gender"
                  checked={gender === "Female"}
                  onChange={() => setGender("Female")}
                />
                Female
              </label>
            </div>

            <input
              className="input"
              placeholder="Patient ID"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
            />
          </div>
        </div>

        {/* Clinical Info */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Clinical Info</h2>

          <div className="grid grid-cols-2 gap-4">
            <input
              className="input"
              placeholder="IOP (mm Hg)"
              value={iop}
              onChange={(e) => setIop(e.target.value)}
            />
            <input
              className="input"
              placeholder="CDR"
              value={cdr}
              onChange={(e) => setCdr(e.target.value)}
            />

            <div className="col-span-2 flex items-center gap-4">
              <span className="text-sm text-gray-600">Eye</span>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="eye"
                  checked={eye === "Left"}
                  onChange={() => setEye("Left")}
                />
                Left
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="eye"
                  checked={eye === "Right"}
                  onChange={() => setEye("Right")}
                />
                Right
              </label>
            </div>

            <input
              className="input col-span-2"
              placeholder="Symptoms"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Fundus Upload */}
      <div
        className={`bg-white rounded-xl shadow-sm p-6 ${
          !isSaved ? "opacity-50" : ""
        }`}
      >
        <h2 className="text-lg font-semibold mb-4">Fundus Image Upload</h2>

        <div className="border-2 border-dashed rounded-xl p-8 text-center text-gray-500">
          Drag and drop retinal image here, or{" "}
          <span className="text-blue-600 cursor-pointer">click to upload</span>
        </div>

        <div className="flex gap-4 justify-center mt-6">
          <button
            onClick={handleSavePatient}
            disabled={isSaved}
            className={`px-6 py-2 rounded-lg font-medium ${
              isSaved
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white"
            }`}
          >
            {isSaved ? "Patient Saved" : "Save Patient"}
          </button>

          <button
            disabled={!isSaved}
            className="px-6 py-2 rounded-lg border border-gray-300 text-gray-400"
          >
            Run AI Prediction
          </button>
        </div>
      </div>

      <p className="text-sm text-gray-400 text-center">
        AI-powered glaucoma prediction and analysis portal
      </p>
    </div>
  );
}
