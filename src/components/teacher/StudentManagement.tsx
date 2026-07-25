import React, { useState } from 'react';
import { Plus, UserPlus, Edit3, Trash2, CheckCircle, XCircle, RotateCcw, FileText, Search, Sparkles } from 'lucide-react';
import { Student } from '../../types';

interface StudentManagementProps {
  students: Student[];
  onSaveStudents: (updated: Student[]) => void;
  onResetAllStatus: () => void;
}

const AVATAR_OPTIONS = ['🐱', '🐶', '🐰', '🐼', '🦁', '🐯', '🦊', '🐻', '🐨', '🐮', '🐸', '🐵', '🐷', '🐥', '🐧', '🦉', '🦄', '🐬', '🐝', '🦋', '🐘', '🦒', '🐙', '🐢'];

export const StudentManagement: React.FC<StudentManagementProps> = ({
  students,
  onSaveStudents,
  onResetAllStatus,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // Form states for Single Add / Edit
  const [formName, setFormName] = useState('');
  const [formAvatar, setFormAvatar] = useState('🐱');
  const [formIsActive, setFormIsActive] = useState(true);

  // Import Text Area state
  const [importText, setImportText] = useState('');

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAdd = () => {
    setFormName('');
    setFormAvatar(AVATAR_OPTIONS[Math.floor(Math.random() * AVATAR_OPTIONS.length)]);
    setFormIsActive(true);
    setEditingStudent(null);
    setShowAddModal(true);
  };

  const handleOpenEdit = (student: Student) => {
    setEditingStudent(student);
    setFormName(student.name);
    setFormAvatar(student.avatar || '🐱');
    setFormIsActive(student.isActive);
    setShowAddModal(true);
  };

  const handleSaveSingleStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    if (editingStudent) {
      // Edit existing
      const updated = students.map(s =>
        s.id === editingStudent.id
          ? { ...s, name: formName.trim(), avatar: formAvatar, isActive: formIsActive }
          : s
      );
      onSaveStudents(updated);
    } else {
      // Create new
      const newId = `m-custom-${Date.now()}`;
      const newStudent: Student = {
        id: newId,
        name: formName.trim(),
        avatar: formAvatar,
        isActive: formIsActive,
        hasPlayedCurrentSession: false,
      };
      onSaveStudents([...students, newStudent]);
    }

    setShowAddModal(false);
  };

  const handleDeleteStudent = (studentId: string) => {
    if (confirm('Yakin ingin menghapus murid ini?')) {
      const updated = students.filter(s => s.id !== studentId);
      onSaveStudents(updated);
    }
  };

  const handleToggleActive = (studentId: string) => {
    const updated = students.map(s =>
      s.id === studentId ? { ...s, isActive: !s.isActive } : s
    );
    onSaveStudents(updated);
  };

  // Batch Name Import
  const handleBatchImport = () => {
    if (!importText.trim()) return;

    // Split by newlines or commas
    const names = importText
      .split(/[\n,]+/)
      .map(n => n.trim())
      .filter(n => n.length > 0);

    if (names.length === 0) return;

    const newStudents: Student[] = names.map((name, idx) => ({
      id: `m-imp-${Date.now()}-${idx}`,
      name,
      avatar: AVATAR_OPTIONS[idx % AVATAR_OPTIONS.length],
      isActive: true,
      hasPlayedCurrentSession: false,
    }));

    onSaveStudents([...students, ...newStudents]);
    setImportText('');
    setShowImportModal(false);
  };

  return (
    <div className="space-y-4">
      {/* Action Header */}
      <div className="bg-white rounded-3xl p-4 border-2 border-slate-100 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-black text-slate-900">Manajemen Data Murid</h2>
          <p className="text-xs font-semibold text-slate-500">
            Total Murid: {students.length} (Aktif: {students.filter(s => s.isActive).length})
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handleOpenAdd}
            className="flex-1 sm:flex-initial px-3.5 py-2 rounded-2xl bg-amber-500 text-white font-bold text-xs shadow-xs hover:bg-amber-600 flex items-center justify-center gap-1.5"
          >
            <UserPlus size={16} />
            <span>Tambah Murid</span>
          </button>

          <button
            onClick={() => setShowImportModal(true)}
            className="flex-1 sm:flex-initial px-3.5 py-2 rounded-2xl bg-purple-100 text-purple-800 border border-purple-200 font-bold text-xs hover:bg-purple-200 flex items-center justify-center gap-1.5"
          >
            <FileText size={16} />
            <span>Impor Nama</span>
          </button>

          <button
            onClick={onResetAllStatus}
            className="flex-1 sm:flex-initial px-3 py-2 rounded-2xl bg-rose-50 text-rose-700 border border-rose-200 font-bold text-xs hover:bg-rose-100 flex items-center justify-center gap-1"
          >
            <RotateCcw size={14} />
            <span>Reset Main Semua</span>
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Cari nama murid..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-amber-500 shadow-2xs"
        />
      </div>

      {/* Student Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {filteredStudents.map(student => (
          <div
            key={student.id}
            className={`p-3.5 rounded-2xl border-2 flex items-center justify-between transition-all ${
              student.isActive
                ? 'bg-white border-slate-100 shadow-2xs'
                : 'bg-slate-50 border-slate-200 opacity-60'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl bg-slate-100 p-2 rounded-2xl">{student.avatar}</span>
              <div>
                <p className="font-extrabold text-sm text-slate-900">{student.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      student.isActive
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {student.isActive ? 'Aktif' : 'Nonaktif'}
                  </span>
                  {student.hasPlayedCurrentSession && (
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                      Sudah Bermain
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => handleToggleActive(student.id)}
                className={`p-1.5 rounded-xl border font-bold text-xs ${
                  student.isActive
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-slate-200 text-slate-600 border-slate-300'
                }`}
                title={student.isActive ? 'Nonaktifkan' : 'Aktifkan'}
              >
                {student.isActive ? <CheckCircle size={16} /> : <XCircle size={16} />}
              </button>

              <button
                onClick={() => handleOpenEdit(student)}
                className="p-1.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100"
                title="Edit Nama/Avatar"
              >
                <Edit3 size={16} />
              </button>

              <button
                onClick={() => handleDeleteStudent(student.id)}
                className="p-1.5 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100"
                title="Hapus Murid"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-5 w-full max-w-xs shadow-2xl border-2 border-amber-300">
            <h3 className="text-base font-black text-slate-900 mb-3">
              {editingStudent ? 'Edit Data Murid' : 'Tambah Murid Baru'}
            </h3>

            <form onSubmit={handleSaveSingleStudent} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Nama Murid</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  placeholder="Contoh: Budi Prasetyo"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Pilih Avatar Icon</label>
                <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-2 bg-slate-50 rounded-xl border border-slate-200">
                  {AVATAR_OPTIONS.map(av => (
                    <button
                      key={av}
                      type="button"
                      onClick={() => setFormAvatar(av)}
                      className={`text-2xl p-1 rounded-xl transition-all ${
                        formAvatar === av ? 'bg-amber-300 scale-110 shadow-xs' : 'hover:bg-slate-200'
                      }`}
                    >
                      {av}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isActiveCheck"
                  checked={formIsActive}
                  onChange={e => setFormIsActive(e.target.checked)}
                  className="w-4 h-4 text-amber-500 rounded focus:ring-0"
                />
                <label htmlFor="isActiveCheck" className="text-xs font-bold text-slate-700">
                  Status Aktif mengikuti kuis
                </label>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-100 font-bold text-xs text-slate-700 hover:bg-slate-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-amber-500 text-white font-bold text-xs shadow-xs hover:bg-amber-600"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Batch Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-5 w-full max-w-sm shadow-2xl border-2 border-purple-300">
            <h3 className="text-base font-black text-slate-900 mb-1">Impor Daftar Nama Murid</h3>
            <p className="text-xs font-semibold text-slate-500 mb-3">
              Masukkan nama-nama murid dipisahkan dengan garis baru (enter) atau koma.
            </p>

            <textarea
              rows={6}
              value={importText}
              onChange={e => setImportText(e.target.value)}
              placeholder={`Budi\nSiti\nAndi\nDewi\nRian`}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-purple-500"
            />

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setShowImportModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 font-bold text-xs text-slate-700 hover:bg-slate-200"
              >
                Batal
              </button>
              <button
                onClick={handleBatchImport}
                className="flex-1 py-2.5 rounded-xl bg-purple-600 text-white font-bold text-xs shadow-md hover:bg-purple-700"
              >
                Impor Sekarang
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
