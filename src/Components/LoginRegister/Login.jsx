import { useContext, useState } from 'react';
import { FaGoogle, FaSignInAlt, FaUser, FaLock, FaUserPlus } from 'react-icons/fa';
import { AuthContext } from '../../Contexts/AuthContext';
import { useNavigate } from 'react-router';

const Login = () => {
    const { signInUser, signInWithGoogle, createUser } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [isLogin, setIsLogin] = useState(true);
    const navigate = useNavigate();

    const handleEmailLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setShowSuccess(false);
        const form = e.target;
        const email = form.email.value.trim();
        const password = form.password.value;

        try {
            await signInUser(email, password);
            setShowSuccess(true);
            toast.success('Logged in successfully.');
            setTimeout(() => navigate('/'), 2000);
        } catch (err) {
            toast.error(err.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setShowSuccess(false);
        const form = e.target;
        const email = form.email.value.trim();
        const password = form.password.value;
        const name = form.name.value;

        try {
            await createUser(email, password);
            setShowSuccess(true);
            toast.success('Account created successfully!');

            // After registration, you might want to auto-login or redirect to login
            setTimeout(() => {
                setIsLogin(true);
            }, 2000);
        } catch (err) {
            toast.error(err.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        setShowSuccess(false);
        try {
            await signInWithGoogle();
            toast.success('Logged in successfully.');
            setTimeout(() => navigate('/'), 2000);
        } catch (err) {
            toast.error(err.message || 'Google login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden z-0">
                <div className="absolute -top- -left-40 w-80 h-80 bg-[#A45CFF] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                <div className="absolute top-20 -right-20 w-80 h-80 bg-[#7ED8FF] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-20 left-1/2 w-80 h-80 bg-[#FF8FA0] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
            </div>

            {/* Toggle Buttons */}
            <div className="absolute top-10 left-1/2 transform -translate-x-1/2 z-20">
                <div className="relative flex bg-white/20 backdrop-blur-md rounded-full p-1 border border-white/30 shadow-lg">
                    <button
                        onClick={() => setIsLogin(true)}
                        className={`px-6 py-3 rounded-full font-semibold transition-all duration-500 relative z-10 ${
                            isLogin
                                ? 'text-white bg-gradient-to-r from-[#A45CFF] to-[#7ED8FF]'
                                : 'text-gray-700 hover:text-gray-900'
                        }`}
                    >
                        <div className="flex items-center justify-center gap-2">
                            <FaSignInAlt /> Login
                        </div>
                    </button>
                    <button
                        onClick={() => setIsLogin(false)}
                        className={`px-6 py-3 rounded-full font-semibold transition-all duration-500 relative z-10 ${
                            !isLogin
                                ? 'text-white bg-gradient-to-r from-[#A45CFF] to-[#7ED8FF]'
                                : 'text-gray-700 hover:text-gray-900'
                        }`}
                    >
                        <div className="flex items-center justify-center gap-2">
                            <FaUserPlus /> Register
                        </div>
                    </button>
                    {/* Animated Indicator */}
                    <div
                        className={` ${
                            isLogin ? 'translate-x-0' : 'translate-x-full'
                        }`}
                        style={{ boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}
                    ></div>
                </div>
            </div>

            <div className="relative w-full max-w-md z-10 mt-16">
                {/* Login Form */}
                <div
                    className={`transition-all duration-700 ease-in-out transform ${
                        isLogin ? 'opacity-100 scale-100' : 'opacity-0 scale-95 absolute'
                    } ${isLogin ? '' : 'h-0 overflow-hidden w-full'}`}
                    style={{ transition: 'all 0.7s cubic-bezier(0.25, 0.1, 0.25, 1)' }}
                >
                    <div className="space-y-5">
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-[#A45CFF] to-[#7ED8FF] mb-4 shadow-lg">
                                <FaSignInAlt className="text-white text-2xl" />
                            </div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#A45CFF] to-[#FF8FA0] bg-clip-text text-transparent">
                                Welcome Back To Clubify!
                            </h1>
                            <p className="text-gray-600 text-sm mt-1">Sign in to your Clubify account</p>
                        </div>

                        <div className="bg-white/60 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/30">
                            <form onSubmit={handleEmailLogin} className="space-y-6">
                                {/* Email Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FaUser className="text-gray-400" />
                                        </div>
                                        <input
                                            name="email"
                                            type="email"
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#A45CFF] focus:border-[#A45CFF] transition-all duration-300 bg-white/50 backdrop-blur-sm"
                                            placeholder="Enter your email"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Password Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FaLock className="text-gray-400" />
                                        </div>
                                        <input
                                            name="password"
                                            type="password"
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#A45CFF] focus:border-[#A45CFF] transition-all duration-300 bg-white/50 backdrop-blur-sm"
                                            placeholder="Enter your password"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Forgot Password */}
                                <div className="flex">
                                    <a href="#" className="text-sm text-[#A45CFF] hover:text-[#7b3db4] hover:underline font-medium transition-colors">
                                        Forgot password?
                                    </a>
                                </div>

                                {/* Login Button */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-gradient-to-r from-[#A45CFF] to-[#7ED8FF] text-white py-3 px-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                                >
                                    {loading ? (
                                        <div className="flex items-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Signing in...
                                        </div>
                                    ) : (
                                        'Sign In to Clubify'
                                    )}
                                </button>

                                {/* Divider */}
                                <div className="flex items-center my-6">
                                    <div className="flex-grow border-t border-gray-300"></div>
                                    <span className="mx-4 text-gray-500 text-sm">or continue with</span>
                                    <div className="flex-grow border-t border-gray-300"></div>
                                </div>

                                {/* Google Sign In */}
                                <button
                                    type="button"
                                    onClick={handleGoogleLogin}
                                    disabled={loading}
                                    className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-xl text-[#A45CFF] font-medium hover:bg-gray-50 transition-all duration-300 hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    <FaGoogle className="text-[#A45CFF]" size={25} />
                                    Sign in with Google
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Register Form */}
                <div
                    className={`transition-all duration-700 ease-in-out transform ${
                        !isLogin ? 'opacity-100 scale-100' : 'opacity-0 scale-95 absolute'
                    } ${!isLogin ? '' : 'h-0 overflow-hidden w-full'}`}
                    style={{ transition: 'all 0.7s cubic-bezier(0.25, 0.1, 0.25, 1)' }}
                >
                    <div className="space-y-3">
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center mt-5 w-16 h-16 rounded-full bg-gradient-to-r from-[#A45CFF] to-[#7ED8FF] mb-4 shadow-lg">
                                <FaUserPlus className="text-white text-2xl" />
                            </div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#A45CFF] to-[#FF8FA0] bg-clip-text text-transparent">
                                Join Clubify!
                            </h1>
                            <p className="text-gray-600 text-sm mt-1">Create your account to get started</p>
                        </div>

                        <div className="bg-white/60 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/30">
                            <form onSubmit={handleRegister} className="space-y-6">
                                {/* Name Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FaUser className="text-gray-400" />
                                        </div>
                                        <input
                                            name="name"
                                            type="text"
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#A45CFF] focus:border-[#A45CFF] transition-all duration-300 bg-white/50 backdrop-blur-sm"
                                            placeholder="Enter your name"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Email Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FaUser className="text-gray-400" />
                                        </div>
                                        <input
                                            name="email"
                                            type="email"
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#A45CFF] focus:border-[#A45CFF] transition-all duration-300 bg-white/50 backdrop-blur-sm"
                                            placeholder="Enter your email"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Password Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FaLock className="text-gray-400" />
                                        </div>
                                        <input
                                            name="password"
                                            type="password"
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#A45CFF] focus:border-[#A45CFF] transition-all duration-300 bg-white/50 backdrop-blur-sm"
                                            placeholder="Create a password"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Register Button */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-gradient-to-r from-[#A45CFF] to-[#7ED8FF] text-white py-3 px-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                                >
                                    {loading ? (
                                        <div className="flex items-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Creating account...
                                        </div>
                                    ) : (
                                        'Create Account'
                                    )}
                                </button>

                                {/* Divider */}
                                <div className="flex items-center my-6">
                                    <div className="flex-grow border-t border-gray-300"></div>
                                    <span className="mx-4 text-gray-500 text-sm">or</span>
                                    <div className="flex-grow border-t border-gray-300"></div>
                                </div>

                                {/* Google Sign Up */}
                                <button
                                    type="button"
                                    onClick={handleGoogleLogin}
                                    disabled={loading}
                                    className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-xl text-[#A45CFF] font-medium hover:bg-gray-50 transition-all duration-300 hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    <FaGoogle className="text-[#A45CFF]" size={25} />
                                    Sign up with Google
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Bottom Link */}
                <div className="mt-8 text-center">
                    <p className="text-gray-600 text-sm">
                        {isLogin ? 'New to Clubify? ' : 'Already have an account? '}
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-[#A45CFF] font-semibold hover:underline transition-colors"
                        >
                            {isLogin ? 'Join Now' : 'Sign In'}
                        </button>
                    </p>
                </div>
            </div>

            <style jsx>{`
                @keyframes blob {
                    0% {
                        transform: translate(0px, 0px) scale(1);
                    }
                    33% {
                        transform: translate(30px, -50px) scale(1.1);
                    }
                    66% {
                        transform: translate(-20px, 20px) scale(0.9);
                    }
                    100% {
                        transform: translate(0px, 0px) scale(1);
                    }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
            `}</style>
        </div>
    );
};

const toast = (type, message) => {
    let container = document.querySelector('.toast-container') || createToastContainer();
    const el = document.createElement('div');
    el.className = `alert alert-${type} shadow-lg p-3 rounded-md mb-2 max-w-xs`;
    el.innerHTML = `<span>${message}</span>`;
    container.appendChild(el);
    setTimeout(() => el.remove(), 3000);
};

toast.success = (msg) => toast('success', msg);
toast.error = (msg) => toast('error', msg);

const createToastContainer = () => {
    const div = document.createElement('div');
    div.className = 'toast-container fixed top-20 right-4 z-[1000] space-y-2';
    document.body.appendChild(div);
    return div;
};

export default Login;



