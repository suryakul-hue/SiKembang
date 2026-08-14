import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';

export default function AuthenticatedLayout({ header, children }) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    
    // Ambil data auth secara aman
    const { auth } = usePage().props;
    const user = auth?.user || {};

    const navigation = [
        { name: 'Dashboard', href: route('dashboard'), icon: '🏠', active: route().current('dashboard') },
        // Route ini sekarang sudah terdaftar otomatis di navbar
        { name: 'Deteksi Stunting', href: route('stunting.check'), icon: '📏', active: route().current('stunting.*') },
        { name: 'Hemoglobin', href: route('hemoglobin.index'), icon: '🩸', active: route().current('hemoglobin.index') },
        { name: 'Resep Bergizi', href: route('recipes.index'), icon: '🥗', active: route().current('recipes.*') },
        { name: 'Riwayat', href: route('stunting.history'), icon: '📋', active: route().current('history.*') },
    ];

    if (user.role === 'admin') {
        navigation.push({ 
            name: 'Admin Resep', 
            href: route('recipes.admin'), 
            icon: '⚙️', 
            active: route().current('recipes.admin') 
        });
    }

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        {/* Logo Brand SiKembang */}
                        <div className="flex items-center">
                            <Link href={route('dashboard')} className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-md">
                                    <span className="text-white text-xl font-bold">🌱</span>
                                </div>
                                <div className="hidden sm:block">
                                    <span className="text-xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                                        SiKembang
                                    </span>
                                    <p className="text-xs text-gray-500 -mt-1">Peduli Gizi Anak</p>
                                </div>
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden sm:flex items-center gap-1">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center ${
                                        item.active
                                            ? 'bg-teal-50 text-teal-700'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                                >
                                    <span className="mr-2">{item.icon}</span>
                                    {item.name}
                                </Link>
                            ))}
                        </div>

                        {/* User Menu Surya */}
                        <div className="hidden sm:flex items-center gap-4">
                            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                                <div className="text-right hidden md:block">
                                    <p className="text-sm font-medium text-gray-900">{user.name || 'Surya'}</p>
                                    <p className="text-xs text-gray-500 capitalize">{user.role || 'Member'}</p>
                                </div>
                                <Link
    href={route('logout')}
    method="post"
    as="button"
    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
>
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
        />
    </svg>
</Link>
                            </div>
                        </div>

                        {/* Mobile Toggle */}
                        <div className="flex items-center sm:hidden">
                            <button onClick={() => setShowingNavigationDropdown(!showingNavigationDropdown)} className="p-2 text-gray-400">
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    {showingNavigationDropdown ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {showingNavigationDropdown && (
                    <div className="sm:hidden bg-white border-t border-gray-100">
                        <div className="pt-2 pb-3 space-y-1">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                                        item.active
                                            ? 'border-teal-500 text-teal-700 bg-teal-50'
                                            : 'border-transparent text-gray-600'
                                    }`}
                                >
                                    <span className="mr-2">{item.icon}</span>
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </nav>

            {header && (
                <header className="bg-white shadow-sm border-b border-gray-100">
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">{header}</div>
                </header>
            )}

            <main className="py-10">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {children}
                </div>
            </main>
        </div>
    );
}