import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function Register({ appName = 'SiKembang' }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    // Password strength checker
    useEffect(() => {
        let strength = 0;
        if (data.password.length > 6) strength++;
        if (data.password.length > 10) strength++;
        if (/[A-Z]/.test(data.password)) strength++;
        if (/[0-9]/.test(data.password)) strength++;
        if (/[^A-Za-z0-9]/.test(data.password)) strength++;
        setPasswordStrength(strength);
    }, [data.password]);

    const getStrengthColor = () => {
        if (passwordStrength <= 2) return 'bg-red-500';
        if (passwordStrength <= 3) return 'bg-yellow-500';
        return 'bg-emerald-500';
    };

    const getStrengthText = () => {
        if (passwordStrength <= 2) return 'Lemah';
        if (passwordStrength <= 3) return 'Sedang';
        return 'Kuat';
    };

    return (
        <GuestLayout>
            <Head title={`Daftar - ${appName}`} />
            
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Sora:wght@400;600;700&display=swap');
                
                :root {
                    --health-primary: #10B981;
                    --health-light: #D1FAE5;
                    --health-lighter: #F0FDF4;
                    --health-dark: #047857;
                    --health-accent: #0EA5E9;
                    --health-accent-dark: #0369A1;
                    --gray-50: #F9FAFB;
                    --gray-100: #F3F4F6;
                    --gray-200: #E5E7EB;
                    --gray-400: #9CA3AF;
                    --gray-600: #4B5563;
                    --gray-900: #111827;
                }

                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }

                body {
                    font-family: 'Sora', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                    background: linear-gradient(135deg, #F0FDF4 0%, #E0F2FE 100%);
                    min-height: 100vh;
                    overflow-x: hidden;
                }

                /* Animated background elements */
                .bg-decoration {
                    position: fixed;
                    width: 100%;
                    height: 100%;
                    top: 0;
                    left: 0;
                    z-index: 0;
                    pointer-events: none;
                }

                .blob-1 {
                    position: absolute;
                    width: 400px;
                    height: 400px;
                    background: radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%);
                    border-radius: 50%;
                    top: -100px;
                    right: -50px;
                    animation: float 25s infinite ease-in-out;
                }

                .blob-2 {
                    position: absolute;
                    width: 300px;
                    height: 300px;
                    background: radial-gradient(circle, rgba(14, 165, 233, 0.1) 0%, transparent 70%);
                    border-radius: 50%;
                    bottom: -50px;
                    left: -100px;
                    animation: float 30s infinite ease-in-out reverse;
                }

                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(30px); }
                }

                /* Main container */
                .login-wrapper {
                    position: relative;
                    z-index: 1;
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 40px 20px;
                    animation: fadeIn 0.8s ease-out;
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                .login-card {
                    width: 100%;
                    max-width: 480px;
                    background: rgba(255, 255, 255, 0.95);
                    backdrop-filter: blur(10px);
                    border-radius: 24px;
                    border: 1px solid rgba(16, 185, 129, 0.2);
                    padding: 48px 40px;
                    box-shadow: 
                        0 20px 25px -5px rgba(0, 0, 0, 0.06),
                        0 0 50px rgba(16, 185, 129, 0.08);
                    animation: slideUp 0.6s ease-out ${isVisible ? '0.1s' : '0s'} both;
                }

                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                /* Header section */
                .login-header {
                    margin-bottom: 32px;
                    text-align: center;
                    animation: slideUp 0.6s ease-out ${isVisible ? '0.2s' : '0s'} both;
                }

                .logo-container {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 64px;
                    height: 64px;
                    background: linear-gradient(135deg, var(--health-primary) 0%, var(--health-accent) 100%);
                    border-radius: 16px;
                    margin-bottom: 20px;
                    box-shadow: 0 8px 16px rgba(16, 185, 129, 0.25);
                }

                .logo-icon {
                    width: 36px;
                    height: 36px;
                    fill: white;
                }

                .login-header h1 {
                    font-size: 32px;
                    font-weight: 700;
                    color: var(--gray-900);
                    margin-bottom: 8px;
                    font-family: 'Poppins', sans-serif;
                    letter-spacing: -0.5px;
                }

                .login-header p {
                    font-size: 15px;
                    color: var(--gray-600);
                    font-weight: 400;
                }

                /* Form section */
                .login-form {
                    display: flex;
                    flex-direction: column;
                    gap: 24px;
                    animation: slideUp 0.6s ease-out ${isVisible ? '0.3s' : '0s'} both;
                }

                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .form-label {
                    font-size: 14px;
                    font-weight: 600;
                    color: var(--gray-900);
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }

                .form-label-icon {
                    width: 16px;
                    height: 16px;
                    color: var(--health-primary);
                }

                .input-wrapper {
                    position: relative;
                }

                .input-icon {
                    position: absolute;
                    left: 14px;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 20px;
                    height: 20px;
                    color: var(--health-primary);
                    pointer-events: none;
                    opacity: 0.7;
                }

                .form-input {
                    padding: 12px 14px 12px 44px;
                    border: 2px solid var(--gray-200);
                    border-radius: 12px;
                    font-size: 14px;
                    font-family: 'Sora', sans-serif;
                    color: var(--gray-900);
                    background: white;
                    transition: all 0.3s ease;
                }

                .form-input:focus {
                    outline: none;
                    border-color: var(--health-primary);
                    background: linear-gradient(135deg, rgba(16, 185, 129, 0.02) 0%, rgba(14, 165, 233, 0.02) 100%);
                    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
                }

                .form-input::placeholder {
                    color: var(--gray-400);
                }

                .password-toggle {
                    position: absolute;
                    right: 14px;
                    top: 50%;
                    transform: translateY(-50%);
                    background: none;
                    border: none;
                    cursor: pointer;
                    padding: 4px;
                    color: var(--gray-400);
                    transition: all 0.3s ease;
                }

                .password-toggle:hover {
                    color: var(--health-primary);
                }

                .error-message {
                    font-size: 13px;
                    color: #EF4444;
                    margin-top: 6px;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }

                /* Submit button */
                .submit-button {
                    padding: 14px 20px;
                    background: linear-gradient(135deg, var(--health-primary) 0%, var(--health-accent) 100%);
                    border: none;
                    border-radius: 12px;
                    font-size: 15px;
                    font-weight: 700;
                    color: white;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    box-shadow: 0 8px 16px rgba(16, 185, 129, 0.25);
                    font-family: 'Sora', sans-serif;
                    letter-spacing: 0.3px;
                }

                .submit-button:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 12px 24px rgba(16, 185, 129, 0.35);
                }

                .submit-button:active:not(:disabled) {
                    transform: translateY(0);
                }

                .submit-button:disabled {
                    opacity: 0.8;
                    cursor: not-allowed;
                }

                .button-content {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                }

                /* Sign up section */
                .signup-section {
                    margin-top: 32px;
                    padding-top: 24px;
                    border-top: 1px solid var(--gray-200);
                    text-align: center;
                    animation: slideUp 0.6s ease-out ${isVisible ? '0.4s' : '0s'} both;
                }

                .signup-text {
                    font-size: 14px;
                    color: var(--gray-600);
                }

                .signup-link {
                    font-weight: 700;
                    color: var(--health-primary);
                    text-decoration: none;
                    transition: all 0.3s ease;
                }

                .signup-link:hover {
                    color: var(--health-dark);
                }

                /* Spin animation */
                .spin {
                    animation: spin 1s linear infinite;
                }

                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }

                @media (max-width: 480px) {
                    .login-card {
                        padding: 40px 24px;
                    }

                    .login-header h1 {
                        font-size: 28px;
                    }
                }
            `}</style>

            <div className="bg-decoration">
                <div className="blob-1"></div>
                <div className="blob-2"></div>
            </div>

            <div className="login-wrapper">
                <div className="login-card">
                    
                    {/* Header */}
                    <div className="login-header">
                        <div className="logo-container">
                            <svg className="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor" />
                            </svg>
                        </div>
                        <h1>Daftar Akun</h1>
                        <p>Lengkapi formulir di bawah untuk membuat akun baru</p>
                    </div>

                    {/* Registration Form */}
                    <form onSubmit={submit} className="login-form">
                        
                        {/* Name Field */}
                        <div className="form-group">
                            <label className="form-label">
                                <svg className="form-label-icon" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                </svg>
                                Nama Lengkap
                            </label>
                            <div className="input-wrapper">
                                <svg className="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <input
                                    id="name"
                                    type="text"
                                    name="name"
                                    value={data.name}
                                    className="form-input"
                                    autoComplete="name"
                                    placeholder="Masukkan nama lengkap Anda"
                                    onChange={(e) => setData('name', e.target.value)}
                                    style={{ width: '100%' }}
                                    required
                                />
                            </div>
                            {errors.name && (
                                <div className="error-message">
                                    <span className="text-xs">⚠️ {errors.name}</span>
                                </div>
                            )}
                        </div>

                        {/* Email Field */}
                        <div className="form-group">
                            <label className="form-label">
                                <svg className="form-label-icon" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                </svg>
                                Alamat Email
                            </label>
                            <div className="input-wrapper">
                                <svg className="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="form-input"
                                    autoComplete="username"
                                    placeholder="nama@email.com"
                                    onChange={(e) => setData('email', e.target.value)}
                                    style={{ width: '100%' }}
                                    required
                                />
                            </div>
                            {errors.email && (
                                <div className="error-message">
                                    <span className="text-xs">⚠️ {errors.email}</span>
                                </div>
                            )}
                        </div>

                        {/* Password Field */}
                        <div className="form-group">
                            <label className="form-label">
                                <svg className="form-label-icon" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                </svg>
                                Kata Sandi
                            </label>
                            <div className="input-wrapper">
                                <svg className="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={data.password}
                                    className="form-input"
                                    autoComplete="new-password"
                                    placeholder="••••••••"
                                    onChange={(e) => setData('password', e.target.value)}
                                    style={{ width: '100%', paddingRight: '44px' }}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="password-toggle"
                                >
                                    {showPassword ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            
                            {/* Strength Indicator */}
                            {data.password && (
                                <div className="mt-2 p-3 bg-slate-50 border border-gray-100 rounded-xl">
                                    <div className="flex justify-between items-center mb-1.5">
                                        <span className="text-xs font-semibold text-gray-500">Kekuatan Sandi:</span>
                                        <span className={`text-xs font-bold ${
                                            passwordStrength <= 2 ? 'text-red-500' : 
                                            passwordStrength <= 3 ? 'text-yellow-600' : 'text-emerald-600'
                                        }`}>{getStrengthText()}</span>
                                    </div>
                                    <div className="flex gap-1.5 h-1.5">
                                        {[1, 2, 3, 4, 5].map((level) => (
                                            <div
                                                key={level}
                                                className={`flex-1 rounded-full transition-all duration-300 ${level <= passwordStrength ? getStrengthColor() : 'bg-gray-200'}`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                            {errors.password && (
                                <div className="error-message">
                                    <span className="text-xs">⚠️ {errors.password}</span>
                                </div>
                            )}
                        </div>

                        {/* Password Confirmation Field */}
                        <div className="form-group">
                            <label className="form-label">
                                <svg className="form-label-icon" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944a11.954 11.954 0 007.834 3.056 11.954 11.954 0 01-3.342 8.687 11.954 11.954 0 01-4.492 2.313 11.954 11.954 0 01-4.492-2.313 11.954 11.954 0 01-3.342-8.687zM10 12a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                </svg>
                                Konfirmasi Kata Sandi
                            </label>
                            <div className="input-wrapper">
                                <svg className="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <input
                                    id="password_confirmation"
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="password_confirmation"
                                    value={data.password_confirmation}
                                    className="form-input"
                                    autoComplete="new-password"
                                    placeholder="••••••••"
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    style={{ width: '100%', paddingRight: '44px' }}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="password-toggle"
                                >
                                    {showConfirmPassword ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            {data.password_confirmation && data.password !== data.password_confirmation && (
                                <div className="error-message">
                                    <span className="text-xs">⚠️ Konfirmasi sandi belum cocok</span>
                                </div>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="submit-button"
                            style={{ marginTop: '12px' }}
                        >
                            <div className="button-content">
                                {processing ? (
                                    <>
                                        <svg className="w-5 h-5 spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>Mendaftarkan...</span>
                                    </>
                                ) : (
                                    <span>Daftar Akun</span>
                                )}
                            </div>
                        </button>
                    </form>

                    {/* Sign In Link */}
                    <div className="signup-section">
                        <p className="signup-text">
                            Sudah memiliki akun?{' '}
                            <Link
                                href={route('login')}
                                className="signup-link"
                            >
                                Masuk di sini
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}