import { Mail } from 'lucide-react';
import { Github, Linkedin, Twitter, Instagram } from './BrandIcons';

const Footer = ({ profile }) => {
  const currentYear = new Date().getFullYear();
  const socialLinks = profile?.social_links || {};

  const icons = [
    { key: 'github', icon: <Github size={20} />, href: socialLinks.github },
    { key: 'linkedin', icon: <Linkedin size={20} />, href: socialLinks.linkedin },
    { key: 'twitter', icon: <Twitter size={20} />, href: socialLinks.twitter },
    { key: 'instagram', icon: <Instagram size={20} />, href: socialLinks.instagram },
    { key: 'email', icon: <Mail size={20} />, href: socialLinks.email ? `mailto:${socialLinks.email}` : '' }
  ];

  return (
    <footer className="relative border-t border-white/5 bg-[#02000f] py-12 z-10">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <p className="text-gray-400 text-sm text-center md:text-left">
            &copy; {currentYear} {profile?.footer_text || `${profile?.name || "Jane Doe"}. All rights reserved.`}
          </p>
        </div>
        
        <div className="flex gap-6">
          {icons.map((item) => (
            item.href ? (
              <a
                key={item.key}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors duration-200"
                aria-label={`Visit ${item.key}`}
              >
                {item.icon}
              </a>
            ) : null
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
