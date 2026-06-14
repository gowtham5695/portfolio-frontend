import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';
import { useLocation, Link as RouterLink } from 'react-router-dom';

const Navbar = ({ profile }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
    { name: 'Education', href: '#education' },
    { name: 'Certifications', href: '#certifications' },
    { name: 'Experience', href: '#experience' },
    { name: 'Contact', href: '#contact' },
  ];

  const handleLinkClick = (e, href) => {
    if (!isHome) return;
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'glass-panel py-4 shadow-lg' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <RouterLink to="/" className="text-xl md:text-2xl font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent flex items-center gap-2">
          <span className="font-extrabold">{profile?.name || "Portfolio"}</span>
        </RouterLink>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {isHome && navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleLinkClick(e, link.href)}
              className="text-gray-300 hover:text-white transition-colors text-sm font-medium"
            >
              {link.name}
            </a>
          ))}
          <RouterLink
            to="/admin"
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200"
          >
            Admin Panel <ArrowRight size={14} />
          </RouterLink>
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-300 hover:text-white focus:outline-none"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isOpen && (
        <div className="md:hidden glass-panel absolute top-full left-0 right-0 py-6 px-6 shadow-2xl border-t border-white/5">
          <div className="flex flex-col gap-4">
            {isHome && navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="text-gray-300 hover:text-white transition-colors text-lg font-medium py-1"
              >
                {link.name}
              </a>
            ))}
            <RouterLink
              to="/admin"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-violet-600 to-cyan-600 text-white rounded-lg text-base font-semibold shadow-lg mt-4"
            >
              Admin Panel <ArrowRight size={16} />
            </RouterLink>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
