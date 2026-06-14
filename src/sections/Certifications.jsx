import React from 'react';
import { motion } from 'framer-motion';
import SectionHeader from '../components/SectionHeader';
import { Award, ExternalLink, Calendar } from 'lucide-react';

const Certifications = ({ certifications = [] }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 15 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <section id="certifications" className="relative py-24 z-10">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader title="Licenses & Certifications" subtitle="Professional credentials and certificates that validate my skill sets." />

        {certifications.length === 0 ? (
          <div className="text-center text-gray-500 py-10">No certifications added yet. Add them in the admin dashboard.</div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {certifications.map((cert) => (
              <motion.div 
                key={cert.id}
                variants={cardVariants}
                className="glass-panel p-6 rounded-xl border border-white/5 shadow-md flex flex-col justify-between hover:border-violet-500/20 transition-all duration-300"
              >
                <div>
                  {/* Icon and Title */}
                  <div className="flex gap-4 items-start mb-4">
                    <div className="p-3 bg-violet-500/10 rounded-lg text-violet-400">
                      <Award size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white leading-snug">{cert.title}</h3>
                      <h4 className="text-gray-400 text-sm font-medium">{cert.issuer}</h4>
                    </div>
                  </div>

                  {/* Date */}
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-6 font-medium">
                    <Calendar size={13} /> Issued {cert.date}
                  </div>
                </div>

                {/* Verification Link */}
                {cert.verification_link && (
                  <a
                    href={cert.verification_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 w-full py-2 border border-white/10 hover:border-violet-500/40 hover:bg-violet-500/5 text-gray-300 hover:text-white rounded-lg text-sm font-medium transition-all duration-200"
                  >
                    Verify Credential <ExternalLink size={13} />
                  </a>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Certifications;
