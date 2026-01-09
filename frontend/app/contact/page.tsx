"use client";

export default function ContactPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Contact</h1>

      <div className="bg-white border rounded-lg p-6 space-y-3">
        <p className="text-sm">
          For technical or medical support, please contact:
        </p>

        <div className="text-sm text-slate-700">
          <p><strong>Project Team:</strong> Glaucoma XAI</p>
          <p><strong>Email:</strong> glaucoma.xai.support@gmail.com</p>
          <p><strong>Phone:</strong> +91 9XXXXXXXXX</p>
          <p><strong>Institution:</strong> XYZ Engineering College</p>
        </div>
      </div>
    </div>
  );
}

