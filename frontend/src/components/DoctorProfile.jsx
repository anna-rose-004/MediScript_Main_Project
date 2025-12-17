import { useState } from "react";
import { X, User } from "lucide-react";

export default function DoctorProfile({ doctorProfile, isOpen, onClose }) {
  if (!isOpen) return null; // don't render if not open

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg w-96 p-6 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold text-[#1e3a8a] mb-4 flex items-center space-x-2">
          <User className="w-6 h-6" />
          <span>Doctor Profile</span>
        </h2>

        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-[#eff6ff] rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-[#2563eb]" />
            </div>
            <div>
              <h3 className="font-semibold text-[#1e3a8a] text-lg">{doctorProfile?.name}</h3>
              <p className="text-sm text-[#4b5563]">{doctorProfile?.specialization}</p>
              <p className="text-sm text-[#4b5563]">License: <span className="font-medium text-[#2563eb]">{doctorProfile?.license_number}</span></p>
              <p className="text-sm text-[#4b5563]">Email: <span className="font-medium text-[#2563eb]">{doctorProfile?.email}</span></p>
              <p className="text-sm text-[#4b5563]">Phone: <span className="font-medium text-[#2563eb]">{doctorProfile?.phone}</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
