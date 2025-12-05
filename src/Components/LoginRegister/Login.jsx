import { useContext, useState } from 'react';
import { FaGoogle, FaSignInAlt, FaUser, FaLock } from 'react-icons/fa';
import { AuthContext } from '../../Contexts/AuthContext';
import { useNavigate } from 'react-router';

const Login = () => {
    const { signInUser, signInWithGoogle } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
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
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative">
            <div className="absolute inset-0 overflow-hidden z-0">
                <div className="absolute -top-40 -left-40 w-80 h-80 bg-[#A45CFF] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                <div className="absolute top-20 -right-20 w-80 h-80 bg-[#7ED8FF] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-20 left-1/2 w-80 h-80 bg-[#FF8FA0] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
            </div>

            <div className="relative w-full max-w-md z-10">
                <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 overflow-hidden">
                    <div className="p-8">
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-[#A45CFF] to-[#7ED8FF] mb-4">
                                <FaSignInAlt className="text-white text-2xl" />
                            </div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#A45CFF] to-[#FF8FA0] bg-clip-text text-transparent">
                                Welcome Back
                            </h1>
                            <p className="text-gray-600 mt-2">Sign in to your Clubify account</p>
                        </div>

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
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A45CFF] focus:border-[#A45CFF] transition-all duration-200 bg-white/50 backdrop-blur-sm"
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
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A45CFF] focus:border-[#A45CFF] transition-all duration-200 bg-white/50 backdrop-blur-sm"
                                        placeholder="Enter your password"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Forgot Password */}
                            <div className="flex justify-end">
                                <a href="#" className="text-sm text-[#A45CFF] hover:text-[#7b3db4] font-medium transition-colors">
                                    Forgot password?
                                </a>
                            </div>

                            {/* Login Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-[#A45CFF] to-[#7ED8FF] text-white py-3 px-4 rounded-lg font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
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
                                className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-all duration-200 hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                <FaGoogle className="text-red-500" size={20} />
                                Sign in with Google
                            </button>
                        </form>

                        {/* Registration Link */}
                        <div className="mt-8 text-center">
                            <p className="text-gray-600">
                                Don't have an account?{' '}
                                <a
                                    href="/register"
                                    className="text-[#A45CFF] font-semibold hover:text-[#7b3db4] transition-colors"
                                >
                                    Join Clubify Now
                                </a>
                            </p>
                        </div>
                    </div>
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



