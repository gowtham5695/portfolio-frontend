import React, { useState, useEffect } from 'react';
import portfolioService from '../services/portfolioService';
import { Plus, Edit2, Trash2, CheckCircle, AlertCircle, Loader2, Save, X } from 'lucide-react';

const ProjectsManagement = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null); // Null = Adding, string ID = Editing
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    technologies: '', // Comma separated string for editing
    image: '',
    github_link: '',
    live_link: ''
  });

  const [status, setStatus] = useState({ submitting: false, success: false, error: null });

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const data = await portfolioService.getProjects();
      setProjects(data);
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

  const handleEditSelect = (project) => {
    setEditingId(project.id);
    setFormData({
      title: project.title,
      description: project.description,
      technologies: project.technologies ? project.technologies.join(', ') : '',
      image: project.image || '',
      github_link: project.github_link || '',
      live_link: project.live_link || ''
    });
    // Scroll form into view if needed
    document.getElementById('project-form-container')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({
      title: '',
      description: '',
      technologies: '',
      image: '',
      github_link: '',
      live_link: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) return;

    setStatus({ submitting: true, success: false, error: null });

    // Process technologies string to array
    const techArr = formData.technologies
      ? formData.technologies.split(',').map(t => t.trim()).filter(t => t.length > 0)
      : [];

    const payload = {
      ...formData,
      technologies: techArr
    };

    try {
      if (editingId) {
        // Update Project
        const updated = await portfolioService.updateProject(editingId, payload);
        setProjects(prev => prev.map(p => p.id === editingId ? updated : p));
        setStatus({ submitting: false, success: true, error: null });
      } else {
        // Create Project
        const created = await portfolioService.addProject(payload);
        setProjects(prev => [...prev, created]);
        setStatus({ submitting: false, success: true, error: null });
      }

      handleCancelEdit();
      setTimeout(() => setStatus(prev => ({ ...prev, success: false })), 3000);
    } catch (err) {
      console.error(err);
      setStatus({ submitting: false, success: false, error: "Failed to save project. Verify database is active." });
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      await portfolioService.deleteProject(id);
      setProjects(prev => prev.filter(p => p.id !== id));
      if (editingId === id) handleCancelEdit();
    } catch (err) {
      console.error(err);
      alert("Failed to delete project.");
    }
  };

  if (loading) {
    return (
      <div className="h-96 flex flex-col justify-center items-center">
        <Loader2 className="animate-spin text-violet-500 mb-2" size={32} />
        <p className="text-gray-400 text-sm">Retrieving project archives...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl animate-fade-in">
      <div>
        <h2 className="text-3xl font-extrabold text-white">Projects Management</h2>
        <p className="text-gray-400 text-sm mt-1">Add, update, or remove portfolio showcase projects.</p>
      </div>

      {/* Editor Form */}
      <div id="project-form-container" className="glass-panel p-8 rounded-xl border border-white/5 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center justify-between border-b border-white/5 pb-3">
          <span className="flex items-center gap-2">
            {editingId ? <Edit2 size={18} className="text-cyan-400" /> : <Plus size={18} className="text-violet-400" />}
            {editingId ? "Edit Project" : "Add New Project"}
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
            <span>Project details saved successfully!</span>
          </div>
        )}
        {status.error && (
          <div className="flex items-center gap-3 p-4 rounded bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
            <AlertCircle size={18} />
            <span>{status.error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm text-gray-300 font-medium">Project Title</label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="w-full glass-input p-3 text-sm"
                placeholder="e.g. E-Commerce Platform"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm text-gray-300 font-medium">Technologies Used (Comma Separated)</label>
              <input
                type="text"
                name="technologies"
                value={formData.technologies}
                onChange={handleChange}
                className="w-full glass-input p-3 text-sm"
                placeholder="React, Express, MongoDB, Tailwind"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-300 font-medium">Project Image URL</label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="w-full glass-input p-3 text-sm"
              placeholder="https://images.unsplash.com/photo-1555066931..."
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm text-gray-300 font-medium">GitHub Repository Link</label>
              <input
                type="url"
                name="github_link"
                value={formData.github_link}
                onChange={handleChange}
                className="w-full glass-input p-3 text-sm"
                placeholder="https://github.com/username/project"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm text-gray-300 font-medium">Live Demo Link</label>
              <input
                type="url"
                name="live_link"
                value={formData.live_link}
                onChange={handleChange}
                className="w-full glass-input p-3 text-sm"
                placeholder="https://myproject.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-300 font-medium">Project Description</label>
            <textarea
              name="description"
              rows="4"
              required
              value={formData.description}
              onChange={handleChange}
              className="w-full glass-input p-3 text-sm resize-none"
              placeholder="Describe what you built, architecture decisions, and challenges solved..."
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={status.submitting}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-500 disabled:bg-gray-800 text-white font-semibold rounded-lg shadow-md cursor-pointer transition-colors"
          >
            {status.submitting ? (
              <>Saving Project... <Loader2 className="animate-spin" size={16} /></>
            ) : (
              <>
                {editingId ? "Update Project Details" : "Create Showcase Project"} <Save size={16} />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Grid of Projects */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-white border-b border-white/5 pb-2">Showcase Gallery</h3>

        {projects.length === 0 ? (
          <div className="text-center text-gray-500 py-10 text-sm">
            No projects currently in repository.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((proj) => (
              <div 
                key={proj.id}
                className="glass-panel p-5 rounded-xl border border-white/5 flex flex-col justify-between hover:border-violet-500/10 transition-colors"
              >
                <div>
                  <h4 className="font-bold text-white text-md mb-2">{proj.title}</h4>
                  <p className="text-gray-400 text-xs line-clamp-3 leading-relaxed mb-4">
                    {proj.description}
                  </p>
                </div>
                
                <div className="flex gap-3 pt-3 border-t border-white/5 justify-end">
                  <button
                    onClick={() => handleEditSelect(proj)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/10 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                  >
                    <Edit2 size={12} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(proj.id)}
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

export default ProjectsManagement;
