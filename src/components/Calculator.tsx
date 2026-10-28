import React, { useEffect, useCallback } from 'react';
import { Delete, RotateCcw, AlertTriangle, ArrowRight, CornerDownLeft } from 'lucide-react';
import { OperatorSymbol, HistoryItem, ExecutionStep } from '../types/calculator';
import { OPERATION_MAP } from '../utils/pythonCalculator';

interface CalculatorProps {
  displayValue: string;
  previousValue: string | null;
  operator: OperatorSymbol | null;
  waitingForSecondOperand: boolean;
  errorMessage: string | null;
  history: HistoryItem[];
  onDigit: (digit: string) => void;
  onOperator: (op: OperatorSymbol) => void;
  onEqual: () => void;
  onClear: () => void;
  onBackspace: () => void;
  onToggleSign: () => void;
  onApplyPreset: (a: number, op: OperatorSymbol, b: number) => void;
  onSelectHistory: (item: HistoryItem) => void;
  lastExecution: ExecutionStep | null;
}

export const Calculator: React.FC<CalculatorProps> = ({
  displayValue,
  previousValue,
  operator,
  waitingForSecondOperand,
  errorMessage,
  history,
  onDigit,
  onOperator,
  onEqual,
  onClear,
  onBackspace,
  onToggleSign,
  onApplyPreset,
  onSelectHistory,
  lastExecution,
}) => {
  // Keyboard event handler
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Avoid capturing shortcuts if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.key >= '0' && e.key <= '9') {
        e.preventDefault();
        onDigit(e.key);
      } else if (e.key === '.' || e.key === ',') {
        e.preventDefault();
        onDigit('.');
      } else if (e.key === '+') {
        e.preventDefault();
        onOperator('+');
      } else if (e.key === '-') {
        e.preventDefault();
        onOperator('-');
      } else if (e.key === '*' || e.key === 'x' || e.key === 'X') {
        e.preventDefault();
        onOperator('*');
      } else if (e.key === '/') {
        e.preventDefault();
        onOperator('/');
      } else if (e.key === '%') {
        e.preventDefault();
        onOperator('%');
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        onEqual();
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        onBackspace();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClear();
      }
    },
    [onDigit, onOperator, onEqual, onBackspace, onClear]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const activeOpMeta = operator ? OPERATION_MAP[operator] : null;

  return (
    <div className="flex flex-col gap-6" id="calculadora">
      {/* Calculator Body Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        {/* Subtle decorative grid/glow behind display */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Display Header / Meta */}
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <div className="flex items-center gap-2">
            <span className="font-medium text-slate-300">Entrada Interativa</span>
            <span aria-hidden="true">·</span>
            <span>Suporta teclado físico</span>
          </div>
          {operator && (
            <div className="text-indigo-400 font-mono text-xs flex items-center gap-1">
              <span>def {activeOpMeta?.funcName}(a, b)</span>
            </div>
          )}
        </div>

        {/* Display Screen */}
        <div className="bg-slate-950/80 border border-slate-800/90 rounded-xl p-4 mb-5 text-right font-mono transition-all">
          {/* Previous Expression */}
          <div className="h-6 text-sm text-slate-400 flex items-center justify-end gap-1.5 overflow-hidden">
            {previousValue !== null && operator !== null ? (
              <>
                <span>{previousValue}</span>
                <span className="text-indigo-400 font-bold">{OPERATION_MAP[operator].symbol}</span>
                {waitingForSecondOperand ? (
                  <span className="text-slate-600">...</span>
                ) : (
                  <span>{displayValue}</span>
                )}
              </>
            ) : lastExecution ? (
              <span className="text-slate-500 text-xs">
                Última chamada: {lastExecution.functionName}({lastExecution.paramA}, {lastExecution.paramB})
              </span>
            ) : (
              <span className="text-slate-600 text-xs">Pronta para calcular</span>
            )}
          </div>

          {/* Current Value */}
          <div className="text-3xl sm:text-4xl font-bold tracking-tight text-white tabular-nums overflow-x-auto whitespace-nowrap py-1">
            {displayValue}
          </div>
        </div>

        {/* Error Notification if any */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-rose-950/60 border border-rose-800/80 rounded-xl text-xs text-rose-200 flex items-start gap-2.5 animate-fadeIn">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5 flex-1">
              <p className="font-semibold text-rose-300 font-mono">ZeroDivisionError</p>
              <p className="text-rose-200/90">{errorMessage}</p>
            </div>
            <button
              onClick={onClear}
              className="text-xs text-rose-400 hover:text-white underline cursor-pointer shrink-0"
            >
              Resetar (C)
            </button>
          </div>
        )}

        {/* Keypad Grid */}
        <div className="grid grid-cols-4 gap-2.5">
          {/* Row 1 */}
          <button
            onClick={onClear}
            className="h-13 rounded-xl bg-slate-800/80 hover:bg-rose-900/40 hover:text-rose-200 hover:border-rose-700/50 border border-slate-700/50 text-slate-200 font-semibold text-base transition-colors flex items-center justify-center cursor-pointer active:scale-95"
            title="Limpar todos os campos (Atalho: Esc)"
          >
            C
          </button>
          <button
            onClick={onBackspace}
            className="h-13 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700/50 text-slate-300 transition-colors flex items-center justify-center cursor-pointer active:scale-95"
            title="Apagar último dígito (Atalho: Backspace)"
          >
            <Delete className="w-5 h-5" />
          </button>
          <button
            onClick={onToggleSign}
            className="h-13 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700/50 text-slate-300 font-mono text-base transition-colors flex items-center justify-center cursor-pointer active:scale-95"
            title="Inverter sinal (+/-)"
          >
            ±
          </button>
          <button
            onClick={() => onOperator('/')}
            className={`h-13 rounded-xl border text-lg font-bold font-mono transition-colors flex items-center justify-center cursor-pointer active:scale-95 ${
              operator === '/'
                ? 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-500/20'
                : 'bg-indigo-950/60 hover:bg-indigo-900/80 text-indigo-300 border-indigo-800/50'
            }`}
            title="Dividir em Python: def dividir(a, b): return a / b"
          >
            ÷
          </button>

          {/* Row 2 */}
          <button
            onClick={() => onDigit('7')}
            className="h-13 rounded-xl bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700/40 text-white font-mono text-lg transition-colors flex items-center justify-center cursor-pointer active:scale-95"
          >
            7
          </button>
          <button
            onClick={() => onDigit('8')}
            className="h-13 rounded-xl bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700/40 text-white font-mono text-lg transition-colors flex items-center justify-center cursor-pointer active:scale-95"
          >
            8
          </button>
          <button
            onClick={() => onDigit('9')}
            className="h-13 rounded-xl bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700/40 text-white font-mono text-lg transition-colors flex items-center justify-center cursor-pointer active:scale-95"
          >
            9
          </button>
          <button
            onClick={() => onOperator('*')}
            className={`h-13 rounded-xl border text-lg font-bold font-mono transition-colors flex items-center justify-center cursor-pointer active:scale-95 ${
              operator === '*'
                ? 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-500/20'
                : 'bg-indigo-950/60 hover:bg-indigo-900/80 text-indigo-300 border-indigo-800/50'
            }`}
            title="Multiplicar em Python: def multiplicar(a, b): return a * b"
          >
            ×
          </button>

          {/* Row 3 */}
          <button
            onClick={() => onDigit('4')}
            className="h-13 rounded-xl bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700/40 text-white font-mono text-lg transition-colors flex items-center justify-center cursor-pointer active:scale-95"
          >
            4
          </button>
          <button
            onClick={() => onDigit('5')}
            className="h-13 rounded-xl bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700/40 text-white font-mono text-lg transition-colors flex items-center justify-center cursor-pointer active:scale-95"
          >
            5
          </button>
          <button
            onClick={() => onDigit('6')}
            className="h-13 rounded-xl bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700/40 text-white font-mono text-lg transition-colors flex items-center justify-center cursor-pointer active:scale-95"
          >
            6
          </button>
          <button
            onClick={() => onOperator('-')}
            className={`h-13 rounded-xl border text-lg font-bold font-mono transition-colors flex items-center justify-center cursor-pointer active:scale-95 ${
              operator === '-'
                ? 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-500/20'
                : 'bg-indigo-950/60 hover:bg-indigo-900/80 text-indigo-300 border-indigo-800/50'
            }`}
            title="Subtrair em Python: def subtrair(a, b): return a - b"
          >
            -
          </button>

          {/* Row 4 */}
          <button
            onClick={() => onDigit('1')}
            className="h-13 rounded-xl bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700/40 text-white font-mono text-lg transition-colors flex items-center justify-center cursor-pointer active:scale-95"
          >
            1
          </button>
          <button
            onClick={() => onDigit('2')}
            className="h-13 rounded-xl bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700/40 text-white font-mono text-lg transition-colors flex items-center justify-center cursor-pointer active:scale-95"
          >
            2
          </button>
          <button
            onClick={() => onDigit('3')}
            className="h-13 rounded-xl bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700/40 text-white font-mono text-lg transition-colors flex items-center justify-center cursor-pointer active:scale-95"
          >
            3
          </button>
          <button
            onClick={() => onOperator('+')}
            className={`h-13 rounded-xl border text-lg font-bold font-mono transition-colors flex items-center justify-center cursor-pointer active:scale-95 ${
              operator === '+'
                ? 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-500/20'
                : 'bg-indigo-950/60 hover:bg-indigo-900/80 text-indigo-300 border-indigo-800/50'
            }`}
            title="Somar em Python: def somar(a, b): return a + b"
          >
            +
          </button>

          {/* Row 5 */}
          <button
            onClick={() => onDigit('0')}
            className="h-13 rounded-xl bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700/40 text-white font-mono text-lg transition-colors flex items-center justify-center cursor-pointer active:scale-95"
          >
            0
          </button>
          <button
            onClick={() => onDigit('.')}
            className="h-13 rounded-xl bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700/40 text-white font-mono text-lg transition-colors flex items-center justify-center cursor-pointer active:scale-95"
            title="Ponto decimal (float)"
          >
            .
          </button>
          <button
            onClick={() => onOperator('%')}
            className={`h-13 rounded-xl border text-lg font-bold font-mono transition-colors flex items-center justify-center cursor-pointer active:scale-95 ${
              operator === '%'
                ? 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-500/20'
                : 'bg-indigo-950/60 hover:bg-indigo-900/80 text-indigo-300 border-indigo-800/50'
            }`}
            title="Porcentagem em Python: def porcentagem(valor, taxa): return (valor * taxa) / 100"
          >
            %
          </button>
          <button
            onClick={onEqual}
            className="h-13 rounded-xl bg-emerald-600 hover:bg-emerald-500 border border-emerald-500/60 text-white text-xl font-bold font-mono transition-all flex items-center justify-center cursor-pointer shadow-lg shadow-emerald-950/40 active:scale-95 focus-visible:outline-2 focus-visible:outline-emerald-400"
            title="Executar chamada da função em Python (Atalho: Enter ou =)"
          >
            =
          </button>
        </div>

        {/* Quick Presets / Test scenarios for learning */}
        <div className="mt-5 pt-4 border-t border-slate-800/80">
          <p className="text-xs text-slate-400 mb-2 font-medium">Exemplos rápidos para testar:</p>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            <button
              onClick={() => onApplyPreset(15, '+', 27)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800/70 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700/40 text-xs font-mono text-center transition-colors cursor-pointer"
            >
              15 + 27
            </button>
            <button
              onClick={() => onApplyPreset(50, '-', 18)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800/70 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700/40 text-xs font-mono text-center transition-colors cursor-pointer"
            >
              50 - 18
            </button>
            <button
              onClick={() => onApplyPreset(7, '*', 8)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800/70 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700/40 text-xs font-mono text-center transition-colors cursor-pointer"
            >
              7 × 8
            </button>
            <button
              onClick={() => onApplyPreset(10, '/', 0)}
              className="px-2.5 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 hover:text-rose-100 border border-rose-800/40 text-xs font-mono text-center transition-colors cursor-pointer"
              title="Testar como o Python trata divisão por zero"
            >
              10 ÷ 0 (!)
            </button>
            <button
              onClick={() => onApplyPreset(200, '%', 15)}
              className="px-2.5 py-1.5 rounded-lg bg-indigo-950/40 hover:bg-indigo-900/60 text-indigo-300 hover:text-indigo-100 border border-indigo-800/40 text-xs font-mono text-center transition-colors cursor-pointer"
              title="Calcular 15% de 200"
            >
              200 % 15
            </button>
          </div>
        </div>
      </div>

      {/* History of operations */}
      {history.length > 0 && (
        <div className="bg-slate-900/70 border border-slate-800/90 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3 text-xs text-slate-400 font-medium">
            <span>Histórico de Cálculos</span>
            <span className="text-slate-500">{history.length} operações</span>
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {history.slice(0, 5).map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectHistory(item)}
                className="p-2.5 rounded-xl bg-slate-950/60 hover:bg-slate-800/60 border border-slate-800/60 transition-colors flex items-center justify-between text-xs cursor-pointer group"
                title="Clique para carregar este valor no display"
              >
                <div className="font-mono text-slate-300 flex items-center gap-2">
                  <span className="text-slate-500 font-sans">{item.timestamp}</span>
                  <span aria-hidden="true" className="text-slate-700">·</span>
                  <span>{item.expression}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-emerald-400 group-hover:text-emerald-300">
                    = {item.result}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
