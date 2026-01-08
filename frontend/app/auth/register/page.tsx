"use client";

import { useState } from "react";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    qualification: "",
    specialization: "",
    experience_years: "",
    hospital: "",
    clinic_address: "",
    city: "",
    clinic_phone: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.name || !form.email || !form.password) {
      setError("Please fill all required fields");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          qualification: form.qualification,
          specialization: form.specialization,
          experience_years: Number(form.experience_years || 0),
          hospital: form.hospital,
          clinic_address: form.clinic_address,
          city: form.city,
          clinic_phone: form.clinic_phone,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.detail || "Registration failed");
        setLoading(false);
        return;
      }

      // ✅ SUCCESS
      setSuccess("Account created successfully! Redirecting to login...");
      setTimeout(() => {
        window.location.href = "/auth/login";
      }, 1500);

    } catch (err) {
      setError("Backend not reachable");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">

      {/* LEFT IMAGE */}
      <div className="hidden md:block w-1/2 relative">
        <img
          src="/doctors-team.png"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60 flex flex-col justify-end p-10 text-white">
          <h1 className="text-3xl font-bold mb-2">
            Join Glaucoma XAI Portal
          </h1>
          <p className="text-sm opacity-90">
            Register as a doctor to access AI-powered glaucoma diagnosis
          </p>
        </div>
      </div>

      {/* RIGHT FORM */}
      <div className="w-full md:w-1/2 flex justify-center bg-gray-50 py-10 overflow-y-auto">
        <div className="w-full max-w-lg px-8">

          <h2 className="text-2xl font-bold text-gray-800 mb-1">
            Doctor Registration
          </h2>
          <p className="text-gray-500 mb-6 text-sm">
            Create your account to continue
          </p>

          {/* ERROR MESSAGE */}
          {error && (
            <p className="mb-4 text-sm text-red-600">{error}</p>
          )}

          {/* SUCCESS MESSAGE */}
          {success && (
            <p className="mb-4 text-sm text-green-600">{success}</p>
          )}

          <form
            onSubmit={handleRegister}
            className="grid grid-cols-2 gap-4"
          >
            <input name="name" placeholder="Full Name *"
              onChange={handleChange}
              className="col-span-2 border rounded-lg px-4 py-3 text-sm bg-white"
            />

            <input name="email" type="email" placeholder="Email *"
              onChange={handleChange}
              className="col-span-2 border rounded-lg px-4 py-3 text-sm bg-white"
            />

            <input name="password" type="password" placeholder="Password *"
              onChange={handleChange}
              className="border rounded-lg px-4 py-3 text-sm bg-white"
            />

            <input name="confirmPassword" type="password" placeholder="Confirm Password *"
              onChange={handleChange}
              className="border rounded-lg px-4 py-3 text-sm bg-white"
            />

            <input name="qualification" placeholder="Qualification"
              onChange={handleChange}
              className="border rounded-lg px-4 py-3 text-sm bg-white"
            />

            <input name="specialization" placeholder="Specialization"
              onChange={handleChange}
              className="border rounded-lg px-4 py-3 text-sm bg-white"
            />

            <input name="experience_years" placeholder="Years of Experience"
              onChange={handleChange}
              className="border rounded-lg px-4 py-3 text-sm bg-white"
            />

            <input name="hospital" placeholder="Hospital / Clinic Name"
              onChange={handleChange}
              className="border rounded-lg px-4 py-3 text-sm bg-white"
            />

            <input name="clinic_address" placeholder="Clinic Address"
              onChange={handleChange}
              className="col-span-2 border rounded-lg px-4 py-3 text-sm bg-white"
            />

            <input name="city" placeholder="City"
              onChange={handleChange}
              className="border rounded-lg px-4 py-3 text-sm bg-white"
            />

            <input name="clinic_phone" placeholder="Clinic Phone"
              onChange={handleChange}
              className="border rounded-lg px-4 py-3 text-sm bg-white"
            />

            <button
              type="submit"
              disabled={loading}
              className="col-span-2 bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-lg font-semibold"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          {/* LOGIN LINK */}
          <p className="text-sm text-center mt-4 text-gray-600">
            Already have an account?{" "}
            <a
              href="/auth/login"
              className="text-blue-600 font-medium hover:underline"
            >
              Login here
            </a>
          </p>

        </div>
      </div>
    </div>
  );
}
