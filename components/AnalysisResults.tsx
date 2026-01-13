import React from 'react';
import { AnalysisResult, NavigationLink } from '../types';
import LinkCard from './LinkCard';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Info, ExternalLink, AlertCircle, FileCode, Code2 } from 'lucide-react';

interface AnalysisResultsProps {
  result: AnalysisResult;
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({ result }) => {
  const { links, summary, groundingSources, scriptsAndStylesheets } = result;

  const internalLinks = links.filter(l => l.type === 'internal');
  const thirdPartyLinks = links.filter(l => l.type === 'third-party');
  const hasLinks = links.length > 0;
  const hasAssets = scriptsAndStylesheets && scriptsAndStylesheets.length > 0;
  
  const data = [
    { name: 'Internal', value: internalLinks.length, color: '#0ea5e9' },
    { name: 'Third Party', value: thirdPartyLinks.length, color: '#f97316' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Summary Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-2 mb-4">
            <Info className="text-brand-400" size={20} />
            <h2 className="text-lg font-semibold text-white">Site Summary</h2>
          </div>
          <p className="text-slate-300 leading-relaxed">
            {summary}
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
             <div className="bg-slate-900/50 rounded-lg px-4 py-2 border border-slate-700">
                <span className="text-2xl font-bold text-white mr-2">{links.length}</span>
                <span className="text-sm text-slate-400">Total Links</span>
             </div>
             <div className="bg-slate-900/50 rounded-lg px-4 py-2 border border-slate-700">
                <span className="text-2xl font-bold text-brand-400 mr-2">{internalLinks.length}</span>
                <span className="text-sm text-slate-400">Internal</span>
             </div>
             <div className="bg-slate-900/50 rounded-lg px-4 py-2 border border-slate-700">
                <span className="text-2xl font-bold text-orange-400 mr-2">{thirdPartyLinks.length}</span>
                <span className="text-sm text-slate-400">External</span>
             </div>
          </div>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl flex flex-col justify-center items-center">
          <h3 className="text-sm font-semibold text-slate-400 mb-4 uppercase tracking-wider">Link Distribution</h3>
          {hasLinks ? (
            <div className="w-full h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="rgba(0,0,0,0)" />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }} 
                    itemStyle={{ color: '#f8fafc' }}
                  />
                  <Legend iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-48 flex flex-col items-center justify-center text-slate-600">
              <AlertCircle size={32} className="mb-2 opacity-50" />
              <span className="text-sm">No link data available</span>
            </div>
          )}
        </div>
      </div>

      {hasLinks ? (
        <>
          {/* Internal Links Grid */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white pl-1 flex items-center gap-2">
              <span className="w-2 h-6 bg-brand-500 rounded-full"></span>
              Internal Navigation
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {internalLinks.map((link, idx) => (
                <LinkCard key={`internal-${idx}`} link={link} />
              ))}
              {internalLinks.length === 0 && (
                 <p className="col-span-full text-slate-500 italic px-4">No internal links identified.</p>
              )}
            </div>
          </div>

          {/* External Links Grid */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white pl-1 flex items-center gap-2">
               <span className="w-2 h-6 bg-orange-500 rounded-full"></span>
               Third-Party / External Links
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {thirdPartyLinks.map((link, idx) => (
                <LinkCard key={`external-${idx}`} link={link} />
              ))}
              {thirdPartyLinks.length === 0 && (
                 <p className="col-span-full text-slate-500 italic px-4">No third-party links identified.</p>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-12 bg-slate-800/30 rounded-2xl border border-slate-700 border-dashed">
          <p className="text-slate-400 mb-2">No navigation links were retrieved.</p>
          <p className="text-sm text-slate-600">The site might be inaccessible or blocked by safety filters. Check the summary above for details.</p>
        </div>
      )}

      {/* Assets / CDNs Section */}
      {hasAssets && (
        <div className="space-y-4">
           <h2 className="text-xl font-semibold text-white pl-1 flex items-center gap-2">
              <span className="w-2 h-6 bg-indigo-500 rounded-full"></span>
              Detected Assets & CDNs
           </h2>
           <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
             {scriptsAndStylesheets.map((url, idx) => (
               <div 
                 key={idx} 
                 className={`
                   flex items-center gap-3 p-4 
                   ${idx !== scriptsAndStylesheets.length - 1 ? 'border-b border-slate-800' : ''}
                   hover:bg-slate-800 transition-colors
                 `}
               >
                 <div className="p-2 rounded bg-indigo-500/10 text-indigo-400">
                    <Code2 size={16} />
                 </div>
                 <div className="min-w-0 flex-1">
                   <p className="text-sm font-mono text-slate-300 truncate" title={url}>{url}</p>
                 </div>
                 <a 
                   href={url}
                   target="_blank"
                   rel="noopener noreferrer"
                   className="text-slate-500 hover:text-white"
                 >
                   <ExternalLink size={14} />
                 </a>
               </div>
             ))}
           </div>
        </div>
      )}

      {/* Sources Attribution */}
      {groundingSources.length > 0 && (
        <div className="mt-12 pt-8 border-t border-slate-800">
           <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-4">Data Sources (Google Search Grounding)</h4>
           <div className="flex flex-wrap gap-3">
             {groundingSources.map((source, idx) => (
               <a 
                 key={idx} 
                 href={source.uri} 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-full text-xs text-brand-400 hover:text-brand-300 transition-colors"
               >
                 <ExternalLink size={10} />
                 {source.title}
               </a>
             ))}
           </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisResults;