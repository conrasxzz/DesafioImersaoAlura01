export type OperationType = 'soma' | 'subtracao' | 'multiplicacao' | 'divisao' | 'porcentagem';

export type OperatorSymbol = '+' | '-' | '*' | '/' | '%';

export interface ExecutionStep {
  functionName: string;
  operationType: OperationType;
  paramA: number;
  paramB: number;
  operator: OperatorSymbol;
  result: number | null;
  error: string | null;
  codeSnippet: string;
  activeLineIndex: number;
  explanation: string;
  timestamp: string;
}

export interface CalculatorState {
  displayValue: string;
  previousValue: string | null;
  operator: OperatorSymbol | null;
  waitingForSecondOperand: boolean;
  errorMessage: string | null;
}

export interface HistoryItem {
  id: string;
  expression: string;
  result: string;
  functionCall: string;
  hasError: boolean;
  timestamp: string;
}

export interface UnitTestCase {
  id: string;
  name: string;
  functionName: string;
  args: [number, number];
  expected: number | 'ZeroDivisionError';
  description: string;
}
