import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState, useCallback, useMemo, useEffect } from 'react';

export default function StuntingHistory({ auth, records, stats, filters }) {
    // Modern Medical Palette - Soft, Clean, Professional
    const colors = {
        primary: '#0D9488',      // Teal 600
        primaryLight: '#14B8A6', // Teal 500
        primaryDark: '#0F766E',  // Teal 700
        secondary: '#059669',    // Emerald 600
        accent: '#D97706',       // Amber 600
        danger: '#DC2626',       // Red 600
        info: '#2563EB',         // Blue 600
        purple: '#7C3AED',       // Violet 600
        surface: '#F8FAFC',
        elevated: '#FFFFFF',
        text: '#1E293B',
        muted: '#64748B',
    };

    const [search,        setSearch]        = useState(filters?.search ?? '');
    const [statusFilter,  setStatusFilter]  = useState(filters?.status ?? 'all');
    const [expandedId,    setExpandedId]    = useState(null);
    const [deletingId,    setDeletingId]    = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(null);
    const [activeChart,   setActiveChart]   = useState('weight'); // weight, height, lila, hb
    const [isVisible, setIsVisible] = useState(false);

    // Intersection observer for animations
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
            { threshold: 0.1 }
        );
        const el = document.getElementById('stats-section');
        if (el) observer.observe(el);
        return () => observer.disconnect();
    }, []);

    const applyFilters = useCallback((s, f) => {
        router.get(route('stunting.history'), {
            search: s || undefined,
            status: f !== 'all' ? f : undefined,
        }, { preserveState: true, replace: true });
    }, []);

    const handleSearch = useCallback((e) => {
        const val = e.target.value;
        setSearch(val);
        clearTimeout(window._st);
        window._st = setTimeout(() => applyFilters(val, statusFilter), 400);
    }, [statusFilter, applyFilters]);

    const handleStatusFilter = useCallback((s) => {
        setStatusFilter(s);
        applyFilters(search, s);
    }, [search, applyFilters]);

    const confirmDoDelete = useCallback(() => {
        if (!confirmDelete) return;
        setDeletingId(confirmDelete.id);
        router.delete(route('stunting.destroy', confirmDelete.id), {
            onFinish: () => { setDeletingId(null); setConfirmDelete(null); },
        });
    }, [confirmDelete]);

    const isHealthy = (r) =>
        r.stunting_status === 'normal' && r.wasting_status === 'normal' &&
        r.anemia_status   === 'normal' && r.lila_status    === 'normal';

    const getOverallStatus = (r) => {
        if (isHealthy(r))               return { label: 'Normal',          bg: 'bg-emerald-100',  text: 'text-emerald-800',  dot: 'bg-emerald-500', border: 'border-emerald-200' };
        if (r.severity === 'severe')    return { label: 'Gizi Buruk',      bg: 'bg-red-100',    text: 'text-red-800',    dot: 'bg-red-500', border: 'border-red-200' };
        if (r.stunting_status === 'stunting') return { label: 'Stunting',  bg: 'bg-red-100',    text: 'text-red-800',    dot: 'bg-red-500', border: 'border-red-200' };
        if (r.stunting_status === 'risk')    return { label: 'Berisiko',   bg: 'bg-amber-100', text: 'text-amber-800', dot: 'bg-amber-500', border: 'border-amber-200' };
        return                                     { label: 'Perlu Perhatian', bg: 'bg-amber-100', text: 'text-amber-800', dot: 'bg-amber-500', border: 'border-amber-200' };
    };

    const formatDate = (d) => d ? new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-';
    const formatDateShort = (d) => d ? new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : '-';
    const ageDisplay = (m) => {
        if (!m && m !== 0) return '-';
        if (m < 12) return `${m} bln`;
        const y = Math.floor(m / 12), r = m % 12;
        return r > 0 ? `${y} thn ${r} bln` : `${y} thn`;
    };

    const getBadgeClass = (s) => {
        if (s === 'normal') return 'bg-emerald-100 text-emerald-800 border-emerald-200';
        if (['severe', 'stunting', 'wasting'].includes(s)) return 'bg-red-100 text-red-800 border-red-200';
        return 'bg-amber-100 text-amber-800 border-amber-200';
    };

    const statusLabels = {
        stunting: { normal: 'Normal', risk: 'Berisiko', stunting: 'Stunting' },
        wasting:  { normal: 'Normal', wasting: 'Gizi Kurang' },
        anemia:   { normal: 'Normal', mild: 'Anemia Ringan', severe: 'Anemia Berat' },
        lila:     { normal: 'Normal', moderate: 'Gizi Kurang', severe: 'Gizi Buruk' },
    };

    const filterButtons = [
        { key: 'all',      label: 'Semua',           icon: '📋' },
        { key: 'healthy',  label: 'Normal',           icon: '✅' },
        { key: 'risk',     label: 'Perlu Perhatian',  icon: '⚠️' },
        { key: 'stunting', label: 'Stunting',         icon: '🔴' },
    ];

    const { flash } = usePage().props;

    // ===== CHART DATA PREPARATION =====
    const chartData = useMemo(() => {
        if (!records?.data || records.data.length === 0) return [];
        // Sort by date ascending for chart
        const sorted = [...records.data].sort((a, b) => 
            new Date(a.tanggal_pemeriksaan) - new Date(b.tanggal_pemeriksaan)
        );
        return sorted.map(r => ({
            date: formatDateShort(r.tanggal_pemeriksaan),
            fullDate: r.tanggal_pemeriksaan,
            weight: parseFloat(r.berat_badan) || 0,
            height: parseFloat(r.tinggi_badan) || 0,
            lila: parseFloat(r.lingkar_lengan) || 0,
            hb: parseFloat(r.hemoglobin) || 0,
            name: r.nama_anak,
            age: r.umur_bulan,
        }));
    }, [records]);

    // Chart config
    const chartConfig = {
        weight: { label: 'Berat Badan (kg)', color: '#0D9488', fill: 'rgba(13,148,136,0.1)', icon: '⚖️' },
        height: { label: 'Tinggi Badan (cm)', color: '#2563EB', fill: 'rgba(37,99,235,0.1)', icon: '📏' },
        lila:   { label: 'LiLA (cm)', color: '#D97706', fill: 'rgba(217,119,6,0.1)', icon: '💪' },
        hb:     { label: 'Hemoglobin (g/dL)', color: '#DC2626', fill: 'rgba(220,38,38,0.1)', icon: '🩸' },
    };

    // ===== INSIGHT / KESIMPULAN LOGIC =====
    const latestInsight = useMemo(() => {
        if (!records?.data || records.data.length === 0) return null;
        const latest = records.data[0]; // Assuming sorted by latest first
        const prev = records.data[1] || null;

        const status = getOverallStatus(latest);
        const insights = [];

        // Weight insight
        if (prev) {
            const diff = (latest.berat_badan - prev.berat_badan).toFixed(1);
            if (diff > 0) insights.push({ type: 'positive', text: `Berat badan naik ${diff} kg dari pemeriksaan sebelumnya.` });
            else if (diff < 0) insights.push({ type: 'warning', text: `Berat badan turun ${Math.abs(diff)} kg dari pemeriksaan sebelumnya.` });
        }

        // Height insight
        if (prev && latest.tinggi_badan > prev.tinggi_badan) {
            const diff = (latest.tinggi_badan - prev.tinggi_badan).toFixed(1);
            insights.push({ type: 'positive', text: `Tinggi badan bertambah ${diff} cm.` });
        }

        // Anemia
        if (latest.anemia_status !== 'normal') {
            insights.push({ type: 'alert', text: `Kadar hemoglobin ${latest.hemoglobin} g/dL menunjukkan ${statusLabels.anemia[latest.anemia_status] || 'anemia'}. Konsumsi tablet tambah darah rutin dan makanan kaya zat besi.` });
        } else {
            insights.push({ type: 'positive', text: `Kadar hemoglobin normal (${latest.hemoglobin} g/dL).` });
        }

        // Stunting
        if (latest.stunting_status === 'stunting') {
            insights.push({ type: 'alert', text: `Terdeteksi stunting. Perlu intervensi gizi segera dan konsultasi ke tenaga kesehatan.` });
        } else if (latest.stunting_status === 'risk') {
            insights.push({ type: 'warning', text: `Berisiko stunting. Pantau asupan protein dan kalsium secara ketat.` });
        } else {
            insights.push({ type: 'positive', text: `Pertumbuhan tinggi badan dalam kategori normal.` });
        }

        // LiLA
        if (latest.lila_status !== 'normal') {
            insights.push({ type: 'warning', text: `Lingkar lengan menunjukkan status gizi ${statusLabels.lila[latest.lila_status] || 'kurang'}.` });
        }

        // Wasting
        if (latest.wasting_status !== 'normal') {
            insights.push({ type: 'warning', text: `Status BB/TB menunjukkan ${statusLabels.wasting[latest.wasting_status] || 'gizi kurang'}.` });
        }

        return {
            latest,
            status,
            insights,
            prev,
            trend: prev ? {
                weight: latest.berat_badan - prev.berat_badan,
                height: latest.tinggi_badan - prev.tinggi_badan,
                hb: latest.hemoglobin - prev.hemoglobin,
            } : null
        };
    }, [records]);

    // SVG Chart Component
    const renderChart = () => {
        if (chartData.length === 0) return null;
        const data = chartData;
        const cfg = chartConfig[activeChart];
        const values = data.map(d => d[activeChart]);
        const max = Math.max(...values) * 1.1;
        const min = Math.min(...values) * 0.9 || 0;
        const range = max - min || 1;

        const width = 600;
        const height = 240;
        const padding = { top: 20, right: 20, bottom: 40, left: 50 };
        const chartW = width - padding.left - padding.right;
        const chartH = height - padding.top - padding.bottom;

        const getX = (i) => padding.left + (i / (data.length - 1 || 1)) * chartW;
        const getY = (v) => padding.top + chartH - ((v - min) / range) * chartH;

        // Line path
        const linePath = data.map((d, i) => {
            const x = getX(i);
            const y = getY(d[activeChart]);
            return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
        }).join(' ');

        // Area path
        const areaPath = `${linePath} L ${getX(data.length - 1)} ${padding.top + chartH} L ${getX(0)} ${padding.top + chartH} Z`;

        // Grid lines
        const gridLines = [0, 0.25, 0.5, 0.75, 1].map(p => {
            const y = padding.top + chartH * p;
            const val = (max - range * p).toFixed(1);
            return { y, val };
        });

        return (
            <div className="w-full overflow-x-auto">
                <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ minWidth: '400px' }}>
                    {/* Grid */}
                    {gridLines.map((g, i) => (
                        <g key={i}>
                            <line x1={padding.left} y1={g.y} x2={width - padding.right} y2={g.y} stroke="#E2E8F0" strokeWidth="1" strokeDasharray="4 4" />
                            <text x={padding.left - 10} y={g.y + 4} textAnchor="end" fontSize="11" fill="#94A3B8">{g.val}</text>
                        </g>
                    ))}

                    {/* Area */}
                    <path d={areaPath} fill={cfg.fill} />

                    {/* Line */}
                    <path d={linePath} fill="none" stroke={cfg.color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

                    {/* Points */}
                    {data.map((d, i) => {
                        const x = getX(i);
                        const y = getY(d[activeChart]);
                        return (
                            <g key={i}>
                                <circle cx={x} cy={y} r="5" fill="white" stroke={cfg.color} strokeWidth="2.5" />
                                <circle cx={x} cy={y} r="2" fill={cfg.color} />
                                {/* Tooltip-like label on hover area */}
                                <text x={x} y={y - 12} textAnchor="middle" fontSize="11" fontWeight="600" fill={cfg.color}>
                                    {d[activeChart]}
                                </text>
                                <text x={x} y={height - 10} textAnchor="middle" fontSize="10" fill="#64748B">{d.date}</text>
                            </g>
                        );
                    })}
                </svg>
            </div>
        );
    };

    // Status distribution for mini bar chart
    const statusDistribution = useMemo(() => {
        if (!records?.data) return [];
        const dist = { normal: 0, risk: 0, stunting: 0, severe: 0 };
        records.data.forEach(r => {
            if (isHealthy(r)) dist.normal++;
            else if (r.stunting_status === 'stunting') dist.stunting++;
            else if (r.stunting_status === 'risk') dist.risk++;
            else if (r.severity === 'severe') dist.severe++;
            else dist.risk++;
        });
        const total = records.data.length || 1;
        return [
            { label: 'Normal', count: dist.normal, pct: (dist.normal / total) * 100, color: '#10B981', bg: 'bg-emerald-500' },
            { label: 'Berisiko', count: dist.risk, pct: (dist.risk / total) * 100, color: '#F59E0B', bg: 'bg-amber-500' },
            { label: 'Stunting', count: dist.stunting, pct: (dist.stunting / total) * 100, color: '#EF4444', bg: 'bg-red-500' },
            { label: 'Gizi Buruk', count: dist.severe, pct: (dist.severe / total) * 100, color: '#DC2626', bg: 'bg-red-600' },
        ];
    }, [records]);

    return (
        <AuthenticatedLayout auth={auth} header={null}>
            <Head title="Riwayat Pemeriksaan" />

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

                .sh-root {
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    background: #F8FAFC;
                    min-height: 100vh;
                    padding-bottom: 5rem;
                }

                /* Hero Section */
                .sh-hero {
                    background: linear-gradient(135deg, #0F766E 0%, #0D9488 40%, #134E4A 100%);
                    position: relative;
                    overflow: hidden;
                }
                .sh-hero::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    opacity: 0.03;
                    background-image: radial-gradient(circle at 1px 1px, white 1px, transparent 0);
                    background-size: 40px 40px;
                }
                .sh-hero-shape {
                    position: absolute;
                    border-radius: 50%;
                    filter: blur(80px);
                    opacity: 0.12;
                }

                /* Cards */
                .medical-card {
                    background: white;
                    border: 1px solid #E2E8F0;
                    border-radius: 20px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02);
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .medical-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 30px -5px rgba(0,0,0,0.06);
                    border-color: #CBD5E1;
                }

                .stat-pill {
                    background: rgba(255,255,255,0.12);
                    backdrop-filter: blur(12px);
                    border: 1px solid rgba(255,255,255,0.2);
                    border-radius: 16px;
                    padding: 1rem 1.25rem;
                    transition: all 0.25s ease;
                }
                .stat-pill:hover {
                    background: rgba(255,255,255,0.18);
                    transform: translateY(-2px);
                }

                .record-card {
                    background: white;
                    border-radius: 20px;
                    border: 1px solid #E2E8F0;
                    overflow: hidden;
                    transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .record-card:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 20px 40px -5px rgba(13, 148, 136, 0.08);
                    border-color: #99F6E4;
                }

                .detail-panel {
                    max-height: 0;
                    overflow: hidden;
                    transition: max-height 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .detail-panel.open {
                    max-height: 1000px;
                }

                .filter-pill {
                    padding: 0.5rem 1.1rem;
                    border-radius: 9999px;
                    font-size: 0.8rem;
                    font-weight: 600;
                    border: 1.5px solid #E2E8F0;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    background: white;
                    color: #64748B;
                }
                .filter-pill:hover {
                    border-color: #0D9488;
                    color: #0D9488;
                }
                .filter-pill.active {
                    background: linear-gradient(135deg, #0D9488, #0F766E);
                    border-color: transparent;
                    color: white;
                    box-shadow: 0 4px 12px rgba(13, 148, 136, 0.25);
                }

                .sh-search {
                    border: 1.5px solid #E2E8F0;
                    border-radius: 14px;
                    padding: 0.75rem 1rem 0.75rem 2.75rem;
                    font-size: 0.9rem;
                    width: 100%;
                    background: white;
                    transition: all 0.25s;
                    color: #1E293B;
                }
                .sh-search:focus {
                    outline: none;
                    border-color: #0D9488;
                    box-shadow: 0 0 0 4px rgba(13, 148, 136, 0.1);
                }
                .sh-search::placeholder { color: #94A3B8; }

                .page-btn {
                    width: 2.2rem;
                    height: 2.2rem;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.875rem;
                    font-weight: 600;
                    transition: all 0.2s;
                    cursor: pointer;
                    border: none;
                }
                .page-btn.active {
                    background: linear-gradient(135deg, #0D9488, #0F766E);
                    color: white;
                    box-shadow: 0 4px 10px rgba(13, 148, 136, 0.25);
                }
                .page-btn:not(.active) {
                    background: #F1F5F9;
                    color: #64748B;
                }
                .page-btn:not(.active):hover {
                    background: #E2E8F0;
                    color: #0D9488;
                }
                .page-btn:disabled {
                    opacity: 0.4;
                    cursor: not-allowed;
                }

                .chart-tab {
                    padding: 0.5rem 1rem;
                    border-radius: 10px;
                    font-size: 0.8rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                    border: 1.5px solid transparent;
                    color: #64748B;
                    background: transparent;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }
                .chart-tab:hover {
                    background: #F1F5F9;
                    color: #0D9488;
                }
                .chart-tab.active {
                    background: rgba(13, 148, 136, 0.08);
                    color: #0D9488;
                    border-color: rgba(13, 148, 136, 0.2);
                }

                .insight-card {
                    background: linear-gradient(135deg, #F0FDFA 0%, #ECFDF5 100%);
                    border: 1px solid #99F6E4;
                    border-radius: 20px;
                    padding: 1.5rem;
                }

                .trend-up { color: #059669; }
                .trend-down { color: #DC2626; }
                .trend-neutral { color: #64748B; }

                @keyframes overlayIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes dialogIn {
                    from { opacity: 0; transform: scale(0.95) translateY(10px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }
                .overlay-bg {
                    animation: overlayIn 0.2s ease;
                }
                .confirm-dialog {
                    animation: dialogIn 0.25s cubic-bezier(0.34, 1.4, 0.64, 1);
                }

                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(16px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .fade-in-up {
                    animation: fadeInUp 0.4s ease both; }

                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-6px); }
                }
                .float { animation: float 5s ease-in-out infinite; }

                @keyframes pulse-soft {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.7; }
                }
                .pulse-soft { animation: pulse-soft 2s ease-in-out infinite; }

                /* Custom Scrollbar */
                ::-webkit-scrollbar { width: 6px; height: 6px; }
                ::-webkit-scrollbar-track { background: #F1F5F9; }
                ::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 3px; }
                ::-webkit-scrollbar-thumb:hover { background: #94A3B8; }
            `}</style>

            <div className="sh-root">

                {/* Hero */}
                <section className="sh-hero py-12 md:py-16">
                    <div className="sh-hero-shape w-96 h-96 bg-white top-0 right-0 -mr-20 -mt-20" />
                    <div className="sh-hero-shape w-72 h-72 bg-teal-300 bottom-0 left-0 -ml-10 -mb-10" />

                    <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
                        <Link href={route('stunting.check')}
                            className="inline-flex items-center gap-2 text-teal-100 hover:text-white text-sm font-medium mb-5 transition-colors group">
                            <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Kembali ke Form Pemeriksaan
                        </Link>

                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/15 backdrop-blur-md rounded-full text-white/95 text-xs font-semibold mb-4 border border-white/20">
                                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                                    <span>Data Pribadi — {auth.user.name}</span>
                                </div>
                                <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
                                    Riwayat <span className="text-teal-200">Pemeriksaan</span>
                                </h1>
                                <p className="text-teal-100/80 mt-3 text-sm md:text-base max-w-lg">
                                    Pantau perkembangan kesehatan anak melalui data pemeriksaan stunting yang terintegrasi.
                                </p>
                            </div>
                            <Link href={route('stunting.check')}
                                className="inline-flex items-center gap-2 px-6 py-3.5 bg-white/15 hover:bg-white/25 backdrop-blur-md rounded-2xl text-white font-semibold transition-all text-sm border border-white/20 shadow-lg shadow-teal-900/10 flex-shrink-0">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Pemeriksaan Baru
                            </Link>
                        </div>

                        {/* Stats */}
                        <div id="stats-section" className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8">
                            {[
                                { label: 'Total Pemeriksaan', value: stats?.total ?? 0,    icon: '📋', color: 'from-teal-400 to-teal-500' },
                                { label: 'Status Normal',     value: stats?.healthy ?? 0,  icon: '✅', color: 'from-emerald-400 to-emerald-500' },
                                { label: 'Perlu Perhatian',   value: stats?.at_risk ?? 0,  icon: '⚠️', color: 'from-amber-400 to-amber-500' },
                                { label: 'Stunting',          value: stats?.stunting ?? 0, icon: '🔴', color: 'from-red-400 to-red-500' },
                            ].map((s, i) => (
                                <div key={i} className="stat-pill text-white">
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <span className="text-base">{s.icon}</span>
                                        <span className="text-[11px] font-semibold text-white/70 uppercase tracking-wider">{s.label}</span>
                                    </div>
                                    <div className={`text-3xl font-extrabold tracking-tight ${isVisible ? 'fade-in-up' : 'opacity-0'}`} style={{ animationDelay: `${i * 100}ms` }}>
                                        {s.value}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Wave */}
                    <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
                        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-16 md:h-20">
                            <path d="M0,60 C300,120 600,0 900,60 C1050,90 1150,40 1200,60 L1200,120 L0,120 Z" fill="#F8FAFC" />
                        </svg>
                    </div>
                </section>

                {/* Content */}
                <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-2 relative z-10 space-y-6">

                    {/* Flash */}
                    {flash?.success && (
                        <div className="mb-4 px-5 py-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 fade-in-up shadow-sm">
                            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <span className="text-emerald-800 font-semibold text-sm">{flash.success}</span>
                        </div>
                    )}

                    {/* ===== INSIGHT & CHARTS SECTION ===== */}
                    {latestInsight && (
                        <div className="grid lg:grid-cols-5 gap-5">
                            {/* Kesimpulan Panel */}
                            <div className="lg:col-span-2 medical-card p-6">
                                <div className="flex items-center gap-2 mb-5">
                                    <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-600 flex items-center justify-center">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">Kesimpulan Terakhir</h3>
                                        <p className="text-xs text-gray-500">{formatDate(latestInsight.latest.tanggal_pemeriksaan)}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 mb-5 p-4 rounded-xl bg-slate-50 border border-slate-100">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${latestInsight.status.bg} border ${latestInsight.status.border}`}>
                                        {isHealthy(latestInsight.latest) ? '✅' : '⚠️'}
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium">Status Gizi</p>
                                        <p className={`font-bold text-sm ${latestInsight.status.text}`}>{latestInsight.status.label}</p>
                                    </div>
                                </div>

                                {/* Trend Metrics */}
                                {latestInsight.trend && (
                                    <div className="grid grid-cols-3 gap-2 mb-5">
                                        {[
                                            { label: 'BB', value: latestInsight.trend.weight, unit: 'kg', icon: '⚖️' },
                                            { label: 'TB', value: latestInsight.trend.height, unit: 'cm', icon: '📏' },
                                            { label: 'Hb', value: latestInsight.trend.hb, unit: 'g/dL', icon: '🩸' },
                                        ].map((t, i) => (
                                            <div key={i} className="text-center p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                                                <span className="text-xs text-gray-400">{t.icon} {t.label}</span>
                                                <p className={`text-sm font-bold mt-0.5 ${t.value > 0 ? 'trend-up' : t.value < 0 ? 'trend-down' : 'trend-neutral'}`}>
                                                    {t.value > 0 ? '+' : ''}{t.value.toFixed(1)} {t.unit}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Insights List */}
                                <div className="space-y-2.5">
                                    {latestInsight.insights.slice(0, 4).map((insight, i) => (
                                        <div key={i} className={`flex items-start gap-2.5 p-3 rounded-xl text-xs leading-relaxed ${
                                            insight.type === 'positive' ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' :
                                            insight.type === 'warning' ? 'bg-amber-50 text-amber-800 border border-amber-100' :
                                            'bg-red-50 text-red-800 border border-red-100'
                                        }`}>
                                            <span className="flex-shrink-0 mt-0.5">
                                                {insight.type === 'positive' ? (
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                ) : (
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                    </svg>
                                                )}
                                            </span>
                                            <span className="font-medium">{insight.text}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Charts Panel */}
                            <div className="lg:col-span-3 medical-card p-6">
                                <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-lg">Tren Pemeriksaan</h3>
                                        <p className="text-xs text-gray-500 mt-0.5">Grafik perkembangan dari waktu ke waktu</p>
                                    </div>
                                    <div className="flex gap-1.5 flex-wrap">
                                        {Object.entries(chartConfig).map(([key, cfg]) => (
                                            <button
                                                key={key}
                                                onClick={() => setActiveChart(key)}
                                                className={`chart-tab ${activeChart === key ? 'active' : ''}`}>
                                                <span>{cfg.icon}</span>
                                                <span className="hidden sm:inline">{cfg.label.split(' ')[0]}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {chartData.length > 1 ? (
                                    <div className="fade-in-up">
                                        {renderChart()}
                                    </div>
                                ) : (
                                    <div className="h-48 flex items-center justify-center text-gray-400 text-sm">
                                        <div className="text-center">
                                            <div className="text-2xl mb-2">📊</div>
                                            <p>Minimal 2 data untuk menampilkan grafik</p>
                                        </div>
                                    </div>
                                )}

                                {/* Distribution Bars */}
                                <div className="mt-6 pt-5 border-t border-gray-100">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Distribusi Status</p>
                                    <div className="space-y-2.5">
                                        {statusDistribution.map((item, i) => (
                                            <div key={i} className="flex items-center gap-3">
                                                <span className="text-xs text-gray-500 w-20 font-medium flex-shrink-0">{item.label}</span>
                                                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                                    <div 
                                                        className={`h-full rounded-full ${item.bg} transition-all duration-700`}
                                                        style={{ width: `${item.pct}%` }}
                                                    />
                                                </div>
                                                <span className="text-xs font-bold text-gray-700 w-8 text-right">{item.count}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Filter bar */}
                    <div className="medical-card p-4 md:p-5">
                        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                            <div className="relative flex-1 min-w-0 w-full">
                                <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input type="text" placeholder="Cari nama anak..."
                                    value={search} onChange={handleSearch} className="sh-search" />
                                {search && (
                                    <button onClick={() => { setSearch(''); applyFilters('', statusFilter); }}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-full">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                            <div className="flex gap-2 flex-wrap">
                                {filterButtons.map(f => (
                                    <button key={f.key}
                                        className={`filter-pill ${statusFilter === f.key ? 'active' : ''}`}
                                        onClick={() => handleStatusFilter(f.key)}>
                                        <span className="mr-1">{f.icon}</span>{f.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Records */}
                    {records.data.length === 0 ? (
                        <div className="medical-card p-12 text-center fade-in-up">
                            <div className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center text-3xl mb-5 bg-slate-50 border border-slate-100">
                                {statusFilter !== 'all' || search ? '🔍' : '📋'}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                {statusFilter !== 'all' || search ? 'Tidak ada hasil ditemukan' : 'Belum ada riwayat pemeriksaan'}
                            </h3>
                            <p className="text-gray-500 mb-6 text-sm max-w-md mx-auto">
                                {statusFilter !== 'all' || search
                                    ? 'Coba ubah filter atau kata kunci pencarian untuk menemukan data yang Anda cari.'
                                    : 'Mulai pemeriksaan pertama dan hasilnya akan muncul di sini secara otomatis.'}
                            </p>
                            {statusFilter !== 'all' || search ? (
                                <button onClick={() => { setSearch(''); setStatusFilter('all'); applyFilters('', 'all'); }}
                                    className="px-6 py-2.5 rounded-xl text-white font-semibold text-sm hover:opacity-90 transition-all shadow-lg shadow-teal-500/20"
                                    style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})` }}>
                                    Reset Filter
                                </button>
                            ) : (
                                <Link href={route('stunting.check')}
                                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-white font-semibold text-sm hover:opacity-90 transition-all shadow-lg shadow-teal-500/20"
                                    style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})` }}>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Pemeriksaan Pertama
                                </Link>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {records.data.map((record, index) => {
                                const status = getOverallStatus(record);
                                const isOpen = expandedId === record.id;
                                const healthy = isHealthy(record);

                                return (
                                    <div key={record.id} className="record-card fade-in-up"
                                        style={{ animationDelay: `${index * 50}ms` }}>

                                        {/* Card header */}
                                        <div className="p-5 md:p-6 flex items-start gap-4">
                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 border ${healthy ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-red-50 border-red-100 text-red-500'}`}>
                                                {healthy ? (
                                                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                ) : (
                                                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                    </svg>
                                                )}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2 flex-wrap">
                                                    <div>
                                                        <h3 className="font-bold text-gray-900 text-lg leading-tight">{record.nama_anak}</h3>
                                                        <div className="flex items-center gap-3 mt-1 flex-wrap">
                                                            <span className="text-sm text-gray-500 flex items-center gap-1">
                                                                <span>{record.jenis_kelamin === 'L' ? '👦' : '👧'}</span>
                                                                {ageDisplay(record.umur_bulan)}
                                                            </span>
                                                            <span className="text-gray-300">·</span>
                                                            <span className="text-sm text-gray-500 flex items-center gap-1">
                                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                </svg>
                                                                {formatDate(record.tanggal_pemeriksaan)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold flex-shrink-0 border ${status.bg} ${status.text} ${status.border}`}>
                                                        <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1.5 ${status.dot}`} />
                                                        {status.label}
                                                    </span>
                                                </div>

                                                {/* Mini metrics */}
                                                <div className="flex gap-2 mt-4 flex-wrap">
                                                    {[
                                                        { icon: '⚖️', label: 'BB', value: `${record.berat_badan} kg`, color: 'teal' },
                                                        { icon: '📏', label: 'TB', value: `${record.tinggi_badan} cm`, color: 'blue' },
                                                        { icon: '💪', label: 'LiLA', value: `${record.lingkar_lengan} cm`, color: 'amber' },
                                                        { icon: '🩸', label: 'Hb', value: `${record.hemoglobin} g/dL`, color: 'red' },
                                                    ].map((m, i) => (
                                                        <div key={i} className="flex items-center gap-1.5 text-xs bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 text-gray-600">
                                                            <span className="opacity-70">{m.icon}</span>
                                                            <span className="text-gray-400">{m.label}</span>
                                                            <span className="font-bold text-gray-700">{m.value}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Expandable detail */}
                                        <div className={`detail-panel ${isOpen ? 'open' : ''}`}>
                                            <div className="px-5 md:px-6 pb-6 border-t border-gray-100 pt-5 space-y-5">

                                                {/* Status badges */}
                                                <div>
                                                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">Detail Status</p>
                                                    <div className="flex gap-3 flex-wrap">
                                                        {[
                                                            { name: 'Tinggi/Umur', type: 'stunting', val: record.stunting_status },
                                                            { name: 'BB/TB',       type: 'wasting',  val: record.wasting_status  },
                                                            { name: 'Anemia',      type: 'anemia',   val: record.anemia_status   },
                                                            { name: 'LiLA',        type: 'lila',     val: record.lila_status     },
                                                        ].map((s, i) => (
                                                            <div key={i} className="flex flex-col items-center gap-1.5 bg-slate-50 p-3 rounded-xl border border-slate-100 min-w-[80px]">
                                                                <span className="text-[10px] text-gray-400 font-medium">{s.name}</span>
                                                                <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${getBadgeClass(s.val)}`}>
                                                                    {statusLabels[s.type]?.[s.val] ?? s.val}
                                                                </span>
                                                            </div>
                                                        ))}
                                                        {record.imt && (
                                                            <div className="flex flex-col items-center gap-1.5 bg-slate-50 p-3 rounded-xl border border-slate-100 min-w-[80px]">
                                                                <span className="text-[10px] text-gray-400 font-medium">IMT</span>
                                                                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-100">
                                                                    {record.imt} kg/m²
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Summary */}
                                                {record.summary && (
                                                    <div className="p-4 rounded-xl bg-teal-50/50 border border-teal-100 text-sm">
                                                        <div className="flex items-start gap-3">
                                                            <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                                </svg>
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-teal-800 mb-1">Ringkasan Pemeriksaan</p>
                                                                <p className="text-teal-700/80 leading-relaxed">{record.summary}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Recommendations */}
                                                {Array.isArray(record.recommendations) && record.recommendations.length > 0 && (
                                                    <div>
                                                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">Rekomendasi</p>
                                                        <div className="grid sm:grid-cols-2 gap-2.5">
                                                            {record.recommendations.slice(0, 4).map((rec, i) => (
                                                                <div key={i} className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100 hover:border-teal-200 transition-colors">
                                                                    <span className="text-xl flex-shrink-0">{rec.icon}</span>
                                                                    <div>
                                                                        <span className="text-xs font-bold text-gray-800 block mb-0.5">{rec.title}</span>
                                                                        <span className="text-xs text-gray-500 leading-relaxed">{rec.desc}</span>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Actions */}
                                                <div className="flex gap-2.5 pt-1">
                                                    <button onClick={() => setConfirmDelete(record)}
                                                        className="px-4 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 border border-red-100">
                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                        Hapus
                                                    </button>
                                                    <button onClick={() => window.print()}
                                                        className="px-4 py-2.5 bg-slate-50 text-gray-600 hover:bg-slate-100 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 border border-slate-200">
                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                                        </svg>
                                                        Cetak
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Toggle */}
                                        <button
                                            onClick={() => setExpandedId(isOpen ? null : record.id)}
                                            className="w-full flex items-center justify-center gap-2 py-3.5 text-sm font-semibold border-t border-gray-100 hover:bg-slate-50/50 transition-colors text-teal-700"
                                        >
                                            <span>{isOpen ? 'Sembunyikan Detail' : 'Lihat Detail'}</span>
                                            <svg className="w-4 h-4 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                                style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Pagination */}
                    {records.last_page > 1 && (
                        <div className="flex items-center justify-center gap-2 pt-4">
                            <button onClick={() => records.prev_page_url && router.get(records.prev_page_url)}
                                disabled={!records.prev_page_url} className="page-btn">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>

                            {Array.from({ length: records.last_page }, (_, i) => i + 1)
                                .filter(p => p === 1 || p === records.last_page || Math.abs(p - records.current_page) <= 1)
                                .reduce((acc, p, idx, arr) => {
                                    if (idx > 0 && p - arr[idx - 1] > 1) acc.push('...');
                                    acc.push(p); return acc;
                                }, [])
                                .map((p, i) => p === '...'
                                    ? <span key={`e${i}`} className="text-gray-400 text-sm px-1">…</span>
                                    : <button key={p}
                                        onClick={() => router.get(route('stunting.history', { page: p, search: search || undefined, status: statusFilter !== 'all' ? statusFilter : undefined }))}
                                        className={`page-btn ${records.current_page === p ? 'active' : ''}`}>{p}</button>
                                )
                            }

                            <button onClick={() => records.next_page_url && router.get(records.next_page_url)}
                                disabled={!records.next_page_url} className="page-btn">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    )}

                    {records.total > 0 && (
                        <p className="text-center text-xs text-gray-400 pt-2">
                            Menampilkan {records.from}–{records.to} dari {records.total} pemeriksaan
                        </p>
                    )}
                </div>
            </div>

            {/* Delete confirm modal */}
            {confirmDelete && (
                <div className="overlay-bg fixed inset-0 z-50 flex items-center justify-center p-4"
                    style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)' }}
                    onClick={() => setConfirmDelete(null)}>
                    <div className="confirm-dialog bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full"
                        onClick={e => e.stopPropagation()}>
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 mx-auto rounded-full bg-red-50 flex items-center justify-center mb-4 border border-red-100">
                                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">Hapus Pemeriksaan?</h3>
                            <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                                Data pemeriksaan <strong className="text-gray-800">{confirmDelete.nama_anak}</strong> pada{' '}
                                <strong className="text-gray-800">{formatDate(confirmDelete.tanggal_pemeriksaan)}</strong> akan dihapus secara permanen.
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => setConfirmDelete(null)}
                                className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-colors text-sm">
                                Batal
                            </button>
                            <button onClick={confirmDoDelete} disabled={deletingId !== null}
                                className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors text-sm disabled:opacity-60 shadow-lg shadow-red-500/20">
                                {deletingId ? 'Menghapus...' : 'Ya, Hapus'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}