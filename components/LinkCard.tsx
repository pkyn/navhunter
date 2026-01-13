import React from 'react';
import { ExternalLink, Link as LinkIcon, Globe, ShieldCheck, ShieldAlert } from 'lucide-react';
import { NavigationLink } from '../types';

interface LinkCardProps {
  link: NavigationLink;
}

const LinkCard: React.FC<LinkCardProps> = ({ link }) => {
  const isThirdParty = link.type === 'third-party';

  return (
    <div className={`
      relative overflow-hidden rounded-xl border p-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1
      ${isThirdParty 
        ? 'bg-slate-800/50 border-orange-500/20 hover:border-orange-500/40' 
        : 'bg-slate-800/50 border-brand-500/20 hover:border-brand-500/40'}
    `}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${isThirdParty ? 'bg-orange-500/10 text-orange-400' : 'bg-brand-500/10 text-brand-400'}`}>
            {isThirdParty ? <Globe size={18} /> : <LinkIcon size={18} />}
          </div>
          <div>
            <h3 className="font-semibold text-slate-200 line-clamp-1">{link.name}</h3>
            <p className="text-xs text-slate-500 font-mono mt-0.5 flex items-center gap-1">
              {isThirdParty && <ShieldAlert size={10} className="text-orange-400" />}
              {!isThirdParty && <ShieldCheck size={10} className="text-brand-400" />}
              {link.type === 'internal' ? 'Internal Resource' : 'External Destination'}
            </p>
          </div>
        </div>
        <a 
          href={link.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-slate-500 hover:text-white transition-colors"
          title="Open Link"
        >
          <ExternalLink size={16} />
        </a>
      </div>
      
      <div className="mt-3">
        <div className="bg-slate-900/50 rounded px-2 py-1.5 text-xs font-mono text-slate-400 truncate border border-slate-700/50">
          {link.url}
        </div>
      </div>

      {link.description && (
        <p className="mt-2 text-xs text-slate-400 line-clamp-2">
          {link.description}
        </p>
      )}
    </div>
  );
};

export default LinkCard;