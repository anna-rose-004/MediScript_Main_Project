import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mic, AlertCircle } from 'lucide-react';

export default function ListeningPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { doctor, patient } = location.state || {};

  const [transcript, setTranscript] = useState("");

  const summarizeTranscript = async () => {
  try {
    setLoading(true);
    setError("");

    const response = await fetch("http://localhost:5001/summarize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ transcript }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Summarization failed");
    }

    setSummary(data.summary);   

  } catch (err) {
    console.error(err);
    setError("Summarization failed");
  } finally {
    setLoading(false);
  }
};

const saveConversationAndNavigate = async () => {
  const token = localStorage.getItem("token");

  // 1️⃣ Create conversation
  const convoRes = await fetch("http://localhost:5000/conversations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      patient_id: patient.patient_id,
    }),
  });

  const convoData = await convoRes.json();
  const { convo_id, convo_number } = convoData;

  // 2️⃣ Save transcript
  await fetch("http://localhost:5000/transcripts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      convo_id,
      text: transcript,
      confidence: 0.95,
    }),
  });

  // 3️⃣ Navigate to completion page
  navigate("/consultation", {
    state: {
      convo_id,
      convo_number,
      transcript,
      summary,
      doctor,
      patient,
    },
  });
};



  /*const goToConsultation = () => {
  navigate("/consultation", {
    state: {
      transcript,
      summary,   // ✅ PASS SUMMARY
      doctor,
      patient
    }
  });
};*/



  return (
    <div className="min-h-screen bg-white">
      
      {/* Header */}
      <header className="bg-white shadow-md border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          
          <div className="flex items-center space-x-3">
            <div className="bg-[#eff6ff] p-2 rounded-full">
              <Mic className="w-6 h-6 text-[#2563eb]" />
            </div>

            <div>
              <h1 className="text-xl font-bold text-[#1e3a8a]">
                Voice Typing Mode (Win + H to start)
              </h1>

              {patient && (
                <p className="text-sm text-[#4b5563] mt-1">
                  Patient: <span className="font-medium text-[#2563eb]">
                    {patient.name} ({patient.patient_id})
                  </span>
                </p>
              )}
            </div>
          </div>

        </div>
      </header>

      {/* Main */}
      <main className="max-w-4xl mx-auto px-4 py-8">

        <div className="mb-3 flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-blue-600" />
          <span className="text-blue-600 font-medium">
            Press **Win + H** and start speaking
          </span>
        </div>

        {/* Windows Voice Typing Target (textarea) */}
        <textarea
          className="w-full min-h-[300px] border border-gray-300 p-4 rounded-lg focus:outline-blue-500 text-gray-800"
          placeholder="Click here, then press Win + H to start dictation..."
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
        />
        <button
          onClick={summarizeTranscript}
          className="px-4 py-2 bg-green-600 text-white rounded-lg"
        >
          Generate Summary
        </button>


        {/* Continue */}
        {transcript.trim().length > 0 && (
          <div className="mt-6 flex justify-end">
            <button
              onClick={saveConversationAndNavigate}
              disabled={!summary || loading}
              className={`px-4 py-2 rounded-lg ${
                !summary
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#2563eb] text-white"
              }`}
            >
              Go to Consultation
            </button>

          </div>
        )}

      </main>
    </div>
  );
}
