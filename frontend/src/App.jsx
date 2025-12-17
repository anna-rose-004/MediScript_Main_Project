import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminLogin from './components/AdminLogin.jsx';
import ManageDoctors from './components/ManageDoctors.jsx';
import ManagePatients from './components/ManagePatients.jsx';
import AdminViewDoctor from './components/AdminViewDoctor.jsx';
import AddDoctor from './components/AddDoctor.jsx';

import HomePage from './components/HomePage.jsx';
import ForgotPwd from './components/ForgotPwd.jsx';
import DoctorDashboard from './components/DoctorDashboard';
import PatientDetails from './components/PatientDetails.jsx';

import Dashboard from './components/Dashboard';

import ListeningPage from './components/ListeningPage';
import ConsultationCompletion from './components/ConsultationCompletion';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-dashboard" element={<Dashboard />} />
        <Route path="/manage-doctors" element={<ManageDoctors />} />
        <Route path="/doctor-profile/:id" element={<AdminViewDoctor />} />
        <Route path="/add-doctor" element={<AddDoctor />} />
        <Route path="/manage-patients" element={<ManagePatients />} />
        <Route path="/forgot-pwd" element={<ForgotPwd />} />
        
        <Route path="/dashboard" element={<DoctorDashboard />} />
        <Route path="/patient/:patientId" element={<PatientDetails />} />
        <Route path="/listening" element={<ListeningPage />} />
        <Route path="/consultation" element={<ConsultationCompletion />} />
      </Routes>
    </BrowserRouter>
  );
}