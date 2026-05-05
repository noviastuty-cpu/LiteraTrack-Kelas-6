
import React, { useState, useMemo, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie
} from 'recharts';
import { 
  Users, TrendingUp, BookOpen, UserPlus, Trash2, BrainCircuit, ChevronRight, 
  Lightbulb, ClipboardCheck, Info, FileText, Download, AlertCircle, RefreshCw
} from 'lucide-react';
import { StudentRecord, ProficiencyLevel, AIAnalysis } from './types';
import { RECOMMENDATIONS, getProficiencyLevel } from './constants';
import { getAIAnalysis } from './services/geminiService';

const App: React.FC = () => {
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [newName, setNewName] = useState('');
  const [newScore, setNewScore] = useState<number>(75);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);

  const addStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const record: StudentRecord = {
      id: Math.random().toString(36).substr(2, 9),
      name: newName,
      score: newScore,
      level: getProficiencyLevel(newScore)
    };

    setStudents([...students, record]);
    setNewName('');
    setNewScore(75);
  };

  const removeStudent = (id: string) => {
    setStudents(students.filter(s => s.id !== id));
  };

  const handleAIAnalysis = async () => {
    if (students.length === 0) return;
    setIsAnalyzing(true);
    const result = await getAIAnalysis(students);
    if (result) {
      setAiAnalysis(result);
    }
    setIsAnalyzing(false);
  };

  const chartData = useMemo(() => {
    const levels = [
      ProficiencyLevel.NEEDS_IMPROVEMENT,
      ProficiencyLevel.BASIC,
      ProficiencyLevel.PROFICIENT,
      ProficiencyLevel.ADVANCED
    ];
    
    return levels.map(level => ({
      name: level,
      count: students.filter(s => s.level === level).length
    }));
  }, [students]);

  const COLORS = ['#ef4444', '#f59e0b', '#3b82f6', '#10b981'];

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-200">
              <BookOpen size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 leading-tight">LiteraTrack <span className="text-indigo-600">Kelas 6</span></h1>
              <p className="text-sm text-slate-500 font-medium">Platform Diagnostik Pemahaman Bacaan</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Status Kelas</span>
              <span className="text-sm font-bold text-slate-700">{students.length} Siswa Terdaftar</span>
            </div>
            <button 
              onClick={handleAIAnalysis}
              disabled={isAnalyzing || students.length === 0}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold transition-all shadow-md active:scale-95 ${
                students.length === 0 
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-200'
              }`}
            >
              {isAnalyzing ? <RefreshCw className="animate-spin" size={18} /> : <BrainCircuit size={18} />}
              {isAnalyzing ? 'Menganalisis...' : 'Analisis AI'}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Input and List */}
          <div className="lg:col-span-4 space-y-6">
            {/* Form Input */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center gap-2 mb-6">
                <UserPlus size={20} className="text-indigo-600" />
                <h2 className="text-lg font-bold text-slate-800">Tambah Data Siswa</h2>
              </div>
              <form onSubmit={addStudent} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-1.5">Nama Siswa</label>
                  <input 
                    type="text" 
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Contoh: Budi Santoso"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-slate-700"
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-1.5">
                    <label className="text-sm font-semibold text-slate-600">Nilai Tes (60-100)</label>
                    <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg">{newScore}</span>
                  </div>
                  <input 
                    type="range" 
                    min="60" 
                    max="100" 
                    value={newScore}
                    onChange={(e) => setNewScore(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1 uppercase font-bold px-1">
                    <span>60</span>
                    <span>80</span>
                    <span>100</span>
                  </div>
                </div>
                <button 
                  type="submit"
                  className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all mt-2 shadow-lg shadow-slate-200"
                >
                  Tambah ke Daftar
                </button>
              </form>
            </div>

            {/* Student List */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Users size={20} className="text-indigo-600" />
                  <h2 className="text-lg font-bold text-slate-800">Daftar Siswa</h2>
                </div>
                <span className="text-xs bg-slate-100 px-2 py-1 rounded-md text-slate-500 font-bold">{students.length}</span>
              </div>
              <div className="max-h-[500px] overflow-y-auto">
                {students.length === 0 ? (
                  <div className="p-12 text-center">
                    <div className="bg-slate-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                      <FileText size={24} />
                    </div>
                    <p className="text-slate-400 text-sm font-medium">Belum ada data siswa.</p>
                  </div>
                ) : (
                  <ul className="divide-y divide-slate-50">
                    {students.map((student) => (
                      <li key={student.id} className="p-4 hover:bg-slate-50 transition-colors group">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-bold text-slate-800 truncate">{student.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-sm font-bold text-indigo-600">Skor: {student.score}</span>
                              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                                student.level === ProficiencyLevel.ADVANCED ? 'bg-emerald-100 text-emerald-700' :
                                student.level === ProficiencyLevel.PROFICIENT ? 'bg-blue-100 text-blue-700' :
                                student.level === ProficiencyLevel.BASIC ? 'bg-amber-100 text-amber-700' :
                                'bg-red-100 text-red-700'
                              }`}>
                                {student.level}
                              </span>
                            </div>
                          </div>
                          <button 
                            onClick={() => removeStudent(student.id)}
                            className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Visualizations & Analysis */}
          <div className="lg:col-span-8 space-y-8">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-blue-50 p-2 rounded-lg text-blue-600"><Users size={20} /></div>
                  <span className="text-sm font-semibold text-slate-500">Total Siswa</span>
                </div>
                <div className="text-2xl font-bold text-slate-800">{students.length}</div>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-emerald-50 p-2 rounded-lg text-emerald-600"><TrendingUp size={20} /></div>
                  <span className="text-sm font-semibold text-slate-500">Rata-rata Skor</span>
                </div>
                <div className="text-2xl font-bold text-slate-800">
                  {students.length > 0 
                    ? (students.reduce((acc, s) => acc + s.score, 0) / students.length).toFixed(1)
                    : '0'
                  }
                </div>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-amber-50 p-2 rounded-lg text-amber-600"><ClipboardCheck size={20} /></div>
                  <span className="text-sm font-semibold text-slate-500">Terendah</span>
                </div>
                <div className="text-2xl font-bold text-slate-800">
                  {students.length > 0 ? Math.min(...students.map(s => s.score)) : '0'}
                </div>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-indigo-50 p-2 rounded-lg text-indigo-600"><TrendingUp size={20} /></div>
                  <span className="text-sm font-semibold text-slate-500">Tertinggi</span>
                </div>
                <div className="text-2xl font-bold text-slate-800">
                  {students.length > 0 ? Math.max(...students.map(s => s.score)) : '0'}
                </div>
              </div>
            </div>

            {/* Chart Section */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <TrendingUp size={20} className="text-indigo-600" />
                Distribusi Kemampuan Kelas
              </h2>
              <div className="h-[300px] w-full">
                {students.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fontSize: 12, fontWeight: 600, fill: '#64748b'}} 
                        dy={10}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fontSize: 12, fill: '#94a3b8'}}
                      />
                      <Tooltip 
                        cursor={{fill: '#f8fafc'}}
                        contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                      />
                      <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={50}>
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-2">
                    <TrendingUp size={40} className="opacity-20" />
                    <p className="font-medium">Data grafik akan muncul setelah siswa ditambahkan</p>
                  </div>
                )}
              </div>
            </div>

            {/* AI Analysis Result */}
            {aiAnalysis && (
              <div className="bg-indigo-900 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                  <BrainCircuit size={120} />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="bg-indigo-500/30 p-2 rounded-lg"><BrainCircuit size={20} /></div>
                    <h2 className="text-xl font-bold">Hasil Analisis Diagnostik AI</h2>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-indigo-200 text-sm font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                        <Info size={14} /> Ringkasan Kelas
                      </h3>
                      <p className="text-lg leading-relaxed text-indigo-50">{aiAnalysis.summary}</p>
                    </div>

                    <div>
                      <h3 className="text-indigo-200 text-sm font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                        <Lightbulb size={14} /> Strategi Utama
                      </h3>
                      <p className="text-slate-100 leading-relaxed bg-white/5 p-4 rounded-xl border border-white/10">{aiAnalysis.detailedStrategy}</p>
                    </div>

                    <div>
                      <h3 className="text-indigo-200 text-sm font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                        <ChevronRight size={14} /> Aktivitas yang Disarankan
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {aiAnalysis.suggestedActivities.map((activity, idx) => (
                          <div key={idx} className="bg-white/10 p-4 rounded-xl border border-white/5 hover:bg-white/15 transition-all">
                            <span className="text-2xl mb-2 block">0{idx+1}</span>
                            <p className="text-sm text-indigo-50 font-medium">{activity}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Matrix Recommendations Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-100">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <ClipboardCheck size={20} className="text-indigo-600" />
                  Matriks Rekomendasi Tindak Lanjut
                </h2>
              </div>
              <div className="divide-y divide-slate-100">
                {Object.values(RECOMMENDATIONS).map((rec, idx) => (
                  <div key={rec.level} className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6 hover:bg-slate-50 transition-all">
                    <div className="md:col-span-1">
                      <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase mb-2 ${
                        rec.level === ProficiencyLevel.ADVANCED ? 'bg-emerald-100 text-emerald-700' :
                        rec.level === ProficiencyLevel.PROFICIENT ? 'bg-blue-100 text-blue-700' :
                        rec.level === ProficiencyLevel.BASIC ? 'bg-amber-100 text-amber-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {rec.level}
                      </div>
                      <div className="text-2xl font-bold text-slate-800">{rec.scoreRange}</div>
                      <p className="text-xs text-slate-400 mt-1 font-semibold uppercase tracking-wider">Nilai Tes</p>
                    </div>
                    <div className="md:col-span-1">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Karakteristik Siswa</h4>
                      <ul className="space-y-1.5">
                        {rec.characteristics.map((c, i) => (
                          <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-300 flex-shrink-0" />
                            {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="md:col-span-1">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 text-indigo-600">Langkah Strategis</h4>
                      <p className="text-sm text-slate-600 leading-relaxed italic border-l-2 border-indigo-100 pl-4">{rec.followUp}</p>
                    </div>
                    <div className="md:col-span-1">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Materi Bacaan Sesuai</h4>
                      <div className="flex flex-wrap gap-2">
                        {rec.readingMaterials.map((m, i) => (
                          <span key={i} className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-[11px] font-bold">
                            {m}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Empty State/Instructions */}
            {students.length === 0 && (
              <div className="bg-amber-50 rounded-2xl p-8 border border-amber-200 flex flex-col md:flex-row items-center gap-6">
                <div className="bg-white p-4 rounded-2xl text-amber-500 shadow-sm border border-amber-100">
                  <AlertCircle size={32} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-amber-900 mb-2">Panduan Penggunaan</h3>
                  <p className="text-amber-800 text-sm leading-relaxed max-w-2xl">
                    Silakan masukkan nama dan nilai hasil tes pemahaman bacaan siswa Anda di panel sebelah kiri. 
                    Aplikasi ini secara otomatis akan memetakan kemampuan siswa ke dalam 4 level (60-100) dan 
                    memberikan rekomendasi tindak lanjut yang spesifik. Gunakan tombol <strong>Analisis AI</strong> 
                    untuk mendapatkan strategi pengajaran yang lebih mendalam untuk seluruh kelas.
                  </p>
                </div>
              </div>
            )}

          </div>
        </div>
      </main>

      {/* Persistent Call to Action */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-lg border-t border-slate-200 z-50 md:hidden">
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold flex items-center justify-center gap-2"
        >
          <UserPlus size={18} /> Tambah Siswa Baru
        </button>
      </div>
    </div>
  );
};

export default App;
