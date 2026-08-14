import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';

export default function StuntingDetection(props) {
    const { auth, children } = props;

    // ── Color Palette ─────────────────────────────────────────────────────
    const colors = {
        primary:  '#3FA7D6',
        light:    '#7EC8E3',
        deep:     '#2F669F',
        forest:   '#6FBF4A',
        lime:     '#A8D86D',
        orange:   '#F29C38',
        peach:    '#E6A57E',
        cream:    '#FFF8F0',
        sky:      '#E0F4FF',
    };

    // ── Form state (removed: nama_anak, tanggal_lahir, jenis_kelamin) ─────
    const [formData, setFormData] = useState({
        berat_badan:         '',
        tinggi_badan:        '',
        lingkar_lengan:      '',
        hemoglobin:          '',
        umur_bulan:          '',
        tanggal_pemeriksaan: new Date().toISOString().split('T')[0],
    });

    const [errors,      setErrors]      = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [result,      setResult]      = useState(null);
    const [showResult,  setShowResult]  = useState(false);
    const [activeTab,   setActiveTab]   = useState('form');
    const resultRef = useRef(null);

    // Auto-scroll to result
    useEffect(() => {
        if (showResult && resultRef.current) {
            resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [showResult]);

    // ── BMI ───────────────────────────────────────────────────────────────
    const bmi = useMemo(() => {
        const bb = parseFloat(formData.berat_badan);
        const tb = parseFloat(formData.tinggi_badan) / 100;
        if (bb > 0 && tb > 0) return (bb / (tb * tb)).toFixed(2);
        return 0;
    }, [formData.berat_badan, formData.tinggi_badan]);

    // ── Handlers ──────────────────────────────────────────────────────────
    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    }, [errors]);

    const validateForm = useCallback(() => {
        const e = {};
        const umur = parseInt(formData.umur_bulan);
        if (!formData.umur_bulan || umur < 0 || umur > 60) e.umur_bulan = 'Umur harus 0–60 bulan';
        if (!formData.berat_badan  || formData.berat_badan  <= 0) e.berat_badan  = 'Berat badan tidak valid';
        if (!formData.tinggi_badan || formData.tinggi_badan <= 0) e.tinggi_badan = 'Tinggi badan tidak valid';
        if (!formData.lingkar_lengan || formData.lingkar_lengan <= 0) e.lingkar_lengan = 'LiLA tidak valid';
        if (!formData.hemoglobin || formData.hemoglobin <= 0) e.hemoglobin = 'Hemoglobin tidak valid';
        setErrors(e);
        return Object.keys(e).length === 0;
    }, [formData]);

    // ── Stunting analysis (WHO + Kemenkes) ──────────────────────────────
    const analyzeStunting = useCallback(() => {
        const tb     = parseFloat(formData.tinggi_badan);
        const bb     = parseFloat(formData.berat_badan);
        const lila   = parseFloat(formData.lingkar_lengan);
        const age    = parseInt(formData.umur_bulan);

        let stuntingStatus = 'normal';
        let wastingStatus  = 'normal';
        let lilaStatus     = 'normal';
        let severity       = 'normal';
        let recommendations = [];

        // Stunting (TB/U) - Main focus
        if (age >= 0 && age <= 60) {
            const medianHeights = {
                0: 49.9, 1: 54.7, 2: 58.4, 3: 61.4, 4: 63.9,
                5: 65.9, 6: 67.6, 9: 72.0, 12: 76.0, 15: 79.1,
                18: 82.3, 21: 85.1, 24: 87.8, 30: 92.9, 36: 96.1,
                42: 99.9, 48: 103.3, 54: 106.7, 60: 110.0
            };
            const ages = Object.keys(medianHeights).map(Number).sort((a,b) => a-b);
            let closestAge = ages[0];
            for (let a of ages) {
                if (Math.abs(a - age) < Math.abs(closestAge - age)) closestAge = a;
            }
            const heightRatio = (tb / (medianHeights[closestAge] || 100)) * 100;
            if      (heightRatio < 85) { stuntingStatus = 'stunting'; severity = 'severe';   }
            else if (heightRatio < 90) { stuntingStatus = 'stunting'; severity = 'moderate'; }
            else if (heightRatio < 95) { stuntingStatus = 'risk'; }
        }

        // Wasting (BB/TB via BMI)
        if      (bmi < 14) { wastingStatus = 'wasting'; severity = 'severe'; }
        else if (bmi < 16) { wastingStatus = 'wasting'; }

        // LiLA
        if      (lila < 11.5) lilaStatus = 'severe';
        else if (lila < 12.5) lilaStatus = 'moderate';

        // Recommendations focused on stunting
        if (stuntingStatus !== 'normal') {
            recommendations.push({ icon: '📏', title: 'Intervensi Stunting', desc: 'Konsultasi ke dokter anak untuk evaluasi pertumbuhan. Tingkatkan asupan protein hewani, kalsium, dan vitamin D.', priority: 'high' });
        }
        if (wastingStatus !== 'normal') {
            recommendations.push({ icon: '⚖️', title: 'Gizi Kurang Akut', desc: 'Perlu penanganan gizi intensif. Berikan makanan tinggi kalori dan protein dengan frekuensi lebih sering.', priority: 'high' });
        }
        if (lilaStatus !== 'normal') {
            recommendations.push({ icon: '💪', title: 'Status Gizi Buruk', desc: 'LiLA menunjukkan massa otot rendah. Tingkatkan asupan protein dan lakukan aktivitas fisik sesuai kemampuan.', priority: 'high' });
        }
        if (recommendations.length === 0) {
            recommendations.push({ icon: '✅', title: 'Pertahankan Gizi Baik', desc: 'Anak dalam kondisi gizi baik. Lanjutkan pola makan seimbang dengan karbohidrat, protein, lemak, vitamin dan mineral.', priority: 'normal' });
        }
        recommendations.push({ icon: '🥗', title: 'MPASI Bergizi', desc: 'Berikan makanan pendamping ASI yang kaya zat besi, protein, dan mikronutrien sesuai usia.', priority: 'normal' });

        const issues = [];
        if (stuntingStatus !== 'normal') issues.push('stunting');
        if (wastingStatus  !== 'normal') issues.push('gizi kurang');
        if (lilaStatus     !== 'normal') issues.push('gizi buruk');
        const summary = issues.length === 0
            ? 'Anak dalam kondisi gizi baik'
            : issues.length === 1
                ? `Terdeteksi ${issues[0]}`
                : `Terdeteksi multiple masalah gizi: ${issues.join(', ')}`;

        return { stuntingStatus, wastingStatus, lilaStatus, bmi, severity, recommendations, summary };
    }, [formData, bmi]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setIsSubmitting(true);
        await new Promise(r => setTimeout(r, 1400));
        setResult(analyzeStunting());
        setShowResult(true);
        setActiveTab('result');
        setIsSubmitting(false);
    };

    const resetForm = useCallback(() => {
        setFormData({
            berat_badan: '', tinggi_badan: '', lingkar_lengan: '',
            hemoglobin: '', umur_bulan: '',
            tanggal_pemeriksaan: new Date().toISOString().split('T')[0]
        });
        setResult(null); setShowResult(false); setActiveTab('form'); setErrors({});
    }, []);

    const saveToHistory = useCallback(() => {
        router.post(route('stunting.store'), { ...formData, imt: bmi, hasil: result }, {
            onSuccess: () => alert('Data berhasil disimpan ke riwayat!')
        });
    }, [formData, bmi, result]);

    // ── Status helpers ────────────────────────────────────────────────────
    const getStatusColor = useCallback((status) => {
        const map = { normal: colors.forest, risk: colors.orange, stunting: '#EF4444', wasting: '#EF4444', severe: '#EF4444', mild: colors.orange, moderate: colors.orange };
        return map[status] ?? '#9CA3AF';
    }, []);

    const getStatusBgClass = useCallback((status) => {
        const map = { normal: 'bg-green-500', risk: 'bg-yellow-500', stunting: 'bg-red-500', wasting: 'bg-red-500', severe: 'bg-red-500', mild: 'bg-orange-400', moderate: 'bg-orange-400' };
        return map[status] ?? 'bg-gray-400';
    }, []);

    const getStatusText = useCallback((type, status) => {
        const labels = {
            stunting: { normal: 'Normal', risk: 'Berisiko', stunting: 'Stunting' },
            wasting:  { normal: 'Normal', wasting: 'Gizi Kurang' },
            lila:     { normal: 'Normal', moderate: 'Gizi Kurang', severe: 'Gizi Buruk' },
        };
        return labels[type]?.[status] || status;
    }, []);

    const isHealthy = result && result.stuntingStatus === 'normal' && result.wastingStatus === 'normal' && result.lilaStatus === 'normal';

    return (
        <AuthenticatedLayout auth={auth} header={null}>
            <Head title="Deteksi Stunting" />

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=Sora:wght@400;500;600;700&display=swap');

                .sd-root {
                    font-family: 'Sora', sans-serif;
                    background: linear-gradient(180deg, #E0F4FF 0%, #F0FDF4 50%, #FFFBF5 100%);
                    min-height: 100vh;
                    padding-bottom: 5rem;
                }

                /* Hero */
                .sd-hero {
                    background: linear-gradient(135deg, #3FA7D6 0%, #2F669F 55%, #6FBF4A 100%);
                    position: relative;
                    overflow: hidden;
                }

                .sd-wave { position: absolute; bottom: 0; left: 0; width: 100%; line-height: 0; pointer-events: none; }

                /* Glass card */
                .glass-card {
                    background: rgba(255,255,255,0.92);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255,255,255,0.6);
                    border-radius: 2rem;
                    box-shadow: 0 8px 40px rgba(63,167,214,0.10);
                }

                /* Input */
                .sd-input-wrap { position: relative; }
                .sd-input {
                    width: 100%;
                    padding: 0.875rem 1rem 0.875rem 3rem;
                    border: 2px solid #E5E7EB;
                    border-radius: 1rem;
                    font-family: 'Sora', sans-serif;
                    font-size: 0.95rem;
                    background: white;
                    transition: border-color 0.25s, box-shadow 0.25s;
                    color: #1F2937;
                }
                .sd-input:focus { outline: none; border-color: #3FA7D6; box-shadow: 0 0 0 4px rgba(63,167,214,0.15); }
                .sd-input.err   { border-color: #EF4444; }
                .sd-icon {
                    position: absolute; left: 0.875rem; top: 50%;
                    transform: translateY(-50%); font-size: 1.2rem;
                    pointer-events: none; opacity: 0.55; transition: opacity 0.2s;
                }
                .sd-input-wrap:focus-within .sd-icon { opacity: 1; }

                /* Submit button */
                .sd-btn-primary {
                    flex: 1;
                    padding: 1rem 2rem;
                    background: linear-gradient(135deg, #3FA7D6 0%, #2F669F 100%);
                    color: white; border: none; border-radius: 1rem;
                    font-family: 'Sora', sans-serif;
                    font-size: 1.05rem; font-weight: 700; cursor: pointer;
                    transition: transform 0.25s, box-shadow 0.25s;
                    box-shadow: 0 8px 24px rgba(63,167,214,0.30);
                }
                .sd-btn-primary:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 14px 32px rgba(63,167,214,0.38); }
                .sd-btn-primary:disabled { opacity: 0.65; cursor: not-allowed; }

                /* Tab pill */
                .sd-tab {
                    padding: 0.65rem 1.4rem; border-radius: 9999px;
                    font-weight: 600; font-family: 'Sora', sans-serif;
                    border: none; cursor: pointer; transition: all 0.25s ease;
                    font-size: 0.9rem;
                }
                .sd-tab.active { background: linear-gradient(135deg,#3FA7D6,#2F669F); color: white; box-shadow: 0 6px 18px rgba(63,167,214,0.30); }
                .sd-tab:not(.active) { background: #F3F4F6; color: #6B7280; }
                .sd-tab:not(.active):hover { background: #E5E7EB; color: #374151; }

                /* Metric card */
                .metric-card {
                    background: linear-gradient(135deg, #F9FBFF 0%, #FFFFFF 100%);
                    border: 1px solid #E5E7EB; border-radius: 1.5rem;
                    padding: 1.5rem; transition: transform 0.3s, box-shadow 0.3s;
                }
                .metric-card:hover { transform: translateY(-4px); box-shadow: 0 14px 28px rgba(63,167,214,0.12); }

                /* Recommendation card */
                .rec-card {
                    background: white; border-radius: 1.25rem;
                    padding: 1.25rem 1.5rem; border-left: 4px solid;
                    transition: transform 0.25s, box-shadow 0.25s;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
                }
                .rec-card:hover { transform: translateX(4px); box-shadow: 0 8px 20px rgba(0,0,0,0.08); }
                .rec-high   { border-left-color: #EF4444; }
                .rec-normal { border-left-color: #6FBF4A; }

                /* Result card animate */
                @keyframes slideUp { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
                .result-card { animation: slideUp 0.5s cubic-bezier(0.34,1.2,0.64,1) both; }

                /* Live preview box */
                .live-preview {
                    background: linear-gradient(135deg, #E0F4FF 0%, #F0FDF4 100%);
                    border: 1.5px solid #7EC8E3;
                    border-radius: 1.25rem; padding: 1rem 1.5rem;
                }

                /* Error / hint text */
                .err-text  { color:#EF4444; font-size:0.75rem; margin-top:0.25rem; display:flex; align-items:center; gap:0.25rem; }
                .hint-text { color:#6B7280; font-size:0.75rem; margin-top:0.25rem; display:block; }

                /* Float animation */
                @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
                .float { animation: float 4s ease-in-out infinite; }

                /* Progress bar */
                @keyframes barGrow { from{width:0} to{width:var(--w)} }
                .bar-fill { animation: barGrow 1s cubic-bezier(0.34,1,0.64,1) 0.3s both; }

                /* Input grid layout */
                .input-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 1.25rem;
                }
                @media (max-width: 640px) {
                    .input-grid { grid-template-columns: 1fr; }
                    .glass-card { border-radius: 1.5rem; }
                }
            `}</style>

            <div className="sd-root">

                {/* ── Hero ─────────────────────────────────────────────── */}
                <section className="sd-hero py-14 md:py-20">
                    <div className="absolute top-0 left-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
                    <div className="absolute bottom-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" />
                    <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none" />

                    <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-semibold mb-5">
                            <span className="float">🔬</span>
                            <span>Berdasarkan Standar WHO & Kemenkes</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
                            Deteksi <span className="text-yellow-300">Stunting</span> Dini
                        </h1>
                        <p className="text-blue-100 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                            Pemeriksaan komprehensif untuk deteksi stunting dan status gizi — cepat, akurat, terpercaya.
                        </p>

                        <div className="flex flex-wrap justify-center gap-3 mt-8">
                            {[
                                { label: 'Standar WHO', icon: '🌐' },
                                { label: 'Kemenkes RI', icon: '🏥' },
                                { label: 'Analisis Otomatis', icon: '⚡' },
                                { label: 'Gratis', icon: '✅' },
                            ].map((s, i) => (
                                <div key={i} className="flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-sm rounded-full text-white text-sm font-medium">
                                    <span>{s.icon}</span><span>{s.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="sd-wave">
                        <svg viewBox="0 0 1440 52" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none"
                            style={{ display: 'block', width: '100%', height: '52px' }}>
                            <path d="M0,26 C360,52 1080,0 1440,26 L1440,52 L0,52 Z" fill="white" />
                        </svg>
                    </div>
                </section>

                {/* ── Content ───────────────────────────────────────────── */}
                <div className="max-w-5xl mx-auto px-4 -mt-2 relative z-10">

                    {/* Tab bar */}
                    <div className="flex justify-center gap-2 mb-8">
                        <button className={`sd-tab ${activeTab === 'form' ? 'active' : ''}`} onClick={() => setActiveTab('form')}>
                            📝 Form Pemeriksaan
                        </button>
                        {showResult && (
                            <button className={`sd-tab ${activeTab === 'result' ? 'active' : ''}`} onClick={() => setActiveTab('result')}>
                                📊 Hasil Analisis
                            </button>
                        )}
                    </div>

                    {/* ── FORM ──────────────────────────────────────────── */}
                    {activeTab === 'form' && (
                        <div className="glass-card p-6 md:p-10">
                            {/* Section header */}
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                                    style={{ background: `linear-gradient(135deg, ${colors.primary}20, ${colors.forest}20)` }}>
                                    📋
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Poppins' }}>Data Pemeriksaan</h2>
                                    <p className="text-sm text-gray-500">Isi semua kolom dengan data yang akurat</p>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} noValidate>
                                <div className="input-grid">

                                    {/* Umur (Bulan) */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Umur Anak (bulan)</label>
                                        <div className="sd-input-wrap">
                                            <span className="sd-icon">🎂</span>
                                            <input type="number" name="umur_bulan" value={formData.umur_bulan}
                                                onChange={handleInputChange}
                                                className={`sd-input ${errors.umur_bulan ? 'err' : ''}`}
                                                placeholder="Contoh: 24" min="0" max="60" />
                                        </div>
                                        {errors.umur_bulan && <span className="err-text">⚠️ {errors.umur_bulan}</span>}
                                        <span className="hint-text">Rentang: 0 – 60 bulan (5 tahun)</span>
                                    </div>

                                    {/* Berat Badan */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Berat Badan (kg)</label>
                                        <div className="sd-input-wrap">
                                            <span className="sd-icon">⚖️</span>
                                            <input type="number" step="0.1" name="berat_badan" value={formData.berat_badan}
                                                onChange={handleInputChange}
                                                className={`sd-input ${errors.berat_badan ? 'err' : ''}`}
                                                placeholder="Contoh: 12.5" />
                                        </div>
                                        {errors.berat_badan && <span className="err-text">⚠️ {errors.berat_badan}</span>}
                                    </div>

                                    {/* Tinggi Badan */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tinggi Badan (cm)</label>
                                        <div className="sd-input-wrap">
                                            <span className="sd-icon">📏</span>
                                            <input type="number" step="0.1" name="tinggi_badan" value={formData.tinggi_badan}
                                                onChange={handleInputChange}
                                                className={`sd-input ${errors.tinggi_badan ? 'err' : ''}`}
                                                placeholder="Contoh: 85.0" />
                                        </div>
                                        {errors.tinggi_badan && <span className="err-text">⚠️ {errors.tinggi_badan}</span>}
                                    </div>

                                    {/* LiLA */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Lingkar Lengan Atas / LiLA (cm)</label>
                                        <div className="sd-input-wrap">
                                            <span className="sd-icon">💪</span>
                                            <input type="number" step="0.1" name="lingkar_lengan" value={formData.lingkar_lengan}
                                                onChange={handleInputChange}
                                                className={`sd-input ${errors.lingkar_lengan ? 'err' : ''}`}
                                                placeholder="Contoh: 13.5" />
                                        </div>
                                        {errors.lingkar_lengan && <span className="err-text">⚠️ {errors.lingkar_lengan}</span>}
                                        <span className="hint-text">Normal &gt;12.5 · Gizi Kurang 11.5–12.5 · Gizi Buruk &lt;11.5 cm</span>
                                    </div>

                                    {/* Hemoglobin */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Kadar Hemoglobin (g/dL)</label>
                                        <div className="sd-input-wrap">
                                            <span className="sd-icon">🩸</span>
                                            <input type="number" step="0.1" name="hemoglobin" value={formData.hemoglobin}
                                                onChange={handleInputChange}
                                                className={`sd-input ${errors.hemoglobin ? 'err' : ''}`}
                                                placeholder="Contoh: 12.5" />
                                        </div>
                                        {errors.hemoglobin && <span className="err-text">⚠️ {errors.hemoglobin}</span>}
                                    </div>

                                    {/* Tanggal Pemeriksaan */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tanggal Pemeriksaan</label>
                                        <div className="sd-input-wrap">
                                            <span className="sd-icon">📋</span>
                                            <input type="date" name="tanggal_pemeriksaan" value={formData.tanggal_pemeriksaan}
                                                onChange={handleInputChange} className="sd-input" />
                                        </div>
                                    </div>
                                </div>

                                {/* Live preview */}
                                {bmi > 0 && (
                                    <div className="live-preview mt-6">
                                        <h4 className="font-bold mb-3 flex items-center gap-2 text-sm" style={{ color: colors.deep }}>
                                            <span>⚡</span> Perhitungan Real-time
                                        </h4>
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                                            {[
                                                { label: 'IMT (BMI)', value: `${bmi} kg/m²` },
                                                { label: 'Umur',      value: formData.umur_bulan ? `${formData.umur_bulan} bulan` : '-' },
                                                { label: 'BB',        value: formData.berat_badan ? `${formData.berat_badan} kg` : '-' },
                                                { label: 'TB',        value: formData.tinggi_badan ? `${formData.tinggi_badan} cm` : '-' },
                                            ].map((item, i) => (
                                                <div key={i} className="text-center bg-white/70 rounded-xl py-2 px-1">
                                                    <div className="text-gray-500 text-xs mb-0.5">{item.label}</div>
                                                    <div className="font-bold text-sm" style={{ color: colors.deep }}>{item.value}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Buttons */}
                                <div className="mt-8 flex gap-3 flex-wrap">
                                    <button type="submit" className="sd-btn-primary" disabled={isSubmitting} style={{ flex: '2 1 200px' }}>
                                        {isSubmitting ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                                                </svg>
                                                Menganalisis...
                                            </span>
                                        ) : '🔍 Analisis Data'}
                                    </button>
                                    <button type="button" onClick={resetForm}
                                        className="px-5 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                                        style={{ flex: '1 1 100px' }}>
                                        🔄 Reset
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* ── RESULT ────────────────────────────────────────── */}
                    {activeTab === 'result' && result && (
                        <div ref={resultRef} className="result-card glass-card overflow-hidden">

                            {/* Result header */}
                            <div className="p-8 text-white rounded-t-3xl"
                                style={{
                                    background: isHealthy
                                        ? `linear-gradient(135deg, ${colors.forest} 0%, #4CAF50 100%)`
                                        : result.severity === 'severe'
                                            ? 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)'
                                            : `linear-gradient(135deg, ${colors.orange} 0%, #EF4444 100%)`
                                }}>
                                <div className="text-center">
                                    <div className="text-6xl mb-4 float">{isHealthy ? '✅' : '⚠️'}</div>
                                    <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ fontFamily: 'Poppins' }}>
                                        {isHealthy ? 'Hasil Pemeriksaan Normal' : 'Perlu Perhatian Khusus'}
                                    </h2>
                                    <p className="text-lg opacity-90">{result.summary}</p>
                                    <div className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 backdrop-blur-sm rounded-full font-bold">
                                        <span>{isHealthy ? '🟢' : result.severity === 'severe' ? '🔴' : '🟠'}</span>
                                        <span>{isHealthy ? 'Gizi Baik' : result.severity === 'severe' ? 'Gizi Buruk' : result.stuntingStatus === 'stunting' ? 'Stunting Terdeteksi' : 'Gizi Kurang'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Metrics */}
                            <div className="p-6 md:p-8 bg-gray-50/60">
                                <h3 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                                    <span>📊</span> Metrik Pengukuran
                                </h3>
                                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {[
                                        { label: 'IMT (BMI)', icon: '⚖️', value: result.bmi, unit: 'kg/m²', type: 'wasting',  status: result.wastingStatus },
                                        { label: 'Tinggi Badan', icon: '📏', value: `${formData.tinggi_badan}`, unit: `cm · ${formData.umur_bulan} bulan`, type: 'stunting', status: result.stuntingStatus },
                                        { label: 'LiLA', icon: '💪', value: `${formData.lingkar_lengan}`, unit: 'cm', type: 'lila', status: result.lilaStatus },
                                    ].map((m, i) => (
                                        <div key={i} className="metric-card">
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-sm font-semibold text-gray-600">{m.label}</span>
                                                <span className="text-2xl">{m.icon}</span>
                                            </div>
                                            <div className="text-2xl font-bold text-gray-900 mb-0.5">{m.value}</div>
                                            <div className="text-xs text-gray-500 mb-3">{m.unit}</div>
                                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold text-white ${getStatusBgClass(m.status)}`}>
                                                {getStatusText(m.type, m.status)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Recommendations */}
                            <div className="p-6 md:p-8">
                                <h3 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                                    <span>💡</span> Rekomendasi &amp; Saran
                                </h3>
                                <div className="space-y-3">
                                    {result.recommendations.map((rec, i) => (
                                        <div key={i} className={`rec-card ${rec.priority === 'high' ? 'rec-high' : 'rec-normal'}`}>
                                            <div className="flex items-start gap-4">
                                                <span className="text-2xl flex-shrink-0">{rec.icon}</span>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-bold text-gray-900 mb-0.5">{rec.title}</h4>
                                                    <p className="text-gray-600 text-sm leading-relaxed">{rec.desc}</p>
                                                </div>
                                                {rec.priority === 'high' && (
                                                    <span className="flex-shrink-0 px-2.5 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">
                                                        PRIORITAS
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Referensi */}
                                <div className="mt-8 p-5 rounded-2xl border" style={{ backgroundColor: `${colors.sky}`, borderColor: `${colors.light}` }}>
                                    <h4 className="font-bold mb-3 flex items-center gap-2 text-sm" style={{ color: colors.deep }}>
                                        📚 Referensi Standar
                                    </h4>
                                    <ul className="space-y-1.5 text-sm" style={{ color: '#1E4D7B' }}>
                                        <li>• <strong>WHO Child Growth Standards 2006</strong> — standar pertumbuhan anak global</li>
                                        <li>• <strong>Permenkes RI No. 2 Tahun 2020</strong> — standar antropometri status gizi</li>
                                        <li>• <strong>LiLA:</strong> &lt;11.5 cm = Gizi Buruk · 11.5–12.5 cm = Gizi Kurang · &gt;12.5 cm = Normal</li>
                                    </ul>
                                </div>

                                {/* Action buttons */}
                                <div className="mt-8 flex flex-col sm:flex-row gap-3">
                                    <button onClick={saveToHistory}
                                        className="flex-1 px-5 py-3.5 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all hover:shadow-lg hover:opacity-90"
                                        style={{ background: `linear-gradient(135deg, ${colors.forest}, #4CAF50)` }}>
                                        💾 Simpan ke Riwayat
                                    </button>
                                    <button onClick={() => window.print()}
                                        className="flex-1 px-5 py-3.5 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all hover:shadow-lg hover:opacity-90"
                                        style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.deep})` }}>
                                        🖨️ Cetak Hasil
                                    </button>
                                    <button onClick={resetForm}
                                        className="flex-1 px-5 py-3.5 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                                        🔄 Pemeriksaan Baru
                                    </button>
                                </div>

                                {/* Disclaimer */}
                                <div className="mt-6 p-4 rounded-xl border" style={{ backgroundColor: `${colors.cream}`, borderColor: `${colors.peach}` }}>
                                    <p className="text-sm text-center" style={{ color: '#92400E' }}>
                                        <strong>⚠️ Disclaimer:</strong> Hasil ini bersifat informatif berdasarkan perhitungan standar.
                                        Konsultasikan dengan tenaga medis profesional untuk diagnosis dan penanganan lanjutan.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
