import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SectionHeader from '../components/SectionHeader';
import { Mail, Send, CheckCircle, AlertCircle } from 'lucide-react';
import portfolioService from '../services/portfolioService';

const Contact = ({ profile }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [status, setStatus] = useState({
    submitting: false,
    success: false,
    error: null
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setStatus({ submitting: false, success: false, error: "Please fill in all required fields." });
      return;
    }

    setStatus({ submitting: true, success: false, error: null });
    try {
      await portfolioService.submitMessage(formData);
      setStatus({ submitting: false, success: true, error: null });
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setStatus(prev => ({ ...prev, success: false })), 5000);
    } catch (err) {
      console.error(err);
      setStatus({
        submitting: false,
        success: false,
        error: err.response?.data?.detail?.[0]?.msg || err.response?.data?.detail || "Something went wrong. Please check your inputs."
      });
    }
  };

  return (
    <section id="contact" className="relative py-24 z-10">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader title="Contact Me" subtitle="Have an exciting project idea, internship opportunity, or just want to chat? Send me a message!" />

        <div className="grid md:grid-cols-12 gap-12 max-w-5xl mx-auto items-stretch">
          
          {/* Details Box */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="md:col-span-5 glass-panel p-8 rounded-xl border border-white/5 shadow-lg flex flex-col justify-between"
          >
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">Let's Connect</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-8">
                I am actively checking my inbox for new inquiries. Feel free to reach out, and I will get back to you as soon as possible (usually within 24 hours).
              </p>

              <div className="space-y-6">
                {profile?.social_links?.email && (
                  <div className="flex gap-4 items-center">
                    <div className="p-3 bg-violet-500/10 rounded-lg text-violet-400">
                      <Mail size={20} />
                    </div>
                    <div>
                      <h4 className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Email Me</h4>
                      <a href={`mailto:${profile.social_links.email}`} className="text-white hover:text-violet-400 transition-colors font-medium break-all">
                        {profile.social_links.email}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Availability info card */}
            <div className="p-4 rounded-lg bg-white/5 border border-white/5 mt-8">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-white text-xs font-semibold uppercase tracking-wider">Availability Status</span>
              </div>
              <p className="text-gray-400 text-sm mt-1.5">{profile?.availability_status || "Available for Freelance & Jobs"}</p>
            </div>
          </motion.div>

          {/* Form Box */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="md:col-span-7 glass-panel p-8 rounded-xl border border-white/5 shadow-lg"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Form Status Notifications */}
              {status.success && (
                <div className="flex items-center gap-3 p-4 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
                  <CheckCircle size={18} />
                  <span>Message sent successfully! Thank you for getting in touch.</span>
                </div>
              )}
              {status.error && (
                <div className="flex items-center gap-3 p-4 rounded bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
                  <AlertCircle size={18} />
                  <span>{status.error}</span>
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm text-gray-300 font-medium">Your Name <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full glass-input p-3 text-sm"
                    placeholder="John Doe"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm text-gray-300 font-medium">Your Email <span className="text-rose-500">*</span></label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full glass-input p-3 text-sm"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm text-gray-300 font-medium">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full glass-input p-3 text-sm"
                  placeholder="Collaboration details"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm text-gray-300 font-medium">Message <span className="text-rose-500">*</span></label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full glass-input p-3 text-sm resize-none"
                  placeholder="Write your message here..."
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={status.submitting}
                className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 disabled:from-gray-700 disabled:to-gray-800 disabled:text-gray-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-cyan-500/20 hover:scale-101 transition-all duration-200"
              >
                {status.submitting ? "Sending..." : (
                  <>
                    Send Message <Send size={16} />
                  </>
                )}
              </button>

            </form>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Contact;
