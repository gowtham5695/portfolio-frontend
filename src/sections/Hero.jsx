import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, FileText, ArrowDown } from 'lucide-react';
import { Github, Linkedin, Twitter, Instagram } from '../components/BrandIcons';

const Hero = ({ profile }) => {
  const [text, setText] = useState('');
  const [loopNum, setLoopNum] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [delta, setDelta] = useState(100);

  const taglines = profile?.taglines && profile.taglines.length > 0 
    ? profile.taglines 
    : ["Full Stack Developer", "Software Engineer", "Problem Solver"];

  const socialLinks = profile?.social_links || {};

  useEffect(() => {
    let ticker = setInterval(() => {
      tick();
    }, delta);

    return () => clearInterval(ticker);
  }, [text, isDeleting, delta]);

  const tick = () => {
    let i = loopNum % taglines.length;
    let fullText = taglines[i];
    let updatedText = isDeleting 
      ? fullText.substring(0, text.length - 1) 
      : fullText.substring(0, text.length + 1);

    setText(updatedText);

    if (isDeleting) {
      setDelta(50);
    }

    if (!isDeleting && updatedText === fullText) {
      setIsDeleting(true);
      setDelta(2000); // Delay before deleting
    } else if (isDeleting && updatedText === '') {
      setIsDeleting(false);
      setLoopNum(loopNum + 1);
      setDelta(150); // Pause before starting typing again
    }
  };

  const icons = [
    { key: 'github', icon: <Github size={20} />, href: socialLinks.github },
    { key: 'linkedin', icon: <Linkedin size={20} />, href: socialLinks.linkedin },
    { key: 'twitter', icon: <Twitter size={20} />, href: socialLinks.twitter },
    { key: 'instagram', icon: <Instagram size={20} />, href: socialLinks.instagram },
    { key: 'email', icon: <Mail size={20} />, href: socialLinks.email ? `mailto:${socialLinks.email}` : '' }
  ];

  const handleScrollDown = () => {
    document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden z-10">
      {/* Background glow spots */}
      <div className="glow-spot bg-violet-600 top-20 left-10 w-96 h-96"></div>
      <div className="glow-spot bg-cyan-600 bottom-10 right-10 w-96 h-96"></div>

      <div className="max-w-7xl mx-auto px-6 w-full grid md:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Info Column */}
        <div className="md:col-span-7 flex flex-col justify-center text-center md:text-left order-2 md:order-1">
          {/* Availability Badge */}
          {profile?.availability_status && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold w-max mx-auto md:mx-0 mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              {profile.availability_status}
            </motion.div>
          )}

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4"
          >
            Hi, I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400">{profile?.name || "Jane Doe"}</span>
          </motion.h1>

          <motion.h3 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl md:text-3xl text-gray-300 font-medium mb-6 min-h-[40px]"
          >
            I am a <span className="text-violet-400 font-semibold typing-cursor">{text}</span>
          </motion.h3>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-gray-400 text-lg max-w-xl mb-8 leading-relaxed mx-auto md:mx-0"
          >
            {profile?.title || "Full Stack Software Engineer"} &mdash; Specializing in building secure, scalable, and visually compelling web applications.
          </motion.p>

          {/* Action Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start mb-8"
          >
            {profile?.resume_url && (
              <a
                href={profile.resume_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-cyan-500/20 hover:scale-102 transition-all duration-200 w-full sm:w-auto justify-center"
              >
                <FileText size={18} /> Download Resume
              </a>
            )}
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 py-3 border border-white/10 hover:border-violet-500/40 hover:bg-white/5 text-gray-200 font-semibold rounded-lg hover:scale-102 transition-all duration-200 w-full sm:w-auto text-center"
            >
              Get In Touch
            </a>
          </motion.div>

          {/* Social Links */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex gap-5 justify-center md:justify-start"
          >
            {icons.map((item) => (
              item.href ? (
                <a
                  key={item.key}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-full bg-white/5 border border-white/5 text-gray-400 hover:text-white hover:border-violet-500/40 hover:bg-violet-950/20 transition-all duration-200"
                  aria-label={item.key}
                >
                  {item.icon}
                </a>
              ) : null
            ))}
          </motion.div>
        </div>

        {/* Profile Image Column */}
        <div className="md:col-span-5 flex justify-center order-1 md:order-2">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
            className="relative"
          >
            {/* Gradient ring */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-violet-600 to-cyan-400 blur-lg opacity-40 animate-pulse"></div>
            
            <div className="relative p-1.5 rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
              <img
                src={profile?.profile_image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400&h=400"}
                alt={profile?.name || "Profile"}
                className="w-64 h-64 md:w-80 md:h-80 object-cover rounded-xl shadow-2xl"
              />
            </div>
          </motion.div>
        </div>

      </div>

      {/* Scroll Down Button */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 hidden md:block">
        <button 
          onClick={handleScrollDown}
          className="text-gray-500 hover:text-violet-400 transition-colors animate-bounce"
          aria-label="Scroll Down"
        >
          <ArrowDown size={28} />
        </button>
      </div>
    </section>
  );
};

export default Hero;
