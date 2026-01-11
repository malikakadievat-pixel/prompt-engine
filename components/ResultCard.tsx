import React, { useState } from 'react';
import { OptimizedPrompt } from '../types';
import { CopyIcon, CheckIcon, SparklesIcon } from './Icons';

interface ResultCardProps {
  promptData: OptimizedPrompt;
  index: number;
}

export const ResultCard: React.FC<ResultCardProps> = ({ promptData, index }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(promptData.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden hover:border-blue-500/50 transition-all duration-300 shadow-lg group">
      {/* Header */}
      <div className="bg-slate-900/50 p-4 border-b border-slate-700 flex justify-between items-center">
        <div className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                index === 0 ? 'bg-purple-500' : index === 1 ? 'bg-blue-500' : 'bg-emerald-500'
            }`}>
                {index + 1}
            </div>
            <div>
                <h3 className="font-semibold text-white">{promptData.title}</h3>
                <p className="text-xs text-slate-400">{promptData.method}</p>
            </div>
        </div>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <SparklesIcon className="w-4 h-4 text-slate-500" />
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="relative">
          <pre className="whitespace-pre-wrap font-mono text-sm text-slate-300 bg-slate-950 p-4 rounded-lg border border-slate-800 leading-relaxed max-h-[300px] overflow-y-auto">
            {promptData.content}
          </pre>
          <button
            onClick={handleCopy}
            className="absolute top-2 right-2 p-2 bg-slate-800 hover:bg-slate-700 rounded-md border border-slate-700 transition-colors text-slate-300"
            title="Copy to clipboard"
          >
            {copied ? <CheckIcon className="w-4 h-4 text-green-400" /> : <CopyIcon className="w-4 h-4" />}
          </button>
        </div>

        {/* Explanation */}
        <div className="mt-4 bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
            <p className="text-xs text-blue-200">
                <span className="font-bold text-blue-400">Why this works:</span> {promptData.explanation}
            </p>
        </div>
      </div>
    </div>
  );
};