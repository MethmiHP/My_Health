import React, { useState, useEffect } from 'react';
import { User, Calendar, Heart, Pill, Phone, Mail, MapPin, Clock, AlertCircle, CheckCircle, BarChart3, Edit3, Save, X, Plus, Scissors, Activity } from 'lucide-react';
import { toast } from 'react-toastify';

const PatientDetails = ({ patient, scannedAt, onClose, userRole, onUpdatePatient }) => {
  const [isEditingMedications, setIsEditingMedications] = useState(false);
  const [medications, setMedications] = useState(patient?.medications || []);
  const [newMedication, setNewMedication] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Surgery editing state
  const [isEditingSurgeries, setIsEditingSurgeries] = useState(false);
  const [surgeries, setSurgeries] = useState(patient?.surgeries || []);
  const [newSurgery, setNewSurgery] = useState({ type: 'surgery', name: '', description: '', date: '', hospital: '', surgeon: '', results: '', followUpRequired: false, followUpDate: '' });

  // Update medications state when patient prop changes
  useEffect(() => {
    setMedications(patient?.medications || []);
  }, [patient?.medications]);

  // Update surgeries state when patient prop changes
  useEffect(() => {
    setSurgeries(patient?.surgeries || []);
  }, [patient?.surgeries]);

  if (!patient) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'Not provided';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateAge = (dob) => {
    if (!dob) return 'Unknown';
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Handle medication editing
  const handleEditMedications = () => {
    setIsEditingMedications(true);
    setMedications([...patient.medications || []]);
  };

  const handleCancelEdit = () => {
    setIsEditingMedications(false);
    setMedications([...patient.medications || []]);
    setNewMedication('');
  };

  const handleAddMedication = () => {
    if (newMedication.trim() && !medications.includes(newMedication.trim())) {
      setMedications([...medications, newMedication.trim()]);
      setNewMedication('');
    }
  };

  const handleRemoveMedication = (index) => {
    console.log('Removing medication at index:', index);
    console.log('Current medications:', medications);
    const updatedMedications = medications.filter((_, i) => i !== index);
    console.log('Updated medications:', updatedMedications);
    setMedications(updatedMedications);
  };

  const handleSaveMedications = async () => {
    setIsUpdating(true);
    try {
      if (onUpdatePatient) {
        console.log('PatientDetails - Saving medications:', medications);
        console.log('PatientDetails - Patient object:', patient);
        console.log('PatientDetails - Patient ID:', patient._id);
        console.log('PatientDetails - Patient User ID:', patient.userId);
        console.log('PatientDetails - Patient user:', patient.user);
        console.log('PatientDetails - Patient user ID:', patient.user?._id);
        const response = await onUpdatePatient(patient.user?._id, { medications });
        console.log('Update response:', response);
        toast.success('Medications updated successfully');
        setIsEditingMedications(false);
      }
    } catch (error) {
      console.error('Error updating medications:', error);
      toast.error('Failed to update medications');
    } finally {
      setIsUpdating(false);
    }
  };

  // Surgery management functions
  const handleEditSurgeries = () => {
    setIsEditingSurgeries(true);
    setSurgeries([...patient.surgeries || []]);
  };

  const handleCancelSurgeryEdit = () => {
    setIsEditingSurgeries(false);
    setSurgeries([...patient.surgeries || []]);
    setNewSurgery({ type: 'surgery', name: '', description: '', date: '', hospital: '', surgeon: '', results: '', followUpRequired: false, followUpDate: '' });
  };

  const handleAddSurgery = () => {
    if (newSurgery.name.trim()) {
      setSurgeries([...surgeries, { ...newSurgery, name: newSurgery.name.trim() }]);
      setNewSurgery({ type: 'surgery', name: '', description: '', date: '', hospital: '', surgeon: '', results: '', followUpRequired: false, followUpDate: '' });
    }
  };

  const handleRemoveSurgery = (index) => {
    setSurgeries(surgeries.filter((_, i) => i !== index));
  };

  const handleUpdateSurgery = (index, field, value) => {
    setSurgeries(surgeries.map((surgery, i) => 
      i === index ? { ...surgery, [field]: value } : surgery
    ));
  };

  const handleSaveSurgeries = async () => {
    setIsUpdating(true);
    try {
      if (onUpdatePatient) {
        const response = await onUpdatePatient(patient.user?._id, { surgeries });
        toast.success('Surgeries updated successfully');
        setIsEditingSurgeries(false);
      }
    } catch (error) {
      console.error('Error updating surgeries:', error);
      toast.error('Failed to update surgeries');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-teal-100 rounded-lg">
            <User className="h-6 w-6 text-teal-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {patient.user?.firstName} {patient.user?.lastName}
            </h3>
            <p className="text-sm text-gray-500">Patient Details</p>
          </div>
        </div>
        
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            ×
          </button>
        )}
      </div>

      {/* Scan Info */}
      {scannedAt && (
        <div className="px-4 py-2 bg-green-50 border-b border-green-200">
          <div className="flex items-center gap-2 text-sm text-green-700">
            <Clock className="h-4 w-4" />
            <span>Scanned at: {new Date(scannedAt).toLocaleString()}</span>
          </div>
        </div>
      )}

      <div className="p-4 space-y-6">
        {/* Basic Information */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
            <User className="h-4 w-4" />
            Basic Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-500">Full Name</label>
              <p className="text-sm font-medium text-gray-900">
                {patient.user?.firstName} {patient.user?.lastName}
              </p>
            </div>
            <div>
              <label className="text-xs text-gray-500">NIC</label>
              <p className="text-sm font-medium text-gray-900 font-mono bg-gray-50 px-2 py-1 rounded border">
                {patient.nic || 'Not provided'}
              </p>
            </div>
            <div>
              <label className="text-xs text-gray-500">Email</label>
              <p className="text-sm font-medium text-gray-900 flex items-center gap-1">
                <Mail className="h-3 w-3" />
                {patient.user?.email || 'Not provided'}
              </p>
            </div>
            <div>
              <label className="text-xs text-gray-500">Phone</label>
              <p className="text-sm font-medium text-gray-900 flex items-center gap-1">
                <Phone className="h-3 w-3" />
                {patient.user?.phone || 'Not provided'}
              </p>
            </div>
            <div>
              <label className="text-xs text-gray-500">Date of Birth</label>
              <p className="text-sm font-medium text-gray-900 flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDate(patient.dob)}
              </p>
            </div>
            <div>
              <label className="text-xs text-gray-500">Age</label>
              <p className="text-sm font-medium text-gray-900">
                {calculateAge(patient.dob)} years
              </p>
            </div>
            <div>
              <label className="text-xs text-gray-500">Gender</label>
              <p className="text-sm font-medium text-gray-900 capitalize">
                {patient.gender || 'Not specified'}
              </p>
            </div>
          </div>
        </div>

        {/* Medical Information */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
            <Heart className="h-4 w-4" />
            Medical Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-500">Blood Group</label>
              <p className="text-sm font-medium text-gray-900">
                {patient.bloodGroup || 'Not specified'}
              </p>
            </div>
            <div>
              <label className="text-xs text-gray-500">Height</label>
              <p className="text-sm font-medium text-gray-900">
                {patient.heightCm ? `${patient.heightCm} cm` : 'Not specified'}
              </p>
            </div>
            <div>
              <label className="text-xs text-gray-500">Weight</label>
              <p className="text-sm font-medium text-gray-900">
                {patient.weightKg ? `${patient.weightKg} kg` : 'Not specified'}
              </p>
            </div>
            <div>
              <label className="text-xs text-gray-500">BMI</label>
              <p className="text-sm font-medium text-gray-900">
                {patient.heightCm && patient.weightKg 
                  ? (patient.weightKg / Math.pow(patient.heightCm / 100, 2)).toFixed(1)
                  : 'Not calculated'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Allergies */}
        {patient.allergies && patient.allergies.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-500" />
              Allergies
            </h4>
            <div className="flex flex-wrap gap-2">
              {patient.allergies.map((allergy, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-red-100 text-red-800 text-xs rounded-full border border-red-200"
                >
                  {allergy}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Chronic Conditions */}
        {patient.chronicConditions && patient.chronicConditions.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
              <Heart className="h-4 w-4 text-orange-500" />
              Chronic Conditions
            </h4>
            <div className="flex flex-wrap gap-2">
              {patient.chronicConditions.map((condition, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-orange-100 text-orange-800 text-xs rounded-full border border-orange-200"
                >
                  {condition}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Current Medications */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-900 flex items-center gap-2">
              <Pill className="h-4 w-4 text-blue-500" />
              Current Medications
            </h4>
            {userRole === 'doctor' && (
              <div className="flex items-center gap-2">
                {!isEditingMedications ? (
                  <button
                    onClick={handleEditMedications}
                    className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded transition-colors"
                    title="Edit Medications"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                ) : (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={handleSaveMedications}
                      disabled={isUpdating}
                      className="p-1 text-green-600 hover:text-green-800 hover:bg-green-100 rounded transition-colors disabled:opacity-50"
                      title="Save Changes"
                    >
                      <Save className="h-4 w-4" />
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded transition-colors"
                      title="Cancel"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {isEditingMedications ? (
            <div className="space-y-3">
              {/* Current medications with remove option */}
              <div className="flex flex-wrap gap-2">
                {medications.map((medication, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full border border-blue-200 flex items-center gap-1"
                  >
                    {medication}
                    <button
                      onClick={() => handleRemoveMedication(index)}
                      className="text-blue-600 hover:text-red-600 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
              
              {/* Add new medication */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMedication}
                  onChange={(e) => setNewMedication(e.target.value)}
                  placeholder="Add new medication..."
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddMedication()}
                />
                <button
                  onClick={handleAddMedication}
                  disabled={!newMedication.trim()}
                  className="px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {patient.medications && patient.medications.length > 0 ? (
                patient.medications.map((medication, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full border border-blue-200"
                  >
                    {medication}
                  </span>
                ))
              ) : (
                <p className="text-sm text-gray-500">No medications recorded</p>
              )}
            </div>
          )}
        </div>

        {/* Current Surgeries & Procedures */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-900 flex items-center gap-2">
              <Activity className="h-4 w-4 text-purple-500" />
              Surgeries & Procedures
            </h4>
            {userRole === 'doctor' && (
              <div className="flex items-center gap-2">
                {!isEditingSurgeries ? (
                  <button
                    onClick={handleEditSurgeries}
                    className="p-1 text-purple-600 hover:text-purple-800 hover:bg-purple-100 rounded transition-colors"
                    title="Edit Surgeries"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                ) : (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={handleSaveSurgeries}
                      disabled={isUpdating}
                      className="p-1 text-green-600 hover:text-green-800 hover:bg-green-100 rounded transition-colors disabled:opacity-50"
                      title="Save Changes"
                    >
                      <Save className="h-4 w-4" />
                    </button>
                    <button
                      onClick={handleCancelSurgeryEdit}
                      className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded transition-colors"
                      title="Cancel"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {isEditingSurgeries ? (
            <div className="space-y-4">
              {/* Current surgeries with edit/remove options */}
              {surgeries.map((surgery, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                    <select
                      value={surgery.type || 'surgery'}
                      onChange={(e) => handleUpdateSurgery(index, 'type', e.target.value)}
                      className="px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="surgery">Surgery</option>
                      <option value="scan">Scan/Imaging</option>
                      <option value="procedure">Procedure</option>
                      <option value="treatment">Treatment</option>
                    </select>
                    <input
                      type="text"
                      value={surgery.name}
                      onChange={(e) => handleUpdateSurgery(index, 'name', e.target.value)}
                      placeholder={`${surgery.type === 'scan' ? 'Scan Type' : surgery.type === 'procedure' ? 'Procedure Name' : 'Surgery Name'}`}
                      className="px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                    <input
                      type="date"
                      value={surgery.date ? new Date(surgery.date).toISOString().split('T')[0] : ''}
                      onChange={(e) => handleUpdateSurgery(index, 'date', e.target.value)}
                      className="px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                    <input
                      type="text"
                      value={surgery.hospital || ''}
                      onChange={(e) => handleUpdateSurgery(index, 'hospital', e.target.value)}
                      placeholder="Hospital/Clinic"
                      className="px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                    <input
                      type="text"
                      value={surgery.surgeon || ''}
                      onChange={(e) => handleUpdateSurgery(index, 'surgeon', e.target.value)}
                      placeholder={surgery.type === 'scan' ? 'Radiologist' : 'Surgeon/Doctor'}
                      className="px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={surgery.followUpRequired || false}
                        onChange={(e) => handleUpdateSurgery(index, 'followUpRequired', e.target.checked)}
                        className="accent-purple-600 h-4 w-4"
                      />
                      <label className="text-sm text-gray-700">Follow-up required</label>
                    </div>
                  </div>
                  {surgery.followUpRequired && (
                    <input
                      type="date"
                      value={surgery.followUpDate ? new Date(surgery.followUpDate).toISOString().split('T')[0] : ''}
                      onChange={(e) => handleUpdateSurgery(index, 'followUpDate', e.target.value)}
                      placeholder="Follow-up Date"
                      className="px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-purple-500 mb-2"
                    />
                  )}
                  <div className="flex gap-2">
                    <textarea
                      value={surgery.description || ''}
                      onChange={(e) => handleUpdateSurgery(index, 'description', e.target.value)}
                      placeholder={surgery.type === 'scan' ? 'Scan Results/Findings' : 'Description'}
                      rows={2}
                      className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                    <textarea
                      value={surgery.results || ''}
                      onChange={(e) => handleUpdateSurgery(index, 'results', e.target.value)}
                      placeholder={surgery.type === 'scan' ? 'Additional Notes' : 'Results/Outcome'}
                      rows={2}
                      className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                    <button
                      onClick={() => handleRemoveSurgery(index)}
                      className="px-2 py-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
              
              {/* Add new surgery */}
              <div className="border border-dashed border-gray-300 rounded-lg p-3 bg-white">
                <h5 className="text-sm font-medium text-gray-700 mb-2">Add New Entry</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                  <select
                    value={newSurgery.type}
                    onChange={(e) => setNewSurgery({...newSurgery, type: e.target.value})}
                    className="px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="surgery">Surgery</option>
                    <option value="scan">Scan/Imaging</option>
                    <option value="procedure">Procedure</option>
                    <option value="treatment">Treatment</option>
                  </select>
                  <input
                    type="text"
                    value={newSurgery.name}
                    onChange={(e) => setNewSurgery({...newSurgery, name: e.target.value})}
                    placeholder={`${newSurgery.type === 'scan' ? 'Scan Type' : newSurgery.type === 'procedure' ? 'Procedure Name' : 'Surgery Name'} *`}
                    className="px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                  <input
                    type="date"
                    value={newSurgery.date}
                    onChange={(e) => setNewSurgery({...newSurgery, date: e.target.value})}
                    className="px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                  <input
                    type="text"
                    value={newSurgery.hospital}
                    onChange={(e) => setNewSurgery({...newSurgery, hospital: e.target.value})}
                    placeholder="Hospital/Clinic"
                    className="px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                  <input
                    type="text"
                    value={newSurgery.surgeon}
                    onChange={(e) => setNewSurgery({...newSurgery, surgeon: e.target.value})}
                    placeholder={newSurgery.type === 'scan' ? 'Radiologist' : 'Surgeon/Doctor'}
                    className="px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={newSurgery.followUpRequired}
                      onChange={(e) => setNewSurgery({...newSurgery, followUpRequired: e.target.checked})}
                      className="accent-purple-600 h-4 w-4"
                    />
                    <label className="text-sm text-gray-700">Follow-up required</label>
                  </div>
                </div>
                {newSurgery.followUpRequired && (
                  <input
                    type="date"
                    value={newSurgery.followUpDate}
                    onChange={(e) => setNewSurgery({...newSurgery, followUpDate: e.target.value})}
                    placeholder="Follow-up Date"
                    className="px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-purple-500 mb-2"
                  />
                )}
                <div className="flex gap-2">
                  <textarea
                    value={newSurgery.description}
                    onChange={(e) => setNewSurgery({...newSurgery, description: e.target.value})}
                    placeholder={newSurgery.type === 'scan' ? 'Scan Results/Findings' : 'Description'}
                    rows={2}
                    className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                  <textarea
                    value={newSurgery.results}
                    onChange={(e) => setNewSurgery({...newSurgery, results: e.target.value})}
                    placeholder={newSurgery.type === 'scan' ? 'Additional Notes' : 'Results/Outcome'}
                    rows={2}
                    className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                  <button
                    onClick={handleAddSurgery}
                    disabled={!newSurgery.name.trim()}
                    className="px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {patient.surgeries && patient.surgeries.length > 0 ? (
                patient.surgeries.map((surgery, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h5 className="font-medium text-gray-900 text-sm">{surgery.name}</h5>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            surgery.type === 'surgery' ? 'bg-red-100 text-red-800' :
                            surgery.type === 'scan' ? 'bg-blue-100 text-blue-800' :
                            surgery.type === 'procedure' ? 'bg-green-100 text-green-800' :
                            'bg-purple-100 text-purple-800'
                          }`}>
                            {surgery.type?.charAt(0).toUpperCase() + surgery.type?.slice(1)}
                          </span>
                        </div>
                        {surgery.description && (
                          <p className="text-gray-600 text-sm mt-1">{surgery.description}</p>
                        )}
                        {surgery.results && (
                          <p className="text-gray-700 text-sm mt-1 font-medium">Results: {surgery.results}</p>
                        )}
                        <div className="flex flex-wrap gap-2 mt-2">
                          {surgery.date && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              Date: {new Date(surgery.date).toLocaleDateString()}
                            </span>
                          )}
                          {surgery.hospital && (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                              Hospital: {surgery.hospital}
                            </span>
                          )}
                          {surgery.surgeon && (
                            <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                              {surgery.type === 'scan' ? 'Radiologist' : 'Doctor'}: {surgery.surgeon}
                            </span>
                          )}
                          {surgery.followUpRequired && (
                            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                              Follow-up Required
                            </span>
                          )}
                          {surgery.followUpDate && (
                            <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
                              Follow-up: {new Date(surgery.followUpDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No surgeries or procedures recorded</p>
              )}
            </div>
          )}
        </div>

        {/* Emergency Contact */}
        {patient.emergencyContact && (
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Emergency Contact
            </h4>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-sm font-medium text-gray-900">
                {patient.emergencyContact.name}
              </p>
              <p className="text-xs text-gray-600">
                {patient.emergencyContact.relation}
              </p>
              <p className="text-sm text-gray-700 flex items-center gap-1 mt-1">
                <Phone className="h-3 w-3" />
                {patient.emergencyContact.phone}
              </p>
            </div>
          </div>
        )}

        {/* Guardian Information (for patients under 16) */}
        {patient.guardian && (
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
              <User className="h-4 w-4" />
              Guardian Information
            </h4>
            <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
              <p className="text-sm font-medium text-gray-900">
                {patient.guardian.name}
              </p>
              <p className="text-xs text-gray-600">
                {patient.guardian.relationship}
              </p>
              <p className="text-sm text-gray-700 flex items-center gap-1 mt-1">
                <Phone className="h-3 w-3" />
                {patient.guardian.phone}
              </p>
              {patient.consent && (
                <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Guardian consent provided
                </p>
              )}
            </div>
          </div>
        )}

        {/* Barcode Information */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Barcode Information
          </h4>
          <div className="bg-teal-50 rounded-lg p-3 border border-teal-200">
            <p className="text-sm font-medium text-teal-900">
              Patient Barcode
            </p>
            <p className="text-xs text-teal-700 font-mono mt-1">
              {patient.barcode}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDetails;
