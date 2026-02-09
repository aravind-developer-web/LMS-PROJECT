import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash } from 'lucide-react';

const AdminModuleList = () => {
    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchModules();
    }, []);

    const fetchModules = async () => {
        try {
            const response = await api.get('/modules/');
            setModules(response.data);
        } catch (error) {
            console.error("Failed to fetch modules", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this module?")) return;
        try {
            await api.delete(`/modules/${id}/`);
            fetchModules();
        } catch (error) {
            console.error("Failed to delete module", error);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Manage Modules</h1>
                <Button onClick={() => navigate('/admin/modules/create')}>
                    <Plus className="mr-2 h-4 w-4" /> Create New Module
                </Button>
            </div>

            <div className="grid gap-4">
                {modules.map(module => (
                    <Card key={module.id} className="flex justify-between items-center p-4">
                        <div>
                            <h3 className="font-semibold text-lg">{module.title}</h3>
                            <p className="text-sm text-muted-foreground">{module.description}</p>
                            <div className="flex gap-2 mt-1">
                                <span className="text-xs bg-secondary px-2 py-1 rounded-full">{module.difficulty}</span>
                                <span className="text-xs bg-secondary px-2 py-1 rounded-full">{module.duration} mins</span>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="ghost" size="icon" onClick={() => navigate(`/admin/modules/${module.id}/edit`)}>
                                <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDelete(module.id)}>
                                <Trash className="h-4 w-4" />
                            </Button>
                        </div>
                    </Card>
                ))}
                {modules.length === 0 && (
                    <div className="text-center p-8 text-muted-foreground">No modules found. Create one to get started.</div>
                )}
            </div>
        </div>
    );
};

export default AdminModuleList;
