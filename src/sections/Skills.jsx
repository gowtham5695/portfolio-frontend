import React from 'react';
import { motion } from 'framer-motion';
import SectionHeader from '../components/SectionHeader';
import * as Icons from 'lucide-react';

const DynamicIcon = ({ name, className, size = 20 }) => {
  const IconComponent = Icons[name] || Icons.Code;
  return <IconComponent className={className} size={size} />;
};

const Skills = ({ skills = [] }) => {
  // Dynamically group skills by category
  const groupedSkills = skills.reduce((acc, skill) => {
    const cat = skill.category || "General";
    if (!acc[cat]) {
      acc[cat] = [];
    }
    acc[cat].push(skill);
    return acc;
  }, {});

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <section id="skills" className="relative py-24 bg-[#03001e]/20 z-10">
      <div className="glow-spot bg-indigo-600 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px]"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <SectionHeader title="Technical Skills" subtitle="My developer stack and competencies, categorized by area of expertise." />

        {skills.length === 0 ? (
          <div className="text-center text-gray-500 py-10">No skills added yet. Check back later or add them in the admin dashboard.</div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {Object.keys(groupedSkills).map((category, catIdx) => (
              <motion.div 
                key={category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: catIdx * 0.1 }}
                className="glass-panel p-8 rounded-xl border border-white/5 shadow-lg"
              >
                <h3 className="text-2xl font-bold text-white mb-6 pb-3 border-b border-white/5 flex items-center gap-3">
                  <span className="p-2 rounded-lg bg-violet-500/10 text-violet-400">
                    <DynamicIcon name={category === "Frontend" ? "Layout" : category === "Backend" ? "Server" : category === "Database" ? "Database" : "Cpu"} size={22} />
                  </span>
                  {category}
                </h3>

                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="space-y-6"
                >
                  {groupedSkills[category].map((skill) => (
                    <motion.div key={skill.id} variants={itemVariants} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-2.5 text-white font-medium">
                          <DynamicIcon name={skill.icon} className="text-cyan-400" size={16} />
                          {skill.name}
                        </span>
                        <span className="text-gray-400 text-sm">{skill.level}%</span>
                      </div>
                      
                      {/* Progress bar wrapper */}
                      <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className="h-full bg-gradient-to-r from-violet-500 to-cyan-400 rounded-full"
                        ></motion.div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Skills;
