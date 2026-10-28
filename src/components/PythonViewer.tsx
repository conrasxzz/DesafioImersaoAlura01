import React, { useState } from 'react';
import { Copy, Check, Terminal, BookOpen, PlayCircle, Code2, AlertCircle } from 'lucide-react';
import { ExecutionStep, OperatorSymbol } from '../types/calculator';
import { PYTHON_FULL_CODE, CODE_LINES, OPERATION_MAP, downloadPythonScript } from '../utils/pythonCalculator';

interface PythonViewerProps {
  currentTab: 'tracer' | 'code' | 'concepts' | 'tests';
  onTabChange: (tab: 'tracer' | 'code' | 'concepts' | 'tests') => void;
  lastExecution: ExecutionStep | null;
  activeOperator: OperatorSymbol | null;
  currentDisplayValue: string;
  previousValue: string | null;
}

export const PythonViewer: React.FC<PythonViewerProps> = ({
  currentTab,
  onTabChange,
  lastExecution,
  activeOperator,
  currentDisplayValue,
  previousValue,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(PYTHON_FULL_CODE);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const activeOpMeta = activeOperator ? OPERATION_MAP[activeOperator] : null;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col h-full" id="codigo-python">
      {/* Tabs / Segmented Control */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5 gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 p-1 bg-slate-950/80 rounded-xl border border-slate-800/80">
          <button
            onClick={() => onTabChange('tracer')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              currentTab === 'tracer'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Execução Passo a Passo</span>
          </button>
          <button
            onClick={() => onTabChange('code')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              currentTab === 'code'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Código Fonte .py</span>
          </button>
          <button
            onClick={() => onTabChange('concepts')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              currentTab === 'concepts'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Fundamentos ADS</span>
          </button>
          <button
            onClick={() => onTabChange('tests')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              currentTab === 'tests'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <PlayCircle className="w-3.5 h-3.5" />
            <span>Laboratório de Testes</span>
          </button>
        </div>

        {currentTab === 'code' && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
              title="Copiar código para a área de transferência"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copiado!' : 'Copiar'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Tab 1: Tracer View */}
      {currentTab === 'tracer' && (
        <div className="flex flex-col gap-5 flex-1">
          {/* Real-time Call Box */}
          <div className="bg-slate-950 rounded-xl border border-slate-800 p-4">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
              <span className="font-semibold text-slate-200">Inspetor de Chamada de Função</span>
              <span className="font-mono text-indigo-400">Python 3.12</span>
            </div>

            {lastExecution ? (
              <div className="space-y-4">
                {/* Function signature call */}
                <div className="p-3 bg-slate-900/90 rounded-lg border border-slate-800 font-mono text-sm">
                  <div className="text-slate-400 text-xs mb-1">Assinatura invocada:</div>
                  <div className="text-white flex items-center gap-1.5 flex-wrap">
                    <span className="text-indigo-400">def</span>
                    <span className="font-bold text-amber-300">{lastExecution.functionName}</span>
                    <span className="text-slate-400">(</span>
                    <span className="text-sky-300">a: float = {lastExecution.paramA}</span>
                    <span className="text-slate-400">,</span>
                    <span className="text-sky-300">b: float = {lastExecution.paramB}</span>
                    <span className="text-slate-400">) -&gt;</span>
                    {lastExecution.error ? (
                      <span className="text-rose-400 font-bold">ZeroDivisionError</span>
                    ) : (
                      <span className="text-emerald-400 font-bold">{lastExecution.result}</span>
                    )}
                  </div>
                </div>

                {/* Variable Stack Trace */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/80">
                    <span className="text-xs text-slate-400 block mb-0.5">Parâmetro 1 (a)</span>
                    <div className="font-mono text-base font-bold text-white tabular-nums">
                      {lastExecution.paramA}
                    </div>
                    <span className="text-xs text-slate-500 font-mono">tipo: float</span>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/80">
                    <span className="text-xs text-slate-400 block mb-0.5">Operador Python</span>
                    <div className="font-mono text-base font-bold text-indigo-300">
                      {lastExecution.operator}
                    </div>
                    <span className="text-xs text-slate-500 font-mono">aritmético</span>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/80">
                    <span className="text-xs text-slate-400 block mb-0.5">Parâmetro 2 (b)</span>
                    <div className="font-mono text-base font-bold text-white tabular-nums">
                      {lastExecution.paramB}
                    </div>
                    <span className="text-xs text-slate-500 font-mono">tipo: float</span>
                  </div>
                </div>

                {/* Explanation */}
                <div className="p-3.5 rounded-lg bg-indigo-950/30 border border-indigo-900/50 text-xs text-slate-300 space-y-1.5">
                  <div className="font-semibold text-indigo-300 flex items-center gap-1.5">
                    <span>O que aconteceu por trás dos panos:</span>
                  </div>
                  <p className="leading-relaxed text-slate-200">{lastExecution.explanation}</p>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-slate-400 text-xs space-y-2">
                <p>Nenhuma operação calculada ainda.</p>
                <p className="text-slate-500">
                  {activeOpMeta ? (
                    <span>
                      Você selecionou a operação <strong className="text-indigo-400">{activeOpMeta.name}</strong>. Agora digite o segundo número e clique em <strong>=</strong> para disparar a função Python!
                    </span>
                  ) : (
                    <span>Digite números e escolha uma operação (+, -, ×, ÷) para ver a execução em tempo real.</span>
                  )}
                </p>
              </div>
            )}
          </div>

          {/* Active Function Snippet */}
          <div className="bg-slate-950 rounded-xl border border-slate-800 p-4">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="font-semibold text-slate-200">Trecho do Código em Execução</span>
              <span className="text-xs text-slate-500">
                {lastExecution ? `Função ${lastExecution.functionName}()` : 'Aguardando operação'}
              </span>
            </div>
            <pre className="p-3 bg-slate-900/80 rounded-lg border border-slate-800/80 font-mono text-xs overflow-x-auto text-slate-200 leading-relaxed">
              {lastExecution ? (
                <code>
                  <span className="text-indigo-400">def</span> <span className="text-amber-300">{lastExecution.functionName}</span>
                  (a: <span className="text-sky-300">float</span>, b: <span className="text-sky-300">float</span>) -&gt; <span className="text-sky-300">float</span>:
                  {'\n'}    <span className="text-slate-500">"""{lastExecution.functionName.toUpperCase()} em Python"""</span>
                  {lastExecution.operator === '/' && (
                    <>
                      {'\n'}    <span className="text-indigo-400">if</span> b == 0:
                      {'\n'}        <span className="text-rose-400">raise ZeroDivisionError</span>(<span className="text-emerald-300">"Não é possível dividir por zero!"</span>)
                    </>
                  )}
                  {'\n'}    <span className="text-indigo-400">return</span> a {lastExecution.operator} b  <span className="text-emerald-400 font-bold"># Retorna: {lastExecution.result ?? 'Erro'}</span>
                </code>
              ) : activeOpMeta ? (
                <code>
                  <span className="text-indigo-400">def</span> <span className="text-amber-300">{activeOpMeta.funcName}</span>
                  (a: <span className="text-sky-300">float</span>, b: <span className="text-sky-300">float</span>) -&gt; <span className="text-sky-300">float</span>:
                  {'\n'}    <span className="text-slate-500"># Preparando chamada com a = {previousValue || '0'}</span>
                  {'\n'}    <span className="text-indigo-400">return</span> a {activeOpMeta.symbol === '×' ? '*' : activeOpMeta.symbol === '÷' ? '/' : activeOpMeta.symbol} b
                </code>
              ) : (
                <code>
                  <span className="text-slate-500"># Selecione uma operação na calculadora para inspecionar</span>
                  {'\n'}# Ex: somar(a, b), subtrair(a, b), multiplicar(a, b), dividir(a, b)
                </code>
              )}
            </pre>
          </div>
        </div>
      )}

      {/* Tab 2: Full Python Source Code */}
      {currentTab === 'code' && (
        <div className="flex flex-col flex-1 min-h-[420px]">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Arquivo: <strong className="text-white font-mono">calculadora.py</strong></span>
            <span>Total: {CODE_LINES.length} linhas</span>
          </div>
          <div className="bg-slate-950 rounded-xl border border-slate-800 p-3 overflow-y-auto max-h-[500px] font-mono text-xs text-slate-300 leading-relaxed">
            {CODE_LINES.map((line, idx) => {
              const lineNum = idx + 1;
              const isHighlighted = lastExecution && lastExecution.activeLineIndex === lineNum;
              return (
                <div
                  key={idx}
                  className={`flex items-start gap-3 py-0.5 px-2 rounded ${
                    isHighlighted ? 'bg-indigo-950/80 border-l-2 border-indigo-400 text-white font-bold' : ''
                  }`}
                >
                  <span className="text-slate-600 select-none w-7 text-right shrink-0">
                    {lineNum}
                  </span>
                  <span className="whitespace-pre overflow-x-auto">{line || ' '}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: Software Engineering & Python Concepts */}
      {currentTab === 'concepts' && (
        <div className="space-y-4 overflow-y-auto max-h-[520px] pr-1 text-xs">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="text-indigo-400 font-mono">01.</span>
              O que é uma Função em Python?
            </h4>
            <p className="text-slate-300 leading-relaxed">
              Uma função é um bloco de código reutilizável que realiza uma tarefa específica. Em Python, declaramos funções com a palavra-chave <code className="text-indigo-300 font-mono bg-slate-900 px-1 py-0.5 rounded">def</code>. Por exemplo: <code className="text-amber-300 font-mono">def somar(a, b):</code>.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="text-indigo-400 font-mono">02.</span>
              Parâmetros e Argumentos
            </h4>
            <p className="text-slate-300 leading-relaxed">
              <strong>Parâmetros</strong> são as variáveis listadas na definição da função (<code className="text-sky-300 font-mono">a</code> e <code className="text-sky-300 font-mono">b</code>). <strong>Argumentos</strong> são os valores reais que você passa ao chamar a função (ex: <code className="text-emerald-300 font-mono">somar(15, 27)</code>).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="text-indigo-400 font-mono">03.</span>
              O comando <code className="font-mono text-indigo-300">return</code>
            </h4>
            <p className="text-slate-300 leading-relaxed">
              O <code className="text-indigo-300 font-mono bg-slate-900 px-1 py-0.5 rounded">return</code> finaliza a execução da função e devolve o resultado para a parte do programa que a chamou. Se não houver retorno explícito, o Python retorna <code className="text-slate-400 font-mono">None</code> por padrão.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="text-rose-400 font-mono">04.</span>
              Tratamento de Exceções (<code className="font-mono text-rose-300">ZeroDivisionError</code>)
            </h4>
            <p className="text-slate-300 leading-relaxed">
              Na computação e na matemática, dividir qualquer número por 0 é impossível. Sem tratamento, o programa é interrompido com falha (crash). Em Python, usamos a cláusula <code className="text-rose-300 font-mono">raise ZeroDivisionError</code> e blocos <code className="text-indigo-300 font-mono">try / except</code> para capturar o erro com segurança e avisar o usuário amigavelmente.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="text-indigo-400 font-mono">05.</span>
              Tipos Numéricos: <code className="font-mono text-sky-300">int</code> vs <code className="font-mono text-sky-300">float</code>
            </h4>
            <p className="text-slate-300 leading-relaxed">
              O Python possui inteiros (<code className="font-mono text-sky-300">int</code> como 1, 2, 42) e números decimais (<code className="font-mono text-sky-300">float</code> como 3.14, 0.5). A operação de divisão (<code className="font-mono text-indigo-300">/</code>) em Python sempre retorna um <code className="font-mono text-sky-300">float</code>, mesmo que a divisão seja exata (ex: 4 / 2 resulta em 2.0).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="text-indigo-400 font-mono">06.</span>
              Porcentagem vs Operador Módulo (<code className="font-mono text-indigo-300">%</code>) no Python
            </h4>
            <p className="text-slate-300 leading-relaxed">
              <strong>Atenção iniciante:</strong> No dia a dia e na calculadora, usamos <code className="text-indigo-300 font-mono">%</code> para porcentagem (ex: 15% de 200). Mas no Python nativo, o símbolo <code className="text-amber-300 font-mono">%</code> é o <strong>operador módulo</strong> (calcula o resto da divisão inteira, ex: <code className="text-emerald-300 font-mono">10 % 3 = 1</code>). Por isso, para calcular porcentagem em código, criamos uma função com a fórmula matemática: <code className="text-sky-300 font-mono">(valor * taxa) / 100</code>!
            </p>
          </div>
        </div>
      )}

      {/* Tab 4: Unit Testing Lab */}
      {currentTab === 'tests' && (
        <div className="space-y-4 flex-1 overflow-y-auto max-h-[520px]">
          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300">
            <p className="font-semibold text-white mb-1">Por que testes são vitais na Engenharia de Software?</p>
            <p className="text-slate-400 leading-relaxed">
              Testes garantem que quando você alterar ou melhorar o código no futuro, nada que já funcionava vai quebrar. Veja abaixo 6 casos de teste essenciais:
            </p>
          </div>

          <div className="space-y-2.5">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
              <div>
                <span className="font-semibold text-white">somar(15, 27)</span>
                <p className="text-slate-400 text-xs">Adição básica</p>
              </div>
              <div className="text-right font-mono">
                <span className="text-slate-500">esperado: </span>
                <span className="text-emerald-400 font-bold">42</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
              <div>
                <span className="font-semibold text-white">subtrair(10, 25)</span>
                <p className="text-slate-400 text-xs">Resultado com sinal negativo</p>
              </div>
              <div className="text-right font-mono">
                <span className="text-slate-500">esperado: </span>
                <span className="text-emerald-400 font-bold">-15</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
              <div>
                <span className="font-semibold text-white">multiplicar(4.5, 2)</span>
                <p className="text-slate-400 text-xs">Números decimais (float)</p>
              </div>
              <div className="text-right font-mono">
                <span className="text-slate-500">esperado: </span>
                <span className="text-emerald-400 font-bold">9.0</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
              <div>
                <span className="font-semibold text-white">dividir(100, 4)</span>
                <p className="text-slate-400 text-xs">Quociente de divisão exata</p>
              </div>
              <div className="text-right font-mono">
                <span className="text-slate-500">esperado: </span>
                <span className="text-emerald-400 font-bold">25.0</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-rose-900/60 flex items-center justify-between text-xs">
              <div>
                <span className="font-semibold text-rose-300">dividir(50, 0)</span>
                <p className="text-slate-400 text-xs">Caso de exceção crítica</p>
              </div>
              <div className="text-right font-mono">
                <span className="text-slate-500">esperado: </span>
                <span className="text-rose-400 font-bold">ZeroDivisionError</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-indigo-900/60 flex items-center justify-between text-xs">
              <div>
                <span className="font-semibold text-indigo-300">porcentagem(200, 15)</span>
                <p className="text-slate-400 text-xs">15% de 200 via fórmula (valor * taxa) / 100</p>
              </div>
              <div className="text-right font-mono">
                <span className="text-slate-500">esperado: </span>
                <span className="text-emerald-400 font-bold">30.0</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
