import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';
import { Shield, Lock, User, ArrowRight, Sparkles } from 'lucide-react';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login(username, password);
            navigate('/dashboard');
        } catch (err) {
            setError('ACCESS DENIED: INVALID CREDENTIALS');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#020617] relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] animate-pulse delay-700"></div>
            </div>

            <div className="w-full max-w-md p-10 bg-slate-900/40 backdrop-blur-2xl rounded-[40px] border border-white/5 shadow-2xl relative z-10 animate-in">
                <div className="flex flex-col items-center mb-10">
                    <div className="w-16 h-16 bg-primary/20 rounded-[20px] flex items-center justify-center mb-6 shadow-xl shadow-primary/20 border border-primary/20">
                        <Shield className="text-primary" size={32} />
                    </div>
                    <h2 className="text-3xl font-black tracking-tighter italic uppercase text-white">Security Protocol</h2>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.3em] mt-2">Initialize Session Gateway</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black p-4 rounded-2xl mb-8 text-center uppercase tracking-widest italic animate-bounce">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Identity Tag</label>
                        <div className="relative group">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={18} />
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full h-14 pl-12 pr-6 rounded-2xl border border-white/5 bg-white/5 focus:bg-white/10 focus:ring-2 ring-primary/20 transition-all outline-none font-bold text-sm text-white placeholder:text-slate-600"
                                placeholder="USERNAME"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Access Cipher</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={18} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full h-14 pl-12 pr-6 rounded-2xl border border-white/5 bg-white/5 focus:bg-white/10 focus:ring-2 ring-primary/20 transition-all outline-none font-bold text-sm text-white placeholder:text-slate-600"
                                placeholder="PASSWORD"
                                required
                            />
                        </div>
                    </div>

                    <div className="pt-4">
                        <Button type="submit" className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-widest shadow-xl shadow-primary/20 group transition-all">
                            Authorize Entry <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </div>

                    <div className="pt-6 border-t border-white/5 text-center space-y-4">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                            New Unit? <Link to="/register" className="text-primary hover:text-primary/80 transition-colors ml-1">Register Interface</Link>
                        </p>
                        <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-black text-slate-600 hover:text-white transition-colors uppercase tracking-[0.2em] pt-2">
                            <ArrowRight size={12} className="rotate-180" /> Back to Neural Node
                        </Link>
                    </div>
                </form>
            </div>

            {/* Bottom Footer Info */}
            <div className="absolute bottom-8 left-0 w-full text-center px-4">
                <div className="flex items-center justify-center gap-4 text-[9px] font-black text-slate-700 uppercase tracking-[0.4em]">
                    <span>Secure Node: 0xF29A</span>
                    <div className="w-1 h-1 bg-slate-800 rounded-full"></div>
                    <span>Encryption Active</span>
                    <div className="w-1 h-1 bg-slate-800 rounded-full"></div>
                    <span>v2.4.0-E</span>
                </div>
            </div>
        </div>
    );
};

export default Login;
