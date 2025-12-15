
import React from 'react';

interface EmptyPageProps {
  onAddSection: () => void;
}

const EmptyPage: React.FC<EmptyPageProps> = ({ onAddSection }) => {
  return (
    <div className="flex flex-col items-center justify-center py-32 px-6 text-center animate-in fade-in zoom-in duration-500">
      <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-8">
        <i className="fa-solid fa-plus text-blue-400 text-4xl"></i>
      </div>
      <h2 className="text-3xl font-black text-slate-800 mb-4 tracking-tight">Your Canvas is Ready</h2>
      <p className="text-slate-500 max-w-md mx-auto mb-10 leading-relaxed">
        Start building your unique website by adding sections or using individual elements from the editor tools.
      </p>
      <button 
        onClick={onAddSection}
        className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black shadow-xl hover:bg-blue-700 hover:-translate-y-1 transition-all flex items-center gap-3"
      >
        <i className="fa-solid fa-plus"></i>
        Add First Section
      </button>
    </div>
  );
};

export default EmptyPage;
