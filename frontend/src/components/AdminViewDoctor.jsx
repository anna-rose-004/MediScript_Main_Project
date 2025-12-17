import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function DoctorProfile() {
  const { id } = useParams(); // doctor ID from URL
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/users/${id}`,
          { credentials: "include" }
        );

        const result = await res.json();

        if (!res.ok || !result.user || result.user.role !== "doctor") {
          console.warn("Invalid doctor, using fallback.");
          setDoctor({
            id: "-",
            name: "Dr. Default",
            specialization: "General Medicine",
            education: "MBBS",
            license_number: "-",
            email: "default@hospital.com",
            phone: "+91 0000000000",
          });
        } else {
          setDoctor(result.user);
        }
      } catch (err) {
        console.error("Fetch doctor error:", err);
        setDoctor({
          id: "-",
          name: "Dr. Default",
          specialization: "General Medicine",
          education: "MBBS",
          license_number: "-",
          email: "default@hospital.com",
          phone: "+91 0000000000",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Loading doctor profile...</p>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 bg-white min-h-screen">
        <Navbar />

        <div className="p-6">
          {/* Back Button */}
          <div
            className="flex items-center gap-2 mb-6 cursor-pointer"
            onClick={() => navigate(-1)}
          >
            <button className="p-2 rounded-full hover:bg-gray-200">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h2 className="text-2xl font-semibold">Doctor Profile</h2>
          </div>

          {/* Main Info Card */}
          <div className="bg-[#c7cfee] p-6 rounded-2xl shadow-sm">
            <div className="bg-white rounded-xl p-6 shadow-sm">

              <div className="flex flex-col items-center text-center md:flex-row md:text-left md:items-start gap-6">
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-5xl text-gray-500">👤</span>
                </div>
                <div>
                  <p><span className="font-medium">Doctor ID:</span> {doctor.user_id || doctor.id}</p>
                  <p><span className="font-medium">Name:</span> {doctor.name}</p>
                </div>
              </div>

              {/* Professional Info */}
              <div className="mt-8 border-t pt-4">
                <h3 className="font-semibold text-indigo-800 mb-2">Professional Information</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Education</p>
                    <p className="font-medium">{doctor.education || "MBBS"}</p>
                  </div>

                  <div>
                    <p className="text-gray-500">Specialization</p>
                    <p className="font-medium">{doctor.specialization || "General Medicine"}</p>
                  </div>

                  <div>
                    <p className="text-gray-500">License Number</p>
                    <p className="font-medium">{doctor.license_number || "-"}</p>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="mt-8 border-t pt-4">
                <h3 className="font-semibold text-indigo-800 mb-2">Contact Information</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Email</p>
                    <p className="font-medium">{doctor.email}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Phone</p>
                    <p className="font-medium">{doctor.phone}</p>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
