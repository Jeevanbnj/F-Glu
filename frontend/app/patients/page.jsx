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
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState("");

  // 🔥 Prediction popup state
  const [showResult, setShowResult] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [isPredicting, setIsPredicting] = useState(false);

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

  // Handle file selection
  const handleFileSelect = (selectedFile) => {
    if (!selectedFile) return;
    
    // Only allow if patient is saved
    if (!isSaved || !patientId) {
      alert("Please save patient details first");
      return;
    }
    
    setFile(selectedFile);
    setFileName(selectedFile.name);
    
    // Auto-upload if patient is saved
    handleUploadImage(selectedFile);
  };

  // Upload image + link
  const handleUploadImage = async (fileToUpload = null) => {
    const fileToUse = fileToUpload || file;
    if (!fileToUse || !patientId) {
      alert("Patient must be saved and image selected");
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append("file", fileToUse);

    const uploadRes = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const uploadData = await uploadRes.json();

    if (!uploadRes.ok) {
      setUploading(false);
      alert(uploadData.error || "Image upload failed");
      return;
    }

    const linkRes = await fetch("/api/patients/image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        patientId,
        imagePath: uploadData.imagePath,
      }),
    });

    setUploading(false);

    if (linkRes.ok) {
      setImagePath(uploadData.imagePath);
      alert("Image uploaded & linked to patient successfully");
    } else {
      alert("Image uploaded but linking failed");
    }
  };

  // Drag and drop handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  // 🔥 RUN AI PREDICTION
  const handleRunPrediction = async () => {
    if (!imagePath) {
      alert("Upload image first");
      return;
    }

    setIsPredicting(true);
    setShowResult(false); // Hide modal if open

    try {
      const res = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imagePath }),
      });

      const data = await res.json();

      if (res.ok) {
        setPrediction(data);
        setIsPredicting(false);
        setShowResult(true);
      } else {
        setIsPredicting(false);
        alert(data.error || "Prediction failed");
      }
    } catch (error) {
      setIsPredicting(false);
      alert("Prediction failed. Please try again.");
    }
  };

  // Helper function to get diagnosis display text
  const getDiagnosisText = (diagnosis) => {
    switch (diagnosis?.toLowerCase()) {
      case "early":
        return "Early Stage Glaucoma Detected";
      case "normal":
        return "No Glaucoma Detected";
      case "advanced":
        return "Advanced Stage Glaucoma Detected";
      default:
        return diagnosis || "Unknown";
    }
  };

  // Helper function to get diagnosis sentence with eye name
  const getDiagnosisSentence = (diagnosis, confidence, eyeName) => {
    const confidencePercent = Math.round((confidence || 0) * 100);
    const diagnosisLower = diagnosis?.toLowerCase();
    
    if (diagnosisLower === "normal") {
      return `No glaucoma has been detected in the ${eyeName.toUpperCase()} eye with ${confidencePercent}% confidence. The heatmap highlights areas analyzed by the AI model.`;
    } else if (diagnosisLower === "early") {
      return `The AI has detected early stage glaucoma in the ${eyeName.toUpperCase()} eye with ${confidencePercent}% confidence. The heatmap highlights areas of concern identified by the AI model.`;
    } else if (diagnosisLower === "advanced") {
      return `The AI has detected advanced stage glaucoma in the ${eyeName.toUpperCase()} eye with ${confidencePercent}% confidence. The heatmap highlights areas of concern identified by the AI model.`;
    }
    return `The AI has analyzed the ${eyeName.toUpperCase()} eye with ${confidencePercent}% confidence.`;
  };

  // Save report to records
  const handleSaveReport = async () => {
    if (!prediction || !patientId || !imagePath) {
      alert("Missing required information to save report");
      return;
    }

    try {
      const res = await fetch("/api/records", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId,
          patientName: name,
          eye,
          diagnosis: prediction.diagnosis,
          confidence: prediction.confidence,
          fundusImagePath: imagePath,
          gradcamImagePath: prediction.gradcamPath,
          notes: "",
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Report saved successfully!");
        setShowResult(false);
      } else {
        alert(data.error || "Failed to save report");
      }
    } catch (error) {
      console.error("Error saving report:", error);
      alert("Failed to save report. Please try again.");
    }
  };

  // Format date for display
  const formatDate = () => {
    const now = new Date();
    return now.toLocaleDateString("en-US", { 
      year: "numeric", 
      month: "long", 
      day: "numeric" 
    });
  };

  // Helper function to get diagnosis color
  const getDiagnosisColor = (diagnosis) => {
    switch (diagnosis?.toLowerCase()) {
      case "normal":
        return "text-green-600";
      case "early":
        return "text-yellow-600";
      case "advanced":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  // Helper function to get progress bar color
  const getProgressBarColor = (diagnosis) => {
    switch (diagnosis?.toLowerCase()) {
      case "normal":
        return "bg-green-500";
      case "early":
        return "bg-yellow-500";
      case "advanced":
        return "bg-red-500";
      default:
        return "bg-gray-500";
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
            <input className="input" placeholder="Patient Name" value={name}
              onChange={(e) => setName(e.target.value)} disabled={isSaved} />

            <input type="number" className="input" placeholder="Age" value={age}
              onChange={(e) => setAge(e.target.value)} disabled={isSaved} />

            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Gender</span>
              <label className="flex items-center gap-2">
                <input type="radio" checked={gender === "Male"}
                  onChange={() => setGender("Male")} disabled={isSaved} />
                Male
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" checked={gender === "Female"}
                  onChange={() => setGender("Female")} disabled={isSaved} />
                Female
              </label>
            </div>

            <input className="input" placeholder="Patient ID" value={patientId}
              onChange={(e) => setPatientId(e.target.value)} disabled={isSaved} />
          </div>
        </div>

        {/* Clinical Info */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Clinical Info</h2>

          <div className="grid grid-cols-2 gap-4">
            <input className="input" placeholder="IOP (mm Hg)" value={iop}
              onChange={(e) => setIop(e.target.value)} disabled={isSaved} />

            <input className="input" placeholder="CDR" value={cdr}
              onChange={(e) => setCdr(e.target.value)} disabled={isSaved} />

            <div className="col-span-2 flex items-center gap-4">
              <span className="text-sm text-gray-600">Eye</span>
              <label className="flex items-center gap-2">
                <input type="radio" checked={eye === "Left"}
                  onChange={() => setEye("Left")} disabled={isSaved} />
                Left
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" checked={eye === "Right"}
                  onChange={() => setEye("Right")} disabled={isSaved} />
                Right
              </label>
            </div>

            <input className="input col-span-2" placeholder="Symptoms"
              value={symptoms} onChange={(e) => setSymptoms(e.target.value)}
              disabled={isSaved} />
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-center">
        <button onClick={handleSavePatient} disabled={isSaved}
          className={`px-8 py-3 rounded-lg font-medium ${
            isSaved ? "bg-gray-300 text-gray-500" : "bg-blue-600 text-white"
          }`}>
          {isSaved ? "Patient Saved" : "Save Patient"}
        </button>
      </div>

      {/* Upload */}
      <div className={`bg-white rounded-xl shadow-sm p-6 ${
        !isSaved ? "opacity-40 pointer-events-none" : ""
      }`}>
        <h2 className="text-lg font-semibold mb-4">Fundus Image Upload</h2>

        {/* Drag and Drop Upload Box */}
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors mb-4 ${
            dragActive
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 bg-gray-50 hover:border-gray-400"
          } ${!isSaved ? "cursor-not-allowed" : "cursor-pointer"}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => {
            if (isSaved) {
              document.getElementById("file-upload-input")?.click();
            }
          }}
        >
          <input
            id="file-upload-input"
            type="file"
            accept="image/*"
            onChange={(e) => handleFileSelect(e.target.files?.[0])}
            className="hidden"
            disabled={!isSaved}
          />
          
          {!imagePath ? (
            <>
              <svg
                className="mx-auto h-12 w-12 text-gray-400 mb-3"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p className="text-gray-600 font-medium mb-1">
                Drag & drop fundus image here or click to upload
              </p>
              <p className="text-sm text-gray-500">PNG, JPG, JPEG up to 10MB</p>
            </>
          ) : (
            <div className="flex items-center justify-center gap-3">
              <svg
                className="h-8 w-8 text-green-500"
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
              <div className="text-left">
                <p className="text-green-600 font-medium">Image uploaded</p>
                <p className="text-sm text-gray-500">{fileName || "Fundus image"}</p>
              </div>
            </div>
          )}
        </div>

        {/* Upload and Prediction Buttons */}
        <div className="flex justify-center gap-4">
          {imagePath && !uploading && (
            <button
              onClick={() => {
                setFile(null);
                setFileName("");
                setImagePath("");
              }}
              className="px-6 py-2 rounded-lg border-2 border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Remove Image
            </button>
          )}
          
          <button
            onClick={handleUploadImage}
            disabled={uploading || !file || !isSaved}
            className="px-6 py-2 rounded-lg bg-blue-600 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {uploading ? "Uploading..." : imagePath ? "Re-upload Image" : "Upload Image"}
          </button>

          <button
            onClick={handleRunPrediction}
            disabled={!imagePath || isPredicting || !isSaved}
            className="px-6 py-2 rounded-lg bg-green-600 text-white disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isPredicting ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Analyzing retinal image…
              </>
            ) : (
              "Run AI Prediction"
            )}
          </button>
        </div>
      </div>

      {/* 🔥 PREDICTION RESULT MODAL */}
      {showResult && prediction && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-y-auto animate-slideUp">
            {/* Modal Header with Patient Info */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl z-10">
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-1">
                  Patient Glaucoma Prediction Results
                </h2>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>Patient ID: <span className="font-medium">{patientId || "N/A"}</span></span>
                  <span>•</span>
                  <span>Age: <span className="font-medium">{age || "N/A"}</span></span>
                  <span>•</span>
                  <span className="font-medium">{eye} Eye</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">{formatDate()}</p>
                <button
                  onClick={() => setShowResult(false)}
                  className="mt-2 text-gray-400 hover:text-gray-600 text-2xl leading-none transition-colors"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 bg-gray-50">
              {/* Images Section: 2 Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Left Card: Original Fundus Image */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="bg-gray-100 px-4 py-3 border-b border-gray-200">
                    <h3 className="text-base font-semibold text-gray-800">
                      Original Fundus Image
                    </h3>
                  </div>
                  <div className="p-4 bg-white">
                    <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                      <img
                        src={imagePath}
                        alt="Fundus Image"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                </div>

                {/* Right Card: AI-Generated Heatmap */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="bg-gray-100 px-4 py-3 border-b border-gray-200">
                    <h3 className="text-base font-semibold text-gray-800">
                      AI-Generated Heatmap
                    </h3>
                  </div>
                  <div className="p-4 bg-white">
                    <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                      <img
                        src={prediction.gradcamPath}
                        alt="Grad-CAM Heatmap"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Result Summary Section */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start gap-4 mb-4">
                  {/* Green Check Icon */}
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
                    {/* Diagnosis Text with Percentage */}
                    <p className={`text-2xl font-bold mb-3 ${getDiagnosisColor(prediction.diagnosis)}`}>
                      {getDiagnosisText(prediction.diagnosis)} – {Math.round((prediction.confidence || 0) * 100)}%
                    </p>
                    
                    {/* Descriptive Sentence */}
                    <p className="text-gray-700 text-base leading-relaxed">
                      {getDiagnosisSentence(prediction.diagnosis, prediction.confidence, eye)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Modal Buttons - Bottom Right */}
              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={() => setShowResult(false)}
                  className="px-6 py-2.5 rounded-lg font-medium border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Retake Analysis
                </button>
                <button
                  onClick={handleSaveReport}
                  className="px-6 py-2.5 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm"
                >
                  Save Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading Overlay when Predicting */}
      {isPredicting && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4 animate-slideUp">
            <div className="text-center">
              <svg
                className="animate-spin h-12 w-12 text-green-600 mx-auto mb-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <p className="text-lg font-medium text-gray-800 mb-1">
                Analyzing retinal image…
              </p>
              <p className="text-sm text-gray-500">
                Please wait while the AI processes your fundus image
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
