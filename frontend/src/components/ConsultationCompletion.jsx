import { useState } from 'react';
import { ArrowLeft, Save, Pill, Plus, Trash2, User, FileText, CheckCircle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import PrescriptionPreview from "../components/PrescriptionPreview";


export default function ConsultationCompletion() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  // get passed items from listening page
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
  const [showPreview, setShowPreview] = useState(false);

  const [formData, setFormData] = useState({
    diagnosis: "",
    additionalNotes: ""
  });
  const [searchResults, setSearchResults] = useState({});
  const [searchLoading, setSearchLoading] = useState(false);

  const searchMedicine = async (query, rowId) => {
    const currentMed = prescribedMedicines.find(m => m.id === rowId);
    if (!query || query.length < 2 || currentMed?.medicine_id) return;
    setSearchLoading(true);

    try {
      const res = await fetch(
        `http://localhost:5000/diagnosis/search?query=${query}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      if (!res.ok) {
      throw new Error("Search API failed");
      }

      const data = await res.json();

      setSearchResults(prev => ({
        ...prev,
        [rowId]: data
      }));

    } catch (err) {
      console.error("MEDICINE SEARCH ERROR:", err);
    } finally {
      setSearchLoading(false);
    }
  };

  const [prescribedMedicines, setPrescribedMedicines] = useState([
    {
      id: Date.now(),medicine_id: "",name: "",dosage: "",frequency: "",duration: "",quantity: 1,
      availability_status: "unknown",
      instructions: ""
    }
  ]);

  const handleAddMedicine = () => {
    setPrescribedMedicines([
      ...prescribedMedicines,
      {
        id: Date.now(),
        medicine_id: "",
        name: "",
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

  const prescriptionData = {
  date: new Date().toLocaleDateString(),

  doctor: {
    name: doctor.name,
    specialization: doctor.specialization,
    license: doctor.license_number
  },

  patient: {
    id: patient.patient_id,
    name: patient.name,
    age: patient.age
  },

  medicines: prescribedMedicines.map(m => ({
    name: m.name,
    dosage: m.dosage,
    frequency: m.frequency,
    duration: m.duration,
    quantity: m.quantity
  }))
};


    const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
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

      const prescriptionRes = await fetch("http://localhost:5000/prescriptions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          doctor_id: doctor.user_id,
          patient_id: patient.patient_id,
          medicines: prescribedMedicines
        })
      });
      if (!prescriptionRes.ok) {
        throw new Error("Failed to save prescription");
      }

      console.log("Submitting payload:", {
    diagnosis: formData.diagnosis,
    summary: editableSummary,
    medicines: prescribedMedicines,
    patient_id: patient.patient_id,
    doctor_id: doctor.user_id,
    conversation_number: convo_number
  });

      setSaving(false);
      setShowSuccess(true);
      setShowPreview(true);
      console.log("SETTING PREVIEW TRUE");

      /*setTimeout(() => {
        navigate("/dashboard");
      }, 2000);*/

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

          {/* Medicines */}
          <div className="bg-white p-6 border rounded mb-6">

            <div className="flex justify-between mb-4">
              <h2 className="font-bold flex items-center space-x-2">
                <Pill className="w-5 h-5" /> Prescription
              </h2>
              <button type="button" onClick={handleAddMedicine}
                className="px-3 py-1 bg-blue-600 text-white rounded">
                Add Medicine
              </button>
            </div>

            {prescribedMedicines.map((med, index) => (
              <div key={med.id} className="border p-4 bg-gray-50 rounded mb-3">

                <div className="flex justify-between mb-2">
                  <span className="font-semibold">Medicine {index + 1}</span>

                  {prescribedMedicines.length > 1 && (
                    <button type="button" onClick={() => handleRemove(med.id)} className="text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

                  <input
                    type="text"
                    placeholder="Search medicine"
                    value={med.name || ""}
                    onChange={(e) => {
                        const value = e.target.value;

                        setPrescribedMedicines(
                          prescribedMedicines.map(x =>
                            x.id === med.id ? { ...x, name: value, medicine_id: "" } : x
                          )
                        );
                        if (value.length < 2) {
                          setSearchResults(prev => {
                            const copy = { ...prev };
                            delete copy[med.id];
                            return copy;
                          });
                          return;
                        }

                        searchMedicine(value, med.id);
                      }}
                    className="border p-2 rounded"
                    required
                  />

                  {med.name.length >= 2 && searchResults[med.id] && (
                    <div className="mt-2 border rounded p-2 bg-white text-sm max-h-40 overflow-y-auto">

                      {searchResults[med.id].available ? (
                        <>
                          <p className="text-green-600 font-semibold">
                            Available in hospital
                          </p>

                          {Array.isArray(searchResults[med.id]?.medicines) &&
                            searchResults[med.id].medicines.map(m => (
                            <button
                              key={m.medicine_id}
                              type="button"
                              className="block w-full text-left px-2 py-1 hover:bg-blue-50"
                              onClick={() => {
                                setPrescribedMedicines(
                                  prescribedMedicines.map(x =>
                                    x.id === med.id
                                      ? {
                                          ...x,
                                          medicine_id: m.medicine_id,
                                          name: m.name,
                                          availability_status: "available"
                                        }
                                      : x
                                  )
                                );
                                setSearchResults(prev => {
                                    const copy = { ...prev };
                                    delete copy[med.id];
                                    return copy;
                                  });
                              }}
                            >
                              {m.name}
                            </button>
                          ))}
                        </>
                      ) : (
                        <>
                          <p className="text-red-600 font-semibold">
                            Not available. Alternatives:
                          </p>

                          {Array.isArray(searchResults[med.id]?.alternatives) &&
                            searchResults[med.id].alternatives.map(a => (

                            <button
                              key={a.medicine_id}
                              type="button"
                              className="block w-full text-left px-2 py-1 hover:bg-yellow-50"
                              onClick={() => {
                                setPrescribedMedicines(
                                  prescribedMedicines.map(x =>
                                    x.id === med.id
                                      ? {
                                          ...x,
                                          medicine_id: a.medicine_id,
                                          name: a.name,
                                          availability_status: "substituted"
                                        }
                                      : x
                                  )
                                );
                                setSearchResults(prev => {
                                  const copy = { ...prev };
                                  delete copy[med.id];
                                  return copy;
                                });
                              }}
                            >
                              {a.name}
                            </button>
                          ))}
                        </>
                      )}

                    </div>
                  )}
                  <input
                    type="text"
                    placeholder="Dosage"
                    value={med.dosage}
                    onChange={(e) =>
                      setPrescribedMedicines(
                        prescribedMedicines.map(x =>
                          x.id === med.id ? { ...x, dosage: e.target.value } : x
                        )
                      )
                    }
                    className="border p-2 rounded"
                    required
                  />
                  <select
                    value={med.frequency}
                    onChange={(e) =>
                      setPrescribedMedicines(
                        prescribedMedicines.map(x =>
                          x.id === med.id ? { ...x, frequency: e.target.value } : x
                        )
                      )
                    }
                    className="border p-2 rounded"
                    required
                  >
                    <option value="">Select Frequency</option>
                    <option value="1-0-0">Morning (1-0-0)</option>
                    <option value="0-1-0">Afternoon (0-1-0)</option>
                    <option value="0-0-1">Night (0-0-1)</option>
                    <option value="1-0-1">Morning & Night (1-0-1)</option>
                    <option value="0-1-1">Afternoon & Night (0-1-1)</option>
                    <option value="1-1-1">Morning, Afternoon & Night (1-1-1)</option>
                  </select>
                  
                  <select
                    value={med.duration}
                    onChange={(e) =>
                      setPrescribedMedicines(
                        prescribedMedicines.map(x =>
                          x.id === med.id ? { ...x, duration: e.target.value } : x
                        )
                      )
                    }
                    className="border p-2 rounded"
                    required
                  >
                    <option value="">Select Duration</option>
                    <option value="3 days">3 days</option>
                    <option value="5 days">5 days</option>
                    <option value="7 days">7 days</option>
                    <option value="10 days">10 days</option>
                    <option value="14 days">14 days</option>
                    <option value="30 days">30 days</option>
                  </select>

                  <select
                    value={med.quantity}
                    onChange={(e) =>
                      setPrescribedMedicines(
                        prescribedMedicines.map(x =>
                          x.id === med.id ? { ...x, quantity: Number(e.target.value) } : x
                        )
                      )
                    }
                    className="border p-2 rounded"
                    required
                  >
                    <option value="">Qty</option>
                    {[...Array(30)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}

          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3">
            <button type="button" onClick={() => navigate('/dashboard')}
              className="px-6 py-2 bg-gray-200 rounded">
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
          {/* Prescription Preview */}
          {showPreview && (
            <div className="mt-10">

              <PrescriptionPreview data={prescriptionData} />

              <div className="flex justify-end mt-4 space-x-3">
                <button
                  onClick={() => window.print()}
                  className="px-5 py-2 bg-green-600 text-white rounded"
                >
                  Print Prescription
                </button>

                <button
                  onClick={() => navigate("/dashboard")}
                  className="px-5 py-2 bg-blue-600 text-white rounded"
                >
                  Back to Dashboard
                </button>
              </div>

            </div>
          )}
      </main>
    </div>
  );
}