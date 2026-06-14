import React from 'react';
import { motion } from 'framer-motion';
import SectionHeader from '../components/SectionHeader';
import { Briefcase, Calendar, ExternalLink } from 'lucide-react';

const Experience = ({ experience = [] }) => {
  return (
    <section id="experience" className="relative py-24 bg-[#03001e]/15 z-10">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader title="Professional Experience" subtitle="My professional journey, roles, and internships completed." />

        {experience.length === 0 ? (
          <div className="text-center text-gray-500 py-10">No experience items added yet. Add them in the admin dashboard.</div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-8">
            {experience.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="glass-panel p-8 rounded-xl border border-white/5 shadow-lg flex flex-col md:flex-row gap-6 items-start hover:border-violet-500/20 transition-all duration-300 relative group"
              >
                {/* Visual Icon Node left side */}
                <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-lg hidden md:block">
                  <Briefcase size={24} />
                </div>

                {/* Information content */}
                <div className="flex-grow space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-violet-400 transition-colors">
                        {item.role}
                      </h3>
                      <h4 className="text-gray-300 font-semibold text-md">{item.company}</h4>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-cyan-400 font-medium bg-cyan-950/20 border border-cyan-500/10 px-3 py-1.5 rounded-full w-max">
                      <Calendar size={13} /> {item.duration}
                    </div>
                  </div>

                  {/* Multiline description formatting (splitting paragraphs or list items if needed, or displaying direct text) */}
                  <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-line">
                    {item.description}
                  </p>

                  {/* Certificate attachment */}
                  {item.certificate_link && (
                    <a
                      href={item.certificate_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-violet-400 hover:text-violet-300 font-semibold transition-colors mt-2"
                    >
                      View Internship Certificate/Reference <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Experience;
