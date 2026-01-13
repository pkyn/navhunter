import React, { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { AnalysisStatus } from '../types';

interface InputFormProps {
  onAnalyze: (url: string) => void;
  status: AnalysisStatus;
}

const InputForm: React.FC<InputFormProps> = ({ onAnalyze, status }) => {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onAnalyze(url);
    }
  };

  const isLoading = status === AnalysisStatus.ANALYZING;

  return (
    <div className="w-full max-w-2xl mx-auto mb-12 relative z-10">
      <form onSubmit={handleSubmit} className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-brand-500 to-indigo-600 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative flex items-center bg-slate-800 rounded-lg border border-slate-700 shadow-xl overflow-hidden">
          <div className="pl-4 text-slate-400">
            <Search size={20} />
          </div>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter website URL (e.g., www.example.com)..."
            className="w-full bg-transparent text-white p-4 outline-none placeholder-slate-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !url.trim()}
            className={`px-6 py-4 font-medium transition-all duration-200 ${
              isLoading || !url.trim()
                ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                : 'bg-brand-600 hover:bg-brand-500 text-white shadow-lg hover:shadow-brand-500/25'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 size={20} className="animate-spin" />
                <span>Scanning</span>
              </div>
            ) : (
              'Analyze'
            )}
          </button>
        </div>
      </form>
      <div className="mt-3 flex justify-between px-1">
        <p className="text-xs text-slate-500">
          Powered by Gemini 2.5 Flash & Google Search Grounding
        </p>
        <p className="text-xs text-slate-500">
          Note: Identifies public navigation via search index
        </p>
      </div>
    </div>
  );
};

export default InputForm;