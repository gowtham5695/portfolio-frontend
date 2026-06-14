import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { Github } from '../components/BrandIcons';
import SectionHeader from '../components/SectionHeader';

const Projects = ({ projects = [] }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6, ease: "easeOut" } 
    }
  };

  const defaultImage = "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800&h=500";

  return (
    <section id="projects" className="relative py-24 z-10">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader title="Featured Projects" subtitle="A showcase of web applications and tools that I have designed and engineered." />

        {projects.length === 0 ? (
          <div className="text-center text-gray-500 py-10">No projects added yet. Check back later or add them in the admin dashboard.</div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {projects.map((project) => (
              <motion.div 
                key={project.id}
                variants={cardVariants}
                className="glass-panel rounded-xl overflow-hidden border border-white/5 shadow-lg flex flex-col h-full hover:border-violet-500/20 hover:shadow-violet-500/5 transition-all duration-300 group"
              >
                {/* Image Wrap */}
                <div className="relative h-48 w-full overflow-hidden bg-violet-950/20">
                  <img
                    src={project.image || defaultImage}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => { e.target.src = defaultImage; }}
                  />
                  {/* Overlay hover */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                    {project.github_link && (
                      <a
                        href={project.github_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all duration-200"
                        title="View Code on GitHub"
                      >
                        <Github size={20} />
                      </a>
                    )}
                    {project.live_link && (
                      <a
                        href={project.live_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all duration-200"
                        title="View Live Demo"
                      >
                        <ExternalLink size={20} />
                      </a>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-violet-400 transition-colors">
                    {project.title}
                  </h3>
                  
                  <p className="text-gray-400 text-sm mb-4 line-clamp-3 leading-relaxed flex-grow">
                    {project.description}
                  </p>

                  {/* Badges */}
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-4 border-t border-white/5">
                      {project.technologies.map((tech, idx) => (
                        <span 
                          key={idx}
                          className="px-2 py-0.5 rounded bg-violet-500/10 border border-violet-500/15 text-violet-400 text-xs font-semibold"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Projects;
