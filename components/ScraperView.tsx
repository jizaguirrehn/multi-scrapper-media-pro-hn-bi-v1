
import React, { useState, useRef } from 'react';
import { Platform, ScrapeResult } from '../types';
import { 
  FileUp, 
  Send, 
  Trash2, 
  Play, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  Download,
  Search,
  Zap
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface ScraperViewProps {
  platform: Platform;
}

export const ScraperView: React.FC<ScraperViewProps> = ({ platform }) => {
  const [inputMode, setInputMode] = useState<'manual' | 'file'>('manual');
  const [manualText, setManualText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<ScrapeResult[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getPlatformColors = () => {
    switch (platform) {
      case Platform.INSTAGRAM: return 'border-pink-500 text-pink-500';
      case Platform.TIKTOK: return 'border-slate-900 text-slate-900';
      case Platform.X: return 'border-blue-500 text-blue-500';
    }
  };

  const handleRunScraper = async () => {
    if (inputMode === 'manual' && !manualText.trim()) return;
    
    setIsProcessing(true);
    setStatus('Connecting to Django backend...');
    
    // Simulate API call to Django
    await new Promise(r => setTimeout(r, 2000));
    setStatus(`Extracting data from ${platform.toUpperCase()}...`);
    await new Promise(r => setTimeout(r, 1500));

    // Mock results for demo
    const mockResults: ScrapeResult[] = manualText.split('\n').filter(u => u.trim()).map((user, i) => ({
      id: Math.random().toString(),
      platform,
      username: user.trim().replace('@', ''),
      followers: Math.floor(Math.random() * 1000000),
      date: new Date().toLocaleDateString(),
      likes: Math.floor(Math.random() * 5000),
      comments: Math.floor(Math.random() * 200),
      description: `Exploring the latest trends on ${platform}. #vibe #social`,
      sentiment: Math.random() > 0.5 ? 'positive' : 'neutral'
    }));

    setResults(prev => [...mockResults, ...prev]);
    setIsProcessing(false);
    setStatus('Completed successfully!');
    setTimeout(() => setStatus(null), 3000);
  };

  // Fix: Added missing Zap import and implemented state update for sentiment analysis using Gemini API
  const analyzeSentiment = async (result: ScrapeResult) => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analyze the sentiment of this social media post: "${result.description}". Return ONLY one word: POSITIVE, NEGATIVE, or NEUTRAL.`,
      });
      
      const sentiment = response.text?.trim().toLowerCase();
      if (sentiment && ['positive', 'negative', 'neutral'].includes(sentiment)) {
        setResults(prev => prev.map(r => r.id === result.id ? { ...r, sentiment: sentiment as any } : r));
      }
    } catch (error) {
      console.error('Sentiment analysis failed:', error);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <h2 className="text-3xl font-bold text-slate-900">
          Extractor: <span className="capitalize">{platform === 'ig' ? 'Instagram' : platform === 'tk' ? 'TikTok' : 'X (Twitter)'}</span>
        </h2>
        <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${getPlatformColors()} uppercase tracking-wider`}>
          Active
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Configuration Panel */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex border-b">
              <button 
                onClick={() => setInputMode('manual')}
                className={`flex-1 py-4 text-sm font-semibold transition-colors ${inputMode === 'manual' ? 'bg-slate-50 text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-800'}`}
              >
                Manual Entry
              </button>
              <button 
                onClick={() => setInputMode('file')}
                className={`flex-1 py-4 text-sm font-semibold transition-colors ${inputMode === 'file' ? 'bg-slate-50 text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-800'}`}
              >
                CSV Upload
              </button>
            </div>
            
            <div className="p-6">
              {inputMode === 'manual' ? (
                <div className="space-y-4">
                  <label className="text-sm font-bold text-slate-700">Enter Usernames or Links</label>
                  <textarea
                    value={manualText}
                    onChange={(e) => setManualText(e.target.value)}
                    placeholder="one_user_per_line&#10;@another_user"
                    className="w-full h-40 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm font-mono"
                  />
                  <p className="text-xs text-slate-500 italic">Separate handles or URLs with new lines.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-200 rounded-2xl p-10 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-slate-50 hover:border-blue-300 transition-all group"
                  >
                    <div className="p-3 bg-blue-50 text-blue-500 rounded-full group-hover:scale-110 transition-transform">
                      <FileUp size={24} />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-slate-700">Drop your CSV here</p>
                      <p className="text-xs text-slate-500 mt-1">Or click to browse files</p>
                    </div>
                    <input type="file" ref={fileInputRef} className="hidden" accept=".csv" />
                  </div>
                  <div className="p-4 bg-amber-50 rounded-xl flex gap-3">
                    <AlertCircle className="text-amber-500 shrink-0" size={20} />
                    <p className="text-xs text-amber-800 leading-relaxed">
                      Make sure your CSV has a column named "handle" or "link" for automatic detection.
                    </p>
                  </div>
                </div>
              )}

              <button
                onClick={handleRunScraper}
                disabled={isProcessing}
                className={`w-full mt-6 py-4 rounded-xl flex items-center justify-center gap-3 font-bold transition-all shadow-lg ${
                  isProcessing 
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                    : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-blue-500/30 active:scale-[0.98]'
                }`}
              >
                {isProcessing ? <Loader2 className="animate-spin" size={20} /> : <Play fill="currentColor" size={20} />}
                {isProcessing ? 'Processing Tasks...' : 'Run Extraction'}
              </button>

              {status && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg flex items-center gap-3 animate-in fade-in zoom-in duration-300">
                  <CheckCircle2 className="text-blue-500" size={16} />
                  <span className="text-xs font-medium text-blue-700">{status}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col min-h-[500px]">
            <div className="p-6 border-b flex justify-between items-center bg-white sticky top-0 z-10 rounded-t-2xl">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Extracted Data</h3>
                <p className="text-sm text-slate-500">Live feed from background tasks</p>
              </div>
              <div className="flex gap-2">
                <button 
                  disabled={results.length === 0}
                  className="p-2.5 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200 disabled:opacity-30"
                >
                  <Download size={18} />
                </button>
                <button 
                  onClick={() => setResults([])}
                  disabled={results.length === 0}
                  className="p-2.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors border border-rose-100 disabled:opacity-30"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            {results.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center opacity-50">
                <div className="bg-slate-100 p-6 rounded-full mb-4">
                  <Search size={48} className="text-slate-300" />
                </div>
                <h4 className="text-lg font-bold text-slate-500">No data yet</h4>
                <p className="text-sm text-slate-400 max-w-xs mt-1">
                  Start an extraction task to see results populating here in real-time.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">User</th>
                      <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Reach</th>
                      <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                      <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Metrics</th>
                      <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Analysis</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {results.map((res) => (
                      <tr key={res.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500 text-xs">
                              {res.username.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-900">@{res.username}</p>
                              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">{platform}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <p className="text-sm font-semibold text-slate-700">{res.followers.toLocaleString()}</p>
                          <p className="text-[10px] text-slate-400">Followers</p>
                        </td>
                        <td className="p-4">
                          <span className="text-xs text-slate-500 font-medium">{res.date}</span>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-3">
                            <div className="flex items-center gap-1 text-slate-600">
                              <Loader2 size={12} className="text-slate-400" />
                              <span className="text-xs font-bold">{res.likes}</span>
                            </div>
                            {res.comments !== undefined && (
                              <div className="flex items-center gap-1 text-slate-600">
                                <AlertCircle size={12} className="text-slate-400" />
                                <span className="text-xs font-bold">{res.comments}</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                             <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                               res.sentiment === 'positive' ? 'bg-emerald-100 text-emerald-700' : 
                               res.sentiment === 'negative' ? 'bg-rose-100 text-rose-700' :
                               'bg-slate-100 text-slate-600'
                             }`}>
                               {res.sentiment || 'Analyzing...'}
                             </span>
                             <button 
                               onClick={() => analyzeSentiment(res)}
                               className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-500 hover:text-blue-700"
                             >
                               <Zap size={14} />
                             </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
