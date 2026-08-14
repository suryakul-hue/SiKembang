import { Link, Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function Welcome({ auth }) {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeFeature, setActiveFeature] = useState(0);
    const [animatedStats, setAnimatedStats] = useState(false);

    // Palet Warna Baru
    const colors = {
        primary: '#3FA7D6',      // Biru Cerah
        light: '#7EC8E3',        // Biru Muda
        deep: '#2F669F',         // Biru Gelap
        forest: '#6FBF4A',       // Hijau Daun
        lime: '#A8D86D',         // Hijau Muda
        orange: '#F29C38',       // Oranye
        peach: '#E6A57E',        // Peach
    };

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
            if (window.scrollY > 300) setAnimatedStats(true);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Data fitur kesehatan dengan warna baru
    const features = [
        {
            title: "Deteksi Stunting Dini",
            desc: "Pantau pertumbuhan anak dengan pengukuran BB, TB, LiLA, dan Hb berdasarkan standar WHO.",
            icon: "📏",
            gradient: `from-[${colors.primary}] to-[${colors.deep}]`,
            bgColor: colors.primary,
            shadowColor: 'shadow-blue-500/30'
        },
        {
            title: "Resep Gizi Bergizi",
            desc: "Akses resep makanan sehat yang disusun khusus untuk setiap tahap pertumbuhan anak.",
            icon: "🥗",
            gradient: `from-[${colors.forest}] to-[${colors.lime}]`,
            bgColor: colors.forest,
            shadowColor: 'shadow-green-500/30'
        },
        {
            title: "Monitoring Berkala",
            desc: "Catat dan pantau perkembangan gizi anak secara berkala dengan grafik pertumbuhan.",
            icon: "📊",
            gradient: `from-[${colors.orange}] to-[${colors.peach}]`,
            bgColor: colors.orange,
            shadowColor: 'shadow-orange-500/30'
        },
        {
            title: "Konsultasi Gizi",
            desc: "Dapatkan rekomendasi dan saran gizi dari ahli untuk mencegah stunting.",
            icon: "👨‍⚕️",
            gradient: `from-[${colors.deep}] to-[${colors.primary}]`,
            bgColor: colors.deep,
            shadowColor: 'shadow-blue-600/30'
        }
    ];

    // Statistik kesehatan
    const stats = [
        { number: "10K+", label: "Anak Terdata", suffix: "", color: colors.primary },
        { number: "85%", label: "Berhasil Cegah", suffix: "", color: colors.forest },
        { number: "500+", label: "Resep Gizi", suffix: "", color: colors.orange },
        { number: "50+", label: "Tenaga Ahli", suffix: "", color: colors.deep }
    ];

    // Tahapan deteksi dengan ikon dan warna
    const steps = [
        { 
            step: "1", 
            title: "Input Data", 
            desc: "Masukkan data anak dan hasil pengukuran antropometri",
            icon: "📝",
            color: colors.primary
        },
        { 
            step: "2", 
            title: "Analisis Otomatis", 
            desc: "Sistem menganalisis status gizi berdasarkan standar WHO",
            icon: "🔍",
            color: colors.forest
        },
        { 
            step: "3", 
            title: "Hasil & Rekomendasi", 
            desc: "Dapatkan hasil deteksi dan saran intervensi gizi",
            icon: "📋",
            color: colors.orange
        },
        { 
            step: "4", 
            title: "Tindak Lanjut", 
            desc: "Akses resep makanan dan jadwal pemeriksaan berikutnya",
            icon: "🎯",
            color: colors.deep
        }
    ];

    // Testimonials
    const testimonials = [
        {
            name: "Ibu Siti",
            role: "Ibu dari Budi (3 tahun)",
            content: "SiKembang sangat membantu saya memantau pertumbuhan Budi. Hasil deteksi dini membuat saya bisa segera mengubah pola makan.",
            avatar: "👩",
            rating: 5,
            color: colors.peach
        },
        {
            name: "Dr. Ahmad",
            role: "Dokter Spesialis Anak",
            content: "Platform yang sangat berguna untuk edukasi orang tua tentang pentingnya gizi seimbang dalam mencegah stunting.",
            avatar: "👨‍⚕️",
            rating: 5,
            color: colors.light
        },
        {
            name: "Ibu Rina",
            role: "Ibu dari Ani (2 tahun)",
            content: "Resep makanan di SiKembang praktis dan anak saya suka. Sekarang Ani tumbuh sehat dan aktif!",
            avatar: "👩‍🦱",
            rating: 5,
            color: colors.lime
        }
    ];

    // Partner/Client logos (placeholder)
    const partners = [
        { name: "WHO", icon: "🏥" },
        { name: "Kemenkes", icon: "🏛️" },
        { name: "Unicef", icon: "🌍" },
        { name: "IDAI", icon: "👶" }
    ];

    return (
        <>
            <Head title="Selamat Datang di SiKembang - Peduli Gizi Anak Indonesia" />
            
            {/* Navigation */}
            <nav className={`fixed w-full z-50 transition-all duration-500 ${
                scrolled 
                    ? 'bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-100' 
                    : 'bg-transparent'
            }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        {/* Logo SiKembang */}
                        <div className="flex items-center gap-3 group cursor-pointer">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-[#3FA7D6] to-[#6FBF4A] rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                                <img 
                                    src="https://national-ivory-qkxzs5sohx.edgeone.app/Untitled%20design%20(1).png" 
                                    alt="Logo SiKembang" 
                                    className="relative h-12 w-12 object-contain transform group-hover:scale-110 transition-transform duration-300"
                                />
                            </div>
                            <div className="flex flex-col">
                                <span className={`font-bold text-xl leading-tight transition-colors ${
                                    scrolled ? 'text-gray-900' : 'text-gray-900'
                                }`}>
                                    SiKembang
                                </span>
                                <span 
                                    className="text-xs font-medium"
                                    style={{ color: colors.forest }}
                                >
                                    Pemantauan Tumbuh Kembang Anak
                                </span>
                            </div>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-8">
                            {['Fitur', 'Cara Kerja', 'Testimoni', 'Tentang'].map((item, idx) => (
                                <a 
                                    key={idx}
                                    href={`#${['fitur', 'cara-kerja', 'testimoni', 'tentang'][idx]}`} 
                                    className="relative text-gray-600 hover:text-[#3FA7D6] font-medium transition-colors group"
                                >
                                    {item}
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#3FA7D6] to-[#6FBF4A] group-hover:w-full transition-all duration-300"></span>
                                </a>
                            ))}
                            
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="px-6 py-2.5 bg-gradient-to-r from-[#3FA7D6] to-[#2F669F] text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-500/30 hover:scale-105 transition-all duration-300"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <div className="flex items-center gap-4">
                                    <Link
                                        href={route('login')}
                                        className="text-gray-600 hover:text-[#3FA7D6] font-semibold transition-colors"
                                    >
                                        Masuk
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="px-6 py-2.5 bg-gradient-to-r from-[#6FBF4A] to-[#A8D86D] text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-green-500/30 hover:scale-105 transition-all duration-300"
                                    >
                                        Daftar Gratis
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button 
                            className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {mobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div className={`md:hidden transition-all duration-300 overflow-hidden ${
                    mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}>
                    <div className="bg-white border-t border-gray-100 shadow-xl px-4 py-4 space-y-3">
                        {['Fitur', 'Cara Kerja', 'Testimoni', 'Tentang'].map((item, idx) => (
                            <a 
                                key={idx}
                                href={`#${['fitur', 'cara-kerja', 'testimoni', 'tentang'][idx]}`}
                                className="block px-3 py-2 text-gray-600 hover:text-[#3FA7D6] hover:bg-blue-50 rounded-lg font-medium transition-colors"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {item}
                            </a>
                        ))}
                        <hr className="border-gray-100" />
                        {auth.user ? (
                            <Link href={route('dashboard')} className="block px-3 py-2 text-[#3FA7D6] font-semibold hover:bg-blue-50 rounded-lg">
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link href={route('login')} className="block px-3 py-2 text-gray-600 font-semibold hover:bg-gray-50 rounded-lg">
                                    Masuk
                                </Link>
                                <Link href={route('register')} className="block px-3 py-2 text-[#6FBF4A] font-semibold hover:bg-green-50 rounded-lg">
                                    Daftar Gratis
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#E0F4FF] via-[#F0F9E8] to-[#FFF4E6]">
                {/* Animated Background Decorations */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div 
                        className="absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl animate-pulse"
                        style={{ backgroundColor: `${colors.primary}20` }}
                    ></div>
                    <div 
                        className="absolute bottom-20 right-10 w-96 h-96 rounded-full blur-3xl animate-pulse delay-1000"
                        style={{ backgroundColor: `${colors.forest}20` }}
                    ></div>
                    <div 
                        className="absolute top-1/3 right-1/4 w-64 h-64 rounded-full blur-3xl animate-pulse delay-700"
                        style={{ backgroundColor: `${colors.orange}15` }}
                    ></div>
                    
                    {/* Floating Elements */}
                    <div className="absolute top-32 right-20 text-6xl animate-float opacity-30">🌱</div>
                    <div className="absolute bottom-32 left-20 text-5xl animate-float delay-1000 opacity-30">👶</div>
                    <div className="absolute top-1/2 left-10 text-4xl animate-float delay-500 opacity-30">💚</div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left Content */}
                        <div className="text-center lg:text-left animate-fade-in-up">
                            <div 
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full shadow-sm border mb-6 backdrop-blur-sm"
                                style={{ 
                                    backgroundColor: `${colors.primary}15`,
                                    borderColor: `${colors.primary}30`
                                }}
                            >
                                <span 
                                    className="flex h-2 w-2 rounded-full animate-pulse"
                                    style={{ backgroundColor: colors.forest }}
                                ></span>
                                <span 
                                    className="text-sm font-semibold"
                                    style={{ color: colors.deep }}
                                >
                                    #GenerasiEmasIndonesia
                                </span>
                            </div>

                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
                                Cegah Stunting Sejak Dini dengan{' '}
                                <span 
                                    className="bg-clip-text text-transparent bg-gradient-to-r from-[#3FA7D6] to-[#6FBF4A]"
                                >
                                    SiKembang
                                </span>
                            </h1>
                            
                            <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                                Platform kesehatan digital untuk memantau pertumbuhan dan gizi anak. 
                                Deteksi dini, resep bergizi, dan monitoring berkala dalam satu aplikasi.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                {!auth.user ? (
                                    <Link
                                        href={route('register')}
                                        className="group px-8 py-4 bg-gradient-to-r from-[#3FA7D6] to-[#2F669F] text-white font-bold rounded-xl shadow-lg hover:shadow-2xl hover:shadow-blue-500/30 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                                    >
                                        Mulai Sekarang
                                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </Link>
                                ) : (
                                    <Link
                                        href={route('dashboard')}
                                        className="group px-8 py-4 bg-gradient-to-r from-[#3FA7D6] to-[#2F669F] text-white font-bold rounded-xl shadow-lg hover:shadow-2xl hover:shadow-blue-500/30 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                                    >
                                        Ke Dashboard
                                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </Link>
                                )}
                                <a 
                                    href="#cara-kerja" 
                                    className="px-8 py-4 bg-white text-gray-700 font-bold rounded-xl shadow-md border border-gray-200 hover:border-[#3FA7D6] hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 group"
                                >
                                    <svg className="w-5 h-5 group-hover:text-[#3FA7D6] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Lihat Cara Kerja
                                </a>
                            </div>

                            {/* Trust Badges */}
                            <div className="mt-8 flex items-center gap-6 justify-center lg:justify-start text-sm text-gray-500">
                                {[
                                    { icon: "✓", text: "Gratis", color: colors.forest },
                                    { icon: "✓", text: "Standar WHO", color: colors.primary },
                                    { icon: "✓", text: "Resep Ahli Gizi", color: colors.orange }
                                ].map((badge, idx) => (
                                    <div key={idx} className="flex items-center gap-2">
                                        <span 
                                            className="text-xl font-bold"
                                            style={{ color: badge.color }}
                                        >{badge.icon}</span>
                                        <span>{badge.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right Content - Hero Image/Illustration */}
                        <div className="relative animate-fade-in-up delay-200 hidden lg:block">
                            <div className="relative">
                                {/* Main Circle dengan gradient baru */}
                                <div 
                                    className="w-96 h-96 rounded-full mx-auto flex items-center justify-center shadow-2xl relative overflow-hidden"
                                    style={{ 
                                        background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.forest} 100%)`
                                    }}
                                >
                                    <div className="absolute inset-0 bg-white/20 backdrop-blur-sm"></div>
                                    <div className="relative z-10 text-center">
                                        <span className="text-8xl animate-bounce-slow">👶</span>
                                        <p className="text-white font-bold text-xl mt-4">Sehat & Ceria</p>
                                    </div>
                                </div>
                                
                                {/* Floating Cards dengan warna baru */}
                                <div 
                                    className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl p-4 animate-float"
                                    style={{ borderTop: `4px solid ${colors.forest}` }}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-3xl">📈</span>
                                        <div>
                                            <p className="text-xs text-gray-500">Pertumbuhan</p>
                                            <p 
                                                className="font-bold"
                                                style={{ color: colors.forest }}
                                            >Normal</p>
                                        </div>
                                    </div>
                                </div>

                                <div 
                                    className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl p-4 animate-float delay-300"
                                    style={{ borderTop: `4px solid ${colors.primary}` }}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-3xl">🥗</span>
                                        <div>
                                            <p className="text-xs text-gray-500">Gizi</p>
                                            <p 
                                                className="font-bold"
                                                style={{ color: colors.primary }}
                                            >Tercukupi</p>
                                        </div>
                                    </div>
                                </div>

                                <div 
                                    className="absolute top-1/2 -right-12 bg-white rounded-2xl shadow-xl p-4 animate-float delay-500"
                                    style={{ borderTop: `4px solid ${colors.orange}` }}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-3xl">💪</span>
                                        <div>
                                            <p className="text-xs text-gray-500">Aktivitas</p>
                                            <p 
                                                className="font-bold"
                                                style={{ color: colors.orange }}
                                            >Optimal</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                    <svg 
                        className="w-6 h-6"
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                        style={{ color: colors.primary }}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                </div>
            </div>

            {/* Partners Section */}
            <section className="py-12 bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <p className="text-center text-gray-400 text-sm font-medium mb-8 uppercase tracking-wider">Dipercaya oleh</p>
                    <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60">
                        {partners.map((partner, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-2xl font-bold text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
                                <span>{partner.icon}</span>
                                <span>{partner.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Section dengan warna gradient baru */}
            <section 
                id="stats" 
                className="py-20 relative overflow-hidden"
                style={{ 
                    background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.deep} 100%)`
                }}
            >
                <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {stats.map((stat, index) => (
                            <div 
                                key={index} 
                                className={`text-white transform transition-all duration-700 ${
                                    animatedStats ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                                }`}
                                style={{ transitionDelay: `${index * 100}ms` }}
                            >
                                <div className="text-4xl md:text-5xl font-bold mb-2">{stat.number}</div>
                                <div className="text-blue-100 font-medium">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section dengan kartu yang lebih menarik */}
            <section id="fitur" className="py-24 bg-white relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
                    <div className="absolute top-20 right-20 w-64 h-64 rounded-full blur-3xl" style={{ backgroundColor: `${colors.primary}10` }}></div>
                    <div className="absolute bottom-20 left-20 w-64 h-64 rounded-full blur-3xl" style={{ backgroundColor: `${colors.forest}10` }}></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-16">
                        <span 
                            className="font-semibold text-sm uppercase tracking-wider"
                            style={{ color: colors.primary }}
                        >
                            Fitur Unggulan
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
                            Apa yang Bisa Anda Lakukan di <span style={{ color: colors.primary }}>SiKembang</span>?
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Platform lengkap untuk memantau kesehatan dan gizi anak Anda
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <div 
                                key={index}
                                onMouseEnter={() => setActiveFeature(index)}
                                className={`group relative p-8 rounded-3xl transition-all duration-500 cursor-pointer overflow-hidden ${
                                    activeFeature === index 
                                        ? 'text-white shadow-2xl scale-105' 
                                        : 'bg-white border border-gray-100 hover:border-gray-200 hover:shadow-xl'
                                }`}
                                style={{
                                    background: activeFeature === index 
                                        ? `linear-gradient(135deg, ${feature.bgColor} 0%, ${index % 2 === 0 ? colors.deep : colors.lime} 100%)`
                                        : 'white'
                                }}
                            >
                                {/* Icon Container */}
                                <div 
                                    className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-6 transition-all duration-300 ${
                                        activeFeature === index 
                                            ? 'bg-white/20 text-white' 
                                            : 'bg-gray-50 text-gray-700 group-hover:scale-110'
                                    }`}
                                >
                                    {feature.icon}
                                </div>
                                
                                <h3 className={`text-xl font-bold mb-3 ${
                                    activeFeature === index ? 'text-white' : 'text-gray-900'
                                }`}>
                                    {feature.title}
                                </h3>
                                <p className={`leading-relaxed ${
                                    activeFeature === index ? 'text-white/90' : 'text-gray-600'
                                }`}>
                                    {feature.desc}
                                </p>

                                {/* Hover Arrow */}
                                <div className={`absolute bottom-6 right-6 transition-all duration-300 ${
                                    activeFeature === index ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                                }`}>
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works Section dengan desain timeline yang lebih baik */}
            <section id="cara-kerja" className="py-24 relative overflow-hidden" style={{ backgroundColor: '#F8FAFC' }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span 
                            className="font-semibold text-sm uppercase tracking-wider"
                            style={{ color: colors.forest }}
                        >
                            Proses Sederhana
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
                            Cara Kerja <span style={{ color: colors.forest }}>SiKembang</span>
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Empat langkah mudah untuk memantau kesehatan anak Anda
                        </p>
                    </div>

                    <div className="grid md:grid-cols-4 gap-8 relative">
                        {/* Connecting Line - Desktop */}
                        <div className="hidden md:block absolute top-24 left-0 w-full h-1 bg-gradient-to-r from-[#3FA7D6] via-[#6FBF4A] to-[#F29C38] rounded-full opacity-30"></div>

                        {steps.map((item, index) => (
                            <div key={index} className="relative group">
                                <div className="relative z-10 text-center">
                                    {/* Step Number dengan Icon */}
                                    <div 
                                        className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center text-3xl shadow-lg mb-6 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300"
                                        style={{ 
                                            background: `linear-gradient(135deg, ${item.color} 0%, ${index === 0 ? colors.deep : index === 1 ? colors.lime : index === 2 ? colors.peach : colors.primary} 100%)`,
                                            color: 'white'
                                        }}
                                    >
                                        {item.icon}
                                    </div>
                                    
                                    <div 
                                        className="inline-flex items-center justify-center w-8 h-8 rounded-full text-white text-sm font-bold mb-3"
                                        style={{ backgroundColor: item.color }}
                                    >
                                        {item.step}
                                    </div>
                                    
                                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#3FA7D6] transition-colors">
                                        {item.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm leading-relaxed px-4">
                                        {item.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section dengan desain kartu yang lebih modern */}
            <section id="testimoni" className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span 
                            className="font-semibold text-sm uppercase tracking-wider"
                            style={{ color: colors.orange }}
                        >
                            Testimoni
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
                            Apa Kata Mereka Tentang <span style={{ color: colors.orange }}>SiKembang</span>?
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {testimonials.map((testi, index) => (
                            <div 
                                key={index} 
                                className="group relative bg-white rounded-3xl p-8 transition-all duration-300 hover:shadow-2xl border border-gray-100 hover:border-transparent overflow-hidden"
                            >
                                {/* Quote Icon */}
                                <div 
                                    className="absolute top-4 right-4 text-6xl font-serif opacity-10 group-hover:opacity-20 transition-opacity"
                                    style={{ color: testi.color }}
                                >
                                    "
                                </div>
                                
                                {/* Rating Stars */}
                                <div className="flex gap-1 mb-4">
                                    {[...Array(testi.rating)].map((_, i) => (
                                        <span key={i} style={{ color: colors.orange }}>⭐</span>
                                    ))}
                                </div>

                                <p className="text-gray-700 mb-6 relative z-10 italic leading-relaxed">
                                    "{testi.content}"
                                </p>
                                
                                <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                                    <div 
                                        className="w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-md"
                                        style={{ 
                                            background: `linear-gradient(135deg, ${testi.color} 0%, ${colors.primary} 100%)`
                                        }}
                                    >
                                        {testi.avatar}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900">{testi.name}</p>
                                        <p 
                                            className="text-sm font-medium"
                                            style={{ color: testi.color }}
                                        >
                                            {testi.role}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* About Section dengan layout yang lebih menarik */}
            <section 
                id="tentang" 
                className="py-24 relative overflow-hidden"
                style={{ 
                    background: `linear-gradient(135deg, ${colors.primary}08 0%, ${colors.forest}08 100%)`
                }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <span 
                                className="font-semibold text-sm uppercase tracking-wider"
                                style={{ color: colors.deep }}
                            >
                                Tentang Kami
                            </span>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-6">
                                Misi Kami: <span style={{ color: colors.forest }}>Generasi Emas Indonesia</span>
                            </h2>
                            <p className="text-gray-600 mb-6 leading-relaxed text-lg">
                                SiKembang hadir sebagai solusi digital untuk membantu orang tua dan tenaga kesehatan 
                                dalam memantau pertumbuhan anak. Kami percaya bahwa pencegahan stunting dimulai dari 
                                edukasi, deteksi dini, dan intervensi gizi yang tepat.
                            </p>
                            <p className="text-gray-600 mb-8 leading-relaxed">
                                Dengan menggunakan standar WHO dan dukungan ahli gizi, SiKembang berkomitmen 
                                untuk mendukung tumbuh kembang anak-anak Indonesia menjadi generasi yang sehat, 
                                cerdas, dan berprestasi.
                            </p>
                            
                            <div className="flex flex-wrap gap-4">
                                {[
                                    { icon: "🎯", text: "Akurat", color: colors.primary },
                                    { icon: "🔒", text: "Aman", color: colors.forest },
                                    { icon: "❤️", text: "Gratis", color: colors.orange }
                                ].map((badge, idx) => (
                                    <div 
                                        key={idx}
                                        className="flex items-center gap-2 px-5 py-3 rounded-xl shadow-sm hover:shadow-md transition-shadow bg-white"
                                    >
                                        <span className="text-2xl">{badge.icon}</span>
                                        <span 
                                            className="font-semibold"
                                            style={{ color: badge.color }}
                                        >
                                            {badge.text}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        <div className="relative">
                            <div className="bg-white rounded-3xl shadow-2xl p-8 relative z-10 transform hover:scale-[1.02] transition-transform duration-500">
                                <div className="grid grid-cols-2 gap-4">
                                    <div 
                                        className="rounded-2xl p-6 text-center transform hover:scale-105 transition-transform"
                                        style={{ backgroundColor: `${colors.primary}15` }}
                                    >
                                        <span className="text-4xl mb-2 block">🌟</span>
                                        <p 
                                            className="font-bold"
                                            style={{ color: colors.deep }}
                                        >
                                            Visi
                                        </p>
                                        <p className="text-sm text-gray-600 mt-2">Indonesia bebas stunting 2030</p>
                                    </div>
                                    <div 
                                        className="rounded-2xl p-6 text-center transform hover:scale-105 transition-transform"
                                        style={{ backgroundColor: `${colors.forest}15` }}
                                    >
                                        <span className="text-4xl mb-2 block">🎯</span>
                                        <p 
                                            className="font-bold"
                                            style={{ color: colors.forest }}
                                        >
                                            Misi
                                        </p>
                                        <p className="text-sm text-gray-600 mt-2">Edukasi & deteksi dini stunting</p>
                                    </div>
                                    <div 
                                        className="rounded-2xl p-6 text-center col-span-2 transform hover:scale-105 transition-transform"
                                        style={{ backgroundColor: `${colors.orange}15` }}
                                    >
                                        <span className="text-4xl mb-2 block">🤝</span>
                                        <p 
                                            className="font-bold"
                                            style={{ color: colors.orange }}
                                        >
                                            Kolaborasi
                                        </p>
                                        <p className="text-sm text-gray-600 mt-2">Bekerjasama dengan 100+ puskesmas dan rumah sakit</p>
                                    </div>
                                </div>
                            </div>
                            {/* Decorative Elements */}
                            <div 
                                className="absolute -top-6 -right-6 w-32 h-32 rounded-full opacity-30 blur-2xl"
                                style={{ backgroundColor: colors.orange }}
                            ></div>
                            <div 
                                className="absolute -bottom-6 -left-6 w-40 h-40 rounded-full opacity-30 blur-2xl"
                                style={{ backgroundColor: colors.primary }}
                            ></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section dengan gradient yang lebih menarik */}
            <section 
                className="py-24 relative overflow-hidden"
                style={{ 
                    background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.deep} 50%, ${colors.forest} 100%)`
                }}
            >
                <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
                
                {/* Floating Elements */}
                <div className="absolute top-10 left-10 text-6xl opacity-10 animate-float">🌱</div>
                <div className="absolute bottom-10 right-10 text-6xl opacity-10 animate-float delay-1000">👶</div>
                
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                        Siap Mencegah Stunting Bersama?
                    </h2>
                    <p className="text-lg text-blue-100 mb-10 max-w-2xl mx-auto">
                        Bergabunglah dengan ribuan orang tua yang peduli dengan gizi anak. 
                        Bersama kita wujudkan generasi emas Indonesia yang sehat dan cerdas.
                    </p>
                    {!auth.user ? (
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href={route('register')}
                                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 font-bold rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 group"
                            >
                                Daftar Gratis Sekarang
                                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </Link>
                            <Link
                                href={route('login')}
                                className="inline-flex items-center gap-2 px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transition-all duration-300"
                            >
                                Sudah Punya Akun? Masuk
                            </Link>
                        </div>
                    ) : (
                        <Link
                            href={route('dashboard')}
                            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 font-bold rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 group"
                        >
                            Ke Dashboard Saya
                            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </Link>
                    )}
                </div>
            </section>

            {/* Footer dengan warna yang lebih soft */}
            <footer className="bg-gray-900 text-gray-300 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-4 gap-12 mb-12">
                        {/* Brand */}
                        <div className="col-span-2">
                            <div className="flex items-center gap-3 mb-6">
                                <img 
                                    src="https://national-ivory-qkxzs5sohx.edgeone.app/Untitled%20design%20(1).png" 
                                    alt="Logo SiKembang" 
                                    className="h-12 w-12 object-contain"
                                />
                                <div>
                                    <span className="font-bold text-2xl text-white">SiKembang</span>
                                    <p 
                                        className="text-xs font-medium"
                                        style={{ color: colors.lime }}
                                    >
                                        Peduli Gizi Anak
                                    </p>
                                </div>
                            </div>
                            <p className="text-gray-400 max-w-sm leading-relaxed mb-6">
                                Platform digital untuk deteksi dini stunting dan edukasi gizi anak. 
                                Bersama mewujudkan Indonesia emas dengan generasi yang sehat dan berkualitas.
                            </p>
                            <div className="flex gap-4">
                                {['facebook', 'twitter', 'instagram', 'youtube'].map((social) => (
                                    <a 
                                        key={social}
                                        href="#"
                                        className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#3FA7D6] transition-colors group"
                                    >
                                        <span className="text-gray-400 group-hover:text-white text-lg">
                                            {social === 'facebook' && 'f'}
                                            {social === 'twitter' && '𝕏'}
                                            {social === 'instagram' && '📷'}
                                            {social === 'youtube' && '▶'}
                                        </span>
                                    </a>
                                ))}
                            </div>
                        </div>
                        
                        {/* Quick Links */}
                        <div>
                            <h4 className="text-white font-semibold mb-6">Tautan Cepat</h4>
                            <ul className="space-y-3">
                                {['Fitur', 'Cara Kerja', 'Testimoni', 'Tentang Kami'].map((item, idx) => (
                                    <li key={idx}>
                                        <a 
                                            href={`#${['fitur', 'cara-kerja', 'testimoni', 'tentang'][idx]}`}
                                            className="hover:text-[#3FA7D6] transition-colors flex items-center gap-2 group"
                                        >
                                            <span className="w-1 h-1 rounded-full bg-gray-600 group-hover:bg-[#3FA7D6] transition-colors"></span>
                                            {item}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        
                        {/* Contact */}
                        <div>
                            <h4 className="text-white font-semibold mb-6">Hubungi Kami</h4>
                            <ul className="space-y-4">
                                <li className="flex items-center gap-3">
                                    <div 
                                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                                        style={{ backgroundColor: `${colors.primary}20` }}
                                    >
                                        <span style={{ color: colors.primary }}>📧</span>
                                    </div>
                                    <span className="text-gray-400">support@sikembang.id</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <div 
                                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                                        style={{ backgroundColor: `${colors.forest}20` }}
                                    >
                                        <span style={{ color: colors.forest }}>📱</span>
                                    </div>
                                    <span className="text-gray-400">0812-3456-7890</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <div 
                                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                                        style={{ backgroundColor: `${colors.orange}20` }}
                                    >
                                        <span style={{ color: colors.orange }}>📍</span>
                                    </div>
                                    <span className="text-gray-400">UNIMUS Semarang, Indonesia</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    
                    <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-sm text-gray-500">
                            © 2026 SiKembang Oleh PPKO UNIMUS <span className="text-red-500"></span>
                        </p>
                        <div className="flex gap-6 text-sm text-gray-500">
                            <a href="#" className="hover:text-[#3FA7D6] transition-colors">Kebijakan Privasi</a>
                            <a href="#" className="hover:text-[#3FA7D6] transition-colors">Syarat & Ketentuan</a>
                        </div>
                    </div>
                </div>
            </footer>

            <style>{`
                @keyframes fade-in-up {
                    0% {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes float {
                    0%, 100% {
                        transform: translateY(0px);
                    }
                    50% {
                        transform: translateY(-20px);
                    }
                }
                
                @keyframes bounce-slow {
                    0%, 100% {
                        transform: translateY(0);
                    }
                    50% {
                        transform: translateY(-10px);
                    }
                }
                
                .animate-fade-in-up {
                    animation: fade-in-up 0.8s ease-out forwards;
                }
                
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
                
                .animate-bounce-slow {
                    animation: bounce-slow 3s ease-in-out infinite;
                }
                
                .delay-100 {
                    animation-delay: 0.1s;
                }
                .delay-200 {
                    animation-delay: 0.2s;
                }
                .delay-300 {
                    animation-delay: 0.3s;
                }
                .delay-500 {
                    animation-delay: 0.5s;
                }
                .delay-700 {
                    animation-delay: 0.7s;
                }
                .delay-1000 {
                    animation-delay: 1s;
                }
            `}</style>
        </>
    );
}