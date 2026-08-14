import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function Login({ status, canResetPassword, googleClientId }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    const handleGoogleLogin = () => {
        setIsGoogleLoading(true);
        window.location.href = route('auth.google');
    };

    useEffect(() => {
        if (googleClientId && window.google) {
            window.google.accounts.id.initialize({
                client_id: googleClientId,
                callback: handleGoogleCredentialResponse,
                auto_select: false,
                cancel_on_tap_outside: true,
            });

            window.google.accounts.id.prompt((notification) => {
                if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
                    // Continue with normal flow
                }
            });
        }
    }, [googleClientId]);

    const handleGoogleCredentialResponse = (response) => {
        router.post(route('auth.google.callback'), {
            credential: response.credential
        }, {
            onFinish: () => setIsGoogleLoading(false),
            onError: () => setIsGoogleLoading(false),
        });
    };

    return (
        <GuestLayout>
            <Head title="Masuk - Platform Kesehatan" />

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
                    padding: 20px;
                    animation: fadeIn 0.8s ease-out;
                }

                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
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

                /* Status message */
                .status-message {
                    margin-bottom: 24px;
                    padding: 16px;
                    background: linear-gradient(135deg, #F0FDF4 0%, #DBEAFE 100%);
                    border-radius: 16px;
                    border-left: 4px solid var(--health-primary);
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    font-size: 14px;
                    font-weight: 500;
                    color: var(--health-dark);
                    animation: slideDown 0.5s ease-out;
                }

                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
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

                /* Google button */
                .google-button {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                    width: 100%;
                    padding: 14px 16px;
                    background: white;
                    border: 2px solid var(--gray-200);
                    border-radius: 16px;
                    font-size: 15px;
                    font-weight: 600;
                    color: var(--gray-900);
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    animation: slideUp 0.6s ease-out ${isVisible ? '0.3s' : '0s'} both;
                }

                .google-button:hover:not(:disabled) {
                    border-color: var(--health-primary);
                    background: linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(14, 165, 233, 0.05) 100%);
                    transform: translateY(-2px);
                    box-shadow: 0 12px 24px rgba(16, 185, 129, 0.12);
                }

                .google-button:active:not(:disabled) {
                    transform: translateY(0);
                }

                .google-button:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                .google-icon {
                    width: 20px;
                    height: 20px;
                }

                .spin {
                    animation: spin 1s linear infinite;
                }

                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }

                /* Divider */
                .divider-container {
                    position: relative;
                    margin: 24px 0;
                    animation: slideUp 0.6s ease-out ${isVisible ? '0.4s' : '0s'} both;
                }

                .divider-line {
                    height: 1px;
                    background: linear-gradient(90deg, transparent, var(--gray-300), transparent);
                }

                .divider-text {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: rgba(255, 255, 255, 0.95);
                    padding: 0 16px;
                    font-size: 13px;
                    color: var(--gray-400);
                    font-weight: 500;
                }

                /* Form section */
                .login-form {
                    display: flex;
                    flex-direction: column;
                    gap: 24px;
                    animation: slideUp 0.6s ease-out ${isVisible ? '0.5s' : '0s'} both;
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

                /* Remember & forgot password */
                .form-footer {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-top: 8px;
                }

                .remember-label {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 14px;
                    color: var(--gray-600);
                    cursor: pointer;
                    user-select: none;
                }

                .forgot-link {
                    font-size: 14px;
                    font-weight: 600;
                    color: var(--health-accent);
                    text-decoration: none;
                    transition: all 0.3s ease;
                }

                .forgot-link:hover {
                    color: var(--health-accent-dark);
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
                    animation: slideUp 0.6s ease-out ${isVisible ? '0.6s' : '0s'} both;
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

                /* Security info */
                .security-info {
                    margin-top: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    font-size: 12px;
                    color: var(--gray-400);
                    animation: slideUp 0.6s ease-out ${isVisible ? '0.7s' : '0s'} both;
                }

                .security-icon {
                    width: 16px;
                    height: 16px;
                    color: var(--health-primary);
                }

                /* Responsive */
                @media (max-width: 480px) {
                    .login-card {
                        padding: 40px 24px;
                    }

                    .login-header h1 {
                        font-size: 28px;
                    }

                    .blob-1, .blob-2 {
                        opacity: 0.5;
                    }
                }
            `}</style>

            <div className="bg-decoration">
                <div className="blob-1"></div>
                <div className="blob-2"></div>
            </div>

            <div className="login-wrapper">
                <div className="login-card">
                    {/* Status Message */}
                    {status && (
                        <div className="status-message">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            {status}
                        </div>
                    )}

                    {/* Header */}
                    <div className="login-header">
                        <div className="logo-container">
                            <svg className="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor" />
                            </svg>
                        </div>
                        <h1>Selamat Datang</h1>
                        <p>Masuk ke akun kesehatan Anda untuk melanjutkan</p>
                    </div>

                    {/* Google Login Button */}
                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        disabled={isGoogleLoading || processing}
                        className="google-button"
                    >
                        {isGoogleLoading ? (
                            <>
                                <svg className="google-icon spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Memproses...</span>
                            </>
                        ) : (
                            <>
                                <svg className="google-icon" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                                <span>Lanjutkan dengan Google</span>
                            </>
                        )}
                    </button>

                    {/* Divider */}
                    <div className="divider-container">
                        <div className="divider-line"></div>
                        <div className="divider-text">Atau masuk dengan email</div>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={submit} className="login-form">
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
                                />
                            </div>
                            {errors.email && (
                                <div className="error-message">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18.101 12.93a1 1 0 00-1.414-1.414L10 14.586 5.313 9.899a1 1 0 00-1.414 1.414l5.5 5.5a1 1 0 001.414 0l8.5-8.5z" clipRule="evenodd" />
                                    </svg>
                                    {errors.email}
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
                                    autoComplete="current-password"
                                    placeholder="••••••••"
                                    onChange={(e) => setData('password', e.target.value)}
                                    style={{ width: '100%', paddingRight: '44px' }}
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
                            {errors.password && (
                                <div className="error-message">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18.101 12.93a1 1 0 00-1.414-1.414L10 14.586 5.313 9.899a1 1 0 00-1.414 1.414l5.5 5.5a1 1 0 001.414 0l8.5-8.5z" clipRule="evenodd" />
                                    </svg>
                                    {errors.password}
                                </div>
                            )}
                        </div>

                        {/* Remember & Forgot */}
                        <div className="form-footer">
                            <label className="remember-label">
                                <input
                                    type="checkbox"
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    style={{
                                        width: '18px',
                                        height: '18px',
                                        cursor: 'pointer',
                                        accentColor: 'var(--health-primary)',
                                    }}
                                />
                                <span>Ingat saya</span>
                            </label>

                            {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    className="forgot-link"
                                >
                                    Lupa password?
                                </Link>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="submit-button"
                        >
                            <div className="button-content">
                                {processing ? (
                                    <>
                                        <svg className="w-5 h-5 spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>Memproses...</span>
                                    </>
                                ) : (
                                    <span>Masuk</span>
                                )}
                            </div>
                        </button>
                    </form>

                    {/* Sign Up */}
                    <div className="signup-section">
                        <p className="signup-text">
                            Belum punya akun?{' '}
                            <Link
                                href={route('register')}
                                className="signup-link"
                            >
                                Daftar sekarang
                            </Link>
                        </p>
                    </div>

                    {/* Security Info */}
                    <div className="security-info">
                        <svg className="security-icon" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        <span>Login aman dengan enkripsi SSL 256-bit</span>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}