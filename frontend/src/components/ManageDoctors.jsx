import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function ManageDoctors() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch doctors from backend (Supabase-powered)
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/doctors`,
          { credentials: "include" }
        );

        const data = await res.json();

        if (!res.ok || !data.doctors) {
          console.error("Failed fetching doctors");
          setDoctors([]);
        } else {
          setDoctors(data.doctors);
        }
      } catch (err) {
        console.error("Error fetching doctors:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  // Delete doctor
  const handleDeleteDoctor = async (doctorId) => {
    if (!window.confirm("Are you sure you want to delete this doctor?")) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/doctors/${doctorId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert("Error deleting doctor: " + (data.error || "Unknown error"));
        return;
      }

      alert("Doctor deleted successfully");
      setDoctors((prev) => prev.filter((d) => d.id !== doctorId));
    } catch (err) {
      console.error("Delete doctor error:", err);
      alert("Failed to delete doctor.");
    }
  };

  if (loading) return <div className="p-6">Loading doctors...</div>;

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 bg-[#e5e6f0] min-h-screen">
        <Navbar />

        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-blue-900">Manage Doctors</h1>

            <button
              onClick={() => navigate("/add-doctor")}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
            >
              Add Doctor
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg shadow-md overflow-hidden">
              <thead>
                <tr className="bg-[#c7cfee] text-left">
                  <th className="p-3">ID</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Specialization</th>
                  <th className="p-3">License No.</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {doctors.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center p-4 text-gray-600">
                      No doctors found
                    </td>
                  </tr>
                ) : (
                  doctors.map((doc) => (
                    <tr key={doc.id} className="border-t hover:bg-gray-50">
                      <td className="p-3 text-blue-900">{doc.user_id}</td>
                      <td className="p-3 text-blue-900">{doc.name}</td>
                      <td className="p-3 text-blue-900">
                        {doc.specialization || "General"}
                      </td>
                      <td className="p-3 text-blue-900">
                        {doc.license_number || "-"}
                      </td>

                      <td className="p-3 text-center space-x-2">
                        <button
                          onClick={() => navigate(`/doctor-profile/${doc.id}`)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                        >
                          View
                        </button>

                        <button
                          onClick={() => handleDeleteDoctor(doc.id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
