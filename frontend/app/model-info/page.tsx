"use client";

import { useEffect, useState } from "react";

export default function ModelInfoPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="max-w-6xl mx-auto">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">
          Model Information
        </h1>
        <p className="text-slate-600">
          Comprehensive details about Glaucoma XAI system and detection model
        </p>
      </div>

      {/* ABOUT WEBSITE SECTION */}
      <div className="bg-white border rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <span className="text-blue-600">📋</span>
          About Glaucoma XAI Portal
        </h2>
        <div className="space-y-4 text-slate-700">
          <p className="leading-relaxed">
            <strong className="text-slate-800">Glaucoma XAI (Explainable AI)</strong> is an advanced 
            web-based platform designed to assist healthcare professionals in the early detection and 
            classification of glaucoma stages. This system combines the power of artificial intelligence 
            with medical expertise to provide accurate, explainable predictions for glaucoma diagnosis.
          </p>
          <p className="leading-relaxed">
            The platform enables doctors to upload patient fundus images, receive AI-powered predictions, 
            and access detailed explanations of the model's decision-making process. This transparency 
            helps medical professionals understand and trust the AI recommendations.
          </p>
          <div className="grid md:grid-cols-2 gap-4 mt-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">🎯 Key Features</h3>
              <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                <li>AI-powered glaucoma stage detection</li>
                <li>Explainable AI for transparency</li>
                <li>Patient management system</li>
                <li>Comprehensive analytics dashboard</li>
                <li>Secure doctor authentication</li>
              </ul>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-900 mb-2">💡 Benefits</h3>
              <ul className="text-sm text-green-800 space-y-1 list-disc list-inside">
                <li>Early detection of glaucoma</li>
                <li>Reduced diagnostic time</li>
                <li>Consistent and accurate assessments</li>
                <li>Improved patient care outcomes</li>
                <li>Educational insights for doctors</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* MODEL OVERVIEW */}
      <div className="bg-white border rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <span className="text-purple-600">🤖</span>
          AI Model Overview
        </h2>
        <div className="space-y-4 text-slate-700">
          <p className="leading-relaxed">
            Our glaucoma detection model is a deep learning-based system trained on thousands of 
            annotated fundus images. The model uses advanced convolutional neural network (CNN) 
            architectures to analyze retinal images and classify them into three distinct stages 
            of glaucoma progression.
          </p>
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mt-4">
            <h3 className="font-semibold text-slate-800 mb-3">Model Architecture</h3>
            <ul className="text-sm text-slate-700 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>Type:</strong> Deep Convolutional Neural Network (CNN)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>Input:</strong> Fundus retinal images (standardized resolution)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>Output:</strong> Classification into 3 stages (Normal, Early, Advanced)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>Accuracy:</strong> High precision in stage classification</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* STAGE-WISE EXPLANATION */}
      <div className="bg-white border rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <span className="text-green-600">🔬</span>
          How the Model Works - Stage Classification
        </h2>
        <p className="text-slate-600 mb-6">
          The model analyzes fundus images and classifies them into three distinct stages based on 
          various retinal features and optic disc characteristics.
        </p>

        <div className="space-y-6">
          {/* NORMAL STAGE */}
          <div className="border-l-4 border-green-500 bg-green-50 rounded-r-lg p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                1
              </div>
              <h3 className="text-xl font-semibold text-green-900">Normal Stage</h3>
            </div>
            <div className="ml-15 space-y-3 text-green-800">
              <p className="leading-relaxed">
                <strong>Classification:</strong> The model identifies healthy retinal structures with no 
                signs of glaucoma damage.
              </p>
              <div className="bg-white rounded-lg p-3 mt-3">
                <h4 className="font-semibold text-green-900 mb-2">Key Features Detected:</h4>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  <li>Normal optic disc appearance</li>
                  <li>Intact neuroretinal rim</li>
                  <li>No cup-to-disc ratio abnormalities</li>
                  <li>Healthy retinal nerve fiber layer</li>
                  <li>No visual field defects</li>
                </ul>
              </div>
              <div className="bg-white rounded-lg p-3">
                <h4 className="font-semibold text-green-900 mb-2">Model Analysis:</h4>
                <p className="text-sm">
                  The CNN processes the image through multiple layers, extracting features related to 
                  optic disc morphology, cup-to-disc ratio, and retinal nerve fiber layer integrity. 
                  When all indicators fall within normal ranges, the model classifies the image as "Normal".
                </p>
              </div>
            </div>
          </div>

          {/* EARLY STAGE */}
          <div className="border-l-4 border-yellow-500 bg-yellow-50 rounded-r-lg p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                2
              </div>
              <h3 className="text-xl font-semibold text-yellow-900">Early Glaucoma Stage</h3>
            </div>
            <div className="ml-15 space-y-3 text-yellow-800">
              <p className="leading-relaxed">
                <strong>Classification:</strong> The model detects initial signs of glaucomatous damage, 
                indicating the onset of the disease.
              </p>
              <div className="bg-white rounded-lg p-3 mt-3">
                <h4 className="font-semibold text-yellow-900 mb-2">Key Features Detected:</h4>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  <li>Slight enlargement of optic cup</li>
                  <li>Mild thinning of neuroretinal rim</li>
                  <li>Early changes in cup-to-disc ratio</li>
                  <li>Initial retinal nerve fiber layer defects</li>
                  <li>Subtle optic disc changes</li>
                </ul>
              </div>
              <div className="bg-white rounded-lg p-3">
                <h4 className="font-semibold text-yellow-900 mb-2">Model Analysis:</h4>
                <p className="text-sm">
                  The model identifies subtle morphological changes in the optic disc structure. 
                  It compares the detected features against learned patterns of early glaucoma, 
                  recognizing the initial pathological changes that may not be immediately apparent 
                  to the human eye. Early detection is crucial for preventing progression.
                </p>
              </div>
              <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-3 mt-3">
                <p className="text-sm font-semibold text-yellow-900">
                  ⚠️ Clinical Significance: Early detection allows for timely intervention and 
                  treatment to prevent further vision loss.
                </p>
              </div>
            </div>
          </div>

          {/* ADVANCED STAGE */}
          <div className="border-l-4 border-red-500 bg-red-50 rounded-r-lg p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                3
              </div>
              <h3 className="text-xl font-semibold text-red-900">Advanced Glaucoma Stage</h3>
            </div>
            <div className="ml-15 space-y-3 text-red-800">
              <p className="leading-relaxed">
                <strong>Classification:</strong> The model identifies significant glaucomatous damage 
                with pronounced structural changes.
              </p>
              <div className="bg-white rounded-lg p-3 mt-3">
                <h4 className="font-semibold text-red-900 mb-2">Key Features Detected:</h4>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  <li>Marked enlargement of optic cup</li>
                  <li>Severe thinning or loss of neuroretinal rim</li>
                  <li>High cup-to-disc ratio (&gt;0.7)</li>
                  <li>Extensive retinal nerve fiber layer loss</li>
                  <li>Significant optic disc excavation</li>
                  <li>Possible visual field defects</li>
                </ul>
              </div>
              <div className="bg-white rounded-lg p-3">
                <h4 className="font-semibold text-red-900 mb-2">Model Analysis:</h4>
                <p className="text-sm">
                  The model recognizes severe structural damage to the optic nerve head. Advanced 
                  glaucoma features are clearly distinguishable through deep learning analysis of 
                  optic disc morphology, cup-to-disc ratios, and retinal nerve fiber layer patterns. 
                  The model provides high confidence scores for advanced cases due to the pronounced 
                  nature of the changes.
                </p>
              </div>
              <div className="bg-red-100 border border-red-300 rounded-lg p-3 mt-3">
                <p className="text-sm font-semibold text-red-900">
                  🚨 Clinical Significance: Advanced glaucoma requires immediate medical attention 
                  and aggressive treatment to preserve remaining vision.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TECHNICAL DETAILS */}
      <div className="bg-white border rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <span className="text-indigo-600">⚙️</span>
          Technical Specifications
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="border border-slate-200 rounded-lg p-4">
              <h3 className="font-semibold text-slate-800 mb-2">Image Processing</h3>
              <ul className="text-sm text-slate-700 space-y-1">
                <li>• Image preprocessing and normalization</li>
                <li>• Automatic quality assessment</li>
                <li>• Feature extraction from fundus images</li>
                <li>• Region of interest (ROI) detection</li>
              </ul>
            </div>
            <div className="border border-slate-200 rounded-lg p-4">
              <h3 className="font-semibold text-slate-800 mb-2">Model Training</h3>
              <ul className="text-sm text-slate-700 space-y-1">
                <li>• Trained on diverse dataset</li>
                <li>• Cross-validation for robustness</li>
                <li>• Regular model updates</li>
                <li>• Performance monitoring</li>
              </ul>
            </div>
          </div>
          <div className="space-y-4">
            <div className="border border-slate-200 rounded-lg p-4">
              <h3 className="font-semibold text-slate-800 mb-2">Explainability</h3>
              <ul className="text-sm text-slate-700 space-y-1">
                <li>• Feature importance visualization</li>
                <li>• Attention maps highlighting key regions</li>
                <li>• Confidence scores for predictions</li>
                <li>• Decision rationale explanation</li>
              </ul>
            </div>
            <div className="border border-slate-200 rounded-lg p-4">
              <h3 className="font-semibold text-slate-800 mb-2">System Requirements</h3>
              <ul className="text-sm text-slate-700 space-y-1">
                <li>• Standard web browser</li>
                <li>• Internet connection</li>
                <li>• Fundus images in supported formats</li>
                <li>• Doctor account authentication</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* IMPORTANT NOTES */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-blue-900 mb-3 flex items-center gap-2">
          <span>📌</span>
          Important Notes
        </h2>
        <ul className="space-y-2 text-blue-800 text-sm">
          <li className="flex items-start gap-2">
            <span className="font-bold">•</span>
            <span>
              <strong>AI Assistance, Not Replacement:</strong> This model is designed to assist 
              healthcare professionals, not replace clinical judgment. All predictions should be 
              reviewed by qualified medical professionals.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold">•</span>
            <span>
              <strong>Clinical Correlation:</strong> Model predictions should be correlated with 
              patient history, clinical examination, and other diagnostic tests.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold">•</span>
            <span>
              <strong>Image Quality:</strong> Prediction accuracy depends on image quality. 
              Ensure fundus images meet the required standards for optimal results.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold">•</span>
            <span>
              <strong>Regular Updates:</strong> The model undergoes periodic updates to improve 
              accuracy and incorporate new research findings.
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
