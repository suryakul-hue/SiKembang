import { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

// ─── Komponen Badge Kesulitan ───────────────────────────────────────────────
const DifficultyBadge = ({ level }) => {
    const map = {
        Mudah:  'bg-emerald-900/60 text-emerald-300 border border-emerald-700',
        Sedang: 'bg-amber-900/60 text-amber-300 border border-amber-700',
        Sulit:  'bg-rose-900/60 text-rose-300 border border-rose-700',
    };
    return (
        <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${map[level] ?? map['Mudah']}`}>
            {level}
        </span>
    );
};

// ─── Komponen Badge Role User ───────────────────────────────────────────────
const RoleBadge = ({ role }) => {
    const isAdmin = role === 'admin';
    return (
        <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${isAdmin ? 'bg-violet-900/60 text-violet-300 border border-violet-700' : 'bg-slate-700 text-slate-300 border border-slate-600'}`}>
            {isAdmin ? '👑 Admin' : '👤 User'}
        </span>
    );
};

// ─── Field Input reusable ───────────────────────────────────────────────────
const Field = ({ label, hint, children }) => (
    <div>
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            {label} {hint && <span className="normal-case text-slate-500 font-normal">{hint}</span>}
        </label>
        {children}
    </div>
);

const inputCls = 'w-full bg-slate-700 border border-slate-600 text-slate-100 placeholder-slate-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition';

// ─── MAIN COMPONENT ─────────────────────────────────────────────────────────
export default function AdminRecipes({ auth, recipes, users = [] }) {

    // Tab aktif: 'recipes' | 'users'
    const [activeTab, setActiveTab] = useState('recipes');

    // ── State modal resep ────────────────────────────────────────────────────
    const [recipeModal, setRecipeModal] = useState(false);
    const [editingRecipe, setEditingRecipe] = useState(null);

    // ── State modal user ─────────────────────────────────────────────────────
    const [userModal, setUserModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    // ── Form resep ───────────────────────────────────────────────────────────
    const recipeForm = useForm({
        title: '', age_group: '6-8', category: '', cooking_time: '', calories: '',
        difficulty: 'Mudah', benefits: '', emoji: '🍽️',
        nutrition_tags: '', ingredients: '', instructions: ''
    });

    // ── Form user ────────────────────────────────────────────────────────────
    const userForm = useForm({
        name: '', email: '', password: '', role: 'user'
    });

    const parseToString = (arr) => Array.isArray(arr) ? arr.join('\n') : '';

    // ─── Handlers Resep ──────────────────────────────────────────────────────
    const openRecipeModal = (recipe = null) => {
        if (recipe) {
            setEditingRecipe(recipe);
            recipeForm.setData({
                title: recipe.title || '',
                age_group: recipe.age_group || '6-8',
                category: recipe.category || '',
                cooking_time: recipe.cooking_time || '',
                calories: recipe.calories || '',
                difficulty: recipe.difficulty || 'Mudah',
                benefits: recipe.benefits || '',
                emoji: recipe.emoji || '🍽️',
                nutrition_tags: parseToString(recipe.nutrition_tags),
                ingredients: parseToString(recipe.ingredients),
                instructions: parseToString(recipe.instructions),
            });
        } else {
            setEditingRecipe(null);
            recipeForm.reset();
        }
        setRecipeModal(true);
    };

    const closeRecipeModal = () => {
        setRecipeModal(false);
        setEditingRecipe(null);
        recipeForm.reset();
    };

    const submitRecipe = (e) => {
        e.preventDefault();
        recipeForm.transform((d) => {
            const toArr = (s) => typeof s === 'string' ? s.split('\n').map(i => i.trim()).filter(Boolean) : s;
            return { ...d, nutrition_tags: toArr(d.nutrition_tags), ingredients: toArr(d.ingredients), instructions: toArr(d.instructions), category: d.category || d.age_group };
        });
        if (editingRecipe) {
            recipeForm.put(route('recipes.update', editingRecipe.id), { onSuccess: closeRecipeModal });
        } else {
            recipeForm.post(route('recipes.store'), { onSuccess: closeRecipeModal });
        }
    };

    const deleteRecipe = (id) => {
        if (confirm('Yakin hapus resep ini?')) router.delete(route('recipes.destroy', id));
    };

    // ─── Handlers User ───────────────────────────────────────────────────────
    const openUserModal = (user = null) => {
        if (user) {
            setEditingUser(user);
            userForm.setData({ name: user.name || '', email: user.email || '', password: '', role: user.role || 'user' });
        } else {
            setEditingUser(null);
            userForm.reset();
        }
        setUserModal(true);
    };

    const closeUserModal = () => {
        setUserModal(false);
        setEditingUser(null);
        userForm.reset();
    };

    const submitUser = (e) => {
        e.preventDefault();
        if (editingUser) {
            userForm.put(route('admin.users.update', editingUser.id), { onSuccess: closeUserModal });
        } else {
            userForm.post(route('admin.users.store'), { onSuccess: closeUserModal });
        }
    };

    const deleteUser = (id) => {
        if (confirm('Yakin hapus user ini? Tindakan ini tidak bisa dibatalkan.')) {
            router.delete(route('admin.users.destroy', id));
        }
    };

    // ─── RENDER ──────────────────────────────────────────────────────────────
    return (
        <AdminLayout auth={auth}>
            <Head title="Admin — Dasbor" />

            {/* ── Page Header ── */}
            <div className="mb-8">
                <p className="text-xs font-semibold text-teal-400 uppercase tracking-widest mb-1">Panel Administrator</p>
                <h1 className="text-2xl font-bold text-slate-100">Manajemen Data</h1>
                <p className="text-slate-400 text-sm mt-0.5">Kelola resep gizi dan akun pengguna SiKembang.</p>
            </div>

            {/* ── Stat Cards ── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                    { label: 'Total Resep', value: recipes.length, icon: '🍽️', color: 'teal' },
                    { label: 'Total Pengguna', value: users.length, icon: '👥', color: 'violet' },
                    { label: 'Admin Aktif', value: users.filter(u => u.role === 'admin').length, icon: '👑', color: 'amber' },
                    { label: 'Resep Mudah', value: recipes.filter(r => r.difficulty === 'Mudah').length, icon: '✅', color: 'emerald' },
                ].map(({ label, value, icon, color }) => (
                    <div key={label} className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex items-center gap-3">
                        <span className="text-2xl">{icon}</span>
                        <div>
                            <p className="text-xs text-slate-400">{label}</p>
                            <p className={`text-xl font-bold text-${color}-400`}>{value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Tab Switcher ── */}
            <div className="flex gap-1 mb-6 bg-slate-800 border border-slate-700 rounded-xl p-1 w-fit">
                {[
                    { key: 'recipes', label: '🍽️ Resep Gizi' },
                    { key: 'users',   label: '👥 Pengguna' },
                ].map(({ key, label }) => (
                    <button
                        key={key}
                        onClick={() => setActiveTab(key)}
                        className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-150 ${activeTab === key ? 'bg-teal-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {/* ════════════════════════════════════════════════════════════
                TAB: RESEP
            ════════════════════════════════════════════════════════════ */}
            {activeTab === 'recipes' && (
                <section>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-slate-200 font-semibold">Daftar Resep ({recipes.length})</h2>
                        <button
                            onClick={() => openRecipeModal()}
                            className="flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
                        >
                            ＋ Tambah Resep
                        </button>
                    </div>

                    <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm">
                                <thead>
                                    <tr className="border-b border-slate-700">
                                        {['Resep', 'Usia', 'Kalori / Waktu', 'Kesulitan', ''].map(h => (
                                            <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-700/50">
                                    {recipes.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="px-5 py-10 text-center text-slate-500">
                                                <span className="block text-3xl mb-2">🍽️</span>
                                                Belum ada resep. Tambahkan yang pertama!
                                            </td>
                                        </tr>
                                    ) : recipes.map((r) => (
                                        <tr key={r.id} className="hover:bg-slate-700/40 transition">
                                            <td className="px-5 py-3.5">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-xl">{r.emoji}</span>
                                                    <span className="font-medium text-slate-100">{r.title}</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3.5 text-slate-400">{r.age_group} bln</td>
                                            <td className="px-5 py-3.5 text-slate-400">{r.calories} kkal · {r.cooking_time} mnt</td>
                                            <td className="px-5 py-3.5"><DifficultyBadge level={r.difficulty} /></td>
                                            <td className="px-5 py-3.5 text-right space-x-2">
                                                <button onClick={() => openRecipeModal(r)} className="text-xs text-slate-300 hover:text-white bg-slate-700 hover:bg-slate-600 px-3 py-1.5 rounded-lg transition">Edit</button>
                                                <button onClick={() => deleteRecipe(r.id)} className="text-xs text-rose-400 hover:text-rose-300 bg-rose-900/40 hover:bg-rose-900/70 px-3 py-1.5 rounded-lg transition">Hapus</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            )}

            {/* ════════════════════════════════════════════════════════════
                TAB: USERS
            ════════════════════════════════════════════════════════════ */}
            {activeTab === 'users' && (
                <section>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-slate-200 font-semibold">Daftar Pengguna ({users.length})</h2>
                        <button
                            onClick={() => openUserModal()}
                            className="flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
                        >
                            ＋ Tambah Pengguna
                        </button>
                    </div>

                    <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm">
                                <thead>
                                    <tr className="border-b border-slate-700">
                                        {['Nama', 'Email', 'Role', 'Bergabung', ''].map(h => (
                                            <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-700/50">
                                    {users.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="px-5 py-10 text-center text-slate-500">
                                                <span className="block text-3xl mb-2">👥</span>
                                                Belum ada data pengguna.
                                            </td>
                                        </tr>
                                    ) : users.map((u) => (
                                        <tr key={u.id} className={`hover:bg-slate-700/40 transition ${u.id === auth.user.id ? 'bg-teal-900/10' : ''}`}>
                                            <td className="px-5 py-3.5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center text-slate-300 text-sm font-bold flex-shrink-0">
                                                        {u.name?.[0]?.toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-slate-100">{u.name}</p>
                                                        {u.id === auth.user.id && <p className="text-xs text-teal-400">Anda</p>}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3.5 text-slate-400">{u.email}</td>
                                            <td className="px-5 py-3.5"><RoleBadge role={u.role} /></td>
                                            <td className="px-5 py-3.5 text-slate-500 text-xs">
                                                {u.created_at ? new Date(u.created_at).toLocaleDateString('id-ID', { day:'numeric', month:'short', year:'numeric' }) : '—'}
                                            </td>
                                            <td className="px-5 py-3.5 text-right space-x-2">
                                                <button onClick={() => openUserModal(u)} className="text-xs text-slate-300 hover:text-white bg-slate-700 hover:bg-slate-600 px-3 py-1.5 rounded-lg transition">Edit</button>
                                                {u.id !== auth.user.id && (
                                                    <button onClick={() => deleteUser(u.id)} className="text-xs text-rose-400 hover:text-rose-300 bg-rose-900/40 hover:bg-rose-900/70 px-3 py-1.5 rounded-lg transition">Hapus</button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            )}

            {/* ════════════════════════════════════════════════════════════
                MODAL: RESEP
            ════════════════════════════════════════════════════════════ */}
            {recipeModal && (
                <Modal title={editingRecipe ? 'Edit Resep' : 'Tambah Resep Baru'} onClose={closeRecipeModal}>
                    <form id="recipeForm" onSubmit={submitRecipe} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        
                        {/* Kolom Kiri */}
                        <div className="space-y-4">
                            <Field label="Judul Resep">
                                <input type="text" required value={recipeForm.data.title} onChange={e => recipeForm.setData('title', e.target.value)} className={inputCls} placeholder="Bubur Ayam Wortel" />
                            </Field>

                            <div className="grid grid-cols-2 gap-3">
                                <Field label="Usia">
                                    <select value={recipeForm.data.age_group} onChange={e => recipeForm.setData('age_group', e.target.value)} className={inputCls}>
                                        <option value="6-8">6–8 Bulan</option>
                                        <option value="9-11">9–11 Bulan</option>
                                        <option value="12-23">12–23 Bulan</option>
                                        <option value="24-59">2–5 Tahun</option>
                                    </select>
                                </Field>
                                <Field label="Emoji">
                                    <input type="text" value={recipeForm.data.emoji} onChange={e => recipeForm.setData('emoji', e.target.value)} className={inputCls} placeholder="🥣" />
                                </Field>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                <Field label="Kalori">
                                    <input type="number" required value={recipeForm.data.calories} onChange={e => recipeForm.setData('calories', e.target.value)} className={inputCls} placeholder="120" />
                                </Field>
                                <Field label="Waktu (mnt)">
                                    <input type="number" required value={recipeForm.data.cooking_time} onChange={e => recipeForm.setData('cooking_time', e.target.value)} className={inputCls} placeholder="30" />
                                </Field>
                                <Field label="Kesulitan">
                                    <select value={recipeForm.data.difficulty} onChange={e => recipeForm.setData('difficulty', e.target.value)} className={inputCls}>
                                        <option>Mudah</option>
                                        <option>Sedang</option>
                                        <option>Sulit</option>
                                    </select>
                                </Field>
                            </div>

                            <Field label="Manfaat Gizi">
                                <textarea value={recipeForm.data.benefits} onChange={e => recipeForm.setData('benefits', e.target.value)} className={inputCls} rows="3" placeholder="Kaya protein untuk pertumbuhan..." />
                            </Field>

                            <Field label="Tag Nutrisi" hint="(pisah per baris)">
                                <textarea value={recipeForm.data.nutrition_tags} onChange={e => recipeForm.setData('nutrition_tags', e.target.value)} className={inputCls} rows="3" placeholder={"Protein\nVitamin A\nZat Besi"} />
                            </Field>
                        </div>

                        {/* Kolom Kanan */}
                        <div className="space-y-4">
                            <Field label="Bahan-bahan" hint="(pisah per baris)">
                                <textarea required value={recipeForm.data.ingredients} onChange={e => recipeForm.setData('ingredients', e.target.value)} className={inputCls} rows="7" placeholder={"50g nasi putih\n30g daging ayam\n20g wortel parut"} />
                            </Field>
                            <Field label="Cara Membuat" hint="(pisah per baris)">
                                <textarea required value={recipeForm.data.instructions} onChange={e => recipeForm.setData('instructions', e.target.value)} className={inputCls} rows="7" placeholder={"Masak nasi dengan kaldu...\nTumis ayam cincang...\nBlender hingga halus..."} />
                            </Field>
                        </div>
                    </form>

                    <ModalFooter onClose={closeRecipeModal} formId="recipeForm" processing={recipeForm.processing} submitLabel={editingRecipe ? 'Simpan Perubahan' : 'Tambah Resep'} />
                </Modal>
            )}

            {/* ════════════════════════════════════════════════════════════
                MODAL: USER
            ════════════════════════════════════════════════════════════ */}
            {userModal && (
                <Modal title={editingUser ? 'Edit Pengguna' : 'Tambah Pengguna Baru'} onClose={closeUserModal} narrow>
                    <form id="userForm" onSubmit={submitUser} className="space-y-4">
                        <Field label="Nama Lengkap">
                            <input type="text" required value={userForm.data.name} onChange={e => userForm.setData('name', e.target.value)} className={inputCls} placeholder="Budi Santoso" />
                        </Field>
                        <Field label="Alamat Email">
                            <input type="email" required value={userForm.data.email} onChange={e => userForm.setData('email', e.target.value)} className={inputCls} placeholder="budi@email.com" />
                        </Field>
                        <Field label={editingUser ? 'Password Baru' : 'Password'} hint={editingUser ? '(kosongkan jika tidak diubah)' : ''}>
                            <input type="password" required={!editingUser} value={userForm.data.password} onChange={e => userForm.setData('password', e.target.value)} className={inputCls} placeholder="••••••••" />
                        </Field>
                        <Field label="Role">
                            <select value={userForm.data.role} onChange={e => userForm.setData('role', e.target.value)} className={inputCls}>
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
                        </Field>
                    </form>

                    <ModalFooter onClose={closeUserModal} formId="userForm" processing={userForm.processing} submitLabel={editingUser ? 'Simpan Perubahan' : 'Buat Akun'} />
                </Modal>
            )}
        </AdminLayout>
    );
}

// ─── Modal Container ────────────────────────────────────────────────────────
function Modal({ title, onClose, children, narrow = false }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className={`bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl w-full ${narrow ? 'max-w-lg' : 'max-w-4xl'} max-h-[90vh] flex flex-col`}>
                {/* Modal Header */}
                <div className="px-6 py-4 border-b border-slate-700 flex justify-between items-center flex-shrink-0">
                    <h2 className="text-base font-semibold text-slate-100">{title}</h2>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-200 transition text-lg leading-none">✕</button>
                </div>
                {/* Modal Body */}
                <div className="p-6 overflow-y-auto flex-1">
                    {children}
                </div>
            </div>
        </div>
    );
}

// ─── Modal Footer ───────────────────────────────────────────────────────────
function ModalFooter({ onClose, formId, processing, submitLabel }) {
    return (
        <div className="px-6 py-4 border-t border-slate-700 flex justify-end gap-3 mt-4">
            <button onClick={onClose} className="px-5 py-2 rounded-lg text-sm font-semibold text-slate-400 hover:text-slate-200 bg-slate-700 hover:bg-slate-600 transition">
                Batal
            </button>
            <button type="submit" form={formId} disabled={processing} className="px-5 py-2 rounded-lg text-sm font-semibold text-white bg-teal-600 hover:bg-teal-500 disabled:opacity-50 transition shadow">
                {processing ? 'Menyimpan…' : submitLabel}
            </button>
        </div>
    );
}