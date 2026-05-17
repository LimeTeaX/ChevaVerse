// src/components/landing/Footer.jsx
import { Film, Mail, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#0A1628]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <img
                src="src/assets/img/chevaverse.png"
                alt="ChevaVerse"
                className="w-8 h-8 rounded-xl object-cover"
              />
              <span className="font-display font-bold text-xl gradient-text">ChevaVerse</span>
            </div>
            <p className="text-gray-500 text-sm max-w-md">
              Your ultimate destination for discovering movies, TV shows, and anime.
              Fast, free, and beautifully designed.
            </p>
          </div>

          <div>
            <h4 className="text-white text-sm font-semibold mb-4">Product</h4>
            <ul className="space-y-2">
              <li><button onClick={() => window.location.href = '/app'} className="text-gray-500 hover:text-cyan-400 text-sm transition-colors">Launch App</button></li>
              <li><button onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })} className="text-gray-500 hover:text-cyan-400 text-sm transition-colors">Features</button></li>
              <li><button onClick={() => document.getElementById('preview')?.scrollIntoView({ behavior: 'smooth' })} className="text-gray-500 hover:text-cyan-400 text-sm transition-colors">Preview</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white text-sm font-semibold mb-4">Connect</h4>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-all"
              >
                <yes-icon name="skill-icons:github-light" className="w-4 h-4"></yes-icon>
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-all"
              >
                <yes-icon name="skill-icons:twitter" className="w-4 h-4"></yes-icon>
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-all"
              >
                <Mail size={16} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-xs">© {new Date().getFullYear()} ChevaVerse. All rights reserved.</p>
          <p className="text-gray-600 text-xs">Made with <Heart size={10} className="inline text-red-400" /> by ChevaEnjoyer</p>
        </div>
      </div>
    </footer>
  );
}