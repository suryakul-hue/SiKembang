import { Head, useForm } from '@inertiajs/react';

export default function BiodataSetup() {
    const { data, setData, post, processing, errors } = useForm({
        gender: '',
        child_name: '',
        child_dob: '',
        child_gender: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('biodata.update'));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <Head title="Lengkapi Biodata" />
            
            <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-teal-800 mb-2">Lengkapi Biodata</h2>
                    <p className="text-sm text-gray-500">Mohon isi data orang tua dan anak untuk mengoptimalkan pemantauan kesehatan.</p>
                </div>

                <form onSubmit={submit} className="space-y-5">
                    {/* Data Orang Tua */}
                    <div className="p-4 bg-teal-50 rounded-2xl border border-teal-100">
                        <label className="block text-sm font-semibold text-teal-900 mb-2">Data Pengguna (Anda)</label>
                        <select 
                            className="w-full rounded-xl border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                            value={data.gender} 
                            onChange={e => setData('gender', e.target.value)}
                        >
                            <option value="">Pilih Jenis Kelamin Anda...</option>
                            <option value="perempuan">Perempuan (Ibu)</option>
                            <option value="laki-laki">Laki-laki (Ayah)</option>
                        </select>
                        {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
                    </div>

                    {/* Data Anak */}
                    <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 space-y-4">
                        <label className="block text-sm font-semibold text-emerald-900">Data Anak Balita</label>
                        
                        <div>
                            <input 
                                type="text" placeholder="Nama Lengkap Anak"
                                className="w-full rounded-xl border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                                value={data.child_name} 
                                onChange={e => setData('child_name', e.target.value)}
                            />
                            {errors.child_name && <p className="text-red-500 text-xs mt-1">{errors.child_name}</p>}
                        </div>

                        <div>
                            <label className="block text-xs text-gray-600 mb-1">Tanggal Lahir Anak</label>
                            <input 
                                type="date" 
                                className="w-full rounded-xl border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                                value={data.child_dob} 
                                onChange={e => setData('child_dob', e.target.value)}
                            />
                            {errors.child_dob && <p className="text-red-500 text-xs mt-1">{errors.child_dob}</p>}
                        </div>

                        <select 
                            className="w-full rounded-xl border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                            value={data.child_gender} 
                            onChange={e => setData('child_gender', e.target.value)}
                        >
                            <option value="">Jenis Kelamin Anak...</option>
                            <option value="L">Laki-laki</option>
                            <option value="P">Perempuan</option>
                        </select>
                        {errors.child_gender && <p className="text-red-500 text-xs mt-1">{errors.child_gender}</p>}
                    </div>

                    <button 
                        type="submit" 
                        disabled={processing}
                        className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-bold py-3.5 rounded-xl hover:opacity-90 transition-all shadow-lg"
                    >
                        {processing ? 'Menyimpan...' : 'Simpan & Lanjutkan'}
                    </button>
                </form>
            </div>
        </div>
    );
}