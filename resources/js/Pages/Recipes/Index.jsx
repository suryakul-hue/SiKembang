import { Link, Head } from '@inertiajs/react';
import { useState, useEffect, useMemo, useCallback } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Recipes({ auth, recipes = [] }) {
    const colors = {
        primary: '#3FA7D6',
        light: '#7EC8E3',
        deep: '#2F669F',
        forest: '#6FBF4A',
        lime: '#A8D86D',
        orange: '#F29C38',
        peach: '#E6A57E',
        cream: '#FFF8F0',
        sky: '#E0F4FF',
    };

    const [activeCategory, setActiveCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [favorites, setFavorites] = useState([]);
    const [viewMode, setViewMode] = useState('grid');

    const ageGroups = [
        { id: 'all', label: 'Semua Usia', icon: '🍽️', color: colors.primary, gradient: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.deep} 100%)` },
        { id: '6-8', label: '6-8 Bulan', range: '6-8 bulan', icon: '🍼', color: colors.peach, gradient: `linear-gradient(135deg, ${colors.peach} 0%, ${colors.orange} 100%)`, description: 'MPASI pertama, tekstur halus' },
        { id: '9-11', label: '9-11 Bulan', range: '9-11 bulan', icon: '🥄', color: colors.orange, gradient: `linear-gradient(135deg, ${colors.orange} 0%, ${colors.peach} 100%)`, description: 'Tekstur kasar, belajar mengunyah' },
        { id: '12-23', label: '12-23 Bulan', range: '12-23 bulan', icon: '🍴', color: colors.forest, gradient: `linear-gradient(135deg, ${colors.forest} 0%, ${colors.lime} 100%)`, description: 'Makanan keluarga, variasi lengkap' },
        { id: '24-59', label: '2-5 Tahun', range: '24-59 bulan', icon: '🥗', color: colors.primary, gradient: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.light} 100%)`, description: 'Menu lengkap, kemandirian makan' },
    ];

    const sampleRecipes = [
        {
            id: 1, title: 'Bubur Ayam Wortel', age_group: '6-8', category: '6-8', cooking_time: 20, calories: 120, image: null, difficulty: 'Mudah', rating: 4.8, reviews: 128,
            nutrition_tags: ['Protein', 'Vit A', 'Zat Besi'],
            ingredients: ['50g nasi putih', '30g daging ayam cincang', '20g wortel parut', '200ml kaldu ayam', '1 sdt minyak kelapa'],
            instructions: ['Masak nasi dengan kaldu hingga lembut', 'Tumis ayam cincang hingga matang', 'Masukkan wortel dan ayam ke dalam bubur', 'Blender hingga tekstur halus sesuai usia', 'Tambahkan minyak kelapa sebelum disajikan'],
            benefits: 'Mengandung protein untuk pertumbuhan dan vitamin A untuk kesehatan mata', emoji: '🥣'
        },
        {
            id: 2, title: 'Puree Alpukat Pisang', age_group: '6-8', category: '6-8', cooking_time: 10, calories: 150, image: null, difficulty: 'Mudah', rating: 4.9, reviews: 256,
            nutrition_tags: ['Lemak Baik', 'Kalium', 'Serat'],
            ingredients: ['1/2 buah alpukat matang', '1/2 buah pisang ambon', '30ml ASI atau susu formula', '1 sdt madu (opsional untuk >1 tahun)'],
            instructions: ['Kupas alpukat dan pisang', 'Haluskan dengan garpu atau blender', 'Tambahkan ASI/susu untuk mengatur kekentalan', 'Sajikan segera'],
            benefits: 'Lemak sehat untuk perkembangan otak dan serat untuk pencernaan', emoji: '🥑'
        },
        {
            id: 3, title: 'Tim Ikan Salmon Brokoli', age_group: '9-11', category: '9-11', cooking_time: 25, calories: 180, image: null, difficulty: 'Sedang', rating: 4.7, reviews: 89,
            nutrition_tags: ['Omega-3', 'Kalsium', 'Vit D'],
            ingredients: ['50g ikan salmon cincang', '30g brokoli cincang halus', '30g tahu sutra', '1 butir telur ayam kampung', '1 sdt kecap asin anak', '100ml air kaldu'],
            instructions: ['Campur semua bahan dalam mangkuk tahan panas', 'Kukus selama 20-25 menit hingga matang', 'Pastikan tekstur cukup kasar untuk latihan mengunyah', 'Sajikan hangat'],
            benefits: 'Omega-3 untuk perkembangan otak dan kalsium untuk tulang kuat', emoji: '🐟'
        },
        {
            id: 4, title: 'Nasi Tim Hati Ayam', age_group: '9-11', category: '9-11', cooking_time: 30, calories: 200, image: null, difficulty: 'Sedang', rating: 4.6, reviews: 67,
            nutrition_tags: ['Zat Besi', 'Vit B12', 'Protein'],
            ingredients: ['50g nasi putih', '30g hati ayam cincang', '20g bayam cincang', '1 siung bawang putih geprek', '200ml air kaldu', '1 sdt minyak zaitun'],
            instructions: ['Tumis bawang putih dengan minyak zaitun', 'Masukkan hati ayam, masak hingga berubah warna', 'Tambahkan nasi dan kaldu', 'Masak hingga menjadi tim yang lembut', 'Masukkan bayam di akhir memasak'],
            benefits: 'Zat besi tinggi untuk mencegah anemia dan vitamin B12', emoji: '🍚'
        },
        {
            id: 5, title: 'Nasi Goreng Seafood', age_group: '12-23', category: '12-23', cooking_time: 20, calories: 250, image: null, difficulty: 'Mudah', rating: 4.9, reviews: 312,
            nutrition_tags: ['Protein', 'Iodium', 'Vit B'],
            ingredients: ['100g nasi putih dingin', '50g udang cincang', '30g cumi cincang', '1 butir telur', '20g wortel dadu kecil', '20g buncis potong kecil', '1 sdt kecap manis', '1 sdt minyak wijen'],
            instructions: ['Orak-arik telur, sisihkan', 'Tumis seafood hingga matang', 'Masukkan sayuran, tumis sebentar', 'Tambahkan nasi dan bumbu, aduk rata', 'Masukkan telur orak-arik, sajikan hangat'],
            benefits: 'Protein lengkap untuk pertumbuhan dan iodium untuk kesehatan tiroid', emoji: '🍤'
        },
        {
            id: 6, title: 'Sup Bola Daging Sayur', age_group: '12-23', category: '12-23', cooking_time: 35, calories: 220, image: null, difficulty: 'Sedang', rating: 4.8, reviews: 156,
            nutrition_tags: ['Protein', 'Vit C', 'Zinc'],
            ingredients: ['100g daging sapi giling', '1 butir telur', '2 sdm tepung panir', '50g wortel potong dadu', '50g kentang potong dadu', '30g buncis', '500ml kaldu sapi', '1 batang seledri'],
            instructions: ['Campur daging, telur, dan tepung panir, bentuk bola', 'Rebus bola daging dalam kaldu hingga mengapung', 'Masukkan wortel dan kentang, masak 10 menit', 'Tambahkan buncis dan seledri', 'Masak hingga semua sayuran empuk'],
            benefits: 'Protein hewani lengkap dan vitamin C untuk penyerapan zat besi', emoji: '🍲'
        },
        {
            id: 7, title: 'Ayam Goreng Tepung Renyah', age_group: '24-59', category: '24-59', cooking_time: 30, calories: 280, image: null, difficulty: 'Sedang', rating: 4.7, reviews: 423,
            nutrition_tags: ['Protein', 'Energi', 'Vit B6'],
            ingredients: ['150g daging ayam potong kecil', '3 sdm tepung terigu', '2 sdm tepung maizena', '1 butir telur kocok lepas', '1/2 sdt garam', '1/4 sdt merica', 'Minyak untuk menggoreng'],
            instructions: ['Campur tepung terigu, maizena, garam, dan merica', 'Celupkan ayam ke telur, lalu ke campuran tepung', 'Goreng dalam minyak panas hingga keemasan', 'Tiriskan di kertas minyak', 'Sajikan dengan saus tomat homemade'],
            benefits: 'Protein untuk pertumbuhan otot dan energi untuk aktivitas', emoji: '🍗'
        },
        {
            id: 8, title: 'Spaghetti Bolognese', age_group: '24-59', category: '24-59', cooking_time: 40, calories: 320, image: null, difficulty: 'Sulit', rating: 4.9, reviews: 289,
            nutrition_tags: ['Karbohidrat', 'Protein', 'Lycopene'],
            ingredients: ['100g spaghetti rebus', '100g daging sapi giling', '100g tomat cincang', '1/2 bawang bombay cincang', '1 siung bawang putih cincang', '2 sdm saus tomat', '1 sdt oregano kering', 'Keju parmesan parut'],
            instructions: ['Tumis bawang bombay dan bawang putih hingga harum', 'Masukkan daging sapi, masak hingga berubah warna', 'Tambahkan tomat dan saus tomat, masak 15 menit', 'Bumbui dengan oregano, garam, dan merica', 'Campur dengan spaghetti, taburi keju parmesan'],
            benefits: 'Lycopene dari tomat untuk kesehatan jantung dan karbohidrat kompleks', emoji: '🍝'
        },
    ];

    // Normalisasi data dari backend agar field selalu konsisten
    const normalizeRecipe = useCallback((r) => ({
        ...r,
        category: r.category ?? r.age_group ?? 'all',
        ingredients: Array.isArray(r.ingredients) ? r.ingredients : [],
        instructions: Array.isArray(r.instructions) ? r.instructions : [],
        nutrition_tags: Array.isArray(r.nutrition_tags) ? r.nutrition_tags : [],
        emoji: r.emoji ?? '🍽️',
        rating: r.rating ?? 0,
        reviews: r.reviews ?? 0,
        calories: r.calories ?? 0,
        cooking_time: r.cooking_time ?? 0,
        difficulty: r.difficulty ?? 'Mudah',
        benefits: r.benefits ?? '',
    }), []);

    const displayRecipes = useMemo(() => {
        const source = recipes.length > 0 ? recipes : sampleRecipes;
        return source.map(normalizeRecipe);
    }, [recipes]);

    const filteredRecipes = useMemo(() => {
        const q = searchQuery.toLowerCase().trim();
        return displayRecipes.filter((recipe) => {
            const matchesCategory = activeCategory === 'all' || recipe.category === activeCategory;
            if (!matchesCategory) return false;
            if (!q) return true;
            return recipe.title.toLowerCase().includes(q) ||
                recipe.ingredients.some((ing) => typeof ing === 'string' && ing.toLowerCase().includes(q));
        });
    }, [activeCategory, searchQuery, displayRecipes]);

    // ─────────────────────────────────────────────────────────────────────────
    // BUG FIX SCROLL:
    // Pendekatan lama pakai `document.body.style.overflow = 'hidden'` tanpa
    // memperhitungkan posisi scroll → body loncat ke atas & modal ikut terkunci.
    //
    // Solusi: pakai position:fixed + top negatif untuk membekukan body di posisi
    // saat ini, lalu kembalikan (restore) saat modal ditutup. Dengan useEffect
    // + cleanup, tidak ada scroll yang bocor walau komponen unmount mendadak.
    // ─────────────────────────────────────────────────────────────────────────
    useEffect(() => {
        if (isModalOpen) {
            const scrollY = window.scrollY;
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = '100%';
            document.body.style.overflowY = 'scroll'; // jaga lebar scrollbar agar tidak layout shift

            return () => {
                document.body.style.position = '';
                document.body.style.top = '';
                document.body.style.width = '';
                document.body.style.overflowY = '';
                window.scrollTo(0, scrollY);
            };
        }
    }, [isModalOpen]);

    // Tutup modal dengan tombol Escape
    useEffect(() => {
        const onKey = (e) => { if (e.key === 'Escape' && isModalOpen) closeModal(); };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [isModalOpen]);

    const toggleFavorite = useCallback((id, e) => {
        if (e) e.stopPropagation();
        setFavorites((prev) => prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]);
    }, []);

    const openRecipeModal = useCallback((recipe) => {
        setSelectedRecipe(recipe);
        setIsModalOpen(true);
    }, []);

    const closeModal = useCallback(() => {
        setIsModalOpen(false);
        setSelectedRecipe(null);
    }, []);

    const getAgeGroup = useCallback((categoryId) => {
        return ageGroups.find((g) => g.id === categoryId) ?? ageGroups[0];
    }, []);

    const getDifficultyColor = useCallback((difficulty) => {
        return ({ Mudah: colors.forest, Sedang: colors.orange, Sulit: '#EF4444' })[difficulty] ?? colors.primary;
    }, []);

    const activeGroup = useMemo(() => getAgeGroup(activeCategory), [activeCategory]);

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title="Resep Gizi Bergizi" />

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=Sora:wght@400;500;600;700&display=swap');

                .recipes-container {
                    font-family: 'Sora', sans-serif;
                    background: linear-gradient(180deg, #F0F9FF 0%, #F0FDF4 50%, #FFFBF5 100%);
                    min-height: 100vh;
                }
                .hero-gradient {
                    background: linear-gradient(135deg, #3FA7D6 0%, #2F669F 60%, #6FBF4A 100%);
                }
                .glass-card {
                    background: rgba(255,255,255,0.92);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255,255,255,0.6);
                    box-shadow: 0 4px 24px rgba(63,167,214,0.07);
                }
                .recipe-card-hover {
                    transition: transform 0.35s cubic-bezier(0.4,0,0.2,1), box-shadow 0.35s cubic-bezier(0.4,0,0.2,1);
                }
                .recipe-card-hover:hover {
                    transform: translateY(-8px);
                    box-shadow: 0 25px 50px rgba(63,167,214,0.18);
                }
                .category-pill { transition: all 0.25s ease; }
                .category-pill:hover { transform: translateY(-2px); }
                .category-pill.active { box-shadow: 0 8px 24px rgba(0,0,0,0.18); }

                .search-input { transition: box-shadow 0.25s ease; }
                .search-input:focus { outline: none; box-shadow: 0 0 0 4px rgba(63,167,214,0.25); }

                .nutrition-tag { transition: transform 0.2s ease; }
                .nutrition-tag:hover { transform: scale(1.06); }

                .favorite-btn { transition: transform 0.25s ease; }
                .favorite-btn:hover { transform: scale(1.22) rotate(8deg); }
                @keyframes heartBeat { 0%,100%{transform:scale(1)} 50%{transform:scale(1.35)} }
                .favorite-btn.active { animation: heartBeat 0.28s ease; }

                /* Modal */
                @keyframes modalFadeIn  { from{opacity:0}         to{opacity:1} }
                @keyframes modalSlideUp { from{opacity:0;transform:translateY(28px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
                .modal-backdrop { animation: modalFadeIn  0.22s ease forwards; }
                .modal-box      { animation: modalSlideUp 0.28s cubic-bezier(0.34,1.56,0.64,1) forwards; }

                @keyframes slideIn { from{opacity:0;transform:translateX(-16px)} to{opacity:1;transform:translateX(0)} }
                .slide-in { animation: slideIn 0.35s ease; }

                @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
                .float-animation { animation: float 5.5s ease-in-out infinite; }

                /* Scrollbar khusus modal */
                .modal-scroll { overflow-y: auto; overscroll-behavior: contain; }
                .modal-scroll::-webkit-scrollbar { width: 6px; }
                .modal-scroll::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 4px; }
                .modal-scroll::-webkit-scrollbar-thumb { background: linear-gradient(135deg,#3FA7D6 0%,#6FBF4A 100%); border-radius: 4px; }

                .line-clamp-2 { display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }

                @media (max-width:768px) {
                    .category-scroll { overflow-x:auto; scrollbar-width:none; -ms-overflow-style:none; }
                    .category-scroll::-webkit-scrollbar { display:none; }
                }
            `}</style>

            <div className="recipes-container">

                {/* ─── Hero ──────────────────────────────────────────────── */}
                <section className="hero-gradient relative py-16 md:py-24 overflow-hidden">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" />
                    <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white/5 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="text-center">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6">
                                <span>🥗</span><span>100+ Resep Bergizi</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                                Resep Gizi <span className="text-yellow-300">Seimbang</span>
                            </h1>
                            <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto mb-10">
                                Temukan resep makanan sehat yang disusun oleh ahli gizi untuk setiap tahap pertumbuhan anak Anda
                            </p>

                            {/* Search */}
                            <div className="max-w-2xl mx-auto relative">
                                <input
                                    type="text"
                                    placeholder="Cari resep berdasarkan nama atau bahan..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="search-input w-full px-6 py-4 pl-14 rounded-2xl border-0 shadow-2xl text-gray-700 placeholder-gray-400"
                                    style={{ backgroundColor: 'rgba(255,255,255,0.96)' }}
                                />
                                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-2xl pointer-events-none">🔍</span>
                                {searchQuery && (
                                    <button onClick={() => setSearchQuery('')} aria-label="Hapus pencarian"
                                        className="absolute right-5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors">
                                        ✕
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/*
                      * WAVE DIPERBAIKI:
                      * Satu kurva bersih (bukan dua path bertumpuk yang saling menutupi).
                      * Warna putih solid agar match dengan background section berikutnya.
                      * Height cukup kecil (48px) agar tidak "makan" area hero.
                    */}
                    <div className="absolute bottom-0 left-0 w-full pointer-events-none" style={{ lineHeight: 0 }}>
                        <svg viewBox="0 0 1440 48" xmlns="http://www.w3.org/2000/svg"
                            preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: '48px' }}>
                            <path d="M0,24 C240,48 480,0 720,24 C960,48 1200,0 1440,24 L1440,48 L0,48 Z" fill="#ffffff" />
                        </svg>
                    </div>
                </section>

                {/* ─── Category Filter ───────────────────────────────────── */}
                <section className="py-8 bg-white border-b border-gray-100 sticky top-0 z-30 shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="category-scroll flex gap-3 overflow-x-auto pb-1">
                            {ageGroups.map((group) => (
                                <button key={group.id} onClick={() => setActiveCategory(group.id)}
                                    className={`category-pill flex-shrink-0 flex items-center gap-2 px-5 py-3 rounded-2xl font-semibold transition-all ${
                                        activeCategory === group.id ? 'text-white active' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                    }`}
                                    style={{ background: activeCategory === group.id ? group.gradient : undefined }}>
                                    <span className="text-xl">{group.icon}</span>
                                    <span>{group.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ─── Active Category Banner ────────────────────────────── */}
                {activeCategory !== 'all' && (
                    <section className="py-6 bg-gradient-to-r from-blue-50 to-green-50 slide-in">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg flex-shrink-0"
                                    style={{ background: activeGroup.gradient }}>{activeGroup.icon}</div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">{activeGroup.label}</h2>
                                    <p className="text-gray-600">{activeGroup.description}</p>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* ─── Recipes ───────────────────────────────────────────── */}
                <section className="py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                        {/* Header row */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">
                                    {activeCategory === 'all' ? 'Semua Resep' : `Resep untuk ${activeGroup.label}`}
                                </h2>
                                <p className="text-gray-500 mt-1">Menampilkan {filteredRecipes.length} resep</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-sm text-gray-500">Tampilan:</span>
                                <div className="flex bg-gray-100 rounded-xl p-1">
                                    <button onClick={() => setViewMode('grid')} aria-label="Grid view"
                                        className={`p-2 rounded-lg transition-all text-base ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}>⊞</button>
                                    <button onClick={() => setViewMode('list')} aria-label="List view"
                                        className={`p-2 rounded-lg transition-all text-base ${viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}>☰</button>
                                </div>
                            </div>
                        </div>

                        {/* Grid */}
                        {viewMode === 'grid' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {filteredRecipes.map((recipe, index) => {
                                    const group = getAgeGroup(recipe.category);
                                    return (
                                        <article key={recipe.id}
                                            className="recipe-card-hover glass-card rounded-3xl overflow-hidden cursor-pointer group"
                                            onClick={() => openRecipeModal(recipe)}
                                            tabIndex={0} role="button"
                                            aria-label={`Lihat resep ${recipe.title}`}
                                            onKeyDown={(e) => e.key === 'Enter' && openRecipeModal(recipe)}
                                            style={{ animationDelay: `${index * 40}ms` }}>

                                            <div className="h-48 flex items-center justify-center text-6xl relative overflow-hidden"
                                                style={{ background: `linear-gradient(135deg, ${colors.primary}15 0%, ${colors.forest}15 100%)` }}>
                                                <span className="float-animation select-none">{recipe.emoji}</span>
                                                <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold text-white"
                                                    style={{ backgroundColor: getDifficultyColor(recipe.difficulty) }}>
                                                    {recipe.difficulty}
                                                </div>
                                                <button onClick={(e) => toggleFavorite(recipe.id, e)}
                                                    aria-label={favorites.includes(recipe.id) ? 'Hapus dari favorit' : 'Tambah ke favorit'}
                                                    className={`favorite-btn absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center text-xl shadow-lg ${favorites.includes(recipe.id) ? 'active' : 'text-gray-400 hover:text-red-400'}`}>
                                                    {favorites.includes(recipe.id) ? '❤️' : '🤍'}
                                                </button>
                                                <div className="absolute bottom-4 right-4 px-3 py-1 rounded-full bg-white/90 text-xs font-semibold text-gray-700 flex items-center gap-1">
                                                    <span>⏱️</span><span>{recipe.cooking_time} menit</span>
                                                </div>
                                            </div>

                                            <div className="p-5">
                                                <div className="flex items-center gap-2 mb-2 flex-wrap">
                                                    <span className="text-xs font-bold px-2 py-1 rounded-lg"
                                                        style={{ backgroundColor: `${group.color}20`, color: group.color }}>
                                                        {group.label}
                                                    </span>
                                                    <div className="flex items-center gap-1 text-yellow-500 text-sm">
                                                        <span>⭐</span>
                                                        <span className="font-semibold">{recipe.rating}</span>
                                                        <span className="text-gray-400 text-xs">({recipe.reviews})</span>
                                                    </div>
                                                </div>
                                                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#3FA7D6] transition-colors">
                                                    {recipe.title}
                                                </h3>
                                                <div className="flex flex-wrap gap-1.5 mb-4">
                                                    {recipe.nutrition_tags.slice(0, 3).map((tag, idx) => (
                                                        <span key={idx} className="nutrition-tag text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">{tag}</span>
                                                    ))}
                                                </div>
                                                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                                    <div className="flex items-center gap-1 text-sm text-gray-500">
                                                        <span>🔥</span><span>{recipe.calories} kkal</span>
                                                    </div>
                                                    <span className="text-[#3FA7D6] font-semibold text-sm group-hover:translate-x-1 transition-transform inline-block">
                                                        Lihat Detail →
                                                    </span>
                                                </div>
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>
                        )}

                        {/* List */}
                        {viewMode === 'list' && (
                            <div className="space-y-4">
                                {filteredRecipes.map((recipe) => {
                                    const group = getAgeGroup(recipe.category);
                                    return (
                                        <article key={recipe.id}
                                            className="recipe-card-hover glass-card rounded-2xl p-4 cursor-pointer group flex gap-4"
                                            onClick={() => openRecipeModal(recipe)}
                                            tabIndex={0} role="button"
                                            aria-label={`Lihat resep ${recipe.title}`}
                                            onKeyDown={(e) => e.key === 'Enter' && openRecipeModal(recipe)}>

                                            <div className="w-24 h-24 rounded-xl flex items-center justify-center text-3xl flex-shrink-0 select-none"
                                                style={{ background: `linear-gradient(135deg, ${colors.primary}15 0%, ${colors.forest}15 100%)` }}>
                                                {recipe.emoji}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                            <span className="text-xs font-bold px-2 py-0.5 rounded"
                                                                style={{ backgroundColor: `${group.color}20`, color: group.color }}>
                                                                {group.label}
                                                            </span>
                                                            <span className="text-xs px-2 py-0.5 rounded text-white"
                                                                style={{ backgroundColor: getDifficultyColor(recipe.difficulty) }}>
                                                                {recipe.difficulty}
                                                            </span>
                                                        </div>
                                                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#3FA7D6] transition-colors truncate">
                                                            {recipe.title}
                                                        </h3>
                                                    </div>
                                                    <button onClick={(e) => toggleFavorite(recipe.id, e)}
                                                        aria-label={favorites.includes(recipe.id) ? 'Hapus dari favorit' : 'Tambah ke favorit'}
                                                        className={`favorite-btn flex-shrink-0 w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center ${favorites.includes(recipe.id) ? 'active' : 'text-gray-400 hover:text-red-400'}`}>
                                                        {favorites.includes(recipe.id) ? '❤️' : '🤍'}
                                                    </button>
                                                </div>
                                                <p className="text-gray-600 text-sm mt-1.5 line-clamp-2">{recipe.benefits}</p>
                                                <div className="flex items-center gap-4 mt-3 text-sm text-gray-500 flex-wrap">
                                                    <span className="flex items-center gap-1"><span>⏱️</span>{recipe.cooking_time} menit</span>
                                                    <span className="flex items-center gap-1"><span>🔥</span>{recipe.calories} kkal</span>
                                                    <span className="flex items-center gap-1 text-yellow-500"><span>⭐</span>{recipe.rating}</span>
                                                    {recipe.nutrition_tags.slice(0, 2).map((tag, idx) => (
                                                        <span key={idx} className="text-xs px-2 py-0.5 bg-gray-100 rounded-full">{tag}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>
                        )}

                        {/* Empty State */}
                        {filteredRecipes.length === 0 && (
                            <div className="text-center py-16">
                                <div className="w-32 h-32 mx-auto rounded-full flex items-center justify-center text-5xl mb-6"
                                    style={{ backgroundColor: `${colors.primary}15` }}>🔍</div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Tidak ada resep ditemukan</h3>
                                <p className="text-gray-500 mb-6">Coba ubah kata kunci pencarian atau pilih kategori lain</p>
                                <button onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
                                    className="px-6 py-3 rounded-xl text-white font-semibold hover:shadow-lg transition-all"
                                    style={{ background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.deep} 100%)` }}>
                                    Lihat Semua Resep
                                </button>
                            </div>
                        )}
                    </div>
                </section>

                {/* ─── Nutrition Tips ────────────────────────────────────── */}
                <section className="py-16 bg-gradient-to-r from-blue-50 to-green-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">Tips Gizi dari Ahli</h2>
                            <p className="text-gray-600 max-w-2xl mx-auto">
                                Pastikan asupan gizi anak tercukupi dengan menerapkan prinsip gizi seimbang
                            </p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                { icon: '🌈', title: 'Makanan Berwarna', desc: 'Sajikan makanan dengan berbagai warna untuk memastikan asupan vitamin dan mineral yang beragam', color: colors.primary },
                                { icon: '🥩', title: 'Protein Berkualitas', desc: 'Pilih sumber protein hewani dan nabati untuk pertumbuhan optimal dan kekebalan tubuh', color: colors.forest },
                                { icon: '💧', title: 'Cukup Cairan', desc: 'Berikan air putih yang cukup sesuai usia anak untuk menjaga hidrasi dan fungsi tubuh', color: colors.orange },
                            ].map((tip, idx) => (
                                <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all hover:-translate-y-2">
                                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-4"
                                        style={{ backgroundColor: `${tip.color}15` }}>{tip.icon}</div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{tip.title}</h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">{tip.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ─── Recipe Modal ──────────────────────────────────────── */}
                {/*
                  * STRUKTUR KUNCI AGAR MODAL BISA DI-SCROLL:
                  *
                  * [backdrop: fixed, full-screen, flex center]
                  *   └─ [.modal-box: flex flex-col, max-h-[90vh]]
                  *         ├─ [header: flex-shrink-0]   ← tidak ikut scroll
                  *         └─ [.modal-scroll: flex-1, overflow-y-auto] ← INI yang scroll
                  *
                  * Kesalahan umum: meletakkan overflow-y-auto di .modal-box bukan
                  * di container konten di dalamnya, atau tidak menggunakan flex-col
                  * sehingga tinggi tidak terbagi dengan benar.
                */}
                {isModalOpen && selectedRecipe && (
                    <div className="modal-backdrop fixed inset-0 z-50 flex items-center justify-center p-4"
                        style={{ backgroundColor: 'rgba(0,0,0,0.62)', backdropFilter: 'blur(4px)' }}
                        onClick={closeModal}
                        role="dialog" aria-modal="true"
                        aria-label={`Detail resep ${selectedRecipe.title}`}>

                        <div className="modal-box bg-white rounded-3xl w-full shadow-2xl flex flex-col"
                            style={{ maxWidth: '768px', maxHeight: '90vh' }}
                            onClick={(e) => e.stopPropagation()}>

                            {/* Header — tetap di atas, tidak scroll */}
                            <div className="flex-shrink-0 h-44 flex items-center justify-center text-8xl relative rounded-t-3xl overflow-hidden"
                                style={{ background: `linear-gradient(135deg, ${colors.primary}20 0%, ${colors.forest}20 100%)` }}>
                                <span className="float-animation select-none">{selectedRecipe.emoji}</span>
                                <button onClick={closeModal} aria-label="Tutup modal"
                                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center text-xl shadow-lg transition-all hover:rotate-90 hover:scale-110">
                                    ✕
                                </button>
                            </div>

                            {/* Konten yang bisa di-scroll */}
                            <div className="modal-scroll flex-1 p-6 md:p-8">

                                {/* Title row */}
                                <div className="flex items-start justify-between gap-4 mb-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                                            <span className="text-sm font-bold px-3 py-1 rounded-full text-white"
                                                style={{ background: getAgeGroup(selectedRecipe.category).gradient }}>
                                                {getAgeGroup(selectedRecipe.category).label}
                                            </span>
                                            <span className="text-sm font-bold px-3 py-1 rounded-full text-white"
                                                style={{ backgroundColor: getDifficultyColor(selectedRecipe.difficulty) }}>
                                                {selectedRecipe.difficulty}
                                            </span>
                                        </div>
                                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{selectedRecipe.title}</h2>
                                    </div>
                                    <button onClick={(e) => toggleFavorite(selectedRecipe.id, e)}
                                        aria-label={favorites.includes(selectedRecipe.id) ? 'Hapus dari favorit' : 'Tambah ke favorit'}
                                        className={`favorite-btn flex-shrink-0 w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-2xl ${favorites.includes(selectedRecipe.id) ? 'active' : 'text-gray-400 hover:text-red-400'}`}>
                                        {favorites.includes(selectedRecipe.id) ? '❤️' : '🤍'}
                                    </button>
                                </div>

                                {/* Quick info */}
                                <div className="flex flex-wrap gap-3 mb-6 pb-6 border-b border-gray-100">
                                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-50 text-orange-700">
                                        <span>⏱️</span><span className="font-semibold">{selectedRecipe.cooking_time} menit</span>
                                    </div>
                                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 text-red-700">
                                        <span>🔥</span><span className="font-semibold">{selectedRecipe.calories} kkal</span>
                                    </div>
                                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-yellow-50 text-yellow-700">
                                        <span>⭐</span><span className="font-semibold">{selectedRecipe.rating} ({selectedRecipe.reviews} ulasan)</span>
                                    </div>
                                </div>

                                {/* Benefits */}
                                <div className="p-4 rounded-2xl mb-6" style={{ backgroundColor: `${colors.forest}10` }}>
                                    <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                                        <span>💡</span><span>Manfaat Gizi</span>
                                    </h4>
                                    <p className="text-gray-700 text-sm leading-relaxed">{selectedRecipe.benefits}</p>
                                </div>

                                {/* Nutrition Tags */}
                                <div className="mb-6">
                                    <h4 className="font-bold text-gray-900 mb-3">Kandungan Nutrisi</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedRecipe.nutrition_tags.map((tag, idx) => (
                                            <span key={idx} className="px-4 py-2 rounded-full text-sm font-semibold text-white"
                                                style={{ background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.forest} 100%)` }}>
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Ingredients */}
                                <div className="mb-6">
                                    <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                        <span>📝</span><span>Bahan-bahan</span>
                                    </h4>
                                    <ul className="space-y-2">
                                        {selectedRecipe.ingredients.map((ingredient, idx) => (
                                            <li key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                                                <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs text-white flex-shrink-0 font-bold"
                                                    style={{ backgroundColor: colors.primary }}>{idx + 1}</span>
                                                <span className="text-gray-700">{ingredient}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Instructions */}
                                <div className="mb-6">
                                    <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                        <span>👨‍🍳</span><span>Cara Membuat</span>
                                    </h4>
                                    <div className="space-y-4">
                                        {selectedRecipe.instructions.map((step, idx) => (
                                            <div key={idx} className="flex gap-4">
                                                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0 mt-0.5"
                                                    style={{ backgroundColor: colors.forest }}>{idx + 1}</div>
                                                <p className="text-gray-700 pt-1 leading-relaxed">{step}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-4 pt-4 border-t border-gray-100">
                                    <button onClick={() => window.print()}
                                        className="flex-1 py-3 rounded-xl text-white font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2 hover:opacity-90"
                                        style={{ background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.deep} 100%)` }}>
                                        <span>🖨️</span><span>Cetak Resep</span>
                                    </button>
                                    <button onClick={() => {
                                            if (navigator.share) {
                                                navigator.share({ title: selectedRecipe.title, text: selectedRecipe.benefits });
                                            } else {
                                                navigator.clipboard?.writeText(selectedRecipe.title);
                                            }
                                        }}
                                        className="flex-1 py-3 rounded-xl font-bold border-2 hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                                        style={{ borderColor: colors.forest, color: colors.forest }}>
                                        <span>📤</span><span>Bagikan</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </AuthenticatedLayout>
    );
}