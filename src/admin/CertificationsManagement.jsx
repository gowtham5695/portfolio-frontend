import React, { useState, useEffect } from 'react';
import portfolioService from '../services/portfolioService';
import { Plus, Edit2, Trash2, CheckCircle, AlertCircle, Loader2, Save, X } from 'lucide-react';

const CertificationsManagement = () => {
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    issuer: '',
    date: '',
    verification_link: ''
  });

  const [status, setStatus] = useState({ submitting: false, success: false, error: null });

  useEffect(() => {
    loadCertifications();
  }, []);

  const loadCertifications = async () => {
    try {
      const data = await portfolioService.getCertifications();
      setCertifications(data);
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
      title: item.title,
      issuer: item.issuer,
      date: item.date,
      verification_link: item.verification_link || ''
    });
    document.getElementById('certs-form-container')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({
      title: '',
      issuer: '',
      date: '',
      verification_link: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.issuer || !formData.date) return;

    setStatus({ submitting: true, success: false, error: null });
    try {
      if (editingId) {
        const updated = await portfolioService.updateCertification(editingId, formData);
        setCertifications(prev => prev.map(c => c.id === editingId ? updated : c));
        setStatus({ submitting: false, success: true, error: null });
      } else {
        const created = await portfolioService.addCertification(formData);
        setCertifications(prev => [...prev, created]);
        setStatus({ submitting: false, success: true, error: null });
      }
      handleCancelEdit();
      setTimeout(() => setStatus(prev => ({ ...prev, success: false })), 3000);
    } catch (err) {
      console.error(err);
      setStatus({ submitting: false, success: false, error: "Failed to save certification credential." });
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this certification?")) return;

    try {
      await portfolioService.deleteCertification(id);
      setCertifications(prev => prev.filter(c => c.id !== id));
      if (editingId === id) handleCancelEdit();
    } catch (err) {
      console.error(err);
      alert("Failed to delete certification.");
    }
  };

  if (loading) {
    return (
      <div className="h-96 flex flex-col justify-center items-center">
        <Loader2 className="animate-spin text-violet-500 mb-2" size={32} />
        <p className="text-gray-400 text-sm">Retrieving professional licenses...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl animate-fade-in">
      <div>
        <h2 className="text-3xl font-extrabold text-white">Certifications Management</h2>
        <p className="text-gray-400 text-sm mt-1">Configure licenses, issuers, dates, and verification links.</p>
      </div>

      {/* Editor Form */}
      <div id="certs-form-container" className="glass-panel p-8 rounded-xl border border-white/5 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center justify-between border-b border-white/5 pb-3">
          <span className="flex items-center gap-2">
            {editingId ? <Edit2 size={18} className="text-cyan-400" /> : <Plus size={18} className="text-violet-400" />}
            {editingId ? "Edit Certification" : "Add New Certification"}
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
            <span>Credential data saved successfully!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm text-gray-300 font-medium">Certification Name</label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="w-full glass-input p-3 text-sm"
                placeholder="e.g. AWS Certified Solutions Architect"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm text-gray-300 font-medium">Issuing Organization</label>
              <input
                type="text"
                name="issuer"
                required
                value={formData.issuer}
                onChange={handleChange}
                className="w-full glass-input p-3 text-sm"
                placeholder="e.g. Amazon Web Services (AWS)"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-300 font-medium">Issue Date</label>
              <input
                type="text"
                name="date"
                required
                value={formData.date}
                onChange={handleChange}
                className="w-full glass-input p-3 text-sm"
                placeholder="e.g. June 2026"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-300 font-medium">Verification Credential URL</label>
            <input
              type="url"
              name="verification_link"
              value={formData.verification_link}
              onChange={handleChange}
              className="w-full glass-input p-3 text-sm"
              placeholder="https://credly.com/badges/your-badge-id"
            />
          </div>

          <button
            type="submit"
            disabled={status.submitting}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-500 disabled:bg-gray-800 text-white font-semibold rounded-lg shadow-md cursor-pointer transition-colors"
          >
            {status.submitting ? (
              <>Saving Credential... <Loader2 className="animate-spin" size={16} /></>
            ) : (
              <>
                {editingId ? "Update Certification Details" : "Create Certification Card"} <Save size={16} />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Grid of Certs */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-white border-b border-white/5 pb-2">Active Credentials</h3>

        {certifications.length === 0 ? (
          <div className="text-center text-gray-500 py-10 text-sm">
            No certifications currently logged.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-6">
            {certifications.map((cert) => (
              <div 
                key={cert.id}
                className="glass-panel p-5 rounded-xl border border-white/5 flex flex-col justify-between hover:border-violet-500/10 transition-colors"
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs text-violet-400 font-semibold uppercase">{cert.issuer}</span>
                    <span className="text-xs text-gray-500 font-medium">{cert.date}</span>
                  </div>
                  <h4 className="font-bold text-white text-md mb-2">{cert.title}</h4>
                  {cert.verification_link && (
                    <a 
                      href={cert.verification_link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold break-all"
                    >
                      Verification: {cert.verification_link.substring(0, 40)}...
                    </a>
                  )}
                </div>
                
                <div className="flex gap-3 pt-3 border-t border-white/5 justify-end">
                  <button
                    onClick={() => handleEditSelect(cert)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/10 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                  >
                    <Edit2 size={12} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(cert.id)}
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

export default CertificationsManagement;
