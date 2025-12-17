import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function HomePage() {
  const [userId, setUserId] = useState("");
const [password, setPassword] = useState("");
const [error, setError] = useState("");
const navigate = useNavigate();

const handleLogin = async (e) => {
  e.preventDefault();
  setError(""); // clear previous errors

  try {
    const res = await fetch("http://localhost:5000/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ user_id: userId, password }),
});


    const data = await res.json();
    console.log("Login response:", data);

    if (data.error) {
      setError(data.error);
      return;
    }

    const { token, role } = data;
    console.log("Received role:", role);

    // Store JWT in localStorage for future API requests
    localStorage.setItem("token", token);

    // Navigate based on user role
    if (role.toLowerCase() === "doctor") navigate("/dashboard");
    else if (role.toLowerCase() === "admin") navigate("/admin-dashboard");
    else navigate("/"); // fallback
  } catch (err) {
    console.error("Login error:", err);
    setError("Login failed. Please try again.");
  }
};

    
    return (
    <div className="min-h-screen flex flex-col relative">

      {/* Top Navigation Bar */}
      <div className="absolute top-0 right-0 p-6">
        <Link
          to="/admin-login"
          className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2 px-4 rounded transition-colors"
        >
          Admin Login
        </Link>
      </div>

      {/* Main Content Section */}
      <div className="flex flex-1">
        {/* Left Section - Branding / Introduction */}
        <div className="hidden lg:flex lg:w-1/2 bg-[#0B1221] items-center justify-center px-16">
          <div className="text-center">
            <h1 className="text-white text-5xl font-bold mb-4">
              Welcome to MediScript
            </h1>
            <p className="text-gray-300 text-xl italic mb-6">
              Automating clinical documentation with a voice-driven system
            </p>

            <div className="text-gray-200 text-left max-w-md mx-auto">
              <h2 className="text-xl font-semibold mb-2">How to use MediScript</h2>
              <ol className="list-decimal list-inside space-y-1">
                <li>Click on "Start Consultation" to capture voice input.</li>
                <li>Verify transcribed text and extracted details.</li>
                <li>Generate digital prescription and share with pharmacy.</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Right Section - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center bg-white px-8">
          <div className="w-full max-w-md">
            <h2 className="text-3xl font-semibold mb-8 text-center italic">
              Sign in to your account
            </h2>

            <form className="space-y-6" onSubmit={handleLogin}>
              <div>
                <label
                  htmlFor="userId"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  User ID
                </label>
                <input
                  type="text"
                  placeholder="Enter your ID (e.g., DOC1001)"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-100 border-0 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-100 border-0 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div className="text-left">
                <Link
                  to="/forgot-pwd"
                  className="text-sm text-gray-700 hover:text-gray-900"
                >
                  Forgot password?
                </Link>
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-3 px-4 rounded transition-colors"
                >
                  Login
                </button>
              </div>
            </form>

            {error && <p className="text-red-500 text-center mt-3">{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;