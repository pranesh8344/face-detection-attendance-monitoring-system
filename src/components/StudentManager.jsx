import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  Trash2, 
  Edit, 
  Camera, 
  Check, 
  X, 
  Filter, 
  Sparkles,
  ShieldCheck,
  Mail,
  Phone,
  BookOpen
} from 'lucide-react';
import { DEPARTMENT_LIST } from '../services/mockData';

export default function StudentManager({ students, onAddStudent, onDeleteStudent, isEnrollModalOpen, setIsEnrollModalOpen }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'

  // New Student Form State
  const [formData, setFormData] = useState({
    name: '',
    id: `STU-${Math.floor(1000 + Math.random() * 9000)}`,
    department: DEPARTMENT_LIST[0],
    email: '',
    phone: '',
    batch: '2023-2027',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  });

  const [cameraCaptured, setCameraCaptured] = useState(false);

  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDept === '' || s.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.id) return;

    // Generate random 10D descriptor vector for face matching
    const randomVector = Array.from({ length: 10 }, () => parseFloat(Math.random().toFixed(2)));

    const newStudent = {
      ...formData,
      joinedDate: new Date().toISOString().split('T')[0],
      status: 'Active',
      faceDescriptor: randomVector
    };

    onAddStudent(newStudent);
    setIsEnrollModalOpen(false);
    
    // Reset Form
    setFormData({
      name: '',
      id: `STU-${Math.floor(1000 + Math.random() * 9000)}`,
      department: DEPARTMENT_LIST[0],
      email: '',
      phone: '',
      batch: '2023-2027',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    });
    setCameraCaptured(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-5 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-cyan-400" /> Student & Personnel Roster
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Total {students.length} registered students with active facial biometric signatures.
          </p>
        </div>
        <button
          onClick={() => setIsEnrollModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold text-sm shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all cursor-pointer"
        >
          <UserPlus className="w-4 h-4" /> Enroll New Student
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
        
        {/* Search */}
        <div className="sm:col-span-6 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search by student name, ID, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-sm focus:border-cyan-500 focus:outline-none placeholder-slate-500"
          />
        </div>

        {/* Department Filter */}
        <div className="sm:col-span-4 relative">
          <Filter className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-sm focus:border-cyan-500 focus:outline-none appearance-none"
          >
            <option value="">All Departments</option>
            {DEPARTMENT_LIST.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        {/* View mode toggle */}
        <div className="sm:col-span-2 flex items-center justify-end gap-1 p-1 bg-slate-900 rounded-xl border border-slate-800">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${viewMode === 'grid' ? 'bg-cyan-500 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            Grid
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${viewMode === 'table' ? 'bg-cyan-500 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            Table
          </button>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredStudents.map(student => (
            <div 
              key={student.id} 
              className="glass-card rounded-2xl p-5 border border-slate-800/80 hover:border-cyan-500/40 transition-all space-y-4 group relative"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img 
                      src={student.avatar} 
                      alt={student.name}
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-700 group-hover:border-cyan-400 transition-all" 
                    />
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-slate-900 rounded-full" title="Biometrics Active"></span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold font-mono-hud text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                      {student.id}
                    </span>
                    <h3 className="text-base font-bold text-white mt-1 group-hover:text-cyan-300 transition-colors">
                      {student.name}
                    </h3>
                  </div>
                </div>
                
                <button
                  onClick={() => onDeleteStudent(student.id)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                  title="Delete Student"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800/80 text-xs text-slate-400">
                <div className="flex items-center gap-2 text-slate-300">
                  <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{student.department}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  <span>{student.email}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] pt-1">
                  <span className="text-slate-500">Batch: {student.batch}</span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Face Vector Active
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/90 text-xs font-semibold text-slate-400 border-b border-slate-800">
                <th className="py-3.5 px-4">Student Name & ID</th>
                <th className="py-3.5 px-4">Department</th>
                <th className="py-3.5 px-4">Email</th>
                <th className="py-3.5 px-4">Batch</th>
                <th className="py-3.5 px-4">Face Signature</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm">
              {filteredStudents.map(student => (
                <tr key={student.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3 px-4 flex items-center gap-3">
                    <img src={student.avatar} alt={student.name} className="w-9 h-9 rounded-xl object-cover border border-slate-700" />
                    <div>
                      <div className="font-bold text-white">{student.name}</div>
                      <div className="text-xs font-mono-hud text-cyan-400">{student.id}</div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-300 text-xs">{student.department}</td>
                  <td className="py-3 px-4 text-slate-400 text-xs">{student.email}</td>
                  <td className="py-3 px-4 text-slate-400 text-xs">{student.batch}</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <ShieldCheck className="w-3 h-3" /> Encrypted 128D
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => onDeleteStudent(student.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Enroll Student Modal */}
      {isEnrollModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="glass-panel w-full max-w-lg rounded-2xl border border-slate-700 p-6 space-y-5 shadow-2xl relative">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-cyan-400" /> Biometric Student Registration
              </h3>
              <button
                onClick={() => setIsEnrollModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pranesh R"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-cyan-500 focus:outline-none mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300">Student ID / Roll No *</label>
                  <input
                    type="text"
                    required
                    value={formData.id}
                    onChange={e => setFormData({ ...formData, id: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400 font-mono-hud text-sm focus:border-cyan-500 focus:outline-none mt-1"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300">Department</label>
                <select
                  value={formData.department}
                  onChange={e => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-cyan-500 focus:outline-none mt-1"
                >
                  {DEPARTMENT_LIST.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300">Email Address</label>
                  <input
                    type="email"
                    placeholder="student@univ.edu"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-cyan-500 focus:outline-none mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300">Batch / Academic Year</label>
                  <input
                    type="text"
                    value={formData.batch}
                    onChange={e => setFormData({ ...formData, batch: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-cyan-500 focus:outline-none mt-1"
                  />
                </div>
              </div>

              {/* Facial Capture Preview Box */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-cyan-400" /> Biometric Face Snapshot
                  </span>
                  <span className="text-emerald-400 font-mono-hud font-bold">128D VECTOR READY</span>
                </div>

                <div className="flex items-center gap-4">
                  <img
                    src={formData.avatar}
                    alt="Preview"
                    className="w-16 h-16 rounded-xl object-cover border-2 border-cyan-500/50 shadow-md"
                  />
                  <div className="flex-1 space-y-1">
                    <p className="text-xs text-slate-400">
                      Facial feature embedding will automatically be extracted upon saving.
                    </p>
                    <button
                      type="button"
                      onClick={() => setCameraCaptured(true)}
                      className="px-3 py-1 rounded-lg bg-cyan-500/10 text-cyan-400 text-xs font-bold border border-cyan-500/20 hover:bg-cyan-500/20"
                    >
                      {cameraCaptured ? '✓ Facial Signature Captured' : 'Snap Photo from Camera'}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEnrollModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold text-sm hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold text-sm shadow-md shadow-cyan-500/25 hover:shadow-cyan-500/40"
                >
                  Save & Register Student
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
