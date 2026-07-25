import React from 'react';
import { Printer, X } from 'lucide-react';
import { Student, QuizResult, ClassSession } from '../../types';

interface PrintReportModalProps {
  currentSession: ClassSession;
  students: Student[];
  results: QuizResult[];
  onClose: () => void;
}

export const PrintReportModal: React.FC<PrintReportModalProps> = ({
  currentSession,
  students,
  results,
  onClose,
}) => {
  const activeStudents = students.filter(s => s.isActive);
  const sessionResults = results.filter(r => r.sessionId === currentSession.sessionId);

  const playedCount = sessionResults.length;
  const totalScoreSum = sessionResults.reduce((acc, r) => acc + r.score, 0);
  const avgScore = playedCount > 0 ? Math.round(totalScoreSum / playedCount) : 0;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl p-6 w-full max-w-2xl shadow-2xl border-2 border-slate-200 my-auto">
        {/* Modal Controls (Hidden when printing) */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 print:hidden">
          <div>
            <h3 className="text-lg font-black text-slate-800">Cetak Laporan Hasil Kuis</h3>
            <p className="text-xs font-semibold text-slate-500">
              Pratinjau laporan hasil kuis kelas PAUD
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-amber-500 text-white font-bold text-xs rounded-xl shadow-xs hover:bg-amber-600 flex items-center gap-1.5"
            >
              <Printer size={16} />
              <span>Cetak / Simpan PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-xl bg-slate-100"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Printable Area */}
        <div className="pt-4 print:p-0">
          <div className="text-center pb-4 border-b-2 border-amber-300">
            <h1 className="text-2xl font-black text-amber-950">KUIS CERIA PAUD</h1>
            <p className="text-sm font-bold text-amber-700">LAPORAN HASIL KELAS SESI KUIS</p>
            <p className="text-xs font-mono text-slate-500 mt-1">
              ID Sesi: {currentSession.sessionId} • {new Date().toLocaleDateString('id-ID', { dateStyle: 'full' })}
            </p>
          </div>

          {/* Session Summary Grid */}
          <div className="grid grid-cols-4 gap-2 my-4 text-center">
            <div className="bg-slate-50 p-2 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 block">Total Murid</span>
              <span className="text-base font-black text-slate-800">{activeStudents.length}</span>
            </div>
            <div className="bg-emerald-50 p-2 rounded-xl border border-emerald-200">
              <span className="text-[10px] font-bold text-emerald-700 block">Sudah Main</span>
              <span className="text-base font-black text-emerald-800">{playedCount}</span>
            </div>
            <div className="bg-amber-50 p-2 rounded-xl border border-amber-200">
              <span className="text-[10px] font-bold text-amber-700 block">Belum Main</span>
              <span className="text-base font-black text-amber-800">
                {activeStudents.length - playedCount}
              </span>
            </div>
            <div className="bg-blue-50 p-2 rounded-xl border border-blue-200">
              <span className="text-[10px] font-bold text-blue-700 block">Rata-rata</span>
              <span className="text-base font-black text-blue-800">{avgScore}</span>
            </div>
          </div>

          {/* Results Table */}
          <table className="w-full text-left text-xs border-collapse mt-4">
            <thead>
              <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
                <th className="p-2 font-bold">No</th>
                <th className="p-2 font-bold">Nama Murid</th>
                <th className="p-2 font-bold">Status</th>
                <th className="p-2 font-bold text-center">Nilai</th>
                <th className="p-2 font-bold text-center">Benar</th>
                <th className="p-2 font-bold text-right">Tanggal/Waktu</th>
              </tr>
            </thead>
            <tbody>
              {activeStudents.map((student, idx) => {
                const res = sessionResults.find(r => r.studentId === student.id);

                return (
                  <tr key={student.id} className="border-b border-slate-100">
                    <td className="p-2 font-mono">{idx + 1}</td>
                    <td className="p-2 font-bold text-slate-800">
                      {student.avatar} {student.name}
                    </td>
                    <td className="p-2">
                      {res ? (
                        <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 text-[10px]">
                          Sudah Main
                        </span>
                      ) : (
                        <span className="text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 text-[10px]">
                          Belum Main
                        </span>
                      )}
                    </td>
                    <td className="p-2 text-center font-black text-slate-900">
                      {res ? res.score : '-'}
                    </td>
                    <td className="p-2 text-center font-bold text-slate-700">
                      {res ? `${res.correctCount}/${res.totalQuestions}` : '-'}
                    </td>
                    <td className="p-2 text-right text-slate-500 font-mono text-[10px]">
                      {res ? new Date(res.date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '-'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Signature Line for Teacher */}
          <div className="mt-8 flex justify-between items-end text-xs text-slate-600 pt-4 border-t border-slate-200">
            <div>
              <p className="font-bold">Guru Kelas PAUD</p>
              <div className="h-12" />
              <p className="border-b border-slate-400 w-36 font-semibold">( ................................ )</p>
            </div>
            <div className="text-right text-[10px] text-slate-400">
              Dicetak dari Aplikasi Kuis Ceria PAUD (Offline Version)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
