import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../components/ui/Card';
import { FileText, Send, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';

const AssignmentPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [module, setModule] = useState(null);
    const [submissionContent, setSubmissionContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [existingSubmissions, setExistingSubmissions] = useState([]);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [moduleRes, submissionRes] = await Promise.all([
                api.get(`/modules/${id}/`),
                api.get(`/assignments/modules/${id}/submissions/`).catch(() => ({ data: [] }))
            ]);
            setModule(moduleRes.data);
            setExistingSubmissions(submissionRes.data);
        } catch (error) {
            console.error("Failed to fetch assignment data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!submissionContent.trim()) {
            return;
        }

        try {
            setSubmitting(true);
            await api.post(`/assignments/modules/${id}/submit/`, {
                content: submissionContent
            });
            setSuccess(true);
        } catch (error) {
            console.error("Submission failed", error);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-primary font-black uppercase tracking-widest text-[10px]">Hydrating Knowledge Node...</p>
        </div>
    );

    if (!module || !module.assignment_prompt) return <div className="p-20 text-center font-black uppercase tracking-widest text-red-500">Assignment Protocols Missing</div>;

    if (success || existingSubmissions.length > 0) {
        const latestSubmission = success ? { content: submissionContent, submitted_at: new Date() } : existingSubmissions[0];
        return (
            <div className="max-w-4xl mx-auto py-20 px-4 animate-in">
                <Card className="glass-dark rounded-[48px] p-16 text-center border-green-500/10 shadow-3xl overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-full h-2 bg-green-500" />
                    <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-10 text-green-500">
                        <CheckCircle size={48} />
                    </div>
                    <CardTitle className="text-5xl font-black italic tracking-tighter uppercase mb-4">Intel Transmuted</CardTitle>
                    <p className="text-slate-400 text-xl font-medium mb-12 italic">Your research has been successfully archived in the Intelligence Vault.</p>
                    <div className="bg-black/40 p-10 rounded-[32px] border border-white/5 text-left mb-12">
                        <h4 className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] mb-6">Archive Preview</h4>
                        <div className="text-lg font-serif italic text-white/80 leading-relaxed">
                            "{latestSubmission.content}"
                        </div>
                    </div>
                    <Button onClick={() => navigate(`/modules/${id}`)} className="h-16 px-12 rounded-3xl bg-white text-black hover:bg-primary hover:text-white font-black uppercase tracking-widest text-[10px] shadow-2xl">
                        Return to Research Node
                    </Button>
                </Card>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto py-12 px-4 space-y-12 animate-in">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                <div>
                    <Button variant="ghost" onClick={() => navigate(`/modules/${id}`)} className="p-0 text-muted-foreground hover:text-primary font-black uppercase tracking-widest text-[10px] mb-4">
                        &larr; Abort Research
                    </Button>
                    <h1 className="text-5xl font-black italic tracking-tighter uppercase">{module.title}</h1>
                    <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mt-2">Intelligence Contribution Required</p>
                </div>
                <div className="bg-primary/10 border border-primary/20 px-6 py-2 rounded-full">
                    <span className="text-primary font-black text-[10px] uppercase tracking-widest italic flex items-center gap-2">
                        <Sparkles size={14} /> Global Rank Advancement Active
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-1">
                    <div className="glass-dark rounded-[40px] border-white/5 p-10 sticky top-24 space-y-8">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center text-primary border border-primary/20">
                                <AlertCircle size={24} />
                            </div>
                            <h3 className="text-xl font-black italic tracking-tighter uppercase leading-none">Protocols</h3>
                        </div>
                        <div className="text-lg text-slate-400 font-medium leading-relaxed italic border-l-2 border-primary/30 pl-6">
                            {module.assignment_prompt}
                        </div>
                        <div className="space-y-4 pt-4">
                            {[
                                "Complete lessons first",
                                "Maintain high structural precision",
                                "Await managerial validation"
                            ].map((text, i) => (
                                <div key={i} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-white/30">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary" /> {text}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2">
                    <form onSubmit={handleSubmit}>
                        <Card className="glass-dark rounded-[48px] border-white/5 overflow-hidden shadow-3xl group">
                            <div className="p-0 border-b border-white/5 bg-white/[0.02]">
                                <div className="p-10 flex justify-between items-center">
                                    <h3 className="text-xs font-black text-white/40 uppercase tracking-[0.4em]">Neural Workspace</h3>
                                    <div className="flex gap-1">
                                        {[1, 2, 3].map(i => <div key={i} className="w-2 h-2 rounded-full bg-white/5" />)}
                                    </div>
                                </div>
                            </div>
                            <div className="p-0">
                                <textarea
                                    value={submissionContent}
                                    onChange={(e) => setSubmissionContent(e.target.value)}
                                    placeholder="Enter your intellectual contribution..."
                                    className="w-full h-96 p-12 focus:outline-none bg-transparent resize-none text-xl font-medium leading-relaxed italic text-white/90 placeholder:text-white/10"
                                    disabled={submitting}
                                />
                            </div>
                            <div className="p-10 bg-white/[0.02] border-t border-white/5 flex justify-between items-center">
                                <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">
                                    {submissionContent.length} / Ω Characters
                                </div>
                                <Button
                                    type="submit"
                                    disabled={submitting || !submissionContent.trim()}
                                    className="h-16 px-12 rounded-[24px] bg-white text-black hover:bg-primary hover:text-white transition-all duration-500 font-black uppercase tracking-widest shadow-2xl group/btn"
                                >
                                    {submitting ? 'TRANSMITTING...' : <>Transmit Research <Send size={20} className="ml-3 group-hover/btn:rotate-12 group-hover/btn:translate-x-1 transition-transform" /></>}
                                </Button>
                            </div>
                        </Card>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AssignmentPage;
