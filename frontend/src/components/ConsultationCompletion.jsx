import { useState } from "react";
import { ArrowLeft, User, FileText, CheckCircle } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import PrescriptionForm from "./PrescriptionForm";

export default function ConsultationCompletion() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const { convo_id, convo_number, transcript, summary, doctor, patient } = location.state || {};

  if (!doctor || !patient) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Missing doctor or patient data.
      </div>
    );
  }

  const [editableSummary, setEditableSummary] = useState(summary || "");
  const [diagnosis, setDiagnosis] = useState("");
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [formData, setFormData] = useState({
    diagnosis: "",
    additionalNotes: ""
  });

  const [prescribedMedicines, setPrescribedMedicines] = useState([
    {
      id: Date.now(),
      medicine_id: "",
      dosage: "",
      frequency: "",
      duration: "",
      quantity: 1,
      instructions: ""
    }
  ]);

  const handleAddMedicine = () => {
    setPrescribedMedicines([
      ...prescribedMedicines,
      {
        id: Date.now(),
        medicine_id: "",
        dosage: "",
        frequency: "",
        duration: "",
        quantity: 1,
        instructions: ""
      }
    ]);
  };

  const handleRemove = (id) => {
    setPrescribedMedicines(prescribedMedicines.filter(m => m.id !== id));
  };


  const handleSubmit = async (e) => {
  e.preventDefault();
  setSaving(true);

  try {
    /* ===============================
       1️⃣ SAVE CLINICAL SUMMARY
    =============================== */
    const summaryRes = await fetch(
      "http://localhost:5000/clinical-summaries",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          convo_id,
          subjective: editableSummary,
          objective: editableSummary,
          assessment: editableSummary,
          plan: editableSummary,
        }),
      }
    );

    if (!summaryRes.ok) {
      throw new Error("Failed to save clinical summary");
    }

    const summaryData = await summaryRes.json();
    const summary_id = summaryData.summary_id;

    /* ===============================
       2️⃣ SAVE ENCRYPTED DIAGNOSIS
    =============================== */
    const diagnosisRes = await fetch(
      "http://localhost:5000/diagnosis",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          summary_id,
          diagnosis: formData.diagnosis,
        }),
      }
    );

    if (!diagnosisRes.ok) {
      throw new Error("Failed to save diagnosis");
    }

    /* ===============================
       3️⃣ SUCCESS FLOW
    =============================== */
    setSaving(false);
    setShowSuccess(true);

    setTimeout(() => {
      navigate("/dashboard");
    }, 2000);

  } catch (error) {
    console.error("CONSULTATION SAVE ERROR:", error);
    setSaving(false);
    alert("Failed to save consultation data");
  }
};

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-md p-4 flex justify-between items-center">
        <button
          onClick={() => navigate("/dashboard")}
          className="text-blue-600 flex items-center gap-2 hover:text-blue-800 transition"
        >
          <ArrowLeft size={18} /> Back
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Complete Consultation</h1>
      </header>

      {showSuccess && (
        <div className="fixed top-20 right-4 bg-green-500 text-white px-4 py-2 rounded flex gap-2 shadow-lg animate-fade-in">
          <CheckCircle /> Saved successfully
        </div>
      )}

      <main className="max-w-6xl mx-auto p-6 grid gap-6">
        {/* Doctor & Patient Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-gray-700 font-semibold">
              <User /> Doctor
            </div>
            <div className="text-gray-800 text-lg font-medium">{doctor?.name}</div>
            <div className="text-gray-500">{doctor?.specialization}</div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-gray-700 font-semibold">
              <User /> Patient
            </div>
            <div className="text-gray-800 text-lg font-medium">{patient?.name}</div>
            <div className="text-gray-500">{patient?.blood_group}</div>
          </div>
        </div>

        {/* Summary Card */}
          {editableSummary && (
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500 relative">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2 text-gray-700 font-semibold text-lg">
                  <FileText size={20} /> Consultation Summary
                </div>
                {/* Copy button */}
                <button
                  type="button"
                  onClick={() => navigator.clipboard.writeText(editableSummary)}
                  className="text-purple-600 hover:text-purple-800 transition"
                  title="Copy summary"
                >
                  Copy
                </button>
              </div>

              <textarea
                className="w-full border border-gray-200 rounded-lg p-4 focus:ring-2 focus:ring-purple-400 focus:outline-none text-gray-800 placeholder-gray-400 resize-none min-h-[120px]"
                rows={6}
                value={editableSummary}
                onChange={(e) => setEditableSummary(e.target.value)}
                placeholder="AI-generated summary will appear here..."
              />

              {/* Optional: character count */}
              <div className="text-right text-gray-400 text-sm mt-1">
                {editableSummary.length} characters
              </div>
            </div>
          )}


        {/* Consultation Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 flex flex-col gap-6">
          <div>
            <label className="block font-semibold text-gray-700 mb-2">Diagnosis</label>
            <textarea
              required
              placeholder="Enter diagnosis"
              className="w-full border rounded-md p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              rows={4}
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
            />
          </div>

          {/* Prescription Form */}
          <PrescriptionForm onChange={setPrescribedMedicines} />

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              {saving ? "Saving..." : "Save Consultation"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
