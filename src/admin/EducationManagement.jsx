import React, { useState, useEffect } from 'react';
import portfolioService from '../services/portfolioService';
import { Plus, Edit2, Trash2, CheckCircle, AlertCircle, Loader2, Save, X } from 'lucide-react';

const EducationManagement = () => {
  const [education, setEducation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    institution: '',
    degree: '',
    field_of_study: '',
    duration: '',
    description: '',
    grade: ''
  });

  const [status, setStatus] = useState({ submitting: false, success: false, error: null });

  useEffect(() => {
    loadEducation();
  }, []);

  const loadEducation = async () => {
    try {
      const data = await portfolioService.getEducation();
      setEducation(data);
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
      institution: item.institution,
      degree: item.degree,
      field_of_study: item.field_of_study,
      duration: item.duration,
      description: item.description || '',
      grade: item.grade || ''
    });
    document.getElementById('education-form-container')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({
      institution: '',
      degree: '',
      field_of_study: '',
      duration: '',
      description: '',
      grade: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.institution || !formData.degree || !formData.field_of_study || !formData.duration) return;

    setStatus({ submitting: true, success: false, error: null });
    try {
      if (editingId) {
        const updated = await portfolioService.updateEducation(editingId, formData);
        setEducation(prev => prev.map(edu => edu.id === editingId ? updated : edu));
        setStatus({ submitting: false, success: true, error: null });
      } else {
        const created = await portfolioService.addEducation(formData);
        setEducation(prev => [...prev, created]);
        setStatus({ submitting: false, success: true, error: null });
      }
      handleCancelEdit();
      setTimeout(() => setStatus(prev => ({ ...prev, success: false })), 3000);
    } catch (err) {
      console.error(err);
      setStatus({ submitting: false, success: false, error: "Failed to save education credentials." });
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this education entry?")) return;

    try {
      await portfolioService.deleteEducation(id);
      setEducation(prev => prev.filter(edu => edu.id !== id));
      if (editingId === id) handleCancelEdit();
    } catch (err) {
      console.error(err);
      alert("Failed to delete education details.");
    }
  };

  if (loading) {
    return (
      <div className="h-96 flex flex-col justify-center items-center">
        <Loader2 className="animate-spin text-violet-500 mb-2" size={32} />
        <p className="text-gray-400 text-sm">Retrieving academic profiles...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl animate-fade-in">
      <div>
        <h2 className="text-3xl font-extrabold text-white">Education Management</h2>
        <p className="text-gray-400 text-sm mt-1">Configure degrees, field studies, academic scores, and schools.</p>
      </div>

      {/* Editor Form */}
      <div id="education-form-container" className="glass-panel p-8 rounded-xl border border-white/5 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center justify-between border-b border-white/5 pb-3">
          <span className="flex items-center gap-2">
            {editingId ? <Edit2 size={18} className="text-cyan-400" /> : <Plus size={18} className="text-violet-400" />}
            {editingId ? "Edit Education Entry" : "Add New Education Card"}
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
            <span>Academic entry details saved!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm text-gray-300 font-medium">Institution Name</label>
              <input
                type="text"
                name="institution"
                required
                value={formData.institution}
                onChange={handleChange}
                className="w-full glass-input p-3 text-sm"
                placeholder="e.g. Stanford University"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm text-gray-300 font-medium">Degree Level</label>
              <input
                type="text"
                name="degree"
                required
                value={formData.degree}
                onChange={handleChange}
                className="w-full glass-input p-3 text-sm"
                placeholder="e.g. Bachelor of Science"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-300 font-medium">Field of Study</label>
              <input
                type="text"
                name="field_of_study"
                required
                value={formData.field_of_study}
                onChange={handleChange}
                className="w-full glass-input p-3 text-sm"
                placeholder="e.g. Computer Science"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm text-gray-300 font-medium">Duration Period</label>
              <input
                type="text"
                name="duration"
                required
                value={formData.duration}
                onChange={handleChange}
                className="w-full glass-input p-3 text-sm"
                placeholder="e.g. 2022 - 2026"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm text-gray-300 font-medium">Grade / GPA (Optional)</label>
              <input
                type="text"
                name="grade"
                value={formData.grade}
                onChange={handleChange}
                className="w-full glass-input p-3 text-sm"
                placeholder="e.g. 3.9 / 4.0 or First Class"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-300 font-medium">Academic Description / Accomplishments</label>
            <textarea
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              className="w-full glass-input p-3 text-sm resize-none"
              placeholder="e.g. Specialized in Artificial Intelligence, Completed thesis in machine learning..."
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={status.submitting}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-500 disabled:bg-gray-800 text-white font-semibold rounded-lg shadow-md cursor-pointer transition-colors"
          >
            {status.submitting ? (
              <>Saving Entry... <Loader2 className="animate-spin" size={16} /></>
            ) : (
              <>
                {editingId ? "Update Academic Details" : "Create Education Card"} <Save size={16} />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Grid of Education entries */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-white border-b border-white/5 pb-2">Academic Timeline</h3>

        {education.length === 0 ? (
          <div className="text-center text-gray-500 py-10 text-sm">
            No education entries logged yet.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-6">
            {education.map((item) => (
              <div 
                key={item.id}
                className="glass-panel p-5 rounded-xl border border-white/5 flex flex-col justify-between hover:border-violet-500/10 transition-colors"
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs text-violet-400 font-semibold uppercase">{item.degree}</span>
                    <span className="text-xs text-gray-500 font-medium">{item.duration}</span>
                  </div>
                  <h4 className="font-bold text-white text-md mb-1">{item.field_of_study}</h4>
                  <h5 className="text-gray-300 text-xs font-semibold mb-2">{item.institution}</h5>
                  {item.grade && <p className="text-xs text-emerald-400 font-semibold mb-1">GPA: {item.grade}</p>}
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

export default EducationManagement;
