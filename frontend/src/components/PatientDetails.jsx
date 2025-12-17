import { useLocation, useNavigate, useParams } from "react-router-dom";
import { User, Mic } from "lucide-react";

export default function PatientDetails() {
  const { patientId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { patient, doctorProfile } = location.state || {};

  // Safely extract details (use fallback values)
  const displayName = patient?.name || "Unknown Patient";
  const displayId = patient?.patient_id || patientId || "Unknown ID";
  const displayAge = patient?.age || "N/A";
  const displayGender = patient?.gender || "N/A";
  const displayContact = patient?.contact || "N/A";

  const startListening = () => {
    navigate("/listening", {
      state: {
        from: "patient-details",
        doctorProfile,
        patient: {
          patient_id: displayId,
          name: displayName,
          age: displayAge,
          gender: displayGender,
          contact: displayContact,
        },
      },
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-md border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-[#eff6ff] p-2 rounded-full">
              <User className="w-6 h-6 text-[#2563eb]" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#1e3a8a]">
                Patient Details
              </h1>
              <p className="text-sm text-[#4b5563]">
                ID:{" "}
                <span className="font-medium text-[#2563eb]">{displayId}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate(-1)}
              className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm"
            >
              Back
            </button>
            <button
              onClick={startListening}
              className="px-4 py-2 bg-[#2563eb] text-white rounded-lg hover:bg-[#1e40af] font-medium"
            >
              <Mic className="inline w-4 h-4 mr-2" />
              Start Listening
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-[#1e3a8a] mb-4">
            {displayName}
          </h2>

          <div className="space-y-3 text-sm text-[#4b5563]">
            <div>
              <span className="font-medium text-[#2563eb]">Patient ID: </span>
              <span>{displayId}</span>
            </div>
            <div>
              <span className="font-medium text-[#2563eb]">Name: </span>
              <span>{displayName}</span>
            </div>
            <div>
              <span className="font-medium text-[#2563eb]">Age: </span>
              <span>{displayAge}</span>
            </div>
            <div>
              <span className="font-medium text-[#2563eb]">Gender: </span>
              <span>{displayGender}</span>
            </div>
            <div>
              <span className="font-medium text-[#2563eb]">Contact: </span>
              <span>{displayContact}</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
