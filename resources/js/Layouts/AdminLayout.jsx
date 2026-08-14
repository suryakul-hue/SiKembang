import { Link, usePage } from '@inertiajs/react';

const NAV_ITEMS = [
    {
        group: 'Data',
        items: [
            { href: '/admin/dashboard',   label: 'Dasbor',          icon: '◈' },
            { href: '/recipes-admin',     label: 'Resep Gizi',       icon: '🍽️' },
            { href: '/admin/users',       label: 'Pengguna',         icon: '👥' },
            { href: '/admin/stunting',    label: 'Grafik Stunting',  icon: '📊' },
        ],
    },
    {
        group: 'Konten',
        items: [
            { href: '/admin/articles',    label: 'Artikel Berita',   icon: '📰' },
        ],
    },
];

export default function AdminLayout({ children, auth }) {
    const { url } = usePage();

    const isActive = (href) => url === href || url.startsWith(href + '/');

    return (
        <div className="min-h-screen bg-slate-950 flex text-slate-100">

            {/* ── Sidebar ─────────────────────────────────────────── */}
            <aside className="w-60 flex-shrink-0 bg-slate-900 border-r border-slate-800 flex flex-col">

                {/* Logo */}
                <div className="px-5 py-5 border-b border-slate-800">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center text-base">
                            🌱
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-100 leading-tight">SiKembang</p>
                            <p className="text-[10px] text-slate-500 leading-tight">Admin Panel</p>
                        </div>
                    </div>
                </div>

                {/* Nav */}
                <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
                    {NAV_ITEMS.map(({ group, items }) => (
                        <div key={group}>
                            <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest px-2 mb-1.5">
                                {group}
                            </p>
                            <ul className="space-y-0.5">
                                {items.map(({ href, label, icon }) => {
                                    const active = isActive(href);
                                    return (
                                        <li key={href}>
                                            <Link
                                                href={href}
                                                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-150 ${
                                                    active
                                                        ? 'bg-teal-600/20 text-teal-400 font-semibold'
                                                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
                                                }`}
                                            >
                                                <span className="text-base w-5 flex-shrink-0 text-center">{icon}</span>
                                                {label}
                                                {active && (
                                                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-teal-400" />
                                                )}
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    ))}
                </nav>

                {/* User Info + Logout */}
                <div className="px-3 py-4 border-t border-slate-800">
                    {/* Avatar + nama */}
                    <div className="flex items-center gap-2.5 px-3 py-2 mb-1">
                        <div className="w-7 h-7 rounded-full bg-teal-700 flex items-center justify-center text-xs font-bold text-teal-200 flex-shrink-0">
                            {auth?.user?.name?.[0]?.toUpperCase() ?? 'A'}
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs font-semibold text-slate-200 truncate">{auth?.user?.name ?? 'Admin'}</p>
                            <p className="text-[10px] text-slate-500 truncate">{auth?.user?.email ?? ''}</p>
                        </div>
                    </div>

                    {/* Logout */}
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-rose-400 hover:text-rose-300 hover:bg-rose-900/30 transition"
                    >
                        <span className="text-base w-5 text-center">⏻</span>
                        Keluar
                    </Link>
                </div>
            </aside>

            {/* ── Main Content ─────────────────────────────────────── */}
            <div className="flex-1 flex flex-col min-w-0">

                {/* Topbar */}
                <header className="h-14 border-b border-slate-800 bg-slate-900/80 backdrop-blur flex items-center px-8 flex-shrink-0 sticky top-0 z-10">
                    {/* Breadcrumb sederhana berdasarkan URL */}
                    <Breadcrumb url={url} />

                    <div className="ml-auto flex items-center gap-3">
                        <span className="text-xs bg-teal-600/20 text-teal-400 border border-teal-700/50 px-2.5 py-1 rounded-full font-semibold">
                            👑 Admin
                        </span>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-8 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}

// ─── Breadcrumb helper ───────────────────────────────────────────────────────
function Breadcrumb({ url }) {
    const MAP = {
        '/admin/dashboard':  ['Dasbor'],
        '/recipes-admin':    ['Resep Gizi'],
        '/admin/users':      ['Pengguna'],
        '/admin/stunting':   ['Grafik Stunting'],
        '/admin/articles':   ['Artikel Berita'],
    };

    const matched = Object.entries(MAP).find(([path]) => url === path || url.startsWith(path + '/'));
    const segments = matched ? matched[1] : ['Halaman'];

    return (
        <nav className="flex items-center gap-1.5 text-sm">
            <span className="text-slate-500">Admin</span>
            <span className="text-slate-700">/</span>
            <span className="text-slate-200 font-medium">{segments[0]}</span>
        </nav>
    );
}