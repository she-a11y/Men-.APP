import React, { useState } from 'react';
import { X, Copy, Check, Download, FileCode, FileSpreadsheet } from 'lucide-react';

interface CodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CodeModal: React.FC<CodeModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'app.py' | 'products.csv'>('app.py');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const downloadFile = (filename: string, path: string) => {
    const link = document.createElement('a');
    link.href = path;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🐍</span>
            <div>
              <h3 className="font-bold text-slate-800 text-lg">
                Arquitectura Python &amp; Streamlit
              </h3>
              <p className="text-xs text-slate-500">
                Fitxers generats a l&apos;arrel del projecte per executar en local amb <code className="bg-slate-100 px-1 py-0.5 rounded text-emerald-700">streamlit run app.py</code>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab selector */}
        <div className="flex items-center justify-between px-6 py-2.5 bg-slate-50 border-b border-slate-200">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('app.py')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'app.py'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              app.py (Lògica Streamlit)
            </button>
            <button
              onClick={() => setActiveTab('products.csv')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'products.csv'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              products.csv (Base de dades Mercadona)
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => downloadFile(activeTab, `/${activeTab}`)}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-medium cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Descarregar {activeTab}
            </button>
          </div>
        </div>

        {/* Instructions / code preview */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-900 text-slate-100 font-mono text-xs">
          <div className="mb-4 p-3 bg-slate-800/80 rounded-lg border border-slate-700 text-emerald-400 font-sans text-xs">
            💡 <b>Com executar en el teu ordinador:</b>
            <div className="mt-1 font-mono text-[11px] text-slate-300">
              1. pip install streamlit pandas openpyxl<br/>
              2. streamlit run app.py
            </div>
          </div>

          <div className="text-slate-400 text-xs font-sans mb-2">
            El fitxer <b>{activeTab}</b> ja s&apos;ha creat a l&apos;arrel del projecte i s&apos;ha integrat completament. Pots descarregar-lo directament amb el botó superior.
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 text-white text-xs font-semibold rounded-lg hover:bg-slate-900 cursor-pointer"
          >
            Tancar
          </button>
        </div>
      </div>
    </div>
  );
};
