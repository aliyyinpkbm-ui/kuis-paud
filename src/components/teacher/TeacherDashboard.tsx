import React, { useState } from 'react';
import {
  Users,
  CheckCircle2,
  Clock,
  Award,
  PlusCircle,
  RotateCcw,
  Download,
  Printer,
  Search,
  Eye,
  Trash2,
  AlertTriangle,
  Database,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { Student, QuizResult, ClassSession, Question } from '../../types';
import { StorageService } from '../../utils/storage';
import { PrintReportModal } from './PrintReportModal';

interface TeacherDashboardProps {
  students: Student[];
  currentSession: ClassSession;
  results: QuizResult[];
  questionBank: Question[];
  onStartNewSession: () => void;
  onResetStudent: (studentId: string) => void;
  onRefreshData: () => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  students,
  currentSession,
  results,
  questionBank,
  onStartNewSession,
  onResetStudent,
  onRefreshData,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'played' | 'not_played'>('all');
  const [selectedResultDetail, setSelectedResultDetail] = useState<QuizResult | null>(null);
  const [showNewSessionConfirm, setShowNewSessionConfirm] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);

  const activeStudents = students.filter(s => s.isActive);
  const sessionResults = results.filter(r => r.sessionId === currentSession.sessionId);

  const playedCount = activeStudents.filter(s => s.hasPlayedCurrentSession).length;
  const notPlayedCount = activeStudents.length - playedCount;

  const totalScore = sessionResults.reduce((sum, r) => sum + r.score, 0);
  const avgScore = sessionResults.length > 0 ? Math.round(totalScore / sessionResults.length) : 0;

  const usedQuestionsCount = currentSession.usedQuestionIds.length;
  const remainingQuestions = Math.max(0, questionBank.length - usedQuestionsCount);

  // Filtered Student Table Rows
  const filteredStudents = activeStudents.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase());
    if (filterStatus === 'played') return matchesSearch && student.hasPlayedCurrentSession;
    if (filterStatus === 'not_played') return matchesSearch && !student.hasPlayedCurrentSession;
    return matchesSearch;
  });

  return (
    <div className="space-y-4">
      {/* Top Banner & Quick Actions */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-3xl p-5 text-white shadow-lg border-b-4 border-amber-700">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full inline-block mb-1">
              Sesi Kelas Aktif
            </span>
            <h2 className="text-xl sm:text-2xl font-black">{currentSession.sessionName}</h2>
            <p className="text-xs font-mono opacity-90">ID: {currentSession.sessionId}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setShowNewSessionConfirm(true)}
              className="px-4 py-2.5 bg-white text-amber-950 font-black text-xs rounded-2xl shadow-md hover:bg-amber-50 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <PlusCircle size={16} className="text-amber-600" />
              <span>Mulai Sesi Kelas Baru</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        <div className="bg-white p-3.5 rounded-2xl border-2 border-slate-100 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold">Total Murid</span>
            <Users size={18} className="text-blue-500" />
          </div>
          <p className="text-2xl font-black text-slate-800">{activeStudents.length}</p>
          <p className="text-[10px] font-semibold text-slate-500">Profil Aktif</p>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border-2 border-emerald-100 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold text-emerald-800">Sudah Bermain</span>
            <CheckCircle2 size={18} className="text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-emerald-600">{playedCount}</p>
          <p className="text-[10px] font-semibold text-emerald-700">Murid Selesai</p>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border-2 border-amber-100 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold text-amber-800">Belum Bermain</span>
            <Clock size={18} className="text-amber-500" />
          </div>
          <p className="text-2xl font-black text-amber-600">{notPlayedCount}</p>
          <p className="text-[10px] font-semibold text-amber-700">Menunggu Kuis</p>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border-2 border-purple-100 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold text-purple-800">Rata-rata Nilai</span>
            <Award size={18} className="text-purple-500" />
          </div>
          <p className="text-2xl font-black text-purple-600">{avgScore}</p>
          <p className="text-[10px] font-semibold text-purple-700">Skor Kelas</p>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border-2 border-sky-100 shadow-2xs col-span-2 sm:col-span-2">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold text-sky-800">Soal Belum Terpakai</span>
            <Database size={18} className="text-sky-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-black text-sky-600">{remainingQuestions}</p>
            <span className="text-xs font-bold text-slate-400">/ {questionBank.length} Total</span>
          </div>
          <p className="text-[10px] font-semibold text-sky-700">Penugasan Otomatis Unik</p>
        </div>
      </div>

      {/* Student Result Table & Controls */}
      <div className="bg-white rounded-3xl p-4 border-2 border-slate-100 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
          <div>
            <h3 className="text-base font-black text-slate-900">Daftar Hasil Murid</h3>
            <p className="text-xs font-semibold text-slate-500">
              Pantau status pengerjaan kuis murid
            </p>
          </div>

          {/* Export & Print Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => StorageService.exportResultsCSV(sessionResults)}
              className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-xs hover:bg-emerald-100 flex items-center gap-1"
            >
              <Download size={14} />
              <span>Ekspor CSV</span>
            </button>
            <button
              onClick={() => setShowPrintModal(true)}
              className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 font-bold text-xs hover:bg-amber-100 flex items-center gap-1"
            >
              <Printer size={14} />
              <span>Cetak Laporan</span>
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <div className="relative w-full sm:flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Cari murid..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex items-center gap-1 w-full sm:w-auto">
            <button
              onClick={() => setFilterStatus('all')}
              className={`flex-1 sm:flex-initial px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                filterStatus === 'all'
                  ? 'bg-amber-500 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Semua ({activeStudents.length})
            </button>
            <button
              onClick={() => setFilterStatus('played')}
              className={`flex-1 sm:flex-initial px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                filterStatus === 'played'
                  ? 'bg-emerald-500 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Sudah ({playedCount})
            </button>
            <button
              onClick={() => setFilterStatus('not_played')}
              className={`flex-1 sm:flex-initial px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                filterStatus === 'not_played'
                  ? 'bg-amber-500 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Belum ({notPlayedCount})
            </button>
          </div>
        </div>

        {/* Student Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-100">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100">
                <th className="p-3">Nama Murid</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-center">Nilai</th>
                <th className="p-3 text-center">Benar</th>
                <th className="p-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-slate-400 font-semibold">
                    Tidak ada murid ditemukan.
                  </td>
                </tr>
              ) : (
                filteredStudents.map(student => {
                  const result = sessionResults.find(r => r.studentId === student.id);
                  const hasPlayed = student.hasPlayedCurrentSession;

                  return (
                    <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3 font-bold text-slate-800 flex items-center gap-2">
                        <span className="text-xl">{student.avatar}</span>
                        <span>{student.name}</span>
                      </td>

                      <td className="p-3">
                        {hasPlayed ? (
                          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full text-[10px] font-bold border border-emerald-200">
                            <CheckCircle2 size={10} />
                            <span>Sudah Main</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full text-[10px] font-bold border border-amber-200">
                            <Clock size={10} />
                            <span>Belum Main</span>
                          </span>
                        )}
                      </td>

                      <td className="p-3 text-center font-black text-slate-900 text-sm">
                        {result ? result.score : '-'}
                      </td>

                      <td className="p-3 text-center font-bold text-slate-600">
                        {result ? `${result.correctCount} / ${result.totalQuestions}` : '-'}
                      </td>

                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {result && (
                            <button
                              onClick={() => setSelectedResultDetail(result)}
                              className="p-1.5 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors"
                              title="Lihat Detail Jawaban"
                            >
                              <Eye size={14} />
                            </button>
                          )}

                          {hasPlayed && (
                            <button
                              onClick={() => onResetStudent(student.id)}
                              className="p-1.5 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors"
                              title="Reset Status Murid"
                            >
                              <RotateCcw size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Class Session Confirmation Modal */}
      {showNewSessionConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 w-full max-w-xs shadow-2xl border-4 border-amber-300 text-center">
            <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl">
              <Sparkles size={28} />
            </div>
            <h3 className="text-lg font-black text-slate-800 mb-1">Mulai Sesi Kelas Baru?</h3>
            <p className="text-xs font-semibold text-slate-600 mb-4 leading-relaxed">
              Semua murid akan di-reset menjadi <span className="font-bold text-amber-600">“Belum Bermain”</span> dan mendapatkan paket kuis acak baru. Riwayat lama tetap tersimpan aman.
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => setShowNewSessionConfirm(false)}
                className="flex-1 py-2.5 rounded-2xl bg-slate-100 font-bold text-xs text-slate-700 hover:bg-slate-200"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  onStartNewSession();
                  setShowNewSessionConfirm(false);
                }}
                className="flex-1 py-2.5 rounded-2xl bg-amber-500 text-white font-bold text-xs shadow-md hover:bg-amber-600"
              >
                Ya, Sesi Baru
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Answer Detail Modal */}
      {selectedResultDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-5 w-full max-w-sm max-h-[85vh] flex flex-col shadow-2xl border-2 border-purple-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{selectedResultDetail.studentAvatar}</span>
                <div>
                  <h4 className="font-black text-sm text-slate-900">
                    {selectedResultDetail.studentName}
                  </h4>
                  <p className="text-[10px] font-bold text-emerald-600">
                    Skor: {selectedResultDetail.score} / 100 ({selectedResultDetail.correctCount} benar)
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedResultDetail(null)}
                className="p-1.5 rounded-xl bg-slate-100 text-slate-500 font-bold text-xs"
              >
                Tutup
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {selectedResultDetail.answersDetails.map((ans, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-2xl border text-xs ${
                    ans.isCorrect
                      ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                      : 'bg-rose-50/80 border-rose-200 text-rose-950'
                  }`}
                >
                  <p className="font-bold text-slate-900 mb-1">
                    Soal {idx + 1}: {ans.questionText}
                  </p>
                  <div className="flex justify-between text-[11px] font-semibold mt-1">
                    <span>
                      Status: {ans.isCorrect ? '✅ Benar (+10)' : '❌ Salah (0)'}
                    </span>
                    <span>Percobaan: {ans.attemptsUsed}x</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Print Modal */}
      {showPrintModal && (
        <PrintReportModal
          currentSession={currentSession}
          students={students}
          results={results}
          onClose={() => setShowPrintModal(false)}
        />
      )}
    </div>
  );
};
