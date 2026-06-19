import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Hero from '../sections/Hero';
import About from '../sections/About';
import Skills from '../sections/Skills';
import Projects from '../sections/Projects';
import Education from '../sections/Education';
import Certifications from '../sections/Certifications';
import Experience from '../sections/Experience';
import Contact from '../sections/Contact';
import SectionHeader from '../components/SectionHeader';
import portfolioService from '../services/portfolioService';
import { Loader2 } from 'lucide-react';

const PortfolioHome = () => {
  const [data, setData] = useState({
    profile: null,
    skills: [],
    projects: [],
    education: [],
    certifications: [],
    experience: [],
    customSections: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingMessage, setLoadingMessage] = useState("Loading portfolio assets...");

  useEffect(() => {
    // Show a helpful tip if the backend takes longer than 3.5 seconds to respond (common for free-tier Render cold starts)
    const messageTimer = setTimeout(() => {
      setLoadingMessage("Waking up the free-tier backend server. This cold start takes about 50 seconds. Thank you for your patience! ☕");
    }, 3500);

    const fetchAllData = async () => {
      try {
        const [profile, skills, projects, education, certifications, experience, customSections] = await Promise.all([
          portfolioService.getProfile(),
          portfolioService.getSkills(),
          portfolioService.getProjects(),
          portfolioService.getEducation(),
          portfolioService.getCertifications(),
          portfolioService.getExperience(),
          portfolioService.getCustomSections()
        ]);

        setData({
          profile,
          skills,
          projects,
          education,
          certifications,
          experience,
          customSections
        });
      } catch (err) {
        console.error("Error loading portfolio data:", err);
        setError("Failed to connect to the backend server. Make sure MongoDB is active and the API is running.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();

    return () => clearTimeout(messageTimer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030014] flex flex-col items-center justify-center text-white p-6 text-center">
        <Loader2 className="animate-spin text-violet-500 mb-4" size={40} />
        <p className="text-gray-400 text-sm font-medium tracking-wide max-w-sm leading-relaxed">{loadingMessage}</p>
      </div>
    );
  }

  if (error && !data.profile) {
    return (
      <div className="min-h-screen bg-[#030014] flex flex-col items-center justify-center text-white p-6 text-center">
        <div className="max-w-md glass-panel p-8 rounded-xl border border-rose-500/20">
          <h2 className="text-2xl font-bold text-rose-400 mb-4">Connection Error</h2>
          <p className="text-gray-400 text-sm mb-6 leading-relaxed">
            {error}
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white rounded-lg text-sm font-semibold transition-all shadow-md"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  const visibility = data.profile?.section_visibility || {};

  return (
    <div className="relative min-h-screen bg-[#030014] text-white">
      {/* Navigation */}
      <Navbar profile={data.profile} />

      {/* Main Content Sections */}
      <main className="relative">
        {visibility.hero !== false && <Hero profile={data.profile} />}
        
        {visibility.about !== false && (
          <About 
            profile={data.profile} 
            skillsCount={data.skills.length}
            projectsCount={data.projects.length}
            experienceCount={data.experience.length}
          />
        )}
        
        {visibility.skills !== false && <Skills skills={data.skills} />}
        
        {visibility.projects !== false && <Projects projects={data.projects} />}
        
        {visibility.education !== false && <Education education={data.education} />}
        
        {visibility.certifications !== false && <Certifications certifications={data.certifications} />}
        
        {visibility.experience !== false && <Experience experience={data.experience} />}
        
        {/* Render Custom Sections dynamically */}
        {data.customSections.map((sec) => (
          sec.visible !== false && (
            <section key={sec.id} id={sec.title.toLowerCase().replace(/\s+/g, '-')} className="relative py-24 z-10 border-b border-white/5 bg-[#03001e]/5">
              <div className="max-w-7xl mx-auto px-6">
                <SectionHeader title={sec.title} subtitle={sec.subtitle} />
                <div className="glass-panel p-8 rounded-xl border border-white/5 max-w-4xl mx-auto text-gray-300 text-md leading-relaxed whitespace-pre-line hover:border-violet-500/10 transition-colors">
                  {sec.content}
                </div>
              </div>
            </section>
          )
        ))}
        
        {visibility.contact !== false && <Contact profile={data.profile} />}
      </main>

      {/* Footer */}
      <Footer profile={data.profile} />
    </div>
  );
};

export default PortfolioHome;
