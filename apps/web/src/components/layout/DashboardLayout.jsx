import React from 'react';
import { Outlet, Link, useLocation } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../features/auth/hooks/useAuth';
import interviewService from '../../services/interview.service';
import Logo from '../ui/Logo';
import ThemeToggle from '../ui/ThemeToggle';

const SidebarContent = ({ latestId, user, handleLogout, location, onItemClick }) => (
    <>
        {/* Header Profile Layout */}
        <div className="flex items-center gap-sm mb-lg px-2">
            <div className="w-12 h-12 rounded-full border border-outline-variant flex items-center justify-center bg-primary-container text-on-primary-container text-xl font-bold">
                {user?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
                <h3 className="font-h3 text-[18px] font-bold text-on-surface">{user?.username || 'User'}</h3>
                <p className="font-body-sm text-body-sm text-secondary">Interview Ready</p>
                <span className="inline-block mt-1 bg-primary-fixed text-on-primary-fixed font-label-caps text-label-caps px-2 py-0.5 rounded-full">Pro Plan</span>
            </div>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col gap-2 flex-1">
            <Link to="/dashboard" onClick={onItemClick} className={`flex items-center gap-sm px-4 py-3 rounded-lg font-manrope text-sm font-medium hover:translate-x-1 duration-200 ${location.pathname === '/dashboard' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-r-4 border-blue-600' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900'}`}>
                <span className={`material-symbols-outlined text-[20px] ${location.pathname === '/dashboard' ? 'fill-icon' : ''}`} data-icon="grid_view" style={{ fontVariationSettings: location.pathname === '/dashboard' ? "'FILL' 1" : "'FILL' 0" }}>grid_view</span>
                Dashboard
            </Link>
            <Link to="/dashboard/analysis/new" onClick={onItemClick} className={`flex items-center gap-sm px-4 py-3 rounded-lg font-manrope text-sm font-medium hover:translate-x-1 duration-200 ${location.pathname === '/dashboard/analysis/new' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-r-4 border-blue-600' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900'}`}>
                <span className={`material-symbols-outlined text-[20px] ${location.pathname === '/dashboard/analysis/new' ? 'fill-icon' : ''}`} data-icon="troubleshoot" style={{ fontVariationSettings: location.pathname === '/dashboard/analysis/new' ? "'FILL' 1" : "'FILL' 0" }}>troubleshoot</span>
                Resume Analysis
            </Link>
            <Link to={latestId ? `/dashboard/questions/${latestId}` : '/dashboard/analysis/new'} onClick={onItemClick} className={`flex items-center gap-sm px-4 py-3 rounded-lg font-manrope text-sm font-medium hover:translate-x-1 duration-200 ${location.pathname.startsWith('/dashboard/questions') ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-r-4 border-blue-600' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900'}`}>
                <span className={`material-symbols-outlined text-[20px] ${location.pathname.startsWith('/dashboard/questions') ? 'fill-icon' : ''}`} data-icon="quiz" style={{ fontVariationSettings: location.pathname.startsWith('/dashboard/questions') ? "'FILL' 1" : "'FILL' 0" }}>quiz</span>
                Question Gen
            </Link>
            <Link to={latestId ? `/dashboard/prep-plan/${latestId}` : '/dashboard/analysis/new'} onClick={onItemClick} className={`flex items-center gap-sm px-4 py-3 rounded-lg font-manrope text-sm font-medium hover:translate-x-1 duration-200 ${location.pathname.startsWith('/dashboard/prep-plan') ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-r-4 border-blue-600' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900'}`}>
                <span className={`material-symbols-outlined text-[20px] ${location.pathname.startsWith('/dashboard/prep-plan') ? 'fill-icon' : ''}`} data-icon="checklist_rtl" style={{ fontVariationSettings: location.pathname.startsWith('/dashboard/prep-plan') ? "'FILL' 1" : "'FILL' 0" }}>checklist_rtl</span>
                Prep Plan
            </Link>
            <Link to="/dashboard/ats" onClick={onItemClick} className={`flex items-center gap-sm px-4 py-3 rounded-lg font-manrope text-sm font-medium hover:translate-x-1 duration-200 ${location.pathname === '/dashboard/ats' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-r-4 border-blue-600' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900'}`}>
                <span className={`material-symbols-outlined text-[20px] ${location.pathname === '/dashboard/ats' ? 'fill-icon' : ''}`} data-icon="architecture" style={{ fontVariationSettings: location.pathname === '/dashboard/ats' ? "'FILL' 1" : "'FILL' 0" }}>architecture</span>
                ATS Builder
            </Link>
        </div>

        {/* Bottom Settings */}
        <div className="mt-auto pt-4 border-t border-outline-variant flex flex-col gap-2">
            <Link to="/settings" onClick={onItemClick} className={`flex items-center gap-sm px-4 py-3 rounded-lg font-manrope text-sm font-medium hover:translate-x-1 duration-200 ${location.pathname === '/settings' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-r-4 border-blue-600' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900'}`}>
                <span className={`material-symbols-outlined text-[20px] ${location.pathname === '/settings' ? 'fill-icon' : ''}`} data-icon="settings" style={{ fontVariationSettings: location.pathname === '/settings' ? "'FILL' 1" : "'FILL' 0" }}>settings</span>
                Settings
            </Link>
            <button onClick={() => { handleLogout(); onItemClick?.(); }} className="flex items-center gap-sm px-4 py-3 rounded-lg text-error hover:bg-error-container hover:text-on-error-container font-manrope text-sm font-medium hover:translate-x-1 duration-200 w-full text-left">
                <span className="material-symbols-outlined text-[20px]" data-icon="logout">logout</span>
                Log out
            </button>
        </div>
    </>
);

const DashboardLayout = () => {
    const { user, handleLogout } = useAuth();
    const location = useLocation();
    const [latestId, setLatestId] = React.useState(null);
    const [profileOpen, setProfileOpen] = React.useState(false);
    const [sidebarOpen, setSidebarOpen] = React.useState(false);
    const profileRef = React.useRef(null);

    // Close dropdown when clicking outside
    React.useEffect(() => {
        const handleClickOutside = (e) => {
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    React.useEffect(() => {
        const fetchLatest = async () => {
            try {
                const data = await interviewService.getAllReports();
                if (data.interviewReports && data.interviewReports.length > 0) {
                    setLatestId(data.interviewReports[0]._id);
                }
            } catch (err) {
                console.error('Failed to fetch latest report', err);
            }
        };
        fetchLatest();
    }, [location.pathname]); // Refresh when navigating

    return (
        <div className="bg-background dark:bg-slate-900 text-on-background dark:text-slate-50 font-body-md text-body-md flex h-screen overflow-hidden antialiased transition-colors duration-200">
            {/* Desktop Sidebar */}
            <nav className="hidden md:flex flex-col h-full py-8 px-4 bg-slate-50 dark:bg-slate-950 w-72 rounded-r-lg border-r border-slate-200 dark:border-slate-800 shadow-xl shrink-0 z-20">
                <SidebarContent latestId={latestId} user={user} handleLogout={handleLogout} location={location} />
            </nav>

            {/* Mobile Sidebar (Drawer) */}
            <AnimatePresence>
                {sidebarOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSidebarOpen(false)}
                            className="fixed inset-0 bg-black/50 z-[60] md:hidden backdrop-blur-sm"
                        />
                        <motion.nav
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 left-0 w-72 bg-slate-50 dark:bg-slate-950 z-[70] md:hidden flex flex-col py-8 px-4 shadow-2xl"
                        >
                            <SidebarContent 
                                latestId={latestId} 
                                user={user} 
                                handleLogout={handleLogout} 
                                location={location} 
                                onItemClick={() => setSidebarOpen(false)} 
                            />
                        </motion.nav>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative pb-[80px] md:pb-0">
                {/* TopAppBar */}
                <header className="flex justify-between items-center w-full px-6 h-16 max-w-full docked full-width top-0 border-b border-slate-100 dark:border-slate-800 shadow-sm dark:shadow-none bg-white dark:bg-slate-900 font-manrope antialiased z-[50] shrink-0 sticky transition-colors duration-200">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => setSidebarOpen(true)}
                            className="md:hidden flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                            <span className="material-symbols-outlined text-slate-600 dark:text-slate-400">menu</span>
                        </button>
                        <Logo className="w-9 h-9" />
                    </div>
                    <div className="flex items-center gap-md">
                        {/* Search Input */}
                        <div className="hidden sm:flex relative">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary dark:text-slate-400 text-[20px]" data-icon="search">search</span>
                            <input className="pl-10 pr-4 py-2 bg-surface-container-low dark:bg-slate-800 border border-outline-variant dark:border-slate-700 rounded-full font-body-sm text-body-sm text-on-surface dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary w-64 transition-all placeholder:text-slate-500" placeholder="Search resources..." type="text"/>
                        </div>
                        {/* Theme Toggle */}
                        <ThemeToggle />
                        {/* Trailing Avatar with Dropdown */}
                        <div className="relative" ref={profileRef}>
                            <div
                                onClick={() => setProfileOpen(prev => !prev)}
                                className="w-9 h-9 rounded-full border border-surface-variant cursor-pointer hover:opacity-80 transition-opacity flex items-center justify-center bg-primary-container text-on-primary-container text-sm font-bold select-none"
                            >
                                {user?.username?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            {profileOpen && (
                                <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg py-2 z-50 animate-in fade-in">
                                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-50 truncate">{user?.username || 'User'}</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Signed in</p>
                                    </div>
                                    <button
                                        onClick={() => { setProfileOpen(false); handleLogout(); }}
                                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left"
                                    >
                                        <span className="material-symbols-outlined text-[18px]">logout</span>
                                        Log out
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Scrollable Dashboard Canvas */}
                <div className="flex-1 overflow-y-auto p-md md:p-gutter">
                    <Outlet />
                </div>
            </main>

            {/* BottomNavBar (Mobile Only) */}
            <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-safe pt-2 bg-white/80 dark:bg-slate-900/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] rounded-t-none font-manrope text-[10px] font-semibold uppercase tracking-wider">
                <Link to="/dashboard" className={`flex flex-col items-center justify-center rounded-xl px-3 py-1 scale-90 duration-150 ${location.pathname === '/dashboard' ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30' : 'text-slate-500 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-300'}`}>
                    <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: location.pathname === '/dashboard' ? "'FILL' 1" : "'FILL' 0" }}>dashboard</span>
                    <span className="mt-1">Home</span>
                </Link>
                <Link to="/dashboard/analysis/new" className={`flex flex-col items-center justify-center rounded-xl px-3 py-1 scale-90 duration-150 ${location.pathname === '/dashboard/analysis/new' ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30' : 'text-slate-500 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-300'}`}>
                    <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: location.pathname === '/dashboard/analysis/new' ? "'FILL' 1" : "'FILL' 0" }}>analytics</span>
                    <span className="mt-1">Analyze</span>
                </Link>
                <Link to={latestId ? `/dashboard/questions/${latestId}` : '/dashboard/analysis/new'} className={`flex flex-col items-center justify-center rounded-xl px-3 py-1 scale-90 duration-150 ${location.pathname.startsWith('/dashboard/questions') ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30' : 'text-slate-500 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-300'}`}>
                    <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: location.pathname.startsWith('/dashboard/questions') ? "'FILL' 1" : "'FILL' 0" }}>psychology</span>
                    <span className="mt-1">Questions</span>
                </Link>
                <Link to={latestId ? `/dashboard/prep-plan/${latestId}` : '/dashboard/analysis/new'} className={`flex flex-col items-center justify-center rounded-xl px-3 py-1 scale-90 duration-150 ${location.pathname.startsWith('/dashboard/prep-plan') ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30' : 'text-slate-500 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-300'}`}>
                    <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: location.pathname.startsWith('/dashboard/prep-plan') ? "'FILL' 1" : "'FILL' 0" }}>event_note</span>
                    <span className="mt-1">Plan</span>
                </Link>
                <Link to="/dashboard/ats" className={`flex flex-col items-center justify-center rounded-xl px-3 py-1 scale-90 duration-150 ${location.pathname === '/dashboard/ats' ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30' : 'text-slate-500 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-300'}`}>
                    <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: location.pathname === '/dashboard/ats' ? "'FILL' 1" : "'FILL' 0" }}>edit_document</span>
                    <span className="mt-1">Builder</span>
                </Link>

            </nav>
        </div>
    );
};

export default DashboardLayout;
