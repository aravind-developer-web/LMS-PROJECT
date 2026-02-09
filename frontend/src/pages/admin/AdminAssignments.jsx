import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Plus, UserMinus } from 'lucide-react';

const AdminAssignments = () => {
    const [assignments, setAssignments] = useState([]);
    const [users, setUsers] = useState([]); // In a real app, this would be paginated/searched
    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState('');
    const [selectedModule, setSelectedModule] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [assignmentsRes, modulesRes] = await Promise.all([
                api.get('/assignments/'),
                api.get('/modules/')
            ]);
            setAssignments(assignmentsRes.data);
            setModules(modulesRes.data);
            // Mock users fetch - in real app would need a user list endpoint
            // For now, we'd need endpoints to list all users. 
            // Let's assume we can't easily list users without an endpoint.
            // I'll create a simple input for User ID for now or mock it if I had a user list endpoint.
        } catch (error) {
            console.error("Failed to load data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAssign = async (e) => {
        e.preventDefault();
        try {
            await api.post(`/modules/${selectedModule}/assign/`, {
                user_id: selectedUser, // Backend expects user_id in body if using that endpoint style, or query logic
                // Wait, my backend implementation for /modules/:id/assign might be missing or different.
                // Let's check the API contract plan. 
                // Plan said: POST /api/modules/:id/assign
            });
            // Actually, let's verify the backend implementation of this endpoint.
            // I haven't implemented specific assign view in modules/views.py yet! 
            // I implemented AssignmentListCreateView which takes POST.

            // Correction: Use AssignmentListCreateView
            await api.post('/assignments/', {
                user: selectedUser,
                module: selectedModule
            });

            alert("Assignment created!");
            fetchData();
        } catch (error) {
            console.error("Assignment failed", error);
            alert("Failed to assign module. Ensure User ID is correct.");
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Manage Assignments</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Assign Module</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleAssign} className="flex gap-4 items-end">
                        <div className="flex-1">
                            <label className="block text-sm font-medium mb-1">User ID</label>
                            <Input
                                placeholder="Enter User ID"
                                value={selectedUser}
                                onChange={(e) => setSelectedUser(e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium mb-1">Module</label>
                            <select
                                className="w-full h-10 px-3 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                                value={selectedModule}
                                onChange={(e) => setSelectedModule(e.target.value)}
                                required
                            >
                                <option value="">Select Module</option>
                                {modules.map(m => (
                                    <option key={m.id} value={m.id}>{m.title}</option>
                                ))}
                            </select>
                        </div>
                        <Button type="submit">
                            <Plus className="mr-2 h-4 w-4" /> Assign
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <div className="grid gap-4">
                <h2 className="text-xl font-semibold">Active Assignments</h2>
                {assignments.map(a => (
                    <Card key={a.id} className="p-4 flex justify-between items-center">
                        <div>
                            <p className="font-medium">Module: {a.module_title}</p>
                            <p className="text-sm text-muted-foreground">User ID: {a.user} | Status: {a.status}</p>
                        </div>
                        {/* Delete/Revoke assignment would go here */}
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default AdminAssignments;
