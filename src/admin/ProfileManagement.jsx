import React, { useState, useEffect } from 'react';
import portfolioService from '../services/portfolioService';
import authService from '../services/authService';
import { Save, Key, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const ProfileManagement = () => {
  // Profile Form States
  const [profileData, setProfileData] = useState({
    name: '',
    title: '',
    taglines: '', // Will hold as comma-separated string for editing
    profile_image: '',
    resume_url: '',
    availability_status: '',
    about_title: '',
    about_bio: '',
    footer_text: '',
    social_links: {
      github: '',
      linkedin: '',
      twitter: '',
      email: '',
      instagram: ''
    },
    section_visibility: {
      hero: true,
      about: true,
      skills: true,
      projects: true,
      education: true,
      certifications: true,
      experience: true,
      contact: true
    }
  });

  // Security Form States
  const [passwords, setPasswords] = useState({
    old_password: '',
    new_password: '',
    confirm_password: ''
  });

  const [loading, setLoading] = useState(true);
  const [profileStatus, setProfileStatus] = useState({ saving: false, success: false, error: null });
  const [passwordStatus, setPasswordStatus] = useState({ updating: false, success: false, error: null });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await portfolioService.getProfile();
        setProfileData({
          ...res,
          taglines: res.taglines ? res.taglines.join(', ') : '',
          social_links: res.social_links || { github: '', linkedin: '', twitter: '', email: '', instagram: '' },
          section_visibility: {
            hero: true,
            about: true,
            skills: true,
            projects: true,
            education: true,
            certifications: true,
            experience: true,
            contact: true,
            ...(res.section_visibility || {})
          }
        });
      } catch (err) {
        console.error("Failed to load profile details:", err);
        setProfileStatus({ saving: false, success: false, error: "Failed to load profile data." });
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSocialChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      social_links: {
        ...prev.social_links,
        [name]: value
      }
    }));
  };

  const handleVisibilityChange = (sectionKey) => {
    setProfileData(prev => ({
      ...prev,
      section_visibility: {
        ...prev.section_visibility,
        [sectionKey]: !prev.section_visibility[sectionKey]
      }
    }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileStatus({ saving: true, success: false, error: null });
    
    // Process taglines back to array
    const taglinesArr = profileData.taglines
      ? profileData.taglines.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
      : [];

    const payload = {
      ...profileData,
      taglines: taglinesArr
    };

    try {
      const updated = await portfolioService.updateProfile(payload);
      setProfileData({
        ...updated,
        taglines: updated.taglines ? updated.taglines.join(', ') : '',
        social_links: updated.social_links || { github: '', linkedin: '', twitter: '', email: '', instagram: '' }
      });
      setProfileStatus({ saving: false, success: true, error: null });
      setTimeout(() => setProfileStatus(prev => ({ ...prev, success: false })), 4000);
    } catch (err) {
      console.error(err);
      setProfileStatus({ saving: false, success: false, error: "Failed to update profile data." });
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordStatus({ updating: true, success: false, error: null });

    if (passwords.new_password !== passwords.confirm_password) {
      setPasswordStatus({ updating: false, success: false, error: "New passwords do not match." });
      return;
    }

    try {
      await authService.updatePassword(passwords.old_password, passwords.new_password);
      setPasswordStatus({ updating: false, success: true, error: null });
      setPasswords({ old_password: '', new_password: '', confirm_password: '' });
      setTimeout(() => setPasswordStatus(prev => ({ ...prev, success: false })), 4000);
    } catch (err) {
      console.error(err);
      setPasswordStatus({
        updating: false,
        success: false,
        error: err.response?.data?.detail || "Failed to update password. Verify old credentials."
      });
    }
  };

  if (loading) {
    return (
      <div className="h-96 flex flex-col justify-center items-center">
        <Loader2 className="animate-spin text-violet-500 mb-2" size={32} />
        <p className="text-gray-400 text-sm">Retrieving profile configurations...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 max-w-5xl animate-fade-in">
      
      {/* Title */}
      <div>
        <h2 className="text-3xl font-extrabold text-white">Profile & Settings</h2>
        <p className="text-gray-400 text-sm mt-1">Configure landing sections, typing words, bio text, and credentials.</p>
      </div>

      {/* Main Profile Configurations Form */}
      <div className="glass-panel p-8 rounded-xl border border-white/5 space-y-6">
        <h3 className="text-lg font-bold text-white border-b border-white/5 pb-3 flex items-center gap-2">
          General Settings
        </h3>

        {profileStatus.success && (
          <div className="flex items-center gap-3 p-4 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
            <CheckCircle size={18} />
            <span>Profile metadata updated successfully!</span>
          </div>
        )}
        {profileStatus.error && (
          <div className="flex items-center gap-3 p-4 rounded bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
            <AlertCircle size={18} />
            <span>{profileStatus.error}</span>
          </div>
        )}

        <form onSubmit={handleProfileSubmit} className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm text-gray-300 font-medium">Your Name</label>
              <input
                type="text"
                name="name"
                required
                value={profileData.name}
                onChange={handleProfileChange}
                className="w-full glass-input p-3 text-sm"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm text-gray-300 font-medium">Subheading Title</label>
              <input
                type="text"
                name="title"
                required
                value={profileData.title}
                onChange={handleProfileChange}
                className="w-full glass-input p-3 text-sm"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm text-gray-300 font-medium">Profile Image URL</label>
              <input
                type="url"
                name="profile_image"
                value={profileData.profile_image}
                onChange={handleProfileChange}
                className="w-full glass-input p-3 text-sm"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm text-gray-300 font-medium">Resume Download Link (URL)</label>
              <input
                type="url"
                name="resume_url"
                value={profileData.resume_url}
                onChange={handleProfileChange}
                className="w-full glass-input p-3 text-sm"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm text-gray-300 font-medium">Availability Badge Status</label>
              <input
                type="text"
                name="availability_status"
                value={profileData.availability_status}
                onChange={handleProfileChange}
                className="w-full glass-input p-3 text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-300 font-medium">Typing Words Taglines (Comma Separated)</label>
              <input
                type="text"
                name="taglines"
                value={profileData.taglines}
                onChange={handleProfileChange}
                className="w-full glass-input p-3 text-sm"
                placeholder="Full Stack Developer, React Engineer, Problem Solver"
              />
            </div>
          </div>

          {/* Social Links Sub-form */}
          <div className="p-5 rounded-lg bg-white/3 border border-white/5 space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Social Accounts</h4>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs text-gray-400">GitHub URL</label>
                <input
                  type="url"
                  name="github"
                  value={profileData.social_links.github}
                  onChange={handleSocialChange}
                  className="w-full glass-input p-2 text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-gray-400">LinkedIn URL</label>
                <input
                  type="url"
                  name="linkedin"
                  value={profileData.social_links.linkedin}
                  onChange={handleSocialChange}
                  className="w-full glass-input p-2 text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-gray-400">Twitter URL</label>
                <input
                  type="url"
                  name="twitter"
                  value={profileData.social_links.twitter}
                  onChange={handleSocialChange}
                  className="w-full glass-input p-2 text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-gray-400">Instagram URL</label>
                <input
                  type="url"
                  name="instagram"
                  value={profileData.social_links.instagram}
                  onChange={handleSocialChange}
                  className="w-full glass-input p-2 text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-gray-400">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={profileData.social_links.email}
                  onChange={handleSocialChange}
                  className="w-full glass-input p-2 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Section Visibility Toggles */}
          <div className="p-5 rounded-lg bg-white/3 border border-white/5 space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Homepage Section Visibility</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {Object.keys(profileData.section_visibility || {}).map((sectionKey) => (
                <label key={sectionKey} className="flex items-center gap-2.5 text-xs text-gray-300 font-semibold cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={profileData.section_visibility[sectionKey]}
                    onChange={() => handleVisibilityChange(sectionKey)}
                    className="w-4 h-4 rounded accent-violet-600 cursor-pointer"
                  />
                  <span className="capitalize">{sectionKey}</span>
                </label>
              ))}
            </div>
          </div>

          {/* About Section details */}
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm text-gray-300 font-medium">About Section Title</label>
              <input
                type="text"
                name="about_title"
                value={profileData.about_title}
                onChange={handleProfileChange}
                className="w-full glass-input p-3 text-sm"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm text-gray-300 font-medium">Footer Copyright Text</label>
              <input
                type="text"
                name="footer_text"
                value={profileData.footer_text}
                onChange={handleProfileChange}
                className="w-full glass-input p-3 text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-300 font-medium">About Biography Bio</label>
            <textarea
              name="about_bio"
              rows="4"
              value={profileData.about_bio}
              onChange={handleProfileChange}
              className="w-full glass-input p-3 text-sm resize-none"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={profileStatus.saving}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-500 disabled:bg-gray-800 text-white font-semibold rounded-lg shadow-md cursor-pointer transition-colors"
          >
            {profileStatus.saving ? (
              <>Saving Changes... <Loader2 className="animate-spin" size={16} /></>
            ) : (
              <>Save General Settings <Save size={16} /></>
            )}
          </button>
        </form>
      </div>

      {/* Security Credentials Password Form */}
      <div className="glass-panel p-8 rounded-xl border border-white/5 space-y-6">
        <h3 className="text-lg font-bold text-white border-b border-white/5 pb-3 flex items-center gap-2">
          Security Credentials
        </h3>

        {passwordStatus.success && (
          <div className="flex items-center gap-3 p-4 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
            <CheckCircle size={18} />
            <span>Admin password updated successfully!</span>
          </div>
        )}
        {passwordStatus.error && (
          <div className="flex items-center gap-3 p-4 rounded bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
            <AlertCircle size={18} />
            <span>{passwordStatus.error}</span>
          </div>
        )}

        <form onSubmit={handlePasswordSubmit} className="space-y-6">
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm text-gray-300 font-medium">Old Password</label>
              <input
                type="password"
                required
                value={passwords.old_password}
                onChange={(e) => setPasswords(prev => ({ ...prev, old_password: e.target.value }))}
                className="w-full glass-input p-3 text-sm"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm text-gray-300 font-medium">New Password</label>
              <input
                type="password"
                required
                value={passwords.new_password}
                onChange={(e) => setPasswords(prev => ({ ...prev, new_password: e.target.value }))}
                className="w-full glass-input p-3 text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-300 font-medium">Confirm New Password</label>
              <input
                type="password"
                required
                value={passwords.confirm_password}
                onChange={(e) => setPasswords(prev => ({ ...prev, confirm_password: e.target.value }))}
                className="w-full glass-input p-3 text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={passwordStatus.updating}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 disabled:from-gray-700 disabled:to-gray-800 text-white font-semibold rounded-lg shadow-md cursor-pointer transition-all duration-200"
          >
            {passwordStatus.updating ? (
              <>Updating Security... <Loader2 className="animate-spin" size={16} /></>
            ) : (
              <>Update Credentials <Key size={16} /></>
            )}
          </button>
        </form>
      </div>

    </div>
  );
};

export default ProfileManagement;
