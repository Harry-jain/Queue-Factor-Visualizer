import React from 'react';

const MobileBlocker: React.FC = () => {
  return (
    <div className="md:hidden flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-slate-900 p-4 text-center">
      <div className="w-16 h-16 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-blue-500">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25A2.25 2.25 0 0 1 5.25 3h13.5A2.25 2.25 0 0 1 21 5.25Z" />
        </svg>
      </div>
      <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">Desktop Experience Recommended</h1>
      <p className="text-slate-600 dark:text-slate-400">
        This application is designed for a larger screen. Please switch to a desktop or tablet for the best experience.
      </p>
    </div>
  );
};

export default MobileBlocker;