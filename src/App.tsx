import React, { useState } from 'react';
import { Header } from './components/Header';
import { Calculator } from './components/Calculator';
import { PythonViewer } from './components/PythonViewer';
import { OperatorSymbol, HistoryItem, ExecutionStep } from './types/calculator';
import { executePythonOperation } from './utils/pythonCalculator';
import { BookMarked, Sparkles, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [displayValue, setDisplayValue] = useState<string>('0');
  const [previousValue, setPreviousValue] = useState<string | null>(null);
  const [operator, setOperator] = useState<OperatorSymbol | null>(null);
  const [waitingForSecondOperand, setWaitingForSecondOperand] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [lastExecution, setLastExecution] = useState<ExecutionStep | null>(null);
  const [activeTab, setActiveTab] = useState<'tracer' | 'code' | 'concepts' | 'tests'>('tracer');

  // Digit clicked
  const handleDigit = (digit: string) => {
    setErrorMessage(null);

    if (waitingForSecondOperand) {
      if (digit === '.') {
        setDisplayValue('0.');
      } else {
        setDisplayValue(digit);
      }
      setWaitingForSecondOperand(false);
      return;
    }

    if (digit === '.') {
      if (!displayValue.includes('.')) {
        setDisplayValue(displayValue + '.');
      }
      return;
    }

    if (displayValue === '0') {
      setDisplayValue(digit);
    } else {
      // Limit length to avoid layout overflow
      if (displayValue.replace('-', '').replace('.', '').length < 12) {
        setDisplayValue(displayValue + digit);
      }
    }
  };

  // Operator (+, -, *, /) clicked
  const handleOperator = (nextOperator: OperatorSymbol) => {
    setErrorMessage(null);
    const inputValue = parseFloat(displayValue);

    if (previousValue !== null && operator !== null && !waitingForSecondOperand) {
      // Calculate intermediate result
      const prev = parseFloat(previousValue);
      const step = executePythonOperation(operator, prev, inputValue);

      if (step.error) {
        setErrorMessage(step.error);
        setLastExecution(step);
        setActiveTab('tracer');
        return;
      }

      setLastExecution(step);
      setDisplayValue(String(step.result));
      setPreviousValue(String(step.result));
    } else {
      setPreviousValue(displayValue);
    }

    setOperator(nextOperator);
    setWaitingForSecondOperand(true);
  };

  // Equal (=) clicked
  const handleEqual = () => {
    if (previousValue === null || operator === null) {
      return;
    }

    const paramA = parseFloat(previousValue);
    const paramB = parseFloat(displayValue);

    const step = executePythonOperation(operator, paramA, paramB);
    setLastExecution(step);
    setActiveTab('tracer');

    const opSymbol = operator === '*' ? '×' : operator === '/' ? '÷' : operator;
    const expression = `${paramA} ${opSymbol} ${paramB}`;

    if (step.error) {
      setErrorMessage(step.error);
      const newHistoryItem: HistoryItem = {
        id: String(Date.now()),
        expression,
        result: 'Erro',
        functionCall: `${step.functionName}(${paramA}, ${paramB})`,
        hasError: true,
        timestamp: step.timestamp,
      };
      setHistory((prev) => [newHistoryItem, ...prev]);
    } else {
      setErrorMessage(null);
      setDisplayValue(String(step.result));
      setPreviousValue(null);
      setOperator(null);
      setWaitingForSecondOperand(true);

      const newHistoryItem: HistoryItem = {
        id: String(Date.now()),
        expression,
        result: String(step.result),
        functionCall: `${step.functionName}(${paramA}, ${paramB})`,
        hasError: false,
        timestamp: step.timestamp,
      };
      setHistory((prev) => [newHistoryItem, ...prev]);
    }
  };

  // Clear (C)
  const handleClear = () => {
    setDisplayValue('0');
    setPreviousValue(null);
    setOperator(null);
    setWaitingForSecondOperand(false);
    setErrorMessage(null);
  };

  // Backspace
  const handleBackspace = () => {
    if (waitingForSecondOperand) return;
    if (displayValue.length > 1) {
      setDisplayValue(displayValue.slice(0, -1));
    } else {
      setDisplayValue('0');
    }
  };

  // Toggle +/-
  const handleToggleSign = () => {
    if (displayValue === '0') return;
    if (displayValue.startsWith('-')) {
      setDisplayValue(displayValue.slice(1));
    } else {
      setDisplayValue('-' + displayValue);
    }
  };

  // Apply one of the quick scenario presets
  const handleApplyPreset = (a: number, op: OperatorSymbol, b: number) => {
    setPreviousValue(String(a));
    setOperator(op);
    setDisplayValue(String(b));
    setWaitingForSecondOperand(false);

    const step = executePythonOperation(op, a, b);
    setLastExecution(step);
    setActiveTab('tracer');

    const opSymbol = op === '*' ? '×' : op === '/' ? '÷' : op;
    const expression = `${a} ${opSymbol} ${b}`;

    if (step.error) {
      setErrorMessage(step.error);
    } else {
      setErrorMessage(null);
      setDisplayValue(String(step.result));
      setPreviousValue(null);
      setOperator(null);
      setWaitingForSecondOperand(true);
    }

    const newHistoryItem: HistoryItem = {
      id: String(Date.now()),
      expression,
      result: step.error ? 'Erro' : String(step.result),
      functionCall: `${step.functionName}(${a}, ${b})`,
      hasError: !!step.error,
      timestamp: step.timestamp,
    };
    setHistory((prev) => [newHistoryItem, ...prev]);
  };

  // Click on a past history item to reuse its result
  const handleSelectHistory = (item: HistoryItem) => {
    if (!item.hasError) {
      setDisplayValue(item.result);
      setWaitingForSecondOperand(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Top Bar Header */}
      <Header onSelectTab={(tab) => setActiveTab(tab)} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8">
        {/* Intro Hero Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-indigo-400 mb-2">
              <BookMarked className="w-4 h-4" />
              <span>Imersão em Engenharia de Software &amp; IA</span>
              <span aria-hidden="true">·</span>
              <span>Atividade 01</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Calculadora Didática em Python
            </h1>
            <p className="mt-1 text-sm text-slate-400 max-w-2xl leading-relaxed">
              Interface limpa conectada ao código Python real com as operações básicas (soma, subtração, multiplicação, divisão e porcentagem). Veja parâmetros, escopo e retorno em cada cálculo.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-400 shrink-0">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>5 Operações Didáticas</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Tratamento de Exceção</span>
            </div>
          </div>
        </div>

        {/* Dual-Zone Sandbox Layout: Left (Calculator) + Right (Python Inspector) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Column 1: Clean Functional Calculator (5 cols on desktop) */}
          <div className="lg:col-span-5">
            <Calculator
              displayValue={displayValue}
              previousValue={previousValue}
              operator={operator}
              waitingForSecondOperand={waitingForSecondOperand}
              errorMessage={errorMessage}
              history={history}
              onDigit={handleDigit}
              onOperator={handleOperator}
              onEqual={handleEqual}
              onClear={handleClear}
              onBackspace={handleBackspace}
              onToggleSign={handleToggleSign}
              onApplyPreset={handleApplyPreset}
              onSelectHistory={handleSelectHistory}
              lastExecution={lastExecution}
            />
          </div>

          {/* Column 2: Python Code & Execution Deck (7 cols on desktop) */}
          <div className="lg:col-span-7">
            <PythonViewer
              currentTab={activeTab}
              onTabChange={setActiveTab}
              lastExecution={lastExecution}
              activeOperator={operator}
              currentDisplayValue={displayValue}
              previousValue={previousValue}
            />
          </div>
        </div>
      </main>

      {/* Clean Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">Calculadora.py</span>
            <span aria-hidden="true">·</span>
            <span>Construído com Python, React e Tailwind CSS</span>
          </div>
          <div>
            <span>Desenvolvido para aprendizado em Engenharia de Software</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
