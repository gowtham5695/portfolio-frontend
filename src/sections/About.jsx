import React from 'react';
import { motion } from 'framer-motion';
import SectionHeader from '../components/SectionHeader';
import { Award, Briefcase, Code, BookOpen } from 'lucide-react';

const About = ({ profile, skillsCount = 0, projectsCount = 0, experienceCount = 0 }) => {
  const stats = [
    { label: 'Projects Built', value: projectsCount, icon: <Briefcase size={22} className="text-cyan-400" /> },
    { label: 'Skills Mastered', value: skillsCount, icon: <Code size={22} className="text-violet-400" /> },
    { label: 'Work Experiences', value: experienceCount, icon: <Award size={22} className="text-fuchsia-400" /> }
  ];

  return (
    <section id="about" className="relative py-24 z-10">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader title="About Me" subtitle="Get to know my story, my background, and what drives my work." />

        <div className="grid md:grid-cols-12 gap-12 items-center">
          {/* Bio text column */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="md:col-span-7 flex flex-col gap-6"
          >
            <h3 className="text-2xl md:text-3xl font-bold text-white leading-tight">
              {profile?.about_title || "Crafting digital experiences with precision & code"}
            </h3>
            
            <p className="text-gray-400 text-lg leading-relaxed">
              {profile?.about_bio || "I am a dedicated full-stack developer with experience in python, react, and cloud technologies. I love building tools that solve real-world problems and creating interfaces that are a joy to use."}
            </p>

            <div className="p-5 rounded-xl bg-white/5 border border-white/5 flex gap-4 items-start">
              <div className="p-3 bg-violet-500/10 rounded-lg text-violet-400">
                <BookOpen size={24} />
              </div>
              <div>
                <h4 className="text-white font-semibold mb-1">{profile?.about_card_title || "Constant Learning"}</h4>
                <p className="text-gray-400 text-sm">{profile?.about_card_desc || "I'm continuously refining my knowledge of algorithms, systems architecture, and UI/UX design trends to deliver top-notch products."}</p>
              </div>
            </div>
          </motion.div>

          {/* Stats grid column */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="md:col-span-5 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-1 gap-6"
          >
            {stats.map((stat, idx) => (
              <div 
                key={idx}
                className="glass-panel p-6 rounded-xl flex items-center gap-5 border border-white/5 shadow-md hover:border-violet-500/20 transition-all duration-300"
              >
                <div className="p-3 rounded-lg bg-white/5">
                  {stat.icon}
                </div>
                <div>
                  <div className="text-3xl font-extrabold text-white mb-0.5">{stat.value}</div>
                  <div className="text-gray-400 text-sm font-medium">{stat.label}</div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
