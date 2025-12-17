import { useState } from 'react';
import { ArrowLeft, Save, Pill, Plus, Trash2, User, FileText, CheckCircle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function ConsultationCompletion() {
  const navigate = useNavigate();
  const location = useLocation();

  // get passed items from listening page
  const { transcript, summary, doctor, patient } = location.state || {};

  if (!doctor || !patient) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Missing doctor or patient data.
      </div>
    );
  }

const [editableTranscript, setEditableTranscript] = useState(transcript || "");
  const [editableSummary, setEditableSummary] = useState(summary || "");
  const [showSuccess, setShowSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);

    setTimeout(() => {
      setSaving(false);
      setShowSuccess(true);

      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-white">

      <header className="bg-white shadow border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <button onClick={() => navigate('/dashboard')} className="flex items-center space-x-2 text-blue-600">
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>

          <h1 className="text-2xl font-bold text-blue-900">Complete Consultation</h1>
        </div>
      </header>

      {showSuccess && (
        <div className="fixed top-20 right-4 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3">
          <CheckCircle className="w-6 h-6" />
          <span>Prescription saved successfully!</span>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 py-8">

        {/* Doctor & Patient */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

          <div className="bg-white p-6 border rounded shadow">
            <h2 className="font-bold flex items-center space-x-2 mb-2">
              <User className="w-5 h-5" /> Doctor
            </h2>
            <p>ID: {doctor.user_id}</p>
            <p>Name: {doctor.name}</p>
            <p>Specialization: {doctor.specialization}</p>
            <p>License: {doctor.license_number}</p>
          </div>

          <div className="bg-white p-6 border rounded shadow">
            <h2 className="font-bold flex items-center space-x-2 mb-2">
              <User className="w-5 h-5" /> Patient
            </h2>
            <p>ID: {patient.patient_id}</p>
            <p>Name: {patient.name}</p>
            <p>Blood Group: {patient.blood_group}</p>
            <p>Allergies: {patient.allergies?.join(", ") || "None"}</p>
          </div>
        </div>

        {/* Transcript */}
        {editableSummary && (
        <div className="bg-green-50 p-6 border rounded mb-6">
          <h2 className="font-bold flex items-center space-x-2 mb-2">
            <FileText className="w-5 h-5" /> AI Summarisation (CRT)
          </h2>

          <textarea
            className="w-full p-3 border rounded"
            rows={10}
            value={editableSummary}
            onChange={(e) => setEditableSummary(e.target.value)}
          />
        </div>
      )}


        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="bg-white p-6 border rounded mb-6">

            <h2 className="font-bold flex items-center space-x-2 mb-2">
              Diagnosis
            </h2>

            <textarea
              className="w-full p-2 border rounded"
              required
              rows={4}
              value={formData.diagnosis}
              onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
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
                    placeholder="Medicine Name"
                    value={med.medicine_id}
                    onChange={(e) =>
                      setPrescribedMedicines(
                        prescribedMedicines.map(x =>
                          x.id === med.id ? { ...x, medicine_id: e.target.value } : x
                        )
                      )
                    }
                    className="border p-2 rounded"
                    required
                  />

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

            <button type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded">
              {saving ? "Saving..." : "Save Prescription"}
            </button>
          </div>

        </form>

      </main>

    </div>
  );
}
