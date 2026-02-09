import React, { useState } from 'react';
import { Outlet, Link, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
    LayoutDashboard,
    BookOpen,
    MessageSquare,
    BarChart3,
    LogOut,
    Menu,
    X,
    User,
    Settings,
    ChevronRight,
    Search,
    Sparkles
} from 'lucide-react';
import NeuralOracle from '../ai/NeuralOracle';

const SidebarLink = ({ to, icon: Icon, label, active, collapsed }) => (
    <Link
        to={to}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${active
            ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
            : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
            }`}
    >
        <Icon size={20} className={active ? '' : 'group-hover:scale-110 transition-transform'} />
        {!collapsed && <span className="font-medium">{label}</span>}
        {active && !collapsed && <ChevronRight size={16} className="ml-auto opacity-50" />}
    </Link>
);

const Layout = () => {
    const { user, logout, loading } = useAuth();
    const [collapsed, setCollapsed] = useState(false);
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    const isManager = user?.role === 'manager' || user?.role === 'admin';

    return (
        <div className="min-h-screen bg-background flex text-foreground overflow-hidden">
            {/* Sidebar */}
            <aside
                className={`hidden md:flex flex-col border-r border-border bg-card transition-all duration-300 relative z-20 ${collapsed ? 'w-20' : 'w-72'
                    }`}
            >
                <div className="p-6 flex items-center justify-between">
                    {!collapsed && (
                        <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
                                <BookOpen size={18} />
                            </div>
                            <span>LMS Enterprise</span>
                        </div>
                    )}
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="p-2 hover:bg-secondary rounded-lg text-muted-foreground transition-colors mx-auto"
                    >
                        {collapsed ? <Menu size={20} /> : <X size={20} />}
                    </button>
                </div>

                <div className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto">
                    {isManager ? (
                        <div className="py-4 space-y-2">
                            {!collapsed && <p className="px-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Command Center</p>}
                            <SidebarLink
                                to="/dashboard/learning"
                                icon={LayoutDashboard}
                                label="Personal Node"
                                active={location.pathname === '/dashboard/learning' || (location.pathname === '/dashboard' && user.role !== 'manager')}
                                collapsed={collapsed}
                            />
                            <SidebarLink
                                to="/dashboard/analytics"
                                icon={BarChart3}
                                label="Team Analytics"
                                active={location.pathname === '/dashboard/analytics' || (location.pathname === '/dashboard' && user.role === 'manager')}
                                collapsed={collapsed}
                            />
                            <div className="pt-4">
                                {!collapsed && <p className="px-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Vault</p>}
                                <SidebarLink
                                    to="/my-notes"
                                    icon={MessageSquare}
                                    label="Neural Notes"
                                    active={location.pathname === '/my-notes'}
                                    collapsed={collapsed}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="py-4 space-y-2">
                            {!collapsed && <p className="px-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Intelligence</p>}
                            <SidebarLink
                                to="/dashboard"
                                icon={LayoutDashboard}
                                label="Dashboard"
                                active={location.pathname === '/dashboard'}
                                collapsed={collapsed}
                            />
                            <SidebarLink
                                to="/my-notes"
                                icon={MessageSquare}
                                label="Personal Notes"
                                active={location.pathname === '/my-notes'}
                                collapsed={collapsed}
                            />
                        </div>
                    )}
                </div>

                {/* User Section */}
                <div className="p-4 border-t border-border mt-auto bg-muted/20">
                    <div className={`flex items-center gap-3 p-3 rounded-xl bg-card border border-border ${collapsed ? 'justify-center' : ''}`}>
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                            <User size={20} />
                        </div>
                        {!collapsed && (
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold truncate">{user.username}</p>
                                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">{user.role}</p>
                            </div>
                        )}
                        {!collapsed && (
                            <button onClick={logout} className="p-2 text-muted-foreground hover:text-destructive transition-colors">
                                <LogOut size={18} />
                            </button>
                        )}
                    </div>
                    {collapsed && (
                        <button onClick={logout} className="w-full mt-2 p-3 text-muted-foreground hover:text-destructive transition-colors flex justify-center">
                            <LogOut size={18} />
                        </button>
                    )}
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Mobile Header */}
                <header className="md:hidden border-b border-border p-4 flex justify-between items-center bg-card">
                    <div className="flex items-center gap-2 font-bold">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
                            <BookOpen size={18} />
                        </div>
                        <span>LMS</span>
                    </div>
                    <button className="p-2 bg-secondary rounded-lg">
                        <Menu size={20} />
                    </button>
                </header>

                <div className="flex-1 overflow-y-auto p-4 md:p-8 animate-in">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </div>
            </main>

            {/* Neural Oracle for Learners */}
            {!isManager && <NeuralOracle />}
        </div>
    );
};

export default Layout;
