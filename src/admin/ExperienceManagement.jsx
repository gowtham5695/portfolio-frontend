import React, { useState, useEffect } from 'react';
import portfolioService from '../services/portfolioService';
import { Plus, Edit2, Trash2, CheckCircle, AlertCircle, Loader2, Save, X } from 'lucide-react';

const ExperienceManagement = () => {
  const [experience, setExperience] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    company: '',
    role: '',
    duration: '',
    description: '',
    certificate_link: ''
  });

  const [status, setStatus] = useState({ submitting: false, success: false, error: null });

  useEffect(() => {
    loadExperience();
  }, []);

  const loadExperience = async () => {
    try {
      const data = await portfolioService.getExperience();
      setExperience(data);
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
      [name]: value
    }));
  };

  const handleEditSelect = (item) => {
    setEditingId(item.id);
    setFormData({
      company: item.company,
      role: item.role,
      duration: item.duration,
      description: item.description,
      certificate_link: item.certificate_link || ''
    });
    document.getElementById('experience-form-container')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({
      company: '',
      role: '',
      duration: '',
      description: '',
      certificate_link: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.company || !formData.role || !formData.duration || !formData.description) return;

    setStatus({ submitting: true, success: false, error: null });
    try {
      if (editingId) {
        const updated = await portfolioService.updateExperience(editingId, formData);
        setExperience(prev => prev.map(exp => exp.id === editingId ? updated : exp));
        setStatus({ submitting: false, success: true, error: null });
      } else {
        const created = await portfolioService.addExperience(formData);
        setExperience(prev => [...prev, created]);
        setStatus({ submitting: false, success: true, error: null });
      }
      handleCancelEdit();
      setTimeout(() => setStatus(prev => ({ ...prev, success: false })), 3000);
    } catch (err) {
      console.error(err);
      setStatus({ submitting: false, success: false, error: "Failed to save experience records." });
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this experience listing?")) return;

    try {
      await portfolioService.deleteExperience(id);
      setExperience(prev => prev.filter(exp => exp.id !== id));
      if (editingId === id) handleCancelEdit();
    } catch (err) {
      console.error(err);
      alert("Failed to delete experience listing.");
    }
  };

  if (loading) {
    return (
      <div className="h-96 flex flex-col justify-center items-center">
        <Loader2 className="animate-spin text-violet-500 mb-2" size={32} />
        <p className="text-gray-400 text-sm">Retrieving experience history...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl animate-fade-in">
      <div>
        <h2 className="text-3xl font-extrabold text-white">Experience Management</h2>
        <p className="text-gray-400 text-sm mt-1">Configure professional occupations, project roles, and internship tracks.</p>
      </div>

      {/* Editor Form */}
      <div id="experience-form-container" className="glass-panel p-8 rounded-xl border border-white/5 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center justify-between border-b border-white/5 pb-3">
          <span className="flex items-center gap-2">
            {editingId ? <Edit2 size={18} className="text-cyan-400" /> : <Plus size={18} className="text-violet-400" />}
            {editingId ? "Edit Experience Entry" : "Add New Experience"}
          </span>
          {editingId && (
            <button 
              onClick={handleCancelEdit}
              className="text-xs text-gray-400 hover:text-white flex items-center gap-1 cursor-pointer"
            >
              <X size={14} /> Cancel Edit
            </button>
          )}
        </h3>

        {status.success && (
          <div className="flex items-center gap-3 p-4 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
            <CheckCircle size={18} />
            <span>Experience history saved!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm text-gray-300 font-medium">Company Name</label>
              <input
                type="text"
                name="company"
                required
                value={formData.company}
                onChange={handleChange}
                className="w-full glass-input p-3 text-sm"
                placeholder="e.g. Google"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm text-gray-300 font-medium">Your Role / Job Title</label>
              <input
                type="text"
                name="role"
                required
                value={formData.role}
                onChange={handleChange}
                className="w-full glass-input p-3 text-sm"
                placeholder="e.g. Software Engineering Intern"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-300 font-medium">Duration Period</label>
              <input
                type="text"
                name="duration"
                required
                value={formData.duration}
                onChange={handleChange}
                className="w-full glass-input p-3 text-sm"
                placeholder="e.g. Jan 2025 - Present"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-300 font-medium">Internship Certificate / Reference Link (URL)</label>
            <input
              type="url"
              name="certificate_link"
              value={formData.certificate_link}
              onChange={handleChange}
              className="w-full glass-input p-3 text-sm"
              placeholder="https://example.com/certificate.pdf"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-300 font-medium">Job Responsibilities & Scope (Supports Line Breaks)</label>
            <textarea
              name="description"
              rows="4"
              required
              value={formData.description}
              onChange={handleChange}
              className="w-full glass-input p-3 text-sm resize-none"
              placeholder="List key duties, projects built, and languages used..."
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={status.submitting}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-500 disabled:bg-gray-800 text-white font-semibold rounded-lg shadow-md cursor-pointer transition-colors"
          >
            {status.submitting ? (
              <>Saving Experience... <Loader2 className="animate-spin" size={16} /></>
            ) : (
              <>
                {editingId ? "Update Experience Details" : "Create Experience Card"} <Save size={16} />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Grid of Experiences */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-white border-b border-white/5 pb-2">Professional Timeline</h3>

        {experience.length === 0 ? (
          <div className="text-center text-gray-500 py-10 text-sm">
            No professional experience logged yet.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-6">
            {experience.map((item) => (
              <div 
                key={item.id}
                className="glass-panel p-5 rounded-xl border border-white/5 flex flex-col justify-between hover:border-violet-500/10 transition-colors"
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs text-violet-400 font-semibold uppercase">{item.company}</span>
                    <span className="text-xs text-gray-500 font-medium">{item.duration}</span>
                  </div>
                  <h4 className="font-bold text-white text-md mb-2">{item.role}</h4>
                  <p className="text-gray-400 text-xs line-clamp-3 leading-relaxed mb-2 whitespace-pre-line">
                    {item.description}
                  </p>
                </div>
                
                <div className="flex gap-3 pt-3 border-t border-white/5 justify-end">
                  <button
                    onClick={() => handleEditSelect(item)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/10 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                  >
                    <Edit2 size={12} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/10 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                  >
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default ExperienceManagement;
