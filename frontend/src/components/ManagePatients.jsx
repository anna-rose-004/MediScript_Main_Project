import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function ManagePatients() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch patients (ADMIN / AUTHORIZED USER)
  useEffect(() => {
    const fetchPatients = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Unauthorized. Please login again.");
        navigate("/login");
        return;
      }

      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/patients`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        if (!res.ok) {
          console.error("Failed fetching patients:", data);
          setPatients([]);
        } else {
          setPatients(data.patients);
        }
      } catch (err) {
        console.error("Error fetching patients:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, [navigate]);

  // Delete patient
  const deletePatient = async (patientId) => {
    if (!window.confirm("Delete this patient?")) return;

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Unauthorized. Please login again.");
      navigate("/login");
      return;
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/patients/${patientId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert("Error deleting patient");
        return;
      }

      alert("Patient deleted successfully");
      setPatients((prev) =>
        prev.filter((p) => p.patient_id !== patientId)
      );
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete patient.");
    }
  };

  if (loading) return <div className="p-6">Loading patients...</div>;

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 bg-[#e5e6f0] min-h-screen">
        <Navbar />

        <div className="p-6">
          <h1 className="text-3xl font-bold mb-6 text-blue-900">
            Manage Patients
          </h1>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg shadow">
              <thead>
                <tr className="bg-[#c7cfee]">
                  <th className="text-left p-3">Name</th>
                  <th className="text-left p-3">Age</th>
                  <th className="text-left p-3">Patient ID</th>
                  <th className="text-left p-3">Actions</th>
                </tr>
              </thead>

              <tbody>
                {patients.length === 0 ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="text-center p-4 text-gray-600"
                    >
                      No patients found.
                    </td>
                  </tr>
                ) : (
                  patients.map((p) => (
                    <tr
                      key={p.patient_id}
                      className="border-t hover:bg-gray-50"
                    >
                      <td className="p-3 text-blue-900">{p.name}</td>
                      <td className="p-3 text-blue-900">{p.age}</td>
                      <td className="p-3 text-blue-900">
                        {p.patient_id}
                      </td>

                      <td className="p-3">
                        <button
                          onClick={() =>
                            deletePatient(p.patient_id)
                          }
                          className="bg-red-600 text-white px-3 py-1 rounded"
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
