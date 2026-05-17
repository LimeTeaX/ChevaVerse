// src/components/landing/Navbar.jsx
import { useState } from 'react';
import { Film, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  const handleNavigate = (path) => {
    window.location.href = path;
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#0A1628]/95 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2 cursor-pointer group" onClick={() => scrollToSection('hero')}>
            <img src="/chevaverse.png" alt="ChevaVerse" className="w-8 h-8 rounded-xl object-cover" />
            <span className="font-display font-bold text-xl gradient-text">ChevaVerse</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollToSection('features')} className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">Features</button>
            <button onClick={() => scrollToSection('preview')} className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">Preview</button>
            <button onClick={() => scrollToSection('testimonials')} className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">Reviews</button>
            <button onClick={() => handleNavigate('/app')} className="btn-primary px-5 py-2 rounded-xl text-sm font-semibold">Launch App →</button>
          </div>

          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2 rounded-lg bg-white/5 border border-white/10">
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10">
            <div className="flex flex-col gap-3">
              <button onClick={() => scrollToSection('features')} className="text-gray-400 hover:text-cyan-400 transition-colors py-2 text-left">Features</button>
              <button onClick={() => scrollToSection('preview')} className="text-gray-400 hover:text-cyan-400 transition-colors py-2 text-left">Preview</button>
              <button onClick={() => scrollToSection('testimonials')} className="text-gray-400 hover:text-cyan-400 transition-colors py-2 text-left">Reviews</button>
              <button onClick={() => handleNavigate('/app')} className="btn-primary px-5 py-2 rounded-xl text-sm font-semibold text-center">Launch App →</button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}