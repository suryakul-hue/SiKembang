import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';

export default function Dashboard(props) {
    const { auth, stats, recentChecks, featuredRecipes, dailyReminder, upcomingAppointments = [] } = props;
    const user = auth?.user;

    // Palette Modern Medical - Soft, Clean, Professional
    const colors = {
        primary: '#0D9488',      // Teal 600 - Medical, calming
        primaryDark: '#0F766E',  // Teal 700
        secondary: '#059669',    // Emerald 600
        accent: '#D97706',       // Amber 600
        danger: '#DC2626',       // Red 600
        purple: '#7C3AED',       // Violet 600
        surface: '#F8FAFC',      // Slate 50
        elevated: '#FFFFFF',
        text: '#1E293B',         // Slate 800
        muted: '#64748B',        // Slate 500
    };

    // States
    const [greeting, setGreeting] = useState('');
    const [currentTime, setCurrentTime] = useState(new Date());
    const [reminderChecked, setReminderChecked] = useState(dailyReminder?.taken_this_week || false);
    const [isSubmittingReminder, setIsSubmittingReminder] = useState(false);
    const [showReminderNotif, setShowReminderNotif] = useState(dailyReminder ? !dailyReminder.taken_this_week : false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [animatedValues, setAnimatedValues] = useState({});
    const [hoveredCard, setHoveredCard] = useState(null);
    const [isVisible, setIsVisible] = useState(false);
    
    const statsRef = useRef(null);
    const heroRef = useRef(null);

    // Greeting & Time
    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 11) setGreeting('Selamat Pagi');
        else if (hour < 15) setGreeting('Selamat Siang');
        else if (hour < 18) setGreeting('Selamat Sore');
        else setGreeting('Selamat Malam');

        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    // Scroll Progress
    useEffect(() => {
        const handleScroll = () => {
            const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
            const progress = totalScroll > 0 ? (window.scrollY / totalScroll) * 100 : 0;
            setScrollProgress(progress);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Intersection Observer untuk animasi stats - FIX: lebih reliable
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
        );

        if (statsRef.current) observer.observe(statsRef.current);
        return () => observer.disconnect();
    }, []);

    // FIX: Animasi value yang lebih aman dengan useEffect terpisah
    useEffect(() => {
        if (!isVisible) return;
        
        quickStats.forEach((stat, index) => {
            const duration = 2000;
            const start = 0;
            const end = stat.value;
            const startTime = performance.now();

            const updateValue = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                // Ease out cubic
                const easeOut = 1 - Math.pow(1 - progress, 3);
                const current = Math.floor(start + (end - start) * easeOut);
                
                setAnimatedValues(prev => ({ ...prev, [index]: current }));
                if (progress < 1) requestAnimationFrame(updateValue);
            };
            requestAnimationFrame(updateValue);
        });
    }, [isVisible]); // FIX: Dependency hanya isVisible, bukan quickStats

    // Reminder handler
    const handleReminderCheck = useCallback(async (status) => {
        if (isSubmittingReminder) return;
        setIsSubmittingReminder(true);
        
        try {
            await router.post(route('reminder.tablet-darah.update'), {
                taken_today: status 
            }, {
                preserveScroll: true,
                onSuccess: () => {
                    setReminderChecked(true);
                    setTimeout(() => setShowReminderNotif(false), 3000);
                },
                onFinish: () => setIsSubmittingReminder(false)
            });
        } catch (error) {
            console.error(error);
            setIsSubmittingReminder(false);
        }
    }, [isSubmittingReminder]);

    // Safe data
    const safeStats = stats || {
        total_checks: 0,
        healthy: 0,
        stunting: 0,
        wasting: 0,
        total_recipes: 24,
        avg_hemoglobin: 0,
    };

    const safeRecentChecks = recentChecks || [];
    const safeFeaturedRecipes = featuredRecipes || [];

    // Quick Stats dengan icon - FIX: SVG yang lebih clean & medical
    const quickStats = useMemo(() => [
        { 
            label: 'Total Pemeriksaan', 
            value: safeStats.total_checks, 
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
            ),
            trend: '+12%',
            color: 'teal',
            bgColor: 'bg-teal-50',
            textColor: 'text-teal-700',
            borderColor: 'border-teal-100',
            gradientFrom: 'from-teal-500',
            gradientTo: 'to-teal-600',
        },
        { 
            label: 'Anak Sehat', 
            value: safeStats.healthy, 
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
            ),
            trend: '+5%',
            color: 'emerald',
            bgColor: 'bg-emerald-50',
            textColor: 'text-emerald-700',
            borderColor: 'border-emerald-100',
            gradientFrom: 'from-emerald-500',
            gradientTo: 'to-emerald-600',
        },
        { 
            label: 'Perlu Perhatian', 
            value: safeStats.stunting + safeStats.wasting, 
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            ),
            trend: '-8%',
            color: 'amber',
            bgColor: 'bg-amber-50',
            textColor: 'text-amber-700',
            borderColor: 'border-amber-100',
            gradientFrom: 'from-amber-500',
            gradientTo: 'to-amber-600',
        },
        { 
            label: 'Rata-rata HB', 
            value: safeStats.avg_hemoglobin || 0, 
            suffix: 'g/dL',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
            ),
            trend: 'Normal',
            color: 'violet',
            bgColor: 'bg-violet-50',
            textColor: 'text-violet-700',
            borderColor: 'border-violet-100',
            gradientFrom: 'from-violet-500',
            gradientTo: 'to-violet-600',
        },
    ], [safeStats]);

    // Health Tips Carousel
    const healthTips = [
        { icon: '💊', title: 'Minum Tablet TTD', desc: 'Konsumsi tablet tambah darah secara rutin setiap minggu' },
        { icon: '🥬', title: 'Gizi Seimbang', desc: 'Perbanyak sayur hijau dan protein hewani' },
        { icon: '💧', title: 'Hidrasi', desc: 'Minum minimal 8 gelas air putih setiap hari' },
        { icon: '😴', title: 'Istirahat Cukup', desc: 'Tidur 7-8 jam untuk pemulihan optimal' },
    ];

    const [currentTip, setCurrentTip] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTip(prev => (prev + 1) % healthTips.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    // FIX: Helper untuk mouse tracking pada action cards (sebelumnya tidak berfungsi)
    const handleMouseMove = (e, cardRef) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        cardRef.current.style.setProperty('--mouse-x', `${x}px`);
        cardRef.current.style.setProperty('--mouse-y', `${y}px`);
    };

    return (
        <AuthenticatedLayout auth={auth} header={null}>
            <Head title="Dashboard Kesehatan" />

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

                body {
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    background: #F8FAFC;
                    color: #1E293B;
                }

                /* Scroll Progress - lebih subtle */
                .scroll-progress {
                    position: fixed;
                    top: 0;
                    left: 0;
                    height: 3px;
                    background: linear-gradient(90deg, #0D9488 0%, #059669 100%);
                    z-index: 9999;
                    transition: width 0.1s linear;
                }

                /* Modern Hero - Clean Medical Gradient */
                .hero-section {
                    background: linear-gradient(135deg, #0F766E 0%, #0D9488 40%, #134E4A 100%);
                    position: relative;
                    min-height: 70vh;
                    display: flex;
                    align-items: center;
                    overflow: hidden;
                }

                /* Subtle background pattern */
                .hero-pattern {
                    position: absolute;
                    inset: 0;
                    opacity: 0.03;
                    background-image: radial-gradient(circle at 1px 1px, white 1px, transparent 0);
                    background-size: 40px 40px;
                }

                /* Soft floating shapes - lebih subtle */
                .hero-shape {
                    position: absolute;
                    border-radius: 50%;
                    filter: blur(100px);
                    opacity: 0.15;
                }

                .shape-1 {
                    width: 500px;
                    height: 500px;
                    background: white;
                    top: -100px;
                    right: -100px;
                    animation: float 15s infinite ease-in-out;
                }

                .shape-2 {
                    width: 400px;
                    height: 400px;
                    background: #5EEAD4;
                    bottom: -100px;
                    left: -100px;
                    animation: float 18s infinite ease-in-out reverse;
                }

                @keyframes float {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    50% { transform: translate(20px, -20px) scale(1.05); }
                }

                /* Wave Separator - lebih clean */
                .wave-container {
                    position: absolute;
                    bottom: -1px;
                    left: 0;
                    width: 100%;
                    overflow: hidden;
                    line-height: 0;
                }

                .wave-svg {
                    position: relative;
                    display: block;
                    width: calc(100% + 1.3px);
                    height: 100px;
                }

                /* Cards - Clean Medical Style */
                .medical-card {
                    background: white;
                    border: 1px solid #E2E8F0;
                    border-radius: 20px;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.03);
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .medical-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.08);
                    border-color: #CBD5E1;
                }

                /* Stat Cards */
                .stat-card {
                    position: relative;
                    background: white;
                    border-radius: 20px;
                    padding: 24px;
                    border: 1px solid #E2E8F0;
                    transition: all 0.3s ease;
                    overflow: hidden;
                }

                .stat-card::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 3px;
                    background: linear-gradient(90deg, var(--stat-color) 0%, var(--stat-color-light) 100%);
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }

                .stat-card:hover::before {
                    opacity: 1;
                }

                .stat-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 20px 40px -5px rgba(0, 0, 0, 0.08);
                }

                /* Icon Box */
                .icon-box {
                    width: 48px;
                    height: 48px;
                    border-radius: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s ease;
                }

                .stat-card:hover .icon-box {
                    transform: scale(1.05);
                }

                /* Action Cards - FIX: Mouse tracking yang benar */
                .action-card {
                    position: relative;
                    background: white;
                    border-radius: 24px;
                    overflow: hidden;
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    border: 1px solid #E2E8F0;
                }

                .action-card::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(13, 148, 136, 0.04), transparent 40%);
                    opacity: 0;
                    transition: opacity 0.3s;
                    pointer-events: none;
                }

                .action-card:hover::after {
                    opacity: 1;
                }

                .action-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 20px 40px -5px rgba(13, 148, 136, 0.1);
                    border-color: #0D9488;
                }

                /* Status Badges - Pill style */
                .status-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    padding: 6px 14px;
                    border-radius: 9999px;
                    font-size: 12px;
                    font-weight: 600;
                    letter-spacing: 0.01em;
                }

                .status-badge::before {
                    content: '';
                    width: 5px;
                    height: 5px;
                    border-radius: 50%;
                    background: currentColor;
                }

                /* Table Rows */
                .table-row-hover {
                    transition: all 0.2s ease;
                    border-radius: 14px;
                }

                .table-row-hover:hover {
                    background: #F8FAFC;
                    transform: scale(1.005);
                }

                /* Buttons */
                .btn-primary {
                    background: linear-gradient(135deg, #0D9488 0%, #0F766E 100%);
                    color: white;
                    border: none;
                    border-radius: 14px;
                    padding: 14px 28px;
                    font-weight: 600;
                    font-size: 14px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 12px rgba(13, 148, 136, 0.25);
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                }

                .btn-primary:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 20px rgba(13, 148, 136, 0.35);
                }

                .btn-secondary {
                    background: rgba(255, 255, 255, 0.1);
                    color: white;
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    border-radius: 14px;
                    padding: 14px 28px;
                    font-weight: 600;
                    font-size: 14px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    backdrop-filter: blur(10px);
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                }

                .btn-secondary:hover {
                    background: rgba(255, 255, 255, 0.2);
                    border-color: rgba(255, 255, 255, 0.5);
                }

                /* Gradient Text */
                .gradient-text {
                    background: linear-gradient(135deg, #0D9488 0%, #059669 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                /* Floating Animation - lebih subtle */
                @keyframes gentleFloat {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-8px); }
                }

                .float-animation {
                    animation: gentleFloat 8s ease-in-out infinite;
                }

                /* Pulse Ring - lebih soft */
                @keyframes pulseRing {
                    0% { transform: scale(0.9); opacity: 0.4; }
                    100% { transform: scale(1.4); opacity: 0; }
                }

                .pulse-ring::before {
                    content: '';
                    position: absolute;
                    inset: -3px;
                    border-radius: 50%;
                    border: 2px solid currentColor;
                    animation: pulseRing 2.5s ease-out infinite;
                }

                /* Custom Scrollbar */
                ::-webkit-scrollbar {
                    width: 6px;
                    height: 6px;
                }

                ::-webkit-scrollbar-track {
                    background: #F1F5F9;
                }

                ::-webkit-scrollbar-thumb {
                    background: #CBD5E1;
                    border-radius: 3px;
                }

                ::-webkit-scrollbar-thumb:hover {
                    background: #94A3B8;
                }

                /* Responsive */
                @media (max-width: 1024px) {
                    .wave-svg {
                        height: 70px;
                    }
                }

                @media (max-width: 768px) {
                    .hero-section {
                        min-height: auto;
                        padding: 80px 0 100px;
                    }
                    
                    .wave-svg {
                        height: 50px;
                    }
                }
            `}</style>

            {/* Scroll Progress */}
            <div className="scroll-progress" style={{ width: `${scrollProgress}%` }} />

            <div className="min-h-screen bg-slate-50">
                
                {/* FIX: Reminder Widget - Integrated dalam flow, tidak fixed */}
                {showReminderNotif && (
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-6">
                        <div className="max-w-4xl mx-auto mb-6 animate-[slideIn_0.5s_ease]">
                            <div className="medical-card overflow-hidden">
                                <div className={`p-5 ${reminderChecked ? 'bg-emerald-50/50' : 'bg-amber-50/50'} border-b border-gray-100`}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${reminderChecked ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'} pulse-ring relative shadow-lg`}>
                                                {reminderChecked ? (
                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                ) : (
                                                    <span className="text-xl">💊</span>
                                                )}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900 text-lg">
                                                    {reminderChecked ? 'Sudah Minum Tablet!' : 'Tablet TTD Hari Ini'}
                                                </h3>
                                                <p className="text-sm text-gray-600">
                                                    {reminderChecked ? 'Terima kasih sudah rutin minum tablet' : 'Jangan lupa konsumsi tablet besi hari ini'}
                                                </p>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => setShowReminderNotif(false)}
                                            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                
                                {!reminderChecked && (
                                    <div className="p-6">
                                        <p className="text-sm text-gray-600 mb-5 leading-relaxed">
                                            Konsumsi tablet tambah darah (TTD) secara rutin membantu mencegah anemia dan menjaga stamina Anda selama masa pemulihan.
                                        </p>
                                        <div className="flex flex-wrap gap-3">
                                            <button
                                                onClick={() => handleReminderCheck(true)}
                                                disabled={isSubmittingReminder}
                                                className="btn-primary"
                                            >
                                                {isSubmittingReminder ? (
                                                    <>
                                                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                                                        </svg>
                                                        <span>Memproses...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                        <span>Sudah Minum</span>
                                                    </>
                                                )}
                                            </button>
                                            <button
                                                onClick={() => setShowReminderNotif(false)}
                                                className="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition-colors text-sm"
                                            >
                                                Nanti Saja
                                            </button>
                                        </div>
                                    </div>
                                )}
                                
                                {reminderChecked && (
                                    <div className="p-6 bg-emerald-50/30">
                                        <div className="flex items-center gap-4 text-emerald-700">
                                            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="font-bold text-emerald-800">Hebat! 🎉</p>
                                                <p className="text-sm text-emerald-600">Anda sudah minum tablet hari ini. Pertahankan konsistensi untuk kesehatan yang optimal!</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Hero Section - Clean Medical Style */}
                <section ref={heroRef} className="hero-section">
                    <div className="hero-pattern" />
                    <div className="hero-shape shape-1" />
                    <div className="hero-shape shape-2" />

                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            <div className="space-y-8 max-w-2xl">
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white/95 text-sm font-medium border border-white/20 shadow-lg shadow-teal-900/10">
                                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                                    <span>Sistem Monitoring Kesehatan Aktif</span>
                                </div>

                                <div>
                                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight">
                                        {greeting},<br />
                                        <span className="text-teal-200">
                                            {user?.name || 'Pengguna'}
                                        </span>
                                    </h1>
                                    <p className="mt-6 text-lg sm:text-xl text-teal-100/90 leading-relaxed max-w-xl font-light">
                                        Pantau kesehatan keluarga Anda dengan dashboard modern. 
                                        Deteksi dini stunting, rekomendasi gizi, dan tracking hemoglobin dalam satu platform terintegrasi.
                                    </p>
                                </div>

                                <div className="flex flex-wrap gap-4">
                                    <Link
                                        href={route('stunting.check')}
                                        className="btn-primary group"
                                    >
                                        <span>Mulai Pemeriksaan</span>
                                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </Link>
                                    <Link
                                        href={route('hemoglobin.index')}
                                        className="btn-secondary"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                        </svg>
                                        <span>Tracking Tablet</span>
                                    </Link>
                                </div>

                                {/* Quick Info Pills */}
                                <div className="flex flex-wrap gap-3 pt-2">
                                    {[
                                        { icon: '📊', label: 'WHO Standards' },
                                        { icon: '🔒', label: 'Data Aman & Privat' },
                                        { icon: '⚡', label: 'Real-time Monitoring' },
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full text-white/80 text-sm border border-white/10">
                                            <span className="opacity-90">{item.icon}</span>
                                            <span className="font-medium">{item.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Hero Visual - Clean Card */}
                            <div className="hidden lg:block relative">
                                <div className="relative float-animation">
                                    <div className="medical-card p-8 max-w-md ml-auto shadow-2xl shadow-teal-900/10">
                                        <div className="flex items-center justify-between mb-8">
                                            <div>
                                                <p className="text-sm font-medium text-gray-500 mb-1">Status Kesehatan</p>
                                                <p className="text-2xl font-bold text-gray-900">Optimal</p>
                                            </div>
                                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-2xl shadow-lg shadow-emerald-200">
                                                💪
                                            </div>
                                        </div>
                                        
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center text-sm">🩸</div>
                                                    <span className="text-sm font-medium text-gray-600">Hemoglobin</span>
                                                </div>
                                                <span className="font-bold text-emerald-600">12.5 g/dL</span>
                                            </div>
                                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-sm">💊</div>
                                                    <span className="text-sm font-medium text-gray-600">Tablet Minggu Ini</span>
                                                </div>
                                                <span className="font-bold text-blue-600">5/7 Hari</span>
                                            </div>
                                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center text-sm">📅</div>
                                                    <span className="text-sm font-medium text-gray-600">Pemeriksaan Terakhir</span>
                                                </div>
                                                <span className="font-bold text-gray-900">2 hari lalu</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Floating Alert Card */}
                                    <div className="absolute -left-8 top-1/2 medical-card p-4 float-animation shadow-xl" style={{animationDelay: '-4s'}}>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 border border-amber-100">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Peringatan</p>
                                                <p className="text-sm font-bold text-gray-900">Jadwal Cek HB</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Wave Separator */}
                    <div className="wave-container">
                        <svg className="wave-svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                            <path 
                                d="M0,60 C300,120 600,0 900,60 C1050,90 1150,40 1200,60 L1200,120 L0,120 Z" 
                                fill="#F8FAFC"
                            />
                            <path 
                                d="M0,80 C200,140 500,20 800,80 C1000,110 1100,60 1200,80 L1200,120 L0,120 Z" 
                                fill="#F8FAFC"
                                opacity="0.5"
                            />
                        </svg>
                    </div>
                </section>

                {/* Stats Section - FIX: Layout dan animasi lebih baik */}
                <section ref={statsRef} className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10 mb-16">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                        {quickStats.map((stat, index) => (
                            <div 
                                key={index}
                                className="stat-card"
                                style={{
                                    '--stat-color': stat.color === 'teal' ? '#0D9488' : 
                                                   stat.color === 'emerald' ? '#059669' : 
                                                   stat.color === 'amber' ? '#D97706' : '#7C3AED',
                                    '--stat-color-light': stat.color === 'teal' ? '#5EEAD4' : 
                                                          stat.color === 'emerald' ? '#6EE7B7' : 
                                                          stat.color === 'amber' ? '#FCD34D' : '#C4B5FD'
                                }}
                                onMouseEnter={() => setHoveredCard(index)}
                                onMouseLeave={() => setHoveredCard(null)}
                            >
                                <div className="flex items-start justify-between mb-5">
                                    <div className={`icon-box text-white shadow-lg ${stat.bgColor.replace('bg-', 'text-').replace('50', '600')} bg-gradient-to-br ${stat.gradientFrom} ${stat.gradientTo}`}>
                                        {stat.icon}
                                    </div>
                                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${stat.bgColor} ${stat.textColor} border ${stat.borderColor}`}>
                                        {stat.trend}
                                    </span>
                                </div>
                                
                                <div>
                                    <h3 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                                        {isVisible ? (animatedValues[index] !== undefined ? animatedValues[index] : 0) : 0}
                                        <span className="text-lg font-semibold text-gray-400 ml-1">{stat.suffix || ''}</span>
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-1.5 font-medium">{stat.label}</p>
                                </div>

                                {/* Mini Chart - FIX: Lebih clean */}
                                <div className="mt-5 flex items-end gap-[3px] h-10">
                                    {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                                        <div 
                                            key={i}
                                            className="flex-1 rounded-full transition-all duration-500"
                                            style={{ 
                                                height: `${h}%`,
                                                backgroundColor: hoveredCard === index ? 
                                                    (stat.color === 'teal' ? '#0D9488' : 
                                                     stat.color === 'emerald' ? '#059669' : 
                                                     stat.color === 'amber' ? '#D97706' : '#7C3AED') 
                                                    : '#E2E8F0',
                                                opacity: hoveredCard === index ? 0.6 : 0.25
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Main Content Grid */}
                <section className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pb-20">
                    
                    {/* Action Cards - FIX: Mouse tracking dengan ref */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <Link
                            href={route('stunting.check')}
                            className="action-card group p-8 block"
                            onMouseMove={(e) => handleMouseMove(e, { current: e.currentTarget })}
                        >
                            <div className="flex items-start gap-6 relative z-10">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-3xl shadow-lg shadow-teal-200 group-hover:scale-110 transition-transform duration-300 text-white">
                                    📏
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-teal-700 transition-colors">
                                        Deteksi Stunting
                                    </h3>
                                    <p className="text-gray-600 mb-5 leading-relaxed text-sm">
                                        Lakukan pemeriksaan komprehensif dengan pengukuran 
                                        <span className="font-semibold text-teal-600"> BB, TB, LiLA, dan IMT </span>
                                        untuk deteksi dini stunting pada anak.
                                    </p>
                                    <div className="flex items-center gap-2 text-teal-600 font-semibold group-hover:gap-4 transition-all text-sm">
                                        <span>Mulai Pemeriksaan</span>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </Link>

                        <Link
                            href={route('recipes.index')}
                            className="action-card group p-8 block"
                            onMouseMove={(e) => handleMouseMove(e, { current: e.currentTarget })}
                        >
                            <div className="flex items-start gap-6 relative z-10">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-3xl shadow-lg shadow-emerald-200 group-hover:scale-110 transition-transform duration-300 text-white">
                                    🥗
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-emerald-700 transition-colors">
                                        Resep Bergizi
                                    </h3>
                                    <p className="text-gray-600 mb-5 leading-relaxed text-sm">
                                        Temukan <span className="font-semibold text-emerald-600">resep makanan bergizi</span> yang 
                                        disusun oleh ahli gizi untuk setiap tahap pertumbuhan anak Anda.
                                    </p>
                                    <div className="flex items-center gap-2 text-emerald-600 font-semibold group-hover:gap-4 transition-all text-sm">
                                        <span>Jelajahi Resep</span>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* Health Tips & Recent Activity */}
                    <div className="grid lg:grid-cols-3 gap-6">
                        
                        {/* Health Tips Carousel - FIX: Lebih clean */}
                        <div className="lg:col-span-1">
                            <div className="medical-card p-6 h-full">
                                <h3 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                                    <span className="text-xl">💡</span> 
                                    <span>Tips Kesehatan</span>
                                </h3>
                                
                                <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-2xl p-5 border border-teal-100 mb-5 transition-all duration-500">
                                    <div className="flex items-start gap-4">
                                        <span className="text-3xl filter drop-shadow-sm">{healthTips[currentTip].icon}</span>
                                        <div>
                                            <h4 className="font-bold text-gray-900 mb-1.5">{healthTips[currentTip].title}</h4>
                                            <p className="text-sm text-gray-600 leading-relaxed">{healthTips[currentTip].desc}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-center gap-2">
                                    {healthTips.map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setCurrentTip(i)}
                                            className={`h-2 rounded-full transition-all duration-300 ${i === currentTip ? 'w-8 bg-teal-500' : 'w-2 bg-gray-300 hover:bg-gray-400'}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Recent Checks - FIX: Table lebih modern */}
                        <div className="lg:col-span-2">
                            <div className="medical-card overflow-hidden">
                                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900">Pemeriksaan Terbaru</h3>
                                        <p className="text-sm text-gray-500 mt-0.5">Riwayat 30 hari terakhir</p>
                                    </div>
                                    <Link 
                                        href={route('stunting.history')}
                                        className="text-sm font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1 transition-colors"
                                    >
                                        Lihat Semua 
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </Link>
                                </div>
                                
                                <div className="p-4 space-y-2">
                                    {safeRecentChecks.length > 0 ? (
                                        safeRecentChecks.slice(0, 4).map((check, index) => (
                                            <div 
                                                key={index}
                                                className="table-row-hover flex items-center justify-between p-4 cursor-pointer border border-transparent hover:border-gray-100"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg shadow-sm ${
                                                        check.status === 'normal' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                                                        check.status === 'stunting' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                                                        'bg-blue-50 text-blue-600 border border-blue-100'
                                                    }`}>
                                                        {check.status === 'normal' ? (
                                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        ) : check.status === 'stunting' ? (
                                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                            </svg>
                                                        ) : (
                                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                            </svg>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-900">{check.child_name}</p>
                                                        <p className="text-sm text-gray-500">{check.age_months} bulan • {check.check_date}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <span className={`status-badge ${
                                                        check.status === 'normal' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                                                        check.status === 'stunting' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                                                        'bg-blue-50 text-blue-700 border border-blue-100'
                                                    }`}>
                                                        {check.status === 'normal' ? 'Normal' : check.status === 'stunting' ? 'Stunting' : 'Gizi Kurang'}
                                                    </span>
                                                    <p className="text-xs text-gray-400 mt-1.5 font-medium">IMT: {check.imt}</p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-12">
                                            <div className="w-16 h-16 mx-auto bg-teal-50 rounded-2xl flex items-center justify-center text-2xl mb-4 border border-teal-100">
                                                <svg className="w-8 h-8 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                </svg>
                                            </div>
                                            <p className="text-gray-600 mb-5 font-medium">Belum ada pemeriksaan</p>
                                            <Link 
                                                href={route('stunting.check')}
                                                className="btn-primary text-sm"
                                            >
                                                Pemeriksaan Pertama
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Featured Recipes & Quick Actions */}
                    <div className="grid lg:grid-cols-3 gap-6">
                        
                        {/* Quick Actions */}
                        <div className="medical-card p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-5">Akses Cepat</h3>
                            <div className="space-y-3">
                                <Link 
                                    href={route('hemoglobin.index')}
                                    className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-red-50 to-rose-50 border border-red-100 hover:shadow-md transition-all group hover:border-red-200"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-white text-red-500 flex items-center justify-center text-xl shadow-sm group-hover:scale-110 transition-transform border border-red-100">
                                        💊
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-gray-900 text-sm">Tracking Tablet TTD</p>
                                        <p className="text-xs text-gray-500 mt-0.5">Catat konsumsi rutin</p>
                                    </div>
                                    <svg className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </Link>

                                <Link 
                                    href={route('hemoglobin.index')}
                                    className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-100 hover:shadow-md transition-all group hover:border-violet-200"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-white text-violet-500 flex items-center justify-center text-xl shadow-sm group-hover:scale-110 transition-transform border border-violet-100">
                                        🩸
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-gray-900 text-sm">Cek Hemoglobin</p>
                                        <p className="text-xs text-gray-500 mt-0.5">Input hasil lab terbaru</p>
                                    </div>
                                    <svg className="w-5 h-5 text-gray-400 group-hover:text-violet-500 transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </Link>

                                <Link 
                                    href={route('education.index')}
                                    className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 hover:shadow-md transition-all group hover:border-amber-200"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-white text-amber-500 flex items-center justify-center text-xl shadow-sm group-hover:scale-110 transition-transform border border-amber-100">
                                        📚
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-gray-900 text-sm">Edukasi Gizi</p>
                                        <p className="text-xs text-gray-500 mt-0.5">Pelajari tentang stunting</p>
                                    </div>
                                    <svg className="w-5 h-5 text-gray-400 group-hover:text-amber-500 transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </Link>
                            </div>
                        </div>

                        {/* Featured Recipes */}
                        <div className="lg:col-span-2 medical-card overflow-hidden">
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                        <span>🍽️</span> Menu Rekomendasi
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-0.5">Pilihan terbaik untuk hari ini</p>
                                </div>
                                <Link 
                                    href={route('recipes.index')}
                                    className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition-colors"
                                >
                                    Lihat Semua
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </Link>
                            </div>
                            
                            <div className="p-6 grid sm:grid-cols-2 gap-4">
                                {safeFeaturedRecipes.length > 0 ? (
                                    safeFeaturedRecipes.slice(0, 2).map((recipe, index) => (
                                        <Link 
                                            key={index}
                                            href={route('recipes.show', recipe.id)}
                                            className="group block p-4 rounded-2xl bg-slate-50 hover:bg-emerald-50/50 border border-slate-100 hover:border-emerald-200 transition-all"
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className="w-20 h-20 rounded-xl bg-white shadow-sm flex items-center justify-center text-3xl border border-slate-100 group-hover:border-emerald-200 transition-colors">
                                                    {recipe.image ? '🍽️' : '🥗'}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-bold text-gray-900 group-hover:text-emerald-700 transition-colors line-clamp-1 text-sm">
                                                        {recipe.title}
                                                    </h4>
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        <span className="inline-flex items-center gap-1">
                                                            <span>👶</span> {recipe.age_group}
                                                        </span>
                                                        <span className="mx-2 text-gray-300">•</span>
                                                        <span className="inline-flex items-center gap-1">
                                                            <span>⏱️</span> {recipe.cooking_time} menit
                                                        </span>
                                                    </p>
                                                    <div className="flex flex-wrap gap-1.5 mt-3">
                                                        {recipe.nutrition_tags?.slice(0, 2).map((tag, i) => (
                                                            <span 
                                                                key={i} 
                                                                className="text-[11px] px-2.5 py-1 bg-white rounded-lg border border-emerald-200 text-emerald-700 font-medium shadow-sm"
                                                            >
                                                                {tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))
                                ) : (
                                    <>
                                        {[
                                            { title: 'Bubur Ayam Wortel', age: '6-8 bulan', time: '20', tags: ['Protein', 'Vit A'], icon: '🥣' },
                                            { title: 'Tim Ikan Salmon', age: '9-11 bulan', time: '15', tags: ['Omega-3', 'Kalsium'], icon: '🐟' },
                                        ].map((recipe, idx) => (
                                            <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                                <div className="flex items-start gap-4">
                                                    <div className="w-20 h-20 rounded-xl bg-white shadow-sm flex items-center justify-center text-3xl border border-slate-100">
                                                        {recipe.icon}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-gray-900 text-sm">{recipe.title}</h4>
                                                        <p className="text-sm text-gray-500 mt-1">
                                                            👶 {recipe.age} • ⏱️ {recipe.time} menit
                                                        </p>
                                                        <div className="flex gap-1.5 mt-3">
                                                            {recipe.tags.map((tag, i) => (
                                                                <span key={i} className="text-[11px] px-2.5 py-1 bg-white rounded-lg border border-slate-200 font-medium text-gray-600">
                                                                    {tag}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Info Cards - FIX: Gradient lebih soft & medical */}
                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            { 
                                icon: '📊', 
                                title: 'Standar WHO', 
                                desc: 'Pemeriksaan menggunakan standar pertumbuhan WHO untuk hasil akurat dan terpercaya.',
                                gradient: 'bg-gradient-to-br from-teal-500 to-teal-700'
                            },
                            { 
                                icon: '🛡️', 
                                title: 'Deteksi Dini', 
                                desc: 'Deteksi stunting sejak dini untuk intervensi lebih awal dan pertumbuhan optimal anak.',
                                gradient: 'bg-gradient-to-br from-emerald-500 to-emerald-700'
                            },
                            { 
                                icon: '🥗', 
                                title: 'Gizi Seimbang', 
                                desc: 'Resep bergizi yang disusun oleh ahli gizi untuk memenuhi kebutuhan anak.',
                                gradient: 'bg-gradient-to-br from-sky-500 to-blue-600'
                            }
                        ].map((card, idx) => (
                            <div 
                                key={idx}
                                className={`relative overflow-hidden rounded-2xl p-6 text-white ${card.gradient} shadow-lg`}
                            >
                                <div className="relative z-10">
                                    <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center text-2xl mb-4 border border-white/20">
                                        {card.icon}
                                    </div>
                                    <h4 className="text-lg font-bold mb-2">{card.title}</h4>
                                    <p className="text-white/85 text-sm leading-relaxed">{card.desc}</p>
                                </div>
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl" />
                                <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full -ml-10 -mb-10 blur-xl" />
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </AuthenticatedLayout>
    );
}