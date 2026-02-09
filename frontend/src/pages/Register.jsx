import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';
import { Shield, User, Mail, Lock, ArrowRight, UserCheck, Briefcase } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        role: 'learner'
    });
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await register(formData);
            navigate('/login');
        } catch (err) {
            setError('REGISTRATION FAILED: IDENTITY CONFLICT');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#020617] relative overflow-hidden py-12">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px]"></div>
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[150px]"></div>
            </div>

            <div className="w-full max-w-xl p-10 bg-slate-1000/40 backdrop-blur-2xl rounded-[48px] border border-white/5 shadow-3xl relative z-10 animate-in">
                <div className="text-center mb-10">
                    <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/10 shadow-lg">
                        <UserCheck className="text-primary" size={28} />
                    </div>
                    <h2 className="text-3xl font-black tracking-tighter italic uppercase text-white">Identity Creation</h2>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mt-3">Register your personnel node</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black p-4 rounded-2xl mb-8 text-center uppercase tracking-widest italic animate-bounce">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">First Command</label>
                            <input
                                name="first_name"
                                type="text"
                                value={formData.first_name}
                                onChange={handleChange}
                                className="w-full h-14 px-6 rounded-2xl border border-white/5 bg-white/5 focus:bg-white/10 focus:ring-2 ring-primary/20 transition-all outline-none font-bold text-sm text-white placeholder:text-slate-600"
                                placeholder="GIVEN NAME"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Last Command</label>
                            <input
                                name="last_name"
                                type="text"
                                value={formData.last_name}
                                onChange={handleChange}
                                className="w-full h-14 px-6 rounded-2xl border border-white/5 bg-white/5 focus:bg-white/10 focus:ring-2 ring-primary/20 transition-all outline-none font-bold text-sm text-white placeholder:text-slate-600"
                                placeholder="SURNAME"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Identity Tag (Unique)</label>
                        <div className="relative group">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={18} />
                            <input
                                name="username"
                                type="text"
                                value={formData.username}
                                onChange={handleChange}
                                className="w-full h-14 pl-12 pr-6 rounded-2xl border border-white/5 bg-white/5 focus:bg-white/10 focus:ring-2 ring-primary/20 transition-all outline-none font-bold text-sm text-white placeholder:text-slate-600"
                                placeholder="USERNAME"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Intel Link (Email)</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={18} />
                            <input
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full h-14 pl-12 pr-6 rounded-2xl border border-white/5 bg-white/5 focus:bg-white/10 focus:ring-2 ring-primary/20 transition-all outline-none font-bold text-sm text-white placeholder:text-slate-600"
                                placeholder="PERS@CORP.COM"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Master Cipher</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={18} />
                            <input
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full h-14 pl-12 pr-6 rounded-2xl border border-white/5 bg-white/5 focus:bg-white/10 focus:ring-2 ring-primary/20 transition-all outline-none font-bold text-sm text-white placeholder:text-slate-600"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-4 pt-4">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Deployment Role</label>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, role: 'learner' })}
                                className={`flex items-center justify-center gap-3 h-14 rounded-2xl border transition-all ${formData.role === 'learner' ? 'bg-primary/20 border-primary text-primary' : 'bg-white/5 border-white/5 text-slate-500 hover:bg-white/10'}`}
                            >
                                <UserCheck size={18} />
                                <span className="font-black text-xs uppercase tracking-widest">Learner</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, role: 'manager' })}
                                className={`flex items-center justify-center gap-3 h-14 rounded-2xl border transition-all ${formData.role === 'manager' ? 'bg-blue-600/20 border-blue-600 text-blue-400' : 'bg-white/5 border-white/5 text-slate-500 hover:bg-white/10'}`}
                            >
                                <Briefcase size={18} />
                                <span className="font-black text-xs uppercase tracking-widest">Manager</span>
                            </button>
                        </div>
                    </div>

                    <div className="pt-6">
                        <Button type="submit" className="w-full h-16 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary/30 group">
                            Establish Connection <ArrowRight size={20} className="ml-3 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </div>

                    <div className="text-center pt-8 border-t border-white/5 space-y-4">
                        <p className="text-xs font-bold text-slate-600 uppercase tracking-widest">
                            Authorized Already? <Link to="/login" className="text-primary hover:text-primary/80 transition-colors ml-2">Session Login</Link>
                        </p>
                        <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-black text-slate-600 hover:text-white transition-colors uppercase tracking-[0.2em] pt-2">
                            <ArrowRight size={12} className="rotate-180" /> Back to Neural Node
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
