import React, { useState } from 'react';
import { generatePrompts } from './services/geminiService';
import { AnalysisResult, PromptMode, LoadingState } from './types';
import { ResultCard } from './components/ResultCard';
import { WandIcon, SparklesIcon, AlertCircleIcon } from './components/Icons';

const App: React.FC = () => {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<PromptMode>(PromptMode.GENERAL);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState<LoadingState>({ isLoading: false, message: '' });
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!input.trim()) return;
    
    setLoading({ isLoading: true, message: 'Analyzing your intent...' });
    setError(null);
    setResult(null);

    try {
      // Small artificial delay to show state changes for better UX
      setTimeout(() => setLoading(prev => ({ ...prev, message: 'Consulting Gemini Architect...' })), 1000);
      setTimeout(() => setLoading(prev => ({ ...prev, message: 'Drafting variations...' })), 2500);

      const data = await generatePrompts(input, mode);
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading({ isLoading: false, message: '' });
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-50 selection:bg-purple-500/30">
      
      {/* Navbar */}
      <nav className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/20">
              <WandIcon className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              PromptForge AI
            </h1>
          </div>
          <div className="text-xs font-medium px-3 py-1 bg-slate-800 rounded-full text-slate-400 border border-slate-700">
            Powered by Gemini 2.5
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-12">
        
        {/* Hero & Input Section */}
        <section className="flex flex-col items-center text-center space-y-6 animate-fadeIn">
          <div className="space-y-2 max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
              Transform Ideas into <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Perfect Prompts</span>
            </h2>
            <p className="text-slate-400 text-lg">
              Don't just write. Engineer. Stop guessing and let AI architect professional-grade prompts for you.
            </p>
          </div>

          <div className="w-full max-w-3xl bg-slate-800/50 p-2 rounded-2xl border border-slate-700 shadow-2xl backdrop-blur-sm">
            <div className="bg-slate-900 rounded-xl p-4 border border-slate-800">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="e.g., I want to write a blog post about coffee, but I want it to be funny and SEO friendly..."
                  className="w-full h-32 bg-transparent text-slate-200 placeholder-slate-500 resize-none focus:outline-none text-lg"
                />
                
                <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-4">
                  <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto">
                    {Object.values(PromptMode).map((m) => (
                      <button
                        key={m}
                        onClick={() => setMode(m)}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                          mode === m 
                            ? 'bg-slate-700 text-white shadow-inner' 
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={handleGenerate}
                    disabled={loading.isLoading || !input.trim()}
                    className={`
                      px-6 py-2 rounded-lg font-semibold text-white shadow-lg transition-all flex items-center gap-2
                      ${loading.isLoading || !input.trim() 
                        ? 'bg-slate-700 cursor-not-allowed opacity-50' 
                        : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 hover:shadow-purple-500/25 active:scale-95'}
                    `}
                  >
                    {loading.isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Processing
                      </>
                    ) : (
                      <>
                        <SparklesIcon className="w-4 h-4" />
                        Enhance Prompt
                      </>
                    )}
                  </button>
                </div>
            </div>
          </div>
          
          {loading.isLoading && (
            <div className="text-slate-400 animate-pulse text-sm">
                {loading.message}
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 flex items-center gap-2">
                <AlertCircleIcon className="w-5 h-5" />
                {error}
            </div>
          )}
        </section>

        {/* Results Section */}
        {result && (
          <section className="space-y-8 animate-slideUp">
            
            {/* Analysis Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Score Card */}
                <div className="col-span-1 bg-slate-800/50 border border-slate-700 rounded-xl p-6 flex flex-col items-center justify-center text-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-2">Original Quality</h3>
                    <div className="relative">
                        <svg className="w-32 h-32 transform -rotate-90">
                            <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-700" />
                            <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="transparent" 
                                className={`${result.originalScore > 75 ? 'text-green-500' : result.originalScore > 50 ? 'text-yellow-500' : 'text-red-500'} transition-all duration-1000 ease-out`}
                                strokeDasharray={351.86}
                                strokeDashoffset={351.86 - (351.86 * result.originalScore) / 100}
                            />
                        </svg>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-3xl font-bold">
                            {result.originalScore}
                        </div>
                    </div>
                </div>

                {/* Critique & Suggestions */}
                <div className="col-span-1 md:col-span-2 bg-slate-800/50 border border-slate-700 rounded-xl p-6 relative overflow-hidden">
                     <div className="space-y-4 relative z-10">
                        <div>
                            <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-1">Critique</h3>
                            <p className="text-slate-300 italic">"{result.critique}"</p>
                        </div>
                        <div className="h-px bg-slate-700/50" />
                        <div>
                            <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-2">Key Improvements Made</h3>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {result.suggestions.map((suggestion, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                                        <div className="mt-1 min-w-[6px] h-[6px] rounded-full bg-blue-500" />
                                        {suggestion}
                                    </li>
                                ))}
                            </ul>
                        </div>
                     </div>
                </div>
            </div>

            <div className="flex items-center gap-4 py-4">
                <div className="h-px bg-slate-800 flex-1" />
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <SparklesIcon className="w-6 h-6 text-purple-400" />
                    Optimized Variations
                </h2>
                <div className="h-px bg-slate-800 flex-1" />
            </div>

            {/* Prompt Variations */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {result.variations.map((prompt, idx) => (
                    <ResultCard key={idx} promptData={prompt} index={idx} />
                ))}
            </div>

          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900 mt-20 py-8 text-center text-slate-500 text-sm">
        <p>&copy; {new Date().getFullYear()} PromptForge AI. Built with React & Gemini.</p>
      </footer>
    </div>
  );
};

export default App;