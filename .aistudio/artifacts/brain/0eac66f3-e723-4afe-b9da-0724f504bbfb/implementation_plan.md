# Calculadora Didática em Python: As 4 Operações Básicas

Uma aplicação web com interface moderna e minimalista que integra uma calculadora funcional com as 4 operações fundamentais (soma, subtração, multiplicação e divisão) e um executor/visualizador interativo de código Python em tempo real, projetada especificamente para quem está iniciando em engenharia de software e imersão em IA.

### User Review & Critical Decisions

> [!IMPORTANT]
> As decisões abaixo foram alinhadas com você para garantir o melhor aproveitamento do aprendizado:

- **Integração do Python**: Calculadora visual conectada a um executor e visualizador em tempo real, demonstrando a função Python exata invocada a cada clique.
- **Disposição da Interface**: Layout em duas colunas complementares (lado esquerdo: calculadora física/touch intuitiva e limpa; lado direito: editor/console do código Python com explicação linha por linha e pilha de execução).
- **Execução Passo a Passo**: Inspeção visual dos parâmetros (`a` e `b`), retorno da função, e tratamento seguro de exceções (como `ZeroDivisionError`).
- **Exportação do Código**: Botão direto para copiar ou baixar o arquivo `calculadora.py` pronto e comentado para estudo local em qualquer ambiente Python.

---

### 1. Overview & Core Concept

- **O que faz**: Oferece uma calculadora interativa com botões de dígitos (0 a 9), operadores (`+`, `-`, `*`, `/`), botão de limpar (`C`), backspace e igual (`=`). Paralelamente, cada ação aciona e destaca o código Python real correspondente, exibindo como o Python recebe os argumentos, processa a operação aritmética e retorna o valor.
- **Público-alvo**: Estudantes de Análise e Desenvolvimento de Sistemas (ADS), engenharia de software e participantes de imersões em IA que desejam consolidar os fundamentos de programação procedural e tratamento de erros.
- **Valor Principal**: Desmistifica o que acontece "por baixo dos panos" de um software, conectando uma interface gráfica limpa à lógica de programação em Python de forma transparente e visual.

---

### 2. User Experience & Visual Design

#### Fluxos Principais do Usuário
1. **Entrada de Operação**:
   - O usuário digita o primeiro número (ex: `15`), seleciona a operação (`+`) e digita o segundo número (`27`).
   - Conforme digita, o painel Python atualiza as variáveis temporárias e destaca a linha da função correspondente (`def somar(a, b): return a + b`).
2. **Cálculo e Rastreamento**:
   - Ao clicar em `=` (ou pressionar Enter no teclado), a animação suave indica a execução da função Python.
   - O display da calculadora mostra o resultado (`42`) e o painel de inspeção exibe:
     - Chamada: `resultado = somar(15.0, 27.0)`
     - Retorno: `42.0`
     - Explicação didática: *"A função somar recebeu dois parâmetros numéricos e utilizou o operador aritmético + do Python."*
3. **Tratamento de Exceções Didático**:
   - Ao tentar dividir por zero (ex: `10 / 0`), a aplicação captura a situação e exibe de forma amigável a lógica do bloco `try / except ZeroDivisionError`, explicando por que a divisão por zero é matematicamente indefinida na computação.
4. **Modo Exploração / Editor**:
   - O estudante pode alternar entre abas do código Python:
     - `Visão Geral`: todas as 4 funções explicadas de forma simples.
     - `Passo a Passo`: visualização dinâmica da última operação realizada com valores substituídos.
     - `Código Completo`: script Python completo com comentários claros em português para copiar.

#### Identidade Visual & Tema
- **Direção Estética**: Minimalismo funcional com foco em ergonomia e legibilidade, inspirado em interfaces de design de ferramentas para desenvolvedores (DevTools modernas).
- **Paleta de Cores (Regra 60-30-10)**:
  - *60% Neutro Dominante*: Fundo ardósia limpo e elegante (`bg-slate-900` para modo escuro de programação ou neutro contrastante `bg-slate-50`), reduzindo a fadiga visual.
  - *30% Superfícies Estruturais*: Superfícies de cartões e painéis com bordas sutis `border-slate-800` / `border-slate-200`, garantindo divisão nítida entre calculadora e código.
  - *10% Acentos Focais*: Azul índigo moderno (`bg-indigo-600`) para operadores principais e verde esmeralda (`text-emerald-400`) para valores retornados e destaque de sintaxe Python.
- **Tipografia**:
  - Títulos e interface: `Plus Jakarta Sans` ou display geométrico claro.
  - Números da calculadora e display de operações: `font-mono tabular-nums` para alinhamento rígido dos dígitos.
  - Painel de código: `JetBrains Mono` / `Space Mono` com destaque sintático claro de palavras-chave (`def`, `return`, `try`, `except`).

---

### 3. Key Product Decisions & Trade-Offs

- **Decisão 1: Visualizador de Execução Python em Tempo Real**:
  - *Abordagem*: Implementar um motor de simulação e interpretação transparente do código Python puro acoplado aos eventos da calculadora, com suporte a inspeção de escopo, argumentos e retorno.
  - *Por quê*: Permite que o estudante veja instantaneamente a relação de causa e efeito: o clique no botão vira uma chamada de função `multiplicar(a, b)` com parâmetros reais.
  - *Alternativa descartada*: Apenas exibir um bloco de texto estático com o código Python sem conexão com o que o usuário digita na calculadora.
- **Decisão 2: Tratamento Explícito de Casos de Borda (`ZeroDivisionError`)**:
  - *Abordagem*: Exibir um banner explicativo quando o usuário divide por zero, mostrando como a cláusula `try...except` ou verificação `if b == 0` evita a interrupção abrupta do programa.
  - *Por quê*: Fundamental para quem está no início de engenharia de software entender resiliência de código e tratamento de exceções.
- **Decisão 3: Teclado Físico + Teclado em Tela**:
  - *Abordagem*: Suporte completo a atalhos de teclado (números, `+`, `-`, `*`, `/`, `Enter`, `Escape`, `Backspace`).
  - *Por quê*: Aumenta a velocidade de teste e aproxima da experiência de uma calculadora nativa de sistema operacional.

---

### 4. Technical Architecture & Data Strategy

#### Diagrama de Arquitetura do Sistema

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       Calculadora Didática Python                           │
└─────────────────────────────────────────────────────────────────────────────┘
                                       │
            ┌──────────────────────────┴──────────────────────────┐
            ▼                                                     ▼
┌───────────────────────────────┐             ┌───────────────────────────────┐
│     Painel da Calculadora     │             │    Painel Didático Python     │
│   (Display + Teclado Touch)   │             │   (Código + Step Visualizer)  │
├───────────────────────────────┤             ├───────────────────────────────┤
│ • Display Primário & Histórico│             │ • Código Fonte das 4 Funções  │
│ • Dígitos (0-9, .)            │             │ • Destaque da Linha Ativa     │
│ • Operadores (+, -, *, /)     │             │ • Inspeção de Parâmetros:     │
│ • Ações (C, Backspace, =)     │             │   - a: float                  │
│ • Suporte a Teclado Físico    │             │   - b: float                  │
└───────────────┬───────────────┘             │   - return: float | Erro      │
                │                             │ • Explicação Conceitual       │
                ▼                             └───────────────▲───────────────┘
┌─────────────────────────────────────────────────────────────┼───────────────┐
│                     Engine de Cálculo & Estado              │               │
├─────────────────────────────────────────────────────────────┴───────────────┤
│ • Estado: { displayValue, previousValue, operator, waitingForOperand }      │
│ • Mapeamento para Funções Python:                                           │
│   - somar(a, b) -> a + b                                                    │
│   - subtrair(a, b) -> a - b                                                 │
│   - multiplicar(a, b) -> a * b                                              │
│   - dividir(a, b) -> a / b (com if b == 0 raise ZeroDivisionError)          │
│ • Histórico das Últimas Operações Executadas                                │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### Modelo de Dados e Funções Python
```python
# Funções essenciais implementadas e explicadas:

def somar(a: float, b: float) -> float:
    """Retorna a soma de dois números."""
    return a + b

def subtrair(a: float, b: float) -> float:
    """Retorna a diferença entre dois números."""
    return a - b

def multiplicar(a: float, b: float) -> float:
    """Retorna o produto de dois números."""
    return a * b

def dividir(a: float, b: float) -> float:
    """Retorna o quociente de dois números, tratando divisão por zero."""
    if b == 0:
        raise ZeroDivisionError("Não é possível dividir por zero!")
    return a / b
```

#### Mapeamento de Componentes
- `CalculatorDisplay`: Mostra o valor atual, a expressão em andamento e badge discreto da operação ativa.
- `CalculatorKeypad`: Botões estilizados com feedback táctil (hover e active), agrupados logicamente.
- `PythonCodeViewer`: Editor com destaque de sintaxe, numeração de linhas e linha ativa animada.
- `ExecutionTracer`: Mostra em tempo real a caixa preta do algoritmo (Entrada `a`, Entrada `b`, Operador, Saída `resultado` e Dica de Engenharia).
- `QuickPythonReference`: Cartão explicativo com os 4 pilares: funções (`def`), parâmetros (`arguments`), retorno (`return`) e condições (`if/else`).
