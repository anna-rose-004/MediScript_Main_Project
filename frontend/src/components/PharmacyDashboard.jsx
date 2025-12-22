import React, { useState } from 'react';
import { Search, Package, AlertCircle, CheckCircle, Plus, Edit2, Trash2, X, Activity, TrendingDown, FileText, ClipboardList, User, Calendar, Pill } from 'lucide-react';

export default function PharmacyDashboard() {
  const [userRole, setUserRole] = useState('pharmacist');
  const [activeTab, setActiveTab] = useState('inventory');
  const [medicines, setMedicines] = useState([
    { id: 1, name: 'Paracetamol 500mg', category: 'Analgesic', stock: 250, minStock: 50, price: 5.00, available: true, expiryDate: '2025-12-30' },
    { id: 2, name: 'Amoxicillin 500mg', category: 'Antibiotic', stock: 120, minStock: 30, price: 15.00, available: true, expiryDate: '2025-08-15' },
    { id: 3, name: 'Ibuprofen 400mg', category: 'Analgesic', stock: 0, minStock: 50, price: 8.00, available: false, expiryDate: '2026-01-20' },
    { id: 4, name: 'Metformin 500mg', category: 'Antidiabetic', stock: 180, minStock: 40, price: 12.00, available: true, expiryDate: '2025-11-10' },
    { id: 5, name: 'Lisinopril 10mg', category: 'Antihypertensive', stock: 15, minStock: 30, price: 20.00, available: true, expiryDate: '2025-09-25' },
    { id: 6, name: 'Omeprazole 20mg', category: 'Proton Pump Inhibitor', stock: 95, minStock: 25, price: 10.00, available: true, expiryDate: '2026-03-18' },
  ]);
  
  const [prescriptions, setPrescriptions] = useState([
    {
      id: 1,
      prescriptionNo: 'RX-2024-001',
      patientName: 'John Doe',
      patientAge: 45,
      doctorName: 'Dr. Sarah Williams',
      date: '2024-12-20',
      status: 'pending',
      medicines: [
        { medicineId: 1, medicineName: 'Paracetamol 500mg', dosage: '1 tablet', frequency: 'Three times daily', duration: '5 days', quantity: 15 },
        { medicineId: 2, medicineName: 'Amoxicillin 500mg', dosage: '1 tablet', frequency: 'Twice daily', duration: '7 days', quantity: 14 }
      ],
      notes: 'Take after meals'
    },
    {
      id: 2,
      prescriptionNo: 'RX-2024-002',
      patientName: 'Emma Smith',
      patientAge: 32,
      doctorName: 'Dr. Michael Chen',
      date: '2024-12-19',
      status: 'fulfilled',
      medicines: [
        { medicineId: 4, medicineName: 'Metformin 500mg', dosage: '1 tablet', frequency: 'Once daily', duration: '30 days', quantity: 30 }
      ],
      notes: 'Take with breakfast'
    },
    {
      id: 3,
      prescriptionNo: 'RX-2024-003',
      patientName: 'Robert Johnson',
      patientAge: 58,
      doctorName: 'Dr. Sarah Williams',
      date: '2024-12-21',
      status: 'pending',
      medicines: [
        { medicineId: 5, medicineName: 'Lisinopril 10mg', dosage: '1 tablet', frequency: 'Once daily', duration: '30 days', quantity: 30 },
        { medicineId: 3, medicineName: 'Ibuprofen 400mg', dosage: '1 tablet', frequency: 'As needed', duration: '10 days', quantity: 10 }
      ],
      notes: 'Monitor blood pressure regularly'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState(null);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    stock: '',
    minStock: '',
    price: '',
    expiryDate: ''
  });

  const [prescriptionForm, setPrescriptionForm] = useState({
    patientName: '',
    patientAge: '',
    doctorName: '',
    medicines: [{ medicineId: '', dosage: '', frequency: '', duration: '', quantity: '' }],
    notes: ''
  });

  const filteredMedicines = medicines.filter(med =>
    med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    med.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPrescriptions = prescriptions.filter(pres =>
    pres.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pres.prescriptionNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pres.doctorName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddMedicine = () => {
    if (formData.name && formData.category && formData.stock && formData.price) {
      const newMedicine = {
        id: medicines.length + 1,
        name: formData.name,
        category: formData.category,
        stock: parseInt(formData.stock),
        minStock: parseInt(formData.minStock) || 20,
        price: parseFloat(formData.price),
        expiryDate: formData.expiryDate || '2026-12-31',
        available: parseInt(formData.stock) > 0
      };
      setMedicines([...medicines, newMedicine]);
      setFormData({ name: '', category: '', stock: '', minStock: '', price: '', expiryDate: '' });
      setShowAddModal(false);
    }
  };

  const handleUpdateMedicine = () => {
    if (editingMedicine && formData.name && formData.category && formData.stock && formData.price) {
      setMedicines(medicines.map(med => 
        med.id === editingMedicine.id 
          ? {
              ...med,
              name: formData.name,
              category: formData.category,
              stock: parseInt(formData.stock),
              minStock: parseInt(formData.minStock) || 20,
              price: parseFloat(formData.price),
              expiryDate: formData.expiryDate || '2026-12-31',
              available: parseInt(formData.stock) > 0
            }
          : med
      ));
      setEditingMedicine(null);
      setFormData({ name: '', category: '', stock: '', minStock: '', price: '', expiryDate: '' });
    }
  };

  const handleDeleteMedicine = (id) => {
    if (window.confirm('Are you sure you want to delete this medicine?')) {
      setMedicines(medicines.filter(med => med.id !== id));
    }
  };

  const handleEditClick = (medicine) => {
    setEditingMedicine(medicine);
    setFormData({
      name: medicine.name,
      category: medicine.category,
      stock: medicine.stock.toString(),
      minStock: medicine.minStock.toString(),
      price: medicine.price.toString(),
      expiryDate: medicine.expiryDate
    });
  };

  const handleAddPrescription = () => {
    if (prescriptionForm.patientName && prescriptionForm.doctorName) {
      const newPrescription = {
        id: prescriptions.length + 1,
        prescriptionNo: `RX-2024-${(prescriptions.length + 1).toString().padStart(3, '0')}`,
        patientName: prescriptionForm.patientName,
        patientAge: parseInt(prescriptionForm.patientAge),
        doctorName: prescriptionForm.doctorName,
        date: new Date().toISOString().split('T')[0],
        status: 'pending',
        medicines: prescriptionForm.medicines.filter(m => m.medicineId).map(m => ({
          ...m,
          medicineName: medicines.find(med => med.id === parseInt(m.medicineId))?.name || '',
          quantity: parseInt(m.quantity)
        })),
        notes: prescriptionForm.notes
      };
      setPrescriptions([newPrescription, ...prescriptions]);
      setPrescriptionForm({
        patientName: '',
        patientAge: '',
        doctorName: '',
        medicines: [{ medicineId: '', dosage: '', frequency: '', duration: '', quantity: '' }],
        notes: ''
      });
      setShowPrescriptionModal(false);
    }
  };

  const handleFulfillPrescription = (prescriptionId) => {
    const prescription = prescriptions.find(p => p.id === prescriptionId);
    if (prescription) {
      const canFulfill = prescription.medicines.every(med => {
        const medicine = medicines.find(m => m.id === med.medicineId);
        return medicine && medicine.stock >= med.quantity;
      });

      if (canFulfill) {
        prescription.medicines.forEach(med => {
          setMedicines(medicines.map(m => 
            m.id === med.medicineId 
              ? { ...m, stock: m.stock - med.quantity, available: (m.stock - med.quantity) > 0 }
              : m
          ));
        });
        setPrescriptions(prescriptions.map(p =>
          p.id === prescriptionId ? { ...p, status: 'fulfilled' } : p
        ));
        alert('Prescription fulfilled successfully!');
      } else {
        alert('Cannot fulfill prescription. Some medicines are out of stock or insufficient quantity.');
      }
    }
  };

  const addMedicineToPrescription = () => {
    setPrescriptionForm({
      ...prescriptionForm,
      medicines: [...prescriptionForm.medicines, { medicineId: '', dosage: '', frequency: '', duration: '', quantity: '' }]
    });
  };

  const updatePrescriptionMedicine = (index, field, value) => {
    const updatedMedicines = [...prescriptionForm.medicines];
    updatedMedicines[index][field] = value;
    setPrescriptionForm({ ...prescriptionForm, medicines: updatedMedicines });
  };

  const removePrescriptionMedicine = (index) => {
    setPrescriptionForm({
      ...prescriptionForm,
      medicines: prescriptionForm.medicines.filter((_, i) => i !== index)
    });
  };

  const availableCount = medicines.filter(m => m.available).length;
  const outOfStockCount = medicines.filter(m => !m.available).length;
  const lowStockCount = medicines.filter(m => m.available && m.stock <= m.minStock).length;
  const pendingPrescriptions = prescriptions.filter(p => p.status === 'pending').length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Package className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Pharmacy Management System</h1>
                <p className="text-sm text-gray-500">Inventory & Prescription Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs text-gray-500">Current User</p>
                <p className="text-sm font-semibold text-gray-900">Sarah Johnson, RPh</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <Package className="text-blue-600" size={24} />
              </div>
              <Activity className="text-gray-400" size={20} />
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">Total Medicines</p>
            <p className="text-3xl font-bold text-gray-900">{medicines.length}</p>
            <p className="text-xs text-gray-500 mt-2">Active inventory items</p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-50 p-3 rounded-lg">
                <CheckCircle className="text-green-600" size={24} />
              </div>
              <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">
                {((availableCount / medicines.length) * 100).toFixed(0)}%
              </span>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">Available Stock</p>
            <p className="text-3xl font-bold text-gray-900">{availableCount}</p>
            <p className="text-xs text-gray-500 mt-2">In stock & ready</p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-amber-50 p-3 rounded-lg">
                <TrendingDown className="text-amber-600" size={24} />
              </div>
              <AlertCircle className="text-amber-500" size={20} />
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">Low Stock Alert</p>
            <p className="text-3xl font-bold text-gray-900">{lowStockCount}</p>
            <p className="text-xs text-gray-500 mt-2">Requires reorder</p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-50 p-3 rounded-lg">
                <ClipboardList className="text-purple-600" size={24} />
              </div>
              <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-1 rounded">
                NEW
              </span>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">Pending Prescriptions</p>
            <p className="text-3xl font-bold text-gray-900">{pendingPrescriptions}</p>
            <p className="text-xs text-gray-500 mt-2">Awaiting fulfillment</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab('inventory')}
                className={`px-6 py-4 text-sm font-semibold border-b-2 transition ${
                  activeTab === 'inventory'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Package size={18} />
                  Medicine Inventory
                </div>
              </button>
              <button
                onClick={() => setActiveTab('prescriptions')}
                className={`px-6 py-4 text-sm font-semibold border-b-2 transition ${
                  activeTab === 'prescriptions'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  <ClipboardList size={18} />
                  Prescriptions
                  {pendingPrescriptions > 0 && (
                    <span className="bg-purple-100 text-purple-600 text-xs font-bold px-2 py-0.5 rounded-full">
                      {pendingPrescriptions}
                    </span>
                  )}
                </div>
              </button>
            </div>
          </div>

          {/* Search and Actions */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex-1 w-full relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder={activeTab === 'inventory' ? 'Search medicines...' : 'Search prescriptions...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              {activeTab === 'inventory' && (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition flex items-center gap-2 font-medium whitespace-nowrap"
                >
                  <Plus size={20} />
                  Add Medicine
                </button>
              )}
              {activeTab === 'prescriptions' && (
                <button
                  onClick={() => setShowPrescriptionModal(true)}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition flex items-center gap-2 font-medium whitespace-nowrap"
                >
                  <Plus size={20} />
                  New Prescription
                </button>
              )}
            </div>
          </div>

          {/* Content Area */}
          <div className="overflow-x-auto">
            {activeTab === 'inventory' ? (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Medicine Details</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Stock Level</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Expiry Date</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Unit Price</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredMedicines.map((medicine) => (
                    <tr key={medicine.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="bg-blue-100 p-2 rounded">
                            <Pill className="text-blue-600" size={18} />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{medicine.name}</p>
                            <p className="text-xs text-gray-500">SKU: MED-{medicine.id.toString().padStart(4, '0')}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                          {medicine.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1">
                            <div className="flex items-baseline gap-1">
                              <span className={`text-lg font-bold ${
                                medicine.stock === 0 ? 'text-red-600' :
                                medicine.stock <= medicine.minStock ? 'text-amber-600' :
                                'text-green-600'
                              }`}>
                                {medicine.stock}
                              </span>
                              <span className="text-xs text-gray-500">units</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                              <div 
                                className={`h-1.5 rounded-full ${
                                  medicine.stock === 0 ? 'bg-red-600' :
                                  medicine.stock <= medicine.minStock ? 'bg-amber-500' :
                                  'bg-green-500'
                                }`}
                                style={{ width: `${Math.min((medicine.stock / (medicine.minStock * 3)) * 100, 100)}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {medicine.available ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
                            <CheckCircle size={14} />
                            Available
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
                            <AlertCircle size={14} />
                            Out of Stock
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-900">{medicine.expiryDate}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-gray-900">${medicine.price.toFixed(2)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditClick(medicine)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="Edit Medicine"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteMedicine(medicine.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Delete Medicine"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredPrescriptions.map((prescription) => (
                  <div key={prescription.id} className="p-6 hover:bg-gray-50 transition">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-gray-900">{prescription.prescriptionNo}</h3>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                            prescription.status === 'pending'
                              ? 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                              : 'bg-green-50 text-green-700 border border-green-200'
                          }`}>
                            {prescription.status === 'pending' ? 'Pending' : 'Fulfilled'}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-xs text-gray-500">Patient Name</p>
                            <p className="text-sm font-semibold text-gray-900 flex items-center gap-1">
                              <User size={14} />
                              {prescription.patientName}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Age</p>
                            <p className="text-sm font-semibold text-gray-900">{prescription.patientAge} years</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Prescribed By</p>
                            <p className="text-sm font-semibold text-gray-900">{prescription.doctorName}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Date</p>
                            <p className="text-sm font-semibold text-gray-900 flex items-center gap-1">
                              <Calendar size={14} />
                              {prescription.date}
                            </p>
                          </div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4 mb-3">
                          <p className="text-xs font-semibold text-gray-700 uppercase mb-2">Prescribed Medicines</p>
                          <div className="space-y-2">
                            {prescription.medicines.map((med, idx) => {
                              const medicine = medicines.find(m => m.id === med.medicineId);
                              const isAvailable = medicine && medicine.stock >= med.quantity;
                              return (
                                <div key={idx} className="flex items-center justify-between bg-white p-3 rounded border border-gray-200">
                                  <div className="flex-1">
                                    <p className="font-semibold text-gray-900">{med.medicineName}</p>
                                    <p className="text-xs text-gray-600">
                                      {med.dosage} • {med.frequency} • {med.duration} • Qty: {med.quantity}
                                    </p>
                                  </div>
                                  {prescription.status === 'pending' && (
                                    <div>
                                      {isAvailable ? (
                                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold bg-green-50 text-green-700">
                                          <CheckCircle size={12} />
                                          In Stock
                                        </span>
                                      ) : (
                                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold bg-red-50 text-red-700">
                                          <AlertCircle size={12} />
                                          Not Available
                                        </span>
                                      )}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                        {prescription.notes && (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <p className="text-xs font-semibold text-blue-900 mb-1">Special Instructions</p>
                            <p className="text-sm text-blue-800">{prescription.notes}</p>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => handleFulfillPrescription(prescription.id)}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
                      >
                        Fulfill Prescription
                      </button>
                    </div>
                  </div>
                ))}
                {filteredPrescriptions.length === 0 && (
                  <div className="text-center py-12">
                    <ClipboardList size={48} className="text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">No prescriptions found.</p>
                    <p className="text-sm text-gray-400 mt-1">Try adjusting your search criteria.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Add Medicine Modal */}
        {(showAddModal || editingMedicine) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-gray-900">
                    {editingMedicine ? 'Edit Medicine Details' : 'Add New Medicine'}
                  </h3>
                  <button
                    onClick={() => {
                      setShowAddModal(false);
                      setEditingMedicine(null);
                      setFormData({ name: '', category: '', stock: '', minStock: '', price: '', expiryDate: '' });
                    }}
                    className="text-gray-400 hover:text-gray-600 transition"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Medicine Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="e.g., Paracetamol 500mg"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="e.g., Analgesic, Antibiotic"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Current Stock *</label>
                    <input
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      placeholder="0"
                      min="0"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Minimum Stock Level *</label>
                    <input
                      type="number"
                      value={formData.minStock}
                      onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      placeholder="20"
                      min="0"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Unit Price ($) *</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      placeholder="0.00"
                      min="0"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Expiry Date *</label>
                    <input
                      type="date"
                      value={formData.expiryDate}
                      onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={editingMedicine ? handleUpdateMedicine : handleAddMedicine}
                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
                  >
                    {editingMedicine ? 'Update Medicine' : 'Add Medicine'}
                  </button>
                  <button
                    onClick={() => {
                      setShowAddModal(false);
                      setEditingMedicine(null);
                      setFormData({ name: '', category: '', stock: '', minStock: '', price: '', expiryDate: '' });
                    }}
                    className="px-6 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Prescription Modal */}
        {showPrescriptionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-gray-900">Create New Prescription</h3>
                  <button
                    onClick={() => {
                      setShowPrescriptionModal(false);
                      setPrescriptionForm({
                        patientName: '',
                        patientAge: '',
                        doctorName: '',
                        medicines: [{ medicineId: '', dosage: '', frequency: '', duration: '', quantity: '' }],
                        notes: ''
                      });
                    }}
                    className="text-gray-400 hover:text-gray-600 transition"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Patient Name *</label>
                    <input
                      type="text"
                      value={prescriptionForm.patientName}
                      onChange={(e) => setPrescriptionForm({ ...prescriptionForm, patientName: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      placeholder="Enter patient name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Patient Age *</label>
                    <input
                      type="number"
                      value={prescriptionForm.patientAge}
                      onChange={(e) => setPrescriptionForm({ ...prescriptionForm, patientAge: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      placeholder="Age"
                      min="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Doctor Name *</label>
                  <input
                    type="text"
                    value={prescriptionForm.doctorName}
                    onChange={(e) => setPrescriptionForm({ ...prescriptionForm, doctorName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="Dr. Name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Prescribed Medicines *</label>
                  <div className="space-y-3">
                    {prescriptionForm.medicines.map((med, index) => (
                      <div key={index} className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                        <div className="grid grid-cols-2 gap-3 mb-3">
                          <div className="col-span-2">
                            <label className="block text-xs font-medium text-gray-600 mb-1">Medicine</label>
                            <select
                              value={med.medicineId}
                              onChange={(e) => updatePrescriptionMedicine(index, 'medicineId', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                            >
                              <option value="">Select medicine</option>
                              {medicines.filter(m => m.available).map(m => (
                                <option key={m.id} value={m.id}>{m.name} (Stock: {m.stock})</option>
                              ))}
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Dosage</label>
                            <input
                              type="text"
                              value={med.dosage}
                              onChange={(e) => updatePrescriptionMedicine(index, 'dosage', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                              placeholder="e.g., 1 tablet"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Frequency</label>
                            <input
                              type="text"
                              value={med.frequency}
                              onChange={(e) => updatePrescriptionMedicine(index, 'frequency', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                              placeholder="e.g., Twice daily"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Duration</label>
                            <input
                              type="text"
                              value={med.duration}
                              onChange={(e) => updatePrescriptionMedicine(index, 'duration', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                              placeholder="e.g., 7 days"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Quantity</label>
                            <input
                              type="number"
                              value={med.quantity}
                              onChange={(e) => updatePrescriptionMedicine(index, 'quantity', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                              placeholder="Qty"
                              min="1"
                            />
                          </div>
                        </div>
                        
                        {prescriptionForm.medicines.length > 1 && (
                          <button
                            onClick={() => removePrescriptionMedicine(index)}
                            className="text-red-600 text-sm font-medium hover:text-red-700"
                          >
                            Remove Medicine
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <button
                    onClick={addMedicineToPrescription}
                    className="mt-3 text-blue-600 text-sm font-medium hover:text-blue-700 flex items-center gap-1"
                  >
                    <Plus size={16} />
                    Add Another Medicine
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Special Instructions</label>
                  <textarea
                    value={prescriptionForm.notes}
                    onChange={(e) => setPrescriptionForm({ ...prescriptionForm, notes: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    rows="3"
                    placeholder="Any special instructions for the patient..."
                  />
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleAddPrescription}
                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
                  >
                    Create Prescription
                  </button>
                  <button
                    onClick={() => {
                      setShowPrescriptionModal(false);
                      setPrescriptionForm({
                        patientName: '',
                        patientAge: '',
                        doctorName: '',
                        medicines: [{ medicineId: '', dosage: '', frequency: '', duration: '', quantity: '' }],
                        notes: ''
                      });
                    }}
                    className="px-6 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}