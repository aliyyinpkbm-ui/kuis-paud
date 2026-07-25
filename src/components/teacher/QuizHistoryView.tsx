import React, { useState } from 'react';
import { History, Calendar, Users, Award, ChevronRight, Eye, Trash2 } from 'lucide-react';
import { ClassSession, QuizResult } from '../../types';

interface QuizHistoryViewProps {
  historySessions: ClassSession[];
  results: QuizResult[];
}

export const QuizHistoryView: React.FC<QuizHistoryViewProps> = ({
  historySessions,
  results,
}) => {
  const [selectedSession, setSelectedSession] = useState<ClassSession | null>(null);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white rounded-3xl p-4 border-2 border-slate-100 shadow-xs">
        <h2 className="text-base font-black text-slate-900">Riwayat Sesi Kuis Kelas</h2>
        <p className="text-xs font-semibold text-slate-500">
          Arsip hasil pengerjaan kuis dari sesi-sesi kelas sebelumnya
        </p>
      </div>

      {/* History List */}
      <div className="space-y-2.5">
        {historySessions.length === 0 ? (
          <div className="bg-white rounded-3xl p-6 text-center border-2 border-dashed border-slate-200 text-slate-400">
            <History size={32} className="mx-auto mb-2 opacity-50" />
            <p className="font-bold text-sm text-slate-600">Belum Ada Riwayat Sesi Lampau.</p>
            <p className="text-xs text-slate-400 mt-1">
              Saat Anda memulai "Sesi Kelas Baru", sesi saat ini akan tersimpan di sini.
            </p>
          </div>
        ) : (
          historySessions.map(session => {
            const sessionResults = results.filter(r => r.sessionId === session.sessionId);
            const count = sessionResults.length;
            const scores = sessionResults.map(r => r.score);
            const avg = count > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / count) : 0;
            const maxScore = count > 0 ? Math.max(...scores) : 0;
            const minScore = count > 0 ? Math.min(...scores) : 0;

            return (
              <div
                key={session.sessionId}
                onClick={() => setSelectedSession(session)}
                className="bg-white p-4 rounded-3xl border-2 border-slate-100 shadow-2xs hover:border-amber-300 transition-all cursor-pointer flex items-center justify-between"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase bg-purple-100 text-purple-800 px-2.5 py-0.5 rounded-full border border-purple-200">
                      {session.sessionId}
                    </span>
                    <span className="text-xs font-bold text-slate-400">
                      {new Date(session.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  <h3 className="font-black text-sm text-slate-900">{session.sessionName}</h3>

                  <div className="flex flex-wrap gap-3 text-xs font-bold text-slate-600 pt-1">
                    <span className="flex items-center gap-1 text-slate-700">
                      <Users size={14} className="text-blue-500" /> {count} Murid
                    </span>
                    <span className="flex items-center gap-1 text-slate-700">
                      <Award size={14} className="text-amber-500" /> Rata-rata: {avg}
                    </span>
                    {count > 0 && (
                      <span className="text-[11px] font-semibold text-slate-400">
                        (Tertinggi: {maxScore} | Terendah: {minScore})
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-2 rounded-2xl bg-slate-50 text-slate-400">
                  <ChevronRight size={20} />
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Historical Session Detail Modal */}
      {selectedSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-5 w-full max-w-md max-h-[85vh] flex flex-col shadow-2xl border-2 border-amber-300">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div>
                <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                  {selectedSession.sessionId}
                </span>
                <h3 className="font-black text-base text-slate-900 mt-1">
                  {selectedSession.sessionName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedSession(null)}
                className="p-1.5 rounded-xl bg-slate-100 font-bold text-xs text-slate-600"
              >
                Tutup
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {results.filter(r => r.sessionId === selectedSession.sessionId).length === 0 ? (
                <p className="text-xs font-semibold text-slate-400 p-4 text-center">
                  Tidak ada hasil tercatat untuk sesi ini.
                </p>
              ) : (
                results
                  .filter(r => r.sessionId === selectedSession.sessionId)
                  .map(res => (
                    <div
                      key={res.id}
                      className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl">{res.studentAvatar}</span>
                        <div>
                          <p className="font-black text-xs text-slate-900">{res.studentName}</p>
                          <p className="text-[10px] text-slate-500 font-mono">
                            {new Date(res.date).toLocaleTimeString('id-ID', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-lg font-black text-emerald-600">{res.score}</span>
                        <p className="text-[10px] font-bold text-slate-500">
                          {res.correctCount}/{res.totalQuestions} Benar
                        </p>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
