import React from 'react';
import { motion } from 'framer-motion';
import SectionHeader from '../components/SectionHeader';
import { GraduationCap, Calendar, Award } from 'lucide-react';

const Education = ({ education = [] }) => {
  return (
    <section id="education" className="relative py-24 bg-[#03001e]/10 z-10">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader title="Education" subtitle="My academic timeline, degrees, and certificates achieved." />

        {education.length === 0 ? (
          <div className="text-center text-gray-500 py-10">No education entries added yet. Add them in the admin dashboard.</div>
        ) : (
          <div className="relative max-w-3xl mx-auto">
            {/* Center Timeline Line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-violet-500 via-cyan-500 to-transparent"></div>

            <div className="space-y-12">
              {education.map((item, idx) => {
                const isEven = idx % 2 === 0;

                return (
                  <motion.div 
                    key={item.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="relative flex flex-col md:flex-row items-stretch"
                  >
                    {/* Node Dot Indicator */}
                    <div className="absolute left-4 md:left-1/2 -translate-x-[7px] md:-translate-x-1/2 w-4.5 h-4.5 rounded-full bg-violet-600 border-4 border-[#030014] z-20 shadow-md"></div>

                    {/* Timeline Content Block */}
                    <div className={`w-full md:w-1/2 pl-10 md:pl-0 flex ${isEven ? 'md:justify-end md:pr-10' : 'md:justify-start md:pl-10 md:order-2'}`}>
                      <div className="glass-panel p-6 rounded-xl border border-white/5 shadow-lg max-w-md w-full relative hover:border-violet-500/20 transition-all duration-300">
                        {/* Heading */}
                        <div className="flex justify-between items-start gap-4 mb-3">
                          <div>
                            <span className="inline-flex items-center gap-1 text-xs text-violet-400 font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-violet-500/10 mb-2">
                              <GraduationCap size={12} /> {item.degree}
                            </span>
                            <h3 className="text-lg font-bold text-white leading-snug">{item.field_of_study}</h3>
                            <h4 className="text-gray-300 text-sm font-medium">{item.institution}</h4>
                          </div>
                        </div>

                        {/* Date badge */}
                        <div className="flex items-center gap-2 text-xs text-cyan-400 font-medium mb-3">
                          <Calendar size={13} /> {item.duration}
                        </div>

                        {/* Description */}
                        {item.description && (
                          <p className="text-gray-400 text-sm leading-relaxed mb-3">
                            {item.description}
                          </p>
                        )}

                        {/* Grade badge */}
                        {item.grade && (
                          <div className="inline-flex items-center gap-1 text-xs text-emerald-400 font-semibold px-2 py-1 rounded bg-emerald-500/10">
                            <Award size={12} /> Grade / GPA: {item.grade}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Spacer for MD layouts */}
                    <div className="hidden md:block w-1/2"></div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Education;
