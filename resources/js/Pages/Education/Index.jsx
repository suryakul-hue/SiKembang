import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function EducationIndex({ auth, topics = [] }) {
    return (
        <AuthenticatedLayout auth={auth}>
            <Head title="Edukasi Gizi" />

            <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 px-4 py-10 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-6xl">
                    <div className="rounded-3xl bg-white/90 p-8 shadow-xl shadow-orange-100 backdrop-blur">
                        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                            <div>
                                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-600">Edukasi</p>
                                <h1 className="mt-2 text-3xl font-bold text-slate-900">Pelajari gizi dan pencegahan stunting</h1>
                                <p className="mt-3 max-w-2xl text-base text-slate-600">
                                    Temukan informasi penting tentang makanan bergizi, pemantauan tumbuh kembang, dan kebiasaan sehat untuk keluarga Anda.
                                </p>
                            </div>
                            <Link href={route('dashboard')} className="inline-flex items-center rounded-full bg-amber-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-600">
                                Kembali ke Dashboard
                            </Link>
                        </div>

                        <div className="mt-8 grid gap-6 md:grid-cols-3">
                            {topics.map((topic, index) => (
                                <div key={index} className="rounded-2xl border border-amber-100 bg-gradient-to-br from-white to-amber-50 p-6 shadow-sm">
                                    <div className="text-4xl">{topic.icon}</div>
                                    <h2 className="mt-4 text-xl font-semibold text-slate-900">{topic.title}</h2>
                                    <p className="mt-3 text-sm leading-6 text-slate-600">{topic.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
