import React, { useState, useEffect } from 'react';
import portfolioService from '../services/portfolioService';
import { Plus, Trash2, CheckCircle, AlertCircle, Loader2, Code } from 'lucide-react';
import * as Icons from 'lucide-react';

const DynamicIcon = ({ name, size = 16, className }) => {
  const IconComponent = Icons[name] || Icons.Code;
  return <IconComponent size={size} className={className} />;
};

const SkillsManagement = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Frontend',
    level: 90,
    icon: 'Code'
  });
  
  const [status, setStatus] = useState({ submitting: false, success: false, error: null });

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    try {
      const data = await portfolioService.getSkills();
      setSkills(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'level' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) return;

    setStatus({ submitting: true, success: false, error: null });
    try {
      const newSkill = await portfolioService.addSkill(formData);
      setSkills(prev => [...prev, newSkill]);
      setFormData({ name: '', category: 'Frontend', level: 90, icon: 'Code' });
      setStatus({ submitting: false, success: true, error: null });
      setTimeout(() => setStatus(prev => ({ ...prev, success: false })), 3000);
    } catch (err) {
      console.error(err);
      setStatus({ submitting: false, success: false, error: "Failed to add skill." });
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this skill?")) return;

    try {
      await portfolioService.deleteSkill(id);
      setSkills(prev => prev.filter(sk => sk.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete skill.");
    }
  };

  if (loading) {
    return (
      <div className="h-96 flex flex-col justify-center items-center">
        <Loader2 className="animate-spin text-violet-500 mb-2" size={32} />
        <p className="text-gray-400 text-sm">Loading skills inventory...</p>
      </div>
    );
  }

  // Group skills by category for organized listing
  const groupedSkills = skills.reduce((acc, skill) => {
    const cat = skill.category || "General";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});

  return (
    <div className="space-y-8 max-w-5xl animate-fade-in">
      <div>
        <h2 className="text-3xl font-extrabold text-white">Skills Management</h2>
        <p className="text-gray-400 text-sm mt-1">Configure your programmer competencies and levels.</p>
      </div>

      {/* Add Skill Form */}
      <div className="glass-panel p-6 rounded-xl border border-white/5 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Plus size={18} className="text-violet-400" /> Add New Skill
        </h3>

        {status.success && (
          <div className="flex items-center gap-3 p-4 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
            <CheckCircle size={18} />
            <span>Skill added to database!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid sm:grid-cols-4 gap-4 items-end">
          <div className="space-y-1.5">
            <label className="text-xs text-gray-300 font-semibold">Skill Name</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full glass-input p-2.5 text-xs"
              placeholder="e.g. Python"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-gray-300 font-semibold">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full glass-input p-2.5 text-xs bg-[#0b0920]"
            >
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
              <option value="Database">Database</option>
              <option value="DevOps">DevOps</option>
              <option value="Languages">Languages</option>
              <option value="Other">Other Area</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-gray-300 font-semibold">Lucide Icon Name</label>
            <input
              type="text"
              name="icon"
              value={formData.icon}
              onChange={handleChange}
              className="w-full glass-input p-2.5 text-xs"
              placeholder="e.g. Terminal, Database"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-gray-300 font-semibold">Skill Level: {formData.level}%</label>
            <div className="flex gap-4 items-center">
              <input
                type="range"
                name="level"
                min="0"
                max="100"
                value={formData.level}
                onChange={handleChange}
                className="w-full accent-violet-500 cursor-pointer"
              />
              <button
                type="submit"
                disabled={status.submitting}
                className="px-4 py-2.5 bg-violet-600 hover:bg-violet-500 disabled:bg-gray-800 text-white font-semibold rounded-lg text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition-colors"
              >
                {status.submitting ? "Adding..." : "Add"}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Listing active skills */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-white border-b border-white/5 pb-2">Active Skills</h3>

        {skills.length === 0 ? (
          <div className="text-center text-gray-500 py-10 text-sm">
            No technical skills found in database.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-6">
            {Object.keys(groupedSkills).map((cat) => (
              <div 
                key={cat}
                className="glass-panel p-6 rounded-xl border border-white/5 space-y-4"
              >
                <h4 className="text-sm font-bold text-violet-400 uppercase tracking-wider border-b border-white/5 pb-2">
                  {cat}
                </h4>

                <div className="space-y-3.5">
                  {groupedSkills[cat].map((skill) => (
                    <div 
                      key={skill.id}
                      className="flex justify-between items-center p-3 rounded bg-white/3 border border-white/5 hover:border-violet-500/10 transition-colors"
                    >
                      <span className="flex items-center gap-2.5 text-xs font-semibold text-white">
                        <DynamicIcon name={skill.icon} className="text-cyan-400" />
                        {skill.name} ({skill.level}%)
                      </span>
                      
                      <button
                        onClick={() => handleDelete(skill.id)}
                        className="p-1.5 text-gray-500 hover:text-rose-400 hover:bg-rose-500/10 rounded transition-colors cursor-pointer"
                        title="Delete Skill"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default SkillsManagement;
