import React, { useState, useEffect } from 'react';
import portfolioService from '../services/portfolioService';
import { Plus, Edit2, Trash2, CheckCircle, AlertCircle, Loader2, Save, X, Eye, EyeOff } from 'lucide-react';

const CustomSectionsManagement = () => {
  const [customSections, setCustomSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    content: '',
    order: 0,
    visible: true
  });

  const [status, setStatus] = useState({ submitting: false, success: false, error: null });

  useEffect(() => {
    loadCustomSections();
  }, []);

  const loadCustomSections = async () => {
    try {
      const data = await portfolioService.getCustomSections();
      setCustomSections(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (name === 'order' ? parseInt(value) || 0 : value)
    }));
  };

  const handleEditSelect = (item) => {
    setEditingId(item.id);
    setFormData({
      title: item.title,
      subtitle: item.subtitle || '',
      content: item.content,
      order: item.order || 0,
      visible: item.visible !== undefined ? item.visible : true
    });
    document.getElementById('sections-form-container')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({
      title: '',
      subtitle: '',
      content: '',
      order: 0,
      visible: true
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) return;

    setStatus({ submitting: true, success: false, error: null });
    try {
      if (editingId) {
        const updated = await portfolioService.updateCustomSection(editingId, formData);
        setCustomSections(prev => prev.map(s => s.id === editingId ? updated : s).sort((a, b) => a.order - b.order));
        setStatus({ submitting: false, success: true, error: null });
      } else {
        const created = await portfolioService.addCustomSection(formData);
        setCustomSections(prev => [...prev, created].sort((a, b) => a.order - b.order));
        setStatus({ submitting: false, success: true, error: null });
      }
      handleCancelEdit();
      setTimeout(() => setStatus(prev => ({ ...prev, success: false })), 3000);
    } catch (err) {
      console.error(err);
      setStatus({ submitting: false, success: false, error: "Failed to save custom section." });
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this custom section?")) return;

    try {
      await portfolioService.deleteCustomSection(id);
      setCustomSections(prev => prev.filter(s => s.id !== id));
      if (editingId === id) handleCancelEdit();
    } catch (err) {
      console.error(err);
      alert("Failed to delete custom section.");
    }
  };

  if (loading) {
    return (
      <div className="h-96 flex flex-col justify-center items-center">
        <Loader2 className="animate-spin text-violet-500 mb-2" size={32} />
        <p className="text-gray-400 text-sm">Retrieving custom portfolio sections...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl animate-fade-in">
      <div>
        <h2 className="text-3xl font-extrabold text-white">Custom Sections Management</h2>
        <p className="text-gray-400 text-sm mt-1">Dynamically construct, adjust, sort, or remove completely new sections on your homepage.</p>
      </div>

      {/* Editor Form */}
      <div id="sections-form-container" className="glass-panel p-8 rounded-xl border border-white/5 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center justify-between border-b border-white/5 pb-3">
          <span className="flex items-center gap-2">
            {editingId ? <Edit2 size={18} className="text-cyan-400" /> : <Plus size={18} className="text-violet-400" />}
            {editingId ? "Edit Custom Section" : "Add New Custom Section"}
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
            <span>Custom section saved successfully!</span>
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
              <label className="text-sm text-gray-300 font-medium">Section Title</label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="w-full glass-input p-3 text-sm"
                placeholder="e.g. Open Source Contributions"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm text-gray-300 font-medium">Section Subtitle (Optional)</label>
              <input
                type="text"
                name="subtitle"
                value={formData.subtitle}
                onChange={handleChange}
                className="w-full glass-input p-3 text-sm"
                placeholder="e.g. Projects and codebases I support"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm text-gray-300 font-medium">Display Order</label>
              <input
                type="number"
                name="order"
                value={formData.order}
                onChange={handleChange}
                className="w-full glass-input p-3 text-sm"
                placeholder="0"
              />
              <p className="text-xs text-gray-500">Sections are sorted ascending by this value.</p>
            </div>
            
            <div className="space-y-2 flex flex-col justify-end">
              <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg bg-white/5 border border-white/5 hover:border-violet-500/10 transition-colors select-none">
                <input
                  type="checkbox"
                  name="visible"
                  checked={formData.visible}
                  onChange={handleChange}
                  className="rounded border-white/10 text-violet-600 focus:ring-violet-500 bg-black/40 h-4 w-4"
                />
                <div className="text-sm">
                  <span className="font-semibold text-white block">Make Section Visible</span>
                  <span className="text-xs text-gray-400">Toggle whether this section renders on the public site.</span>
                </div>
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-300 font-medium">Section Content</label>
            <textarea
              name="content"
              rows="6"
              required
              value={formData.content}
              onChange={handleChange}
              className="w-full glass-input p-3 text-sm resize-none"
              placeholder="Write the content/details of this section here..."
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={status.submitting}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-500 disabled:bg-gray-800 text-white font-semibold rounded-lg shadow-md cursor-pointer transition-colors"
          >
            {status.submitting ? (
              <>Saving Section... <Loader2 className="animate-spin" size={16} /></>
            ) : (
              <>
                {editingId ? "Update Section Details" : "Create Custom Section"} <Save size={16} />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Grid of Custom Sections */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-white border-b border-white/5 pb-2">Configured Custom Sections</h3>

        {customSections.length === 0 ? (
          <div className="text-center text-gray-500 py-10 text-sm">
            No custom sections currently created.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-6">
            {customSections.map((sect) => (
              <div 
                key={sect.id}
                className={`glass-panel p-5 rounded-xl border flex flex-col justify-between hover:border-violet-500/10 transition-colors ${
                  sect.visible ? 'border-white/5' : 'border-rose-500/20 bg-rose-950/5'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs text-violet-400 font-semibold uppercase">Order: {sect.order}</span>
                    <span className={`flex items-center gap-1 text-xs font-semibold ${
                      sect.visible ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                      {sect.visible ? <Eye size={12} /> : <EyeOff size={12} />}
                      {sect.visible ? 'Visible' : 'Hidden'}
                    </span>
                  </div>
                  <h4 className="font-bold text-white text-md mb-1">{sect.title}</h4>
                  {sect.subtitle && <p className="text-xs text-gray-400 italic mb-2">{sect.subtitle}</p>}
                  <p className="text-gray-300 text-xs line-clamp-4 leading-relaxed mb-4 whitespace-pre-wrap">
                    {sect.content}
                  </p>
                </div>
                
                <div className="flex gap-3 pt-3 border-t border-white/5 justify-end">
                  <button
                    onClick={() => handleEditSelect(sect)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/10 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                  >
                    <Edit2 size={12} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(sect.id)}
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

export default CustomSectionsManagement;
