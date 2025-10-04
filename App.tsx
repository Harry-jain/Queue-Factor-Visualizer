import React, { useState } from 'react';
import Introduction from './components/Introduction.tsx';
import Visualization from './components/Visualization.tsx';
import Assessment from './components/Assessment.tsx';
import MobileBlocker from './components/MobileBlocker.tsx';

type Page = 'intro' | 'viz' | 'mcq';

const NavButton = React.memo(({ onClick, isActive, children }: {
  onClick: () => void;
  isActive: boolean;
  children: React.ReactNode;
}) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
      isActive
        ? 'bg-blue-100 text-blue-700 dark:bg-slate-700 dark:text-blue-400'
        : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-slate-700 dark:hover:text-gray-200'
    }`}
  >
    {children}
  </button>
));

const App: React.FC = () => {
  const [page, setPage] = useState<Page>('intro');

  let content;
  if (page === 'intro') {
    content = <Introduction onNavigate={() => setPage('viz')} />;
  } else if (page === 'viz') {
    content = <Visualization onNavigate={() => setPage('mcq')} />;
  } else {
    content = <Assessment />;
  }

  return (
    <>
      <div className="hidden md:flex min-h-screen bg-gray-100 text-slate-800 dark:bg-slate-900 dark:text-slate-200 font-sans flex-col">
        <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm sticky top-0 z-50 shadow-md border-b border-gray-200 dark:border-slate-700">
          <div className="container mx-auto px-6 py-3 flex justify-between items-center">
            <div className="flex items-center gap-8">
              <h1 className="text-xl md:text-2xl font-bold text-blue-600 dark:text-blue-500 tracking-wider">
                Queue Factor Visualizer
              </h1>
              <nav className="hidden md:flex items-center gap-2">
                <NavButton onClick={() => setPage('intro')} isActive={page === 'intro'}>
                  Introduction
                </NavButton>
                <NavButton onClick={() => setPage('viz')} isActive={page === 'viz'}>
                  Visualizer
                </NavButton>
                <NavButton onClick={() => setPage('mcq')} isActive={page === 'mcq'}>
                  Assessment
                </NavButton>
              </nav>
            </div>
          </div>
        </header>

        <main className="container mx-auto p-4 md:p-8 flex-grow">
          {content}
        </main>

        <footer className="bg-gray-200 dark:bg-slate-800 py-4 text-center text-gray-600 dark:text-gray-400 text-sm">
          <p>
            Queue Factor Visualizer. An educational tool for exploring ML concepts.
          </p>
          <p className="mt-1">Made by Harsh Jain (B54) and team</p>
        </footer>
      </div>
      <MobileBlocker />
    </>
  );
};

export default App;