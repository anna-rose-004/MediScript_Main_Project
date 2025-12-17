import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="w-64 bg-white text-white min-h-screen p-6 flex flex-col">
      <h1 className="text-2xl font-bold mb-6 text-blue-900">MediScript</h1>
      <nav className="flex flex-col gap-4">
        <Link to="/admin-dashboard" className="hover:bg-[#8ca1e1] p-2 rounded text-blue-900">Dashboard</Link>
        <Link to="/manage-doctors" className="hover:bg-[#8ca1e1] p-2 rounded text-blue-900">Manage Doctors</Link>
        <Link to="/manage-patients" className="hover:bg-[#8ca1e1] p-2 rounded text-blue-900">Manage Patients</Link>
         <Link to="/manage-patients" className="hover:bg-[#8ca1e1] p-2 rounded text-blue-900">Settings</Link>
      </nav>
    </div>
  );
}
