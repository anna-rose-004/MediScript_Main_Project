import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function Dashboard() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 bg-[#e5e6f0] min-h-screen">
        <Navbar />
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-6 text-blue-900">Dashboard</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded shadow text-blue-900">Doctors: 50</div>
            <div className="bg-white p-6 rounded shadow text-blue-900">Patients: 120</div>
            <div className="bg-white p-6 rounded shadow text-blue-900">Appointments: 30</div>
          </div>
        </div>
      </div>
    </div>
  );
}
