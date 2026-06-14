import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import portfolioService from '../services/portfolioService';
import { FolderGit2, Code2, Briefcase, GraduationCap, Mail, Loader2, ArrowRight } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    projects: 0,
    skills: 0,
    experience: 0,
    education: 0,
    messages: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [proj, sk, exp, edu, msg] = await Promise.all([
          portfolioService.getProjects(),
          portfolioService.getSkills(),
          portfolioService.getExperience(),
          portfolioService.getEducation(),
          portfolioService.getMessages()
        ]);
        setStats({
          projects: proj.length,
          skills: sk.length,
          experience: exp.length,
          education: edu.length,
          messages: msg.slice(0, 3) // Get top 3 recent messages
        });
      } catch (err) {
        console.error("Failed to load dashboard statistics:", err);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="h-96 flex flex-col justify-center items-center">
        <Loader2 className="animate-spin text-violet-500 mb-2" size={32} />
        <p className="text-gray-400 text-sm">Gathering performance metrics...</p>
      </div>
    );
  }

  const statCards = [
    { label: 'Projects Built', value: stats.projects, icon: <FolderGit2 size={24} className="text-cyan-400" />, path: '/admin/projects' },
    { label: 'Skills Added', value: stats.skills, icon: <Code2 size={24} className="text-violet-400" />, path: '/admin/skills' },
    { label: 'Experiences', value: stats.experience, icon: <Briefcase size={24} className="text-fuchsia-400" />, path: '/admin/experience' },
    { label: 'Education Cards', value: stats.education, icon: <GraduationCap size={24} className="text-emerald-400" />, path: '/admin/education' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-3xl font-extrabold text-white">System Dashboard</h2>
        <p className="text-gray-400 text-sm mt-1">Quick summary of your portfolio sections and visitor feedback.</p>
      </div>

      {/* Grid of Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((item, idx) => (
          <Link 
            key={idx}
            to={item.path}
            className="glass-panel p-6 rounded-xl border border-white/5 flex items-center justify-between hover:border-violet-500/20 hover:shadow-violet-500/5 transition-all duration-300"
          >
            <div>
              <div className="text-3xl font-extrabold text-white mb-1">{item.value}</div>
              <div className="text-gray-400 text-sm font-medium">{item.label}</div>
            </div>
            <div className="p-3 bg-white/5 rounded-lg">
              {item.icon}
            </div>
          </Link>
        ))}
      </div>

      {/* Grid for Quick Activities */}
      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* Contact Form Mail Activity */}
        <div className="lg:col-span-8 glass-panel p-6 rounded-xl border border-white/5 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6 pb-3 border-b border-white/5">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Mail size={18} className="text-violet-400" /> Recent Inquiries
              </h3>
              <Link to="/admin/messages" className="text-violet-400 hover:text-violet-300 text-xs font-semibold flex items-center gap-1">
                View All <ArrowRight size={12} />
              </Link>
            </div>

            {stats.messages.length === 0 ? (
              <div className="text-center py-10 text-gray-500 text-sm">
                No inquiries received in your inbox.
              </div>
            ) : (
              <div className="space-y-4">
                {stats.messages.map((msg) => (
                  <div 
                    key={msg.id}
                    className="p-4 rounded-lg bg-white/3 border border-white/5 space-y-1.5"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-white">{msg.name}</span>
                      <span className="text-xs text-gray-500">{new Date(msg.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="text-xs text-violet-400">{msg.email}</p>
                    <p className="text-gray-400 text-xs line-clamp-2 leading-relaxed">
                      {msg.message}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Short Documentation */}
        <div className="lg:col-span-4 glass-panel p-6 rounded-xl border border-white/5 space-y-6">
          <h3 className="text-lg font-bold text-white pb-3 border-b border-white/5">Quick Guide</h3>
          <ul className="space-y-4 text-xs text-gray-400 leading-relaxed">
            <li>
              <strong className="text-gray-200">1. Hero & Bio</strong>: Fill in your tags (comma-separated lists) to update the typing slider effects.
            </li>
            <li>
              <strong className="text-gray-200">2. External Asset Links</strong>: Link project and certification credentials directly to cloud paths (Cloudinary, Drive, Dropbox, etc.).
            </li>
            <li>
              <strong className="text-gray-200">3. Lucide Icons</strong>: Use valid Lucide camel-case strings (e.g. Code, Server, Layout, Database, Award) for custom rendering.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
