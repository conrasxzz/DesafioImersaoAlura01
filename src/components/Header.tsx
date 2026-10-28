import React from 'react';
import { Download } from 'lucide-react';
import { downloadPythonScript } from '../utils/pythonCalculator';

interface HeaderProps {
  onSelectTab?: (tab: 'tracer' | 'code' | 'concepts' | 'tests') => void;
}

export const Header: React.FC<HeaderProps> = ({ onSelectTab }) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-6 py-3.5">
        {/* Zone 1: Brand wordmark */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-mono font-bold text-sm">
            Py
          </div>
          <a
            href="/"
            className="text-lg font-bold tracking-tight text-white hover:text-indigo-300 transition-colors whitespace-nowrap"
          >
            Calculadora<span className="text-indigo-400">.py</span>
          </a>
        </div>

        {/* Zone 2: 4 single-line nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
          <a
            href="#calculadora"
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            Calculadora
          </a>
          <button
            onClick={() => onSelectTab?.('tracer')}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 text-left"
          >
            Execução Passo a Passo
          </button>
          <button
            onClick={() => onSelectTab?.('code')}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 text-left"
          >
            Código Python
          </button>
          <button
            onClick={() => onSelectTab?.('concepts')}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 text-left"
          >
            Conceitos de Software
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={downloadPythonScript}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-indigo-400"
            title="Baixar arquivo calculadora.py completo para seu computador"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Baixar calculadora.py</span>
          </button>
        </div>
      </div>
    </header>
  );
};
