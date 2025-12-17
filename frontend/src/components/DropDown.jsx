import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, ChevronDown } from 'lucide-react';

export default function DoctorDropdown({ doctorProfile }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    try {
      localStorage.removeItem("token");
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center space-x-2 px-4 py-2 bg-white border-2 border-[#2563eb] text-[#2563eb] rounded-lg hover:bg-[#eff6ff]"
      >
        <User className="w-5 h-5" />
        <span className="font-medium">{doctorProfile?.name}</span>
        <ChevronDown className="w-4 h-4" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg z-50">
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 hover:bg-red-100 text-red-600 font-medium"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
