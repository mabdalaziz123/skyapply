import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff, Lock, User, Loader2, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(username, password);
            navigate('/admin', { replace: true });
        } catch (err: any) {
            setError(err.message || 'حدث خطأ، حاول مجدداً');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0a0f2e] via-[#111a45] to-[#0a0f2e] flex items-center justify-center p-4" dir="rtl">

            {/* Background decorative blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-red/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="relative w-full max-w-md"
            >
                {/* Card */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10 shadow-2xl">

                    {/* Logo */}
                    <div className="text-center mb-10">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                            className="w-16 h-16 bg-brand-red/20 border border-brand-red/30 rounded-2xl flex items-center justify-center mx-auto mb-5"
                        >
                            <ShieldCheck className="text-brand-red" size={32} />
                        </motion.div>
                        <h1 className="text-3xl font-black text-white mb-2">
                            <span className="text-brand-red">APPLY</span>
                            <span>SKY</span>
                        </h1>
                        <p className="text-white/50 text-sm font-medium">لوحة تحكم المدير</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Username */}
                        <div>
                            <label className="block text-white/70 text-sm font-bold mb-2">اسم المستخدم</label>
                            <div className="relative">
                                <User className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                                <input
                                    id="admin-username"
                                    type="text"
                                    value={username}
                                    onChange={e => setUsername(e.target.value)}
                                    placeholder="أدخل اسم المستخدم"
                                    required
                                    className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/25 rounded-xl py-3.5 pr-12 pl-4 focus:outline-none focus:border-brand-red/50 focus:ring-2 focus:ring-brand-red/20 transition-all text-right"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-white/70 text-sm font-bold mb-2">كلمة المرور</label>
                            <div className="relative">
                                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                                <input
                                    id="admin-password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="أدخل كلمة المرور"
                                    required
                                    className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/25 rounded-xl py-3.5 pr-12 pl-12 focus:outline-none focus:border-brand-red/50 focus:ring-2 focus:ring-brand-red/20 transition-all text-right"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-medium rounded-xl px-4 py-3 text-center"
                            >
                                ⚠️ {error}
                            </motion.div>
                        )}

                        {/* Submit Button */}
                        <button
                            id="login-submit"
                            type="submit"
                            disabled={loading}
                            className="w-full bg-brand-red hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-black py-4 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-brand-red/30 hover:-translate-y-0.5 flex items-center justify-center gap-3 text-lg mt-2"
                        >
                            {loading ? (
                                <><Loader2 className="animate-spin" size={22} /> جاري التحقق...</>
                            ) : (
                                'تسجيل الدخول'
                            )}
                        </button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;
