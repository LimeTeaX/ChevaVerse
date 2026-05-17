// src/pages/HomePage.jsx
import { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import MovieFinder from './MovieFinder';
import RightSidebar from '../components/layout/RightSidebar';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activePage, setActivePage] = useState('Home');

  return (
    <div className="min-h-screen bg-[#0A1628]">
      <Navbar
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
        onClear={() => setSearchQuery('')}
        activePage={activePage}
        onNavigate={setActivePage}
      />
      <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-6">
        <div className="flex gap-6">
          <div className="flex-1 min-w-0">
            <MovieFinder searchQuery={searchQuery} onSearchChange={setSearchQuery} />
          </div>
          <div className="hidden xl:block flex-shrink-0">
            <RightSidebar onGenreClick={(genre) => {
              setSearchQuery(genre);
              setActivePage('Search');
            }} />
          </div>
        </div>
      </div>
    </div>
  );
}