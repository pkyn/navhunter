import React, { useState } from 'react';
import { Radar, AlertTriangle, PlayCircle } from 'lucide-react';
import InputForm from './components/InputForm';
import AnalysisResults from './components/AnalysisResults';
import { AnalysisStatus, AnalysisResult } from './types';
import { analyzeWebsiteNav } from './services/gemini';

const App: React.FC = () => {
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (url: string) => {
    setStatus(AnalysisStatus.ANALYZING);
    setError(null);
    setResult(null);

    try {
      const data = await analyzeWebsiteNav(url);
      setResult(data);
      setStatus(AnalysisStatus.COMPLETED);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred while analyzing the URL.");
      setStatus(AnalysisStatus.ERROR);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-900 font-sans text-slate-100">
      
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-brand-900/20 blur-3xl pointer-events-none rounded-full"></div>
      <div className="absolute top-20 right-0 w-96 h-96 bg-indigo-900/10 blur-3xl pointer-events-none rounded-full"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <header className="flex flex-col items-center justify-center text-center mb-16 space-y-4">
          <div className="inline-flex items-center justify-center p-3 bg-slate-800 rounded-2xl shadow-xl border border-slate-700/50 mb-4">
            <Radar className="text-brand-400 animate-pulse-slow" size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
            Nav<span className="text-brand-400">Hunter</span>
          </h1>
          <p className="max-w-xl text-lg text-slate-400">
            Uncover website structures instantly. Analyze navigation menus and detect third-party integrations with AI-powered search.
          </p>
        </header>

        {/* Input Section */}
        <InputForm onAnalyze={handleAnalyze} status={status} />

        {/* Content Area */}
        <div className="min-h-[400px]">
          {status === AnalysisStatus.IDLE && (
            <div className="flex flex-col items-center justify-center h-64 text-slate-600 border-2 border-dashed border-slate-800 rounded-3xl p-8">
              <PlayCircle size={48} className="mb-4 opacity-50" />
              <p className="text-lg font-medium">Ready to analyze</p>
              <p className="text-sm">Enter a URL above to begin the scan</p>
            </div>
          )}

          {status === AnalysisStatus.ANALYZING && (
            <div className="flex flex-col items-center justify-center h-64 space-y-4 animate-pulse">
              <div className="w-16 h-16 border-4 border-brand-500/30 border-t-brand-500 rounded-full animate-spin"></div>
              <p className="text-brand-400 font-medium tracking-wide">ANALYZING STRUCTURE...</p>
              <p className="text-slate-500 text-sm">Querying Google Search Grounding</p>
            </div>
          )}

          {status === AnalysisStatus.ERROR && (
            <div className="bg-red-900/20 border border-red-500/20 rounded-2xl p-6 text-center max-w-lg mx-auto">
              <div className="inline-flex p-3 rounded-full bg-red-900/30 text-red-400 mb-4">
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Analysis Failed</h3>
              <p className="text-red-200 mb-4">{error}</p>
              <button 
                onClick={() => setStatus(AnalysisStatus.IDLE)}
                className="text-sm text-white underline hover:text-red-300"
              >
                Try Again
              </button>
            </div>
          )}

          {status === AnalysisStatus.COMPLETED && result && (
            <AnalysisResults result={result} />
          )}
        </div>
      </div>
    </div>
  );
};

export default App;