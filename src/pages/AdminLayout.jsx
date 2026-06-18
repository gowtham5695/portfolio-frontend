import { useState } from 'react';
import { Outlet, NavLink, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { 
  LayoutDashboard, User, Code2, FolderGit2, GraduationCap, 
  Briefcase, Award, Mail, LogOut, Menu, X, ArrowLeft, Loader2,
  Layers, ClipboardList
} from 'lucide-react';

const AdminLayout = () => {
  const { admin, loading, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  // Route guarding
  if (loading) {
    return (
      <div className="min-h-screen bg-[#030014] flex flex-col items-center justify-center text-white">
        <Loader2 className="animate-spin text-violet-500 mb-4" size={40} />
        <p className="text-gray-400 text-sm font-medium tracking-wide">Validating session authority...</p>
      </div>
    );
  }

  if (!admin) {
    return <Navigate to="/admin/login" replace />;
  }

  const menuItems = [
    { name: 'Dashboard', path: 'dashboard', icon: <LayoutDashboard size={18} /> },
    { name: 'Profile & Bio', path: 'profile', icon: <User size={18} /> },
    { name: 'Skills', path: 'skills', icon: <Code2 size={18} /> },
    { name: 'Projects', path: 'projects', icon: <FolderGit2 size={18} /> },
    { name: 'Education', path: 'education', icon: <GraduationCap size={18} /> },
    { name: 'Certifications', path: 'certifications', icon: <Award size={18} /> },
    { name: 'Experience', path: 'experience', icon: <Briefcase size={18} /> },
    { name: 'Custom Sections', path: 'sections', icon: <Layers size={18} /> },
    { name: 'Job Tracker', path: 'tracker', icon: <ClipboardList size={18} /> },
    { name: 'Messages Inbox', path: 'messages', icon: <Mail size={18} /> },
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#02000c] text-white flex flex-col md:flex-row relative">
      
      {/* Mobile Top Navbar bar */}
      <div className="md:hidden flex justify-between items-center bg-[#07051a] px-6 py-4 border-b border-white/5 relative z-40">
        <div className="flex items-center gap-3">
          <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">Admin Control</span>
        </div>
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-gray-300 hover:text-white"
        >
          {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-[#050314] border-r border-white/5 flex flex-col justify-between py-6 px-4
        transform md:translate-x-0 transition-transform duration-300 ease-in-out md:static
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="space-y-8">
          <div className="flex justify-between items-center px-2">
            <h1 className="text-xl font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
              Portfolio Admin
            </h1>
            <button 
              onClick={() => navigate('/')}
              className="p-1 rounded bg-white/5 border border-white/10 hover:text-violet-400 text-gray-400 cursor-pointer"
              title="Return to Site"
            >
              <ArrowLeft size={16} />
            </button>
          </div>

          <nav className="flex flex-col gap-1.5">
            {menuItems.map((item) => (
              <NavLink
                key={item.name}
                to={`/admin/${item.path}`}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) => `
                  flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200
                  ${isActive 
                    ? 'bg-violet-600/20 text-violet-400 border-l-2 border-violet-500 shadow-md' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5 border-l-2 border-transparent'}
                `}
              >
                {item.icon}
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* User logout section */}
        <div className="pt-4 border-t border-white/5 space-y-3">
          <div className="flex items-center gap-3 px-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-violet-500/10 flex items-center justify-center text-xs font-bold text-violet-400 border border-violet-500/20">
              AD
            </div>
            <div className="text-xs">
              <p className="font-semibold text-white">{admin?.username || "Admin"}</p>
              <p className="text-gray-500">Authorized user</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Panel Content Area */}
      <main className="flex-1 overflow-x-hidden p-6 md:p-10 relative z-10 bg-[#030010] min-h-[calc(100vh-60px)] md:min-h-screen">
        <Outlet />
      </main>
      
    </div>
  );
};

export default AdminLayout;
