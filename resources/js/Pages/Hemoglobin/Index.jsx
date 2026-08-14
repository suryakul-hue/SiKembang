import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState, useEffect, useMemo, useCallback } from 'react';

export default function TabletRoutineHistory(props) {
    const { auth, history = [], children } = props;

    // ── Palette Modern Health ──────────────────────────
    const colors = {
        primary:  '#E53935',    // Red health
        light:    '#FFCDD2',
        deep:     '#C62828',
        accent:   '#FF7043',    // Orange
        success:  '#43A047',    // Green
        info:     '#1E88E5',    // Blue
        purple:   '#8E24AA',    // Purple
        cream:    '#FFF3E0',
        rose:     '#FFEBEE',
        surface:  '#FAFAFA',
    };

    // ── State ─────────────────────────────────────────
    const [activeTab, setActiveTab] = useState('tracker');
    const [selectedWeek, setSelectedWeek] = useState(() => getCurrentWeek());
    const [hemoglobinData, setHemoglobinData] = useState({
        hemoglobin: '',
        tanggal_cek: new Date().toISOString().split('T')[0],
        catatan: '',
    });
    const [weeklyStatus, setWeeklyStatus] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    // Helper: Get current week number
    function getCurrentWeek() {
        const now = new Date();
        const start = new Date(now.getFullYear(), 0, 1);
        const diff = now - start + ((start.getDay() + 1) * 86400000);
        return Math.ceil(diff / 604800000);
    }

    // Helper: Get week dates
    function getWeekDates(weekNum, year = new Date().getFullYear()) {
        const start = new Date(year, 0, 1 + (weekNum - 1) * 7);
        const end = new Date(start);
        end.setDate(end.getDate() + 6);
        return { start, end, days: Array.from({length: 7}, (_, i) => {
            const d = new Date(start);
            d.setDate(d.getDate() + i);
            return d;
        })};
    }

    // ── Handlers ──────────────────────────────────────
    const handleHemoglobinSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        // Simulate API call
        await new Promise(r => setTimeout(r, 1000));
        
        router.post(route('hemoglobin.store'), hemoglobinData, {
            onSuccess: () => {
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 3000);
                setHemoglobinData({
                    hemoglobin: '',
                    tanggal_cek: new Date().toISOString().split('T')[0],
                    catatan: '',
                });
            },
            onFinish: () => setIsSubmitting(false)
        });
    };

    const toggleDayStatus = useCallback((weekKey, dayIndex) => {
        setWeeklyStatus(prev => ({
            ...prev,
            [weekKey]: {
                ...prev[weekKey],
                [dayIndex]: !prev[weekKey]?.[dayIndex]
            }
        }));
    }, []);

    const saveWeeklyProgress = async (weekKey) => {
        const daysTaken = Object.values(weeklyStatus[weekKey] || {}).filter(Boolean).length;
        
        router.post(route('tablet-routine.store'), {
            minggu: weekKey,
            tahun: new Date().getFullYear(),
            total_minum: daysTaken,
            detail_harian: weeklyStatus[weekKey] || {},
        }, {
            onSuccess: () => alert(`Progress minggu ${weekKey} tersimpan! ${daysTaken}/7 hari minum tablet.`)
        });
    };

    // ── Analysis ───────────────────────────────────────
    const hemoglobinAnalysis = useMemo(() => {
        const hb = parseFloat(hemoglobinData.hemoglobin);
        if (!hb || hb <= 0) return null;
        
        let status = 'normal';
        let color = colors.success;
        let message = 'Kadar hemoglobin normal';
        let icon = '✅';
        
        if (hb < 8) {
            status = 'severe';
            color = colors.deep;
            message = 'Anemia Berat - Segera ke dokter!';
            icon = '🚨';
        } else if (hb < 11) {
            status = 'moderate';
            color = colors.primary;
            message = 'Anemia Ringan-Sedang - Perlu perhatian';
            icon = '⚠️';
        } else if (hb < 12) {
            status = 'borderline';
            color = colors.accent;
            message = 'Batas bawah normal - Pantau terus';
            icon = '💡';
        }
        
        return { status, color, message, icon, hb };
    }, [hemoglobinData.hemoglobin]);

    const weekInfo = useMemo(() => getWeekDates(selectedWeek), [selectedWeek]);

    return (
        <AuthenticatedLayout auth={auth} header={null}>
            <Head title="Riwayat Tablet Tambah Darah" />

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap');

                .ttd-root {
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    background: linear-gradient(135deg, #FFF5F5 0%, #FFF8F0 50%, #F3E5F5 100%);
                    min-height: 100vh;
                    padding-bottom: 4rem;
                }

                /* Hero Section */
                .ttd-hero {
                    background: linear-gradient(135deg, #E53935 0%, #C62828 50%, #8E24AA 100%);
                    position: relative;
                    overflow: hidden;
                }

                .ttd-hero::before {
                    content: '';
                    position: absolute;
                    top: -50%;
                    left: -50%;
                    width: 200%;
                    height: 200%;
                    background: radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px);
                    background-size: 20px 20px;
                    opacity: 0.3;
                }

                /* Glass Card */
                .glass-card {
                    background: rgba(255,255,255,0.95);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255,255,255,0.8);
                    border-radius: 24px;
                    box-shadow: 0 8px 32px rgba(229,57,53,0.08);
                }

                /* Modern Input */
                .modern-input {
                    width: 100%;
                    padding: 1rem 1rem 1rem 3rem;
                    border: 2px solid #E0E0E0;
                    border-radius: 16px;
                    font-family: 'Inter', sans-serif;
                    font-size: 1rem;
                    background: white;
                    transition: all 0.3s ease;
                }
                .modern-input:focus {
                    outline: none;
                    border-color: #E53935;
                    box-shadow: 0 0 0 4px rgba(229,57,53,0.1);
                }

                /* Week Selector */
                .week-card {
                    background: white;
                    border-radius: 20px;
                    padding: 1.5rem;
                    border: 2px solid transparent;
                    transition: all 0.3s ease;
                    cursor: pointer;
                }
                .week-card:hover {
                    border-color: #FFCDD2;
                    transform: translateY(-2px);
                }
                .week-card.active {
                    border-color: #E53935;
                    background: linear-gradient(135deg, #FFEBEE 0%, white 100%);
                }

                /* Day Toggle */
                .day-toggle {
                    width: 56px;
                    height: 56px;
                    border-radius: 16px;
                    border: 2px solid #E0E0E0;
                    background: white;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                    overflow: hidden;
                }
                .day-toggle:hover {
                    border-color: #E53935;
                    transform: scale(1.05);
                }
                .day-toggle.taken {
                    background: linear-gradient(135deg, #43A047 0%, #2E7D32 100%);
                    border-color: #43A047;
                    color: white;
                    box-shadow: 0 4px 16px rgba(67,160,71,0.3);
                }
                .day-toggle.taken::after {
                    content: '✓';
                    position: absolute;
                    top: 4px;
                    right: 4px;
                    font-size: 12px;
                    font-weight: bold;
                }

                /* Progress Ring */
                .progress-ring {
                    transform: rotate(-90deg);
                }
                .progress-ring-circle {
                    transition: stroke-dashoffset 0.5s ease;
                }

                /* Hemoglobin Gauge */
                .hb-gauge {
                    position: relative;
                    width: 200px;
                    height: 100px;
                    margin: 0 auto;
                }
                .hb-gauge-bg {
                    fill: none;
                    stroke: #E0E0E0;
                    stroke-width: 20;
                }
                .hb-gauge-fill {
                    fill: none;
                    stroke-width: 20;
                    stroke-linecap: round;
                    transition: stroke-dasharray 0.5s ease;
                }

                /* Animated Button */
                .btn-primary {
                    background: linear-gradient(135deg, #E53935 0%, #C62828 100%);
                    color: white;
                    border: none;
                    border-radius: 16px;
                    padding: 1rem 2rem;
                    font-weight: 700;
                    font-size: 1rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 16px rgba(229,57,53,0.3);
                    position: relative;
                    overflow: hidden;
                }
                .btn-primary:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 24px rgba(229,57,53,0.4);
                }
                .btn-primary:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                /* Success Animation */
                @keyframes successPop {
                    0% { transform: scale(0); opacity: 0; }
                    50% { transform: scale(1.2); }
                    100% { transform: scale(1); opacity: 1; }
                }
                .success-badge {
                    animation: successPop 0.5s ease;
                }

                /* Pulse Animation */
                @keyframes pulse-ring {
                    0% { transform: scale(0.8); opacity: 0.5; }
                    100% { transform: scale(1.3); opacity: 0; }
                }
                .pulse-indicator {
                    position: relative;
                }
                .pulse-indicator::before {
                    content: '';
                    position: absolute;
                    inset: -4px;
                    border-radius: 50%;
                    background: #E53935;
                    animation: pulse-ring 2s ease-out infinite;
                }

                /* Table Styles */
                .modern-table {
                    width: 100%;
                    border-collapse: separate;
                    border-spacing: 0 8px;
                }
                .modern-table th {
                    text-align: left;
                    padding: 1rem;
                    font-weight: 600;
                    color: #666;
                    font-size: 0.875rem;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
                .modern-table td {
                    padding: 1rem;
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
                }
                .modern-table tr:hover td {
                    box-shadow: 0 4px 16px rgba(0,0,0,0.08);
                    transform: translateY(-1px);
                    transition: all 0.2s ease;
                }

                /* Tab Pills */
                .tab-pill {
                    padding: 0.875rem 1.75rem;
                    border-radius: 50px;
                    font-weight: 600;
                    font-size: 0.95rem;
                    border: none;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    background: rgba(255,255,255,0.6);
                    color: #666;
                }
                .tab-pill.active {
                    background: linear-gradient(135deg, #E53935 0%, #C62828 100%);
                    color: white;
                    box-shadow: 0 4px 16px rgba(229,57,53,0.3);
                }

                /* Status Badge */
                .status-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.5rem 1rem;
                    border-radius: 50px;
                    font-size: 0.875rem;
                    font-weight: 600;
                }

                /* Floating Card */
                .float-card {
                    animation: floatUp 0.6s ease;
                }
                @keyframes floatUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @media (max-width: 768px) {
                    .day-toggle {
                        width: 44px;
                        height: 44px;
                        font-size: 0.75rem;
                    }
                }
            `}</style>

            <div className="ttd-root">

                {/* ── Hero Section ─────────────────────────────── */}
                <section className="ttd-hero py-16 md:py-24 relative">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl" />
                    
                    <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-semibold mb-6 pulse-indicator">
                            <span>💊</span>
                            <span>Program Tablet Tambah Darah</span>
                        </div>
                        
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">
                            Pantau Kesehatan <span className="text-yellow-300">Anemia</span>
                        </h1>
                        
                        <p className="text-red-100 text-lg md:text-xl max-w-2xl mx-auto mb-8">
                            Tracking rutin konsumsi tablet besi dan monitoring kadar hemoglobin untuk kesehatan optimal.
                        </p>

                        {/* Quick Stats */}
                        <div className="flex flex-wrap justify-center gap-4 mt-8">
                            {[
                                { value: '90%', label: 'Efektivitas TTD', icon: '📈' },
                                { value: '1x/Hari', label: 'Dosis Rutin', icon: '⏰' },
                                { value: '12 mg', label: 'Zat Besi', icon: '⚡' },
                            ].map((stat, i) => (
                                <div key={i} className="glass-card px-6 py-4 flex items-center gap-3">
                                    <span className="text-2xl">{stat.icon}</span>
                                    <div className="text-left">
                                        <div className="font-bold text-gray-900 text-lg">{stat.value}</div>
                                        <div className="text-gray-500 text-sm">{stat.label}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Wave */}
                    <div className="absolute bottom-0 left-0 w-full">
                        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0 60L48 55C96 50 192 40 288 35C384 30 480 30 576 33.3C672 37 768 43 864 45C960 47 1056 45 1152 41.7C1248 38 1344 33 1392 30.3L1440 28V60H1392C1344 60 1248 60 1152 60C1056 60 960 60 864 60C768 60 672 60 576 60C480 60 384 60 288 60C192 60 96 60 48 60H0Z" fill="#FFF5F5"/>
                        </svg>
                    </div>
                </section>

                {/* ── Navigation Tabs ────────────────────────────── */}
                <div className="max-w-6xl mx-auto px-4 -mt-8 relative z-20">
                    <div className="glass-card p-2 inline-flex gap-2">
                        <button 
                            className={`tab-pill ${activeTab === 'tracker' ? 'active' : ''}`}
                            onClick={() => setActiveTab('tracker')}>
                            📅 Tracking Mingguan
                        </button>
                        <button 
                            className={`tab-pill ${activeTab === 'hemoglobin' ? 'active' : ''}`}
                            onClick={() => setActiveTab('hemoglobin')}>
                            🩸 Cek Hemoglobin
                        </button>
                        <button 
                            className={`tab-pill ${activeTab === 'history' ? 'active' : ''}`}
                            onClick={() => setActiveTab('history')}>
                            📊 Riwayat Lengkap
                        </button>
                    </div>
                </div>

                {/* ── Tab Content ──────────────────────────────── */}
                <div className="max-w-6xl mx-auto px-4 mt-8">

                    {/* TRACKER TAB */}
                    {activeTab === 'tracker' && (
                        <div className="float-card space-y-6">
                            
                            {/* Week Selector */}
                            <div className="glass-card p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900">Minggu ke-{selectedWeek}</h2>
                                        <p className="text-gray-500 mt-1">
                                            {weekInfo.start.toLocaleDateString('id-ID', {day:'numeric', month:'long'})} - {weekInfo.end.toLocaleDateString('id-ID', {day:'numeric', month:'long', year:'numeric'})}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => setSelectedWeek(prev => prev - 1)}
                                            className="p-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors">
                                            ←
                                        </button>
                                        <button 
                                            onClick={() => setSelectedWeek(getCurrentWeek())}
                                            className="px-4 py-3 rounded-xl bg-red-50 text-red-600 font-semibold hover:bg-red-100 transition-colors">
                                            Minggu Ini
                                        </button>
                                        <button 
                                            onClick={() => setSelectedWeek(prev => prev + 1)}
                                            className="p-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors">
                                            →
                                        </button>
                                    </div>
                                </div>

                                {/* Days Grid */}
                                <div className="grid grid-cols-7 gap-3 md:gap-4">
                                    {weekInfo.days.map((date, idx) => {
                                        const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
                                        const isTaken = weeklyStatus[selectedWeek]?.[idx];
                                        const isToday = new Date().toDateString() === date.toDateString();
                                        
                                        return (
                                            <div key={idx} className="flex flex-col items-center gap-2">
                                                <span className={`text-xs font-semibold ${isToday ? 'text-red-600' : 'text-gray-500'}`}>
                                                    {dayNames[date.getDay()]}
                                                </span>
                                                <button
                                                    onClick={() => toggleDayStatus(selectedWeek, idx)}
                                                    className={`day-toggle ${isTaken ? 'taken' : ''} ${isToday ? 'ring-2 ring-red-500 ring-offset-2' : ''}`}>
                                                    <span className="text-lg font-bold">{date.getDate()}</span>
                                                    <span className="text-[10px] opacity-80">{isTaken ? 'Sudah' : 'Belum'}</span>
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Progress Summary */}
                                <div className="mt-8 p-6 bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl border border-red-100">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-bold text-gray-900 text-lg">Progress Minggu Ini</h3>
                                            <p className="text-gray-600 text-sm mt-1">
                                                {Object.values(weeklyStatus[selectedWeek] || {}).filter(Boolean).length} dari 7 hari sudah minum tablet
                                            </p>
                                        </div>
                                        <div className="relative w-24 h-24">
                                            <svg className="progress-ring w-24 h-24" viewBox="0 0 100 100">
                                                <circle cx="50" cy="50" r="45" fill="none" stroke="#E0E0E0" strokeWidth="10"/>
                                                <circle 
                                                    cx="50" cy="50" r="45" fill="none" stroke="#E53935" strokeWidth="10"
                                                    strokeDasharray={`${2 * Math.PI * 45}`}
                                                    strokeDashoffset={`${2 * Math.PI * 45 * (1 - (Object.values(weeklyStatus[selectedWeek] || {}).filter(Boolean).length / 7))}`}
                                                    className="progress-ring-circle"
                                                    strokeLinecap="round"
                                                />
                                            </svg>
                                            <div className="absolute inset-0 flex items-center justify-center font-bold text-xl text-gray-900">
                                                {Math.round((Object.values(weeklyStatus[selectedWeek] || {}).filter(Boolean).length / 7) * 100)}%
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <button 
                                        onClick={() => saveWeeklyProgress(selectedWeek)}
                                        className="btn-primary w-full mt-4 flex items-center justify-center gap-2">
                                        💾 Simpan Progress Minggu Ini
                                    </button>
                                </div>
                            </div>

                            {/* Tips Card */}
                            <div className="glass-card p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-100">
                                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <span>💡</span> Tips Konsumsi Tablet
                                </h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    {[
                                        { icon: '🍊', title: 'Minum dengan Vitamin C', desc: 'Jus jeruk atau tomat membantu absorbsi zat besi' },
                                        { icon: '☕', title: 'Hindari Kopi/Teh', desc: 'Jangan minum 1 jam sebelum/sesudah tablet' },
                                        { icon: '🥛', title: 'Jauhi Susu', desc: 'Kalsium menghambat penyerapan zat besi' },
                                        { icon: '⏰', title: 'Waktu Terbaik', desc: 'Minum saat perut kosong di pagi hari' },
                                    ].map((tip, i) => (
                                        <div key={i} className="flex items-start gap-3 p-3 bg-white/70 rounded-xl">
                                            <span className="text-2xl">{tip.icon}</span>
                                            <div>
                                                <h4 className="font-semibold text-gray-900 text-sm">{tip.title}</h4>
                                                <p className="text-gray-600 text-xs mt-0.5">{tip.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* HEMOGLOBIN TAB */}
                    {activeTab === 'hemoglobin' && (
                        <div className="float-card max-w-2xl mx-auto">
                            <div className="glass-card p-8">
                                <div className="text-center mb-8">
                                    <div className="w-20 h-20 mx-auto bg-gradient-to-br from-red-100 to-red-200 rounded-2xl flex items-center justify-center text-4xl mb-4">
                                        🩸
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900">Input Data Hemoglobin</h2>
                                    <p className="text-gray-500 mt-2">Catat hasil pemeriksaan darah terbaru Anda</p>
                                </div>

                                <form onSubmit={handleHemoglobinSubmit} className="space-y-6">
                                    {/* Hemoglobin Input */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Kadar Hemoglobin (g/dL)
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl">🧪</span>
                                            <input
                                                type="number"
                                                step="0.1"
                                                value={hemoglobinData.hemoglobin}
                                                onChange={(e) => setHemoglobinData(prev => ({...prev, hemoglobin: e.target.value}))}
                                                className="modern-input text-center text-2xl font-bold"
                                                placeholder="12.0"
                                                required
                                            />
                                        </div>
                                        
                                        {/* Real-time Analysis */}
                                        {hemoglobinAnalysis && (
                                            <div 
                                                className="mt-4 p-4 rounded-xl border-2 transition-all"
                                                style={{ 
                                                    backgroundColor: `${hemoglobinAnalysis.color}15`,
                                                    borderColor: hemoglobinAnalysis.color 
                                                }}>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-3xl">{hemoglobinAnalysis.icon}</span>
                                                    <div>
                                                        <div 
                                                            className="font-bold text-lg"
                                                            style={{ color: hemoglobinAnalysis.color }}>
                                                            {hemoglobinAnalysis.message}
                                                        </div>
                                                        <div className="text-gray-600 text-sm">
                                                            Kadar HB: <strong>{hemoglobinAnalysis.hb} g/dL</strong>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                {/* Visual Gauge */}
                                                <div className="hb-gauge mt-4">
                                                    <svg viewBox="0 0 200 100" className="w-full">
                                                        <path d="M 20 100 A 80 80 0 0 1 180 100" className="hb-gauge-bg"/>
                                                        <path 
                                                            d="M 20 100 A 80 80 0 0 1 180 100" 
                                                            className="hb-gauge-fill"
                                                            stroke={hemoglobinAnalysis.color}
                                                            strokeDasharray={`${Math.min((hemoglobinAnalysis.hb / 16) * 251, 251)} 251`}
                                                        />
                                                        {/* Markers */}
                                                        <text x="20" y="115" fontSize="10" fill="#999">0</text>
                                                        <text x="95" y="20" fontSize="10" fill="#999">8</text>
                                                        <text x="180" y="115" fontSize="10" fill="#999">16</text>
                                                    </svg>
                                                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center">
                                                        <div className="text-2xl font-bold" style={{ color: hemoglobinAnalysis.color }}>
                                                            {hemoglobinAnalysis.hb}
                                                        </div>
                                                        <div className="text-xs text-gray-500">g/dL</div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Date Input */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Tanggal Pemeriksaan
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">📅</span>
                                            <input
                                                type="date"
                                                value={hemoglobinData.tanggal_cek}
                                                onChange={(e) => setHemoglobinData(prev => ({...prev, tanggal_cek: e.target.value}))}
                                                className="modern-input"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Notes */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Catatan (Opsional)
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-4 text-xl">📝</span>
                                            <textarea
                                                value={hemoglobinData.catatan}
                                                onChange={(e) => setHemoglobinData(prev => ({...prev, catatan: e.target.value}))}
                                                className="modern-input min-h-[100px] resize-none"
                                                placeholder="Contoh: Minum tablet rutin, makan daging merah..."
                                                rows={3}
                                            />
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <button 
                                        type="submit" 
                                        disabled={isSubmitting}
                                        className="btn-primary w-full flex items-center justify-center gap-2">
                                        {isSubmitting ? (
                                            <>
                                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                                                </svg>
                                                Menyimpan...
                                            </>
                                        ) : (
                                            <>💾 Simpan Data Hemoglobin</>
                                        )}
                                    </button>

                                    {/* Success Message */}
                                    {showSuccess && (
                                        <div className="success-badge bg-green-100 text-green-700 p-4 rounded-xl text-center font-semibold flex items-center justify-center gap-2">
                                            <span>✅</span>
                                            Data berhasil disimpan!
                                        </div>
                                    )}
                                </form>

                                {/* Reference Table */}
                                <div className="mt-8 p-4 bg-gray-50 rounded-xl">
                                    <h4 className="font-bold text-gray-900 mb-3 text-sm">📚 Standar Hemoglobin (WHO)</h4>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div className="flex justify-between p-2 bg-white rounded-lg">
                                            <span className="text-gray-600">Anemia Berat</span>
                                            <span className="font-bold text-red-600">&lt; 8 g/dL</span>
                                        </div>
                                        <div className="flex justify-between p-2 bg-white rounded-lg">
                                            <span className="text-gray-600">Anemia Sedang</span>
                                            <span className="font-bold text-orange-500">8-10.9 g/dL</span>
                                        </div>
                                        <div className="flex justify-between p-2 bg-white rounded-lg">
                                            <span className="text-gray-600">Anemia Ringan</span>
                                            <span className="font-bold text-yellow-600">11-11.9 g/dL</span>
                                        </div>
                                        <div className="flex justify-between p-2 bg-white rounded-lg">
                                            <span className="text-gray-600">Normal</span>
                                            <span className="font-bold text-green-600">≥ 12 g/dL</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* HISTORY TAB */}
                    {activeTab === 'history' && (
                        <div className="float-card space-y-6">
                            
                            {/* Combined History Table */}
                            <div className="glass-card p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-gray-900">📊 Riwayat Lengkap</h2>
                                    <div className="flex gap-2">
                                        <select className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm">
                                            <option>Semua Tahun</option>
                                            <option>2026</option>
                                            <option>2025</option>
                                        </select>
                                        <button className="px-4 py-2 bg-red-50 text-red-600 rounded-xl font-semibold text-sm hover:bg-red-100 transition-colors">
                                            📥 Export
                                        </button>
                                    </div>
                                </div>

                                {/* Tablet History */}
                                <div className="mb-8">
                                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                        <span className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-green-600">💊</span>
                                        Riwayat Konsumsi Tablet
                                    </h3>
                                    <table className="modern-table">
                                        <thead>
                                            <tr>
                                                <th>Minggu</th>
                                                <th>Periode</th>
                                                <th>Frekuensi</th>
                                                <th>Status</th>
                                                <th>Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {[
                                                { week: 10, period: '3-9 Maret 2026', taken: 7, total: 7, status: 'perfect' },
                                                { week: 9, period: '24 Feb - 2 Mar 2026', taken: 5, total: 7, status: 'good' },
                                                { week: 8, period: '17-23 Feb 2026', taken: 3, total: 7, status: 'warning' },
                                            ].map((row, i) => (
                                                <tr key={i}>
                                                    <td className="font-semibold">Minggu {row.week}</td>
                                                    <td className="text-gray-600 text-sm">{row.period}</td>
                                                    <td>
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                                <div 
                                                                    className={`h-full rounded-full ${row.taken === 7 ? 'bg-green-500' : row.taken >= 5 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                                                    style={{width: `${(row.taken/7)*100}%`}}
                                                                />
                                                            </div>
                                                            <span className="text-sm font-medium">{row.taken}/7</span>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <span className={`status-badge ${
                                                            row.status === 'perfect' ? 'bg-green-100 text-green-700' :
                                                            row.status === 'good' ? 'bg-yellow-100 text-yellow-700' :
                                                            'bg-red-100 text-red-700'
                                                        }`}>
                                                            {row.status === 'perfect' ? '✅ Sempurna' : row.status === 'good' ? '👍 Baik' : '⚠️ Perlu Perhatian'}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <button className="text-red-600 hover:text-red-700 font-medium text-sm">
                                                            Detail →
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Hemoglobin History */}
                                <div>
                                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                        <span className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center text-red-600">🩸</span>
                                        Riwayat Pemeriksaan Hemoglobin
                                    </h3>
                                    <table className="modern-table">
                                        <thead>
                                            <tr>
                                                <th>Tanggal</th>
                                                <th>Nilai (g/dL)</th>
                                                <th>Status</th>
                                                <th>Tren</th>
                                                <th>Catatan</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {[
                                                { date: '10 Mar 2026', value: 12.5, prev: 11.8, note: 'Setelah minum tablet 3 bulan' },
                                                { date: '15 Jan 2026', value: 11.8, prev: 10.5, note: 'Mulai program TTD' },
                                                { date: '10 Des 2025', value: 10.5, prev: null, note: 'Pemeriksaan awal' },
                                            ].map((row, i) => (
                                                <tr key={i}>
                                                    <td className="font-medium">{row.date}</td>
                                                    <td>
                                                        <span className={`text-lg font-bold ${
                                                            row.value >= 12 ? 'text-green-600' :
                                                            row.value >= 11 ? 'text-yellow-600' :
                                                            'text-red-600'
                                                        }`}>
                                                            {row.value}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                            row.value >= 12 ? 'bg-green-100 text-green-700' :
                                                            row.value >= 11 ? 'bg-yellow-100 text-yellow-700' :
                                                            'bg-red-100 text-red-700'
                                                        }`}>
                                                            {row.value >= 12 ? 'Normal' : row.value >= 11 ? 'Borderline' : 'Anemia'}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        {row.prev ? (
                                                            <span className={`flex items-center gap-1 text-sm ${
                                                                row.value > row.prev ? 'text-green-600' : 'text-red-600'
                                                            }`}>
                                                                {row.value > row.prev ? '↑' : '↓'} 
                                                                {Math.abs(row.value - row.prev).toFixed(1)}
                                                            </span>
                                                        ) : (
                                                            <span className="text-gray-400 text-sm">-</span>
                                                        )}
                                                    </td>
                                                    <td className="text-gray-600 text-sm max-w-xs truncate">{row.note}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Summary Cards */}
                            <div className="grid md:grid-cols-3 gap-4">
                                <div className="glass-card p-6 text-center">
                                    <div className="text-4xl mb-2">📈</div>
                                    <div className="text-3xl font-bold text-gray-900">85%</div>
                                    <div className="text-gray-500 text-sm">Keteraturan Minum Tablet</div>
                                </div>
                                <div className="glass-card p-6 text-center">
                                    <div className="text-4xl mb-2">🎯</div>
                                    <div className="text-3xl font-bold text-green-600">+2.0</div>
                                    <div className="text-gray-500 text-sm">Peningkatan HB (g/dL)</div>
                                </div>
                                <div className="glass-card p-6 text-center">
                                    <div className="text-4xl mb-2">🏆</div>
                                    <div className="text-3xl font-bold text-purple-600">12</div>
                                    <div className="text-gray-500 text-sm">Minggu Berturut-turut</div>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </AuthenticatedLayout>
    );
}