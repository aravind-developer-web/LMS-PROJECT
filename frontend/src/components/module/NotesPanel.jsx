import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Button } from '../ui/Button';
import { Save } from 'lucide-react';

const NotesPanel = ({ moduleId }) => {
    const [note, setNote] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState(null);

    useEffect(() => {
        fetchNotes();
    }, [moduleId]);

    const fetchNotes = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/notes/${moduleId}/`);
            setNote(response.data.content || '');
            setLastSaved(response.data.updated_at);
        } catch (error) {
            console.error("Failed to fetch notes", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            const response = await api.put(`/notes/${moduleId}/`, { content: note });
            setLastSaved(response.data.updated_at);
        } catch (error) {
            console.error("Failed to save note", error);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-[#030712]/40 backdrop-blur-3xl animate-in">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">Journal Node</h3>
                <Button
                    variant="ghost"
                    onClick={handleSave}
                    disabled={saving}
                    className="h-10 px-4 rounded-xl hover:bg-primary/20 hover:text-primary transition-all font-black uppercase tracking-widest text-[9px] border border-white/5"
                >
                    <Save size={14} className="mr-2" />
                    {saving ? 'Transmitting...' : 'Archive'}
                </Button>
            </div>
            <div className="flex-1 p-0">
                <textarea
                    className="w-full h-full p-8 resize-none bg-transparent focus:outline-none text-lg font-medium italic leading-relaxed text-white/80 placeholder:text-white/10"
                    placeholder="Enter architectural insights..."
                    value={loading ? 'Synchronizing Archive...' : note}
                    onChange={(e) => setNote(e.target.value)}
                    disabled={loading}
                />
            </div>
            <div className="p-4 border-t border-white/5 bg-white/[0.01] text-[9px] font-black text-white/20 uppercase tracking-widest text-center">
                {lastSaved ? `Last Neural Sync: ${new Date(lastSaved).toLocaleTimeString()}` : 'Buffer Empty'}
            </div>
        </div>
    );
};

export default NotesPanel;
