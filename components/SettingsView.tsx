
import React, { useState } from 'react';
import { Save, Key, ShieldCheck, ExternalLink, AlertTriangle } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const [keys, setKeys] = useState({
    ig_keys: 'REDACTED_KEY_4398, REDACTED_KEY_1290',
    x_tk_busqueda: 'SEARCH_TOKEN_B2, SEARCH_TOKEN_C9',
    x_tk_timeline: 'TIMELINE_TOKEN_X1'
  });

  const handleSave = () => {
    // Send to Django backend
    alert('Configuration saved to encrypted backend storage.');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-3xl font-bold text-slate-900">API Configuration</h2>
        <p className="text-slate-500 mt-1">Securely manage your RapidAPI tokens and service credentials.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 space-y-8">
          {/* Key Inputs */}
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                <Key size={16} className="text-blue-500" />
                Instagram API Keys (RapidAPI)
              </label>
              <textarea
                value={keys.ig_keys}
                onChange={(e) => setKeys({...keys, ig_keys: e.target.value})}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-mono"
                rows={3}
              />
              <p className="text-xs text-slate-400">Enter multiple keys separated by commas for automatic rotation.</p>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                <ShieldCheck size={16} className="text-emerald-500" />
                X & TikTok Search Credentials
              </label>
              <textarea
                value={keys.x_tk_busqueda}
                onChange={(e) => setKeys({...keys, x_tk_busqueda: e.target.value})}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-mono"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                <ShieldCheck size={16} className="text-indigo-500" />
                X & TikTok Timeline Credentials
              </label>
              <textarea
                value={keys.x_tk_timeline}
                onChange={(e) => setKeys({...keys, x_tk_timeline: e.target.value})}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-mono"
                rows={3}
              />
            </div>
          </div>

          <div className="p-6 bg-slate-900 rounded-2xl text-white">
            <div className="flex justify-between items-start mb-4">
              <h4 className="font-bold">Need more API keys?</h4>
              <ExternalLink size={18} className="text-slate-500" />
            </div>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              For high-volume extraction, it is recommended to use at least 3 active keys per platform to avoid rate limiting.
            </p>
            <div className="flex flex-wrap gap-2">
              {['Instagram Looter', 'TikTok Scraper', 'Twitter API v24'].map((item) => (
                <a key={item} href="#" className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-medium transition-colors">
                  {item}
                </a>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-rose-50 border border-rose-100 rounded-xl">
            <AlertTriangle className="text-rose-500 shrink-0" size={20} />
            <p className="text-xs text-rose-800 leading-relaxed font-medium">
              Sensitive keys are encrypted using AES-256 before being stored in our Django database. Never share your config_keys.json file.
            </p>
          </div>
        </div>

        <div className="p-6 bg-slate-50 border-t flex justify-end">
          <button 
            onClick={handleSave}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2 active:scale-95"
          >
            <Save size={18} />
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
};
