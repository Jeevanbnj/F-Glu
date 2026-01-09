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

  // Fundus image
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [imagePath, setImagePath] = useState("");

  // Save patient
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

  // Upload image
  const handleUploadImage = async () => {
    if (!file) {
      alert("Please select an image");
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setUploading(false);

    if (res.ok) {
      setImagePath(data.imagePath);
      alert("Image uploaded successfully");
    } else {
      alert(data.error || "Image upload failed");
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
              disabled={isSaved}
            />

            <input
              type="number"
              className="input"
              placeholder="Age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              disabled={isSaved}
            />

            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Gender</span>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={gender === "Male"}
                  onChange={() => setGender("Male")}
                  disabled={isSaved}
                />
                Male
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={gender === "Female"}
                  onChange={() => setGender("Female")}
                  disabled={isSaved}
                />
                Female
              </label>
            </div>

            <input
              className="input"
              placeholder="Patient ID"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              disabled={isSaved}
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
              disabled={isSaved}
            />

            <input
              className="input"
              placeholder="CDR"
              value={cdr}
              onChange={(e) => setCdr(e.target.value)}
              disabled={isSaved}
            />

            <div className="col-span-2 flex items-center gap-4">
              <span className="text-sm text-gray-600">Eye</span>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={eye === "Left"}
                  onChange={() => setEye("Left")}
                  disabled={isSaved}
                />
                Left
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={eye === "Right"}
                  onChange={() => setEye("Right")}
                  disabled={isSaved}
                />
                Right
              </label>
            </div>

            <input
              className="input col-span-2"
              placeholder="Symptoms"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              disabled={isSaved}
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-center">
        <button
          onClick={handleSavePatient}
          disabled={isSaved}
          className={`px-8 py-3 rounded-lg font-medium ${
            isSaved
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 text-white"
          }`}
        >
          {isSaved ? "Patient Saved" : "Save Patient"}
        </button>
      </div>

      {/* Fundus Upload */}
      <div
        className={`bg-white rounded-xl shadow-sm p-6 transition ${
          !isSaved ? "opacity-40 pointer-events-none" : ""
        }`}
      >
        <h2 className="text-lg font-semibold mb-4">Fundus Image Upload</h2>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
          className="mb-4"
        />

        {file && (
          <p className="text-sm text-gray-500 mb-4">
            Selected: {file.name}
          </p>
        )}

        <div className="flex justify-center gap-4">
          <button
            onClick={handleUploadImage}
            disabled={uploading}
            className="px-6 py-2 rounded-lg bg-blue-600 text-white"
          >
            {uploading ? "Uploading..." : "Upload Image"}
          </button>

          <button
            disabled={!imagePath}
            className="px-6 py-2 rounded-lg bg-green-600 text-white disabled:bg-gray-300"
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
