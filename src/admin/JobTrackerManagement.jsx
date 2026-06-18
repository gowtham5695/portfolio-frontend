import React, { useState, useEffect } from 'react';
import portfolioService from '../services/portfolioService';
import { 
  Plus, Edit2, Trash2, CheckCircle, AlertCircle, Loader2, Save, X, 
  Search, Filter, Briefcase, Calendar, MapPin, Link2, FileText,
  ClipboardList, CheckSquare, TrendingUp, AlertTriangle
} from 'lucide-react';

const JobTrackerManagement = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const [formData, setFormData] = useState({
    company: '',
    role: '',
    location: 'Remote',
    status: 'Applied',
    date_applied: new Date().toISOString().split('T')[0],
    job_link: '',
    notes: ''
  });

  const [status, setStatus] = useState({ submitting: false, success: false, error: null });

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const data = await portfolioService.getJobApplications();
      setApplications(data);
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
      location: item.location || 'Remote',
      status: item.status || 'Applied',
      date_applied: item.date_applied || new Date().toISOString().split('T')[0],
      job_link: item.job_link || '',
      notes: item.notes || ''
    });
    document.getElementById('tracker-form-container')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({
      company: '',
      role: '',
      location: 'Remote',
      status: 'Applied',
      date_applied: new Date().toISOString().split('T')[0],
      job_link: '',
      notes: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.company || !formData.role || !formData.date_applied) return;

    setStatus({ submitting: true, success: false, error: null });
    try {
      if (editingId) {
        const updated = await portfolioService.updateJobApplication(editingId, formData);
        setApplications(prev => prev.map(a => a.id === editingId ? updated : a));
        setStatus({ submitting: false, success: true, error: null });
      } else {
        const created = await portfolioService.addJobApplication(formData);
        setApplications(prev => [created, ...prev]);
        setStatus({ submitting: false, success: true, error: null });
      }
      handleCancelEdit();
      setTimeout(() => setStatus(prev => ({ ...prev, success: false })), 3000);
    } catch (err) {
      console.error(err);
      setStatus({ submitting: false, success: false, error: "Failed to save application details." });
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this application log?")) return;

    try {
      await portfolioService.deleteJobApplication(id);
      setApplications(prev => prev.filter(a => a.id !== id));
      if (editingId === id) handleCancelEdit();
    } catch (err) {
      console.error(err);
      alert("Failed to delete application.");
    }
  };

  // Get Stats
  const totalApps = applications.length;
  const interviewingCount = applications.filter(a => a.status === 'Interviewing').length;
  const offersCount = applications.filter(a => a.status === 'Offer').length;
  const pendingCount = applications.filter(a => a.status === 'Applied').length;

  // Filter & Search Applications
  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      app.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.role.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (statusFilter === 'All') return matchesSearch;
    return matchesSearch && app.status === statusFilter;
  });

  const getStatusBadgeClass = (statusStr) => {
    switch (statusStr) {
      case 'Applied':
        return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
      case 'Interviewing':
        return 'bg-blue-500/10 text-blue-400 border border-blue-500/20 animate-pulse';
      case 'Offer':
        return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold';
      case 'Rejected':
        return 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
      case 'Declined':
        return 'bg-slate-500/15 text-slate-400 border border-slate-500/25';
      default:
        return 'bg-gray-500/10 text-gray-400 border border-gray-500/20';
    }
  };

  if (loading) {
    return (
      <div className="h-96 flex flex-col justify-center items-center">
        <Loader2 className="animate-spin text-violet-500 mb-2" size={32} />
        <p className="text-gray-400 text-sm">Accessing job tracking ledger...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl animate-fade-in">
      <div>
        <h2 className="text-3xl font-extrabold text-white">Job Application Tracker</h2>
        <p className="text-gray-400 text-sm mt-1">Keep track of your job and internship applications, interviews, and offers.</p>
      </div>

      {/* Stats Counter Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-xl border border-white/5 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-violet-500/10 text-violet-400">
            <ClipboardList size={22} />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white">{totalApps}</div>
            <div className="text-gray-400 text-xs font-semibold">Total Applied</div>
          </div>
        </div>
        
        <div className="glass-panel p-5 rounded-xl border border-white/5 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-blue-500/10 text-blue-400">
            <Briefcase size={22} />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white">{interviewingCount}</div>
            <div className="text-gray-400 text-xs font-semibold">Interviews</div>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-xl border border-white/5 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-400">
            <TrendingUp size={22} />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white">{offersCount}</div>
            <div className="text-gray-400 text-xs font-semibold">Offers Received</div>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-xl border border-white/5 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-amber-500/10 text-amber-400">
            <CheckSquare size={22} />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white">{pendingCount}</div>
            <div className="text-gray-400 text-xs font-semibold">Pending Review</div>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div id="tracker-form-container" className="glass-panel p-6 rounded-xl border border-white/5 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center justify-between border-b border-white/5 pb-3">
          <span className="flex items-center gap-2">
            {editingId ? <Edit2 size={18} className="text-cyan-400" /> : <Plus size={18} className="text-violet-400" />}
            {editingId ? "Edit Application Log" : "Log New Application"}
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
            <span>Application logged successfully!</span>
          </div>
        )}
        {status.error && (
          <div className="flex items-center gap-3 p-4 rounded bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
            <AlertTriangle size={18} />
            <span>{status.error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs text-gray-300 font-semibold">Company Name</label>
              <input
                type="text"
                name="company"
                required
                value={formData.company}
                onChange={handleChange}
                className="w-full glass-input p-2.5 text-xs"
                placeholder="e.g. Google"
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs text-gray-300 font-semibold">Role Title</label>
              <input
                type="text"
                name="role"
                required
                value={formData.role}
                onChange={handleChange}
                className="w-full glass-input p-2.5 text-xs"
                placeholder="e.g. Software Engineer Intern"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-gray-300 font-semibold">Location Type</label>
              <select
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full glass-input p-2.5 text-xs bg-[#0b0920]"
              >
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Onsite">Onsite</option>
              </select>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs text-gray-300 font-semibold">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full glass-input p-2.5 text-xs bg-[#0b0920]"
              >
                <option value="Applied">Applied</option>
                <option value="Interviewing">Interviewing</option>
                <option value="Offer">Offer Received</option>
                <option value="Rejected">Rejected</option>
                <option value="Declined">Declined</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-gray-300 font-semibold">Date Applied</label>
              <input
                type="date"
                name="date_applied"
                required
                value={formData.date_applied}
                onChange={handleChange}
                className="w-full glass-input p-2 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-gray-300 font-semibold">Job Posting Link (URL)</label>
              <input
                type="url"
                name="job_link"
                value={formData.job_link}
                onChange={handleChange}
                className="w-full glass-input p-2.5 text-xs"
                placeholder="https://careers.google.com/jobs/..."
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-gray-300 font-semibold">Notes & Salary Details (Optional)</label>
            <textarea
              name="notes"
              rows="3"
              value={formData.notes}
              onChange={handleChange}
              className="w-full glass-input p-2.5 text-xs resize-none"
              placeholder="e.g. Salary: $45/hr. Recruiter contacted: John. First interview on Friday."
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={status.submitting}
            className="flex items-center justify-center gap-2 px-6 py-2 bg-violet-600 hover:bg-violet-500 disabled:bg-gray-800 text-white font-semibold rounded-lg text-xs shadow-md cursor-pointer transition-colors"
          >
            {status.submitting ? (
              <>Logging... <Loader2 className="animate-spin" size={12} /></>
            ) : (
              <>
                {editingId ? "Update Application" : "Log Application"} <Save size={12} />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Filter and Search Panel */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search by Company or Role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full glass-input pl-10 pr-4 py-2 text-xs"
          />
        </div>

        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1">
          {['All', 'Applied', 'Interviewing', 'Offer', 'Rejected', 'Declined'].map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                statusFilter === filter 
                  ? 'bg-violet-600 text-white' 
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              {filter === 'Offer' ? 'Offers' : filter}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of applications */}
      <div className="space-y-4">
        {filteredApplications.length === 0 ? (
          <div className="glass-panel p-10 rounded-xl border border-white/5 text-center text-gray-500 text-sm">
            No applications match your current filters.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {filteredApplications.map((app) => (
              <div 
                key={app.id}
                className="glass-panel p-5 rounded-xl border border-white/5 hover:border-violet-500/10 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-violet-500/10 text-violet-400 flex items-center justify-center font-bold text-lg border border-violet-500/10">
                        {app.company.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-white text-sm leading-snug">{app.company}</h4>
                        <span className="text-gray-400 text-xs font-medium">{app.role}</span>
                      </div>
                    </div>
                    
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${getStatusBadgeClass(app.status)}`}>
                      {app.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs text-gray-400 pt-2 border-t border-white/3">
                    <span className="flex items-center gap-1.5">
                      <MapPin size={12} className="text-violet-400" /> {app.location}
                    </span>
                    <span className="flex items-center gap-1.5 justify-end">
                      <Calendar size={12} className="text-violet-400" /> {app.date_applied}
                    </span>
                  </div>

                  {app.notes && (
                    <div className="mt-3 p-3 rounded bg-white/3 border border-white/5 flex gap-2 items-start text-xs text-gray-300">
                      <FileText size={12} className="text-cyan-400 shrink-0 mt-0.5" />
                      <p className="whitespace-pre-line leading-relaxed">{app.notes}</p>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center mt-4 pt-3 border-t border-white/5">
                  {app.job_link ? (
                    <a
                      href={app.job_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
                    >
                      <Link2 size={12} /> Job Posting
                    </a>
                  ) : (
                    <span className="text-xs text-gray-600 italic">No posting link</span>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditSelect(app)}
                      className="p-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/10 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                      title="Edit Log"
                    >
                      <Edit2 size={12} />
                    </button>
                    <button
                      onClick={() => handleDelete(app.id)}
                      className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/10 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                      title="Delete Log"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobTrackerManagement;
