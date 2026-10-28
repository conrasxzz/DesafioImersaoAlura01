import { ExecutionStep, OperatorSymbol, OperationType, UnitTestCase } from '../types/calculator';

export const PYTHON_FULL_CODE = `"""
Calculadora Simples em Python com as 4 Operações Básicas
Desenvolvida para estudantes de Análise e Desenvolvimento de Sistemas (ADS)
e iniciantes em Engenharia de Software.
"""

def somar(a: float, b: float) -> float:
    """
    Retorna a soma de dois números.
    Operador utilizado: +
    """
    return a + b


def subtrair(a: float, b: float) -> float:
    """
    Retorna a diferença entre dois números (a menos b).
    Operador utilizado: -
    """
    return a - b


def multiplicar(a: float, b: float) -> float:
    """
    Retorna o produto de dois números.
    Operador utilizado: *
    """
    return a * b


def dividir(a: float, b: float) -> float:
    """
    Retorna o quociente da divisão de a por b.
    Trata explicitamente o caso de divisão por zero lançando ZeroDivisionError.
    Operador utilizado: /
    """
    if b == 0:
        raise ZeroDivisionError("Não é possível dividir um número por zero!")
    return a / b


def porcentagem(valor: float, taxa: float) -> float:
    """
    Retorna a porcentagem (taxa%) aplicada sobre um determinado valor.
    Exemplo: porcentagem(200, 15) -> 15% de 200 = 30.0
    Fórmula: (valor * taxa) / 100
    Nota didática: No Python puro, o símbolo % é o operador de resto da divisão (módulo).
    Para cálculo de porcentagem comercial, aplicamos a fórmula: (valor * taxa) / 100.
    """
    return (valor * taxa) / 100


def executar_calculo(operacao: str, a: float, b: float) -> float:
    """
    Função controladora que direciona para a operação correta
    utilizando a estrutura de decisão if/elif/else.
    """
    try:
        if operacao == "+":
            return somar(a, b)
        elif operacao == "-":
            return subtrair(a, b)
        elif operacao == "*":
            return multiplicar(a, b)
        elif operacao == "/":
            return dividir(a, b)
        elif operacao == "%":
            return porcentagem(a, b)
        else:
            raise ValueError(f"Operação desconhecida: {operacao}")
    except ZeroDivisionError as erro:
        print(f"Erro aritmético: {erro}")
        raise


# Bloco de execução principal para testar no terminal:
if __name__ == "__main__":
    print("=== Calculadora em Python ===")
    print("Soma (10 + 5):", somar(10, 5))
    print("Subtração (10 - 5):", subtrair(10, 5))
    print("Multiplicação (10 * 5):", multiplicar(10, 5))
    print("Divisão (10 / 5):", dividir(10, 5))
    print("Porcentagem (15% de 200):", porcentagem(200, 15))
    
    # Testando o tratamento de erro seguro:
    try:
        print("Tentativa de dividir por zero:")
        dividir(10, 0)
    except ZeroDivisionError as e:
        print(f"Exceção capturada com sucesso: {e}")
`;

export const CODE_LINES = PYTHON_FULL_CODE.split('\n');

export const OPERATION_MAP: Record<OperatorSymbol, {
  name: string;
  funcName: string;
  type: OperationType;
  lineStart: number;
  lineEnd: number;
  highlightLine: number;
  symbol: string;
  explanation: (a: number, b: number, res: number | null, err: string | null) => string;
}> = {
  '+': {
    name: 'Soma',
    funcName: 'somar',
    type: 'soma',
    lineStart: 8,
    lineEnd: 13,
    highlightLine: 13,
    symbol: '+',
    explanation: (a, b, res) =>
      `A função somar(a=${a}, b=${b}) recebeu dois argumentos numéricos e executou 'return a + b', resultando em ${res}.`,
  },
  '-': {
    name: 'Subtração',
    funcName: 'subtrair',
    type: 'subtracao',
    lineStart: 16,
    lineEnd: 21,
    highlightLine: 21,
    symbol: '-',
    explanation: (a, b, res) =>
      `A função subtrair(a=${a}, b=${b}) calculou a diferença com 'return a - b', resultando em ${res}.`,
  },
  '*': {
    name: 'Multiplicação',
    funcName: 'multiplicar',
    type: 'multiplicacao',
    lineStart: 24,
    lineEnd: 29,
    highlightLine: 29,
    symbol: '×',
    explanation: (a, b, res) =>
      `A função multiplicar(a=${a}, b=${b}) calculou o produto utilizando 'return a * b', resultando em ${res}.`,
  },
  '/': {
    name: 'Divisão',
    funcName: 'dividir',
    type: 'divisao',
    lineStart: 32,
    lineEnd: 40,
    highlightLine: 39,
    symbol: '÷',
    explanation: (a, b, res, err) => {
      if (err) {
        return `A função dividir(a=${a}, b=${b}) avaliou a condição 'if b == 0:' como Verdadeira (True) e lançou a exceção 'ZeroDivisionError'. Na matemática e na computação, a divisão por zero é indefinida.`;
      }
      return `A função dividir(a=${a}, b=${b}) validou que b != 0 e executou 'return a / b', resultando no quociente em ponto flutuante ${res}.`;
    },
  },
  '%': {
    name: 'Porcentagem',
    funcName: 'porcentagem',
    type: 'porcentagem',
    lineStart: 43,
    lineEnd: 52,
    highlightLine: 52,
    symbol: '%',
    explanation: (a, b, res) =>
      `A função porcentagem(valor=${a}, taxa=${b}) calculou ${b}% de ${a} utilizando a fórmula '(valor * taxa) / 100', resultando em ${res}. Nota didática: no Python puro, o operador % calcula o resto da divisão, mas na lógica da calculadora aplicamos a regra matemática da porcentagem.`,
  },
};

export function executePythonOperation(operator: OperatorSymbol, a: number, b: number): ExecutionStep {
  const meta = OPERATION_MAP[operator];
  const now = new Date().toLocaleTimeString('pt-BR');

  if (operator === '/' && b === 0) {
    return {
      functionName: meta.funcName,
      operationType: meta.type,
      paramA: a,
      paramB: b,
      operator,
      result: null,
      error: 'ZeroDivisionError: Não é possível dividir por zero!',
      codeSnippet: `def dividir(a=${a}, b=0):\n    if b == 0:\n        raise ZeroDivisionError("Não é possível dividir um número por zero!")`,
      activeLineIndex: 38, // if b == 0: raise ...
      explanation: meta.explanation(a, b, null, 'ZeroDivisionError'),
      timestamp: now,
    };
  }

  let result = 0;
  switch (operator) {
    case '+':
      result = a + b;
      break;
    case '-':
      result = a - b;
      break;
    case '*':
      result = a * b;
      break;
    case '/':
      result = a / b;
      break;
    case '%':
      result = (a * b) / 100;
      break;
  }

  // Round floating point inaccuracies (e.g. 0.1 + 0.2 = 0.30000000000000004) to reasonable precision
  const cleanResult = parseFloat(result.toFixed(10));

  const codeSnippet = operator === '%'
    ? `def porcentagem(valor=${a}, taxa=${b}):\n    return (valor * taxa) / 100  # => ${cleanResult}`
    : `def ${meta.funcName}(a=${a}, b=${b}):\n    return a ${operator} b  # => ${cleanResult}`;

  return {
    functionName: meta.funcName,
    operationType: meta.type,
    paramA: a,
    paramB: b,
    operator,
    result: cleanResult,
    error: null,
    codeSnippet,
    activeLineIndex: meta.highlightLine,
    explanation: meta.explanation(a, b, cleanResult, null),
    timestamp: now,
  };
}

export function downloadPythonScript(): void {
  const blob = new Blob([PYTHON_FULL_CODE], { type: 'text/x-python;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'calculadora.py';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export const SAMPLE_UNIT_TESTS: UnitTestCase[] = [
  {
    id: 'test-1',
    name: 'Soma de inteiros positivos',
    functionName: 'somar',
    args: [15, 27],
    expected: 42,
    description: 'Verifica a adição básica de dois números inteiros.',
  },
  {
    id: 'test-2',
    name: 'Subtração resultando em negativo',
    functionName: 'subtrair',
    args: [10, 25],
    expected: -15,
    description: 'Demonstra como o Python lida com números negativos.',
  },
  {
    id: 'test-3',
    name: 'Multiplicação com números decimais',
    functionName: 'multiplicar',
    args: [4.5, 2],
    expected: 9,
    description: 'Demonstra tipos float em operações aritméticas.',
  },
  {
    id: 'test-4',
    name: 'Divisão exata',
    functionName: 'dividir',
    args: [100, 4],
    expected: 25,
    description: 'Verifica a divisão normal com retorno de quociente.',
  },
  {
    id: 'test-5',
    name: 'Divisão por zero (Caso de Erro)',
    functionName: 'dividir',
    args: [50, 0],
    expected: 'ZeroDivisionError',
    description: 'Confirma o tratamento de exceção seguro sem travar o sistema.',
  },
  {
    id: 'test-6',
    name: 'Porcentagem (15% de 200)',
    functionName: 'porcentagem',
    args: [200, 15],
    expected: 30,
    description: 'Aplica a fórmula matemática da porcentagem comercial (valor * taxa) / 100.',
  },
];
