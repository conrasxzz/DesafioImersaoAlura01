#!/usr/bin/env python3
"""
Calculadora Didática em Python com as 4 Operações Básicas
==========================================================
Arquivo: calculadora.py
Desenvolvido para estudantes de ADS e Engenharia de Software.
"""

def somar(a: float, b: float) -> float:
    """
    Retorna a soma de dois números.
    Operador aritmético: +
    """
    return a + b


def subtrair(a: float, b: float) -> float:
    """
    Retorna a subtração entre dois números (a menos b).
    Operador aritmético: -
    """
    return a - b


def multiplicar(a: float, b: float) -> float:
    """
    Retorna a multiplicação de dois números.
    Operador aritmético: *
    """
    return a * b


def dividir(a: float, b: float) -> float:
    """
    Retorna o quociente da divisão de a por b.
    Trata explicitamente o caso de divisão por zero.
    Operador aritmético: /
    """
    if b == 0:
        raise ZeroDivisionError("Não é possível dividir um número por zero!")
    return a / b


def porcentagem(valor: float, taxa: float) -> float:
    """
    Retorna a porcentagem (taxa%) aplicada sobre um determinado valor.
    Exemplo: porcentagem(200, 15) -> 15% de 200 = 30.0
    Fórmula: (valor * taxa) / 100
    Nota didática: No Python puro, o operador '%' calcula o resto da divisão.
    Para calcular porcentagem comercial, usamos a fórmula matemática: (valor * taxa) / 100.
    """
    return (valor * taxa) / 100


def menu_interativo():
    """
    Menu interativo via terminal simples para o estudante
    executar e testar a calculadora diretamente pelo Python.
    """
    print("\n" + "=" * 45)
    print("      CALCULADORA DIDÁTICA EM PYTHON")
    print("=" * 45)
    print("1. Somar (+)")
    print("2. Subtrair (-)")
    print("3. Multiplicar (*)")
    print("4. Dividir (/)")
    print("5. Porcentagem (%)")
    print("0. Sair")
    print("=" * 45)


def main():
    while True:
        menu_interativo()
        opcao = input("Escolha uma operação (0-5): ").strip()

        if opcao == "0":
            print("\nEncerrando a calculadora. Bons estudos!")
            break

        if opcao not in ("1", "2", "3", "4", "5"):
            print("\n[!] Opção inválida! Escolha um número entre 0 e 5.")
            continue

        try:
            num1 = float(input("\nDigite o primeiro número (a ou valor): "))
            num2 = float(input("Digite o segundo número (b ou taxa %): "))
        except ValueError:
            print("\n[!] Erro: Você deve digitar números válidos!")
            continue

        try:
            if opcao == "1":
                resultado = somar(num1, num2)
                operador = "+"
                funcao = "somar"
            elif opcao == "2":
                resultado = subtrair(num1, num2)
                operador = "-"
                funcao = "subtrair"
            elif opcao == "3":
                resultado = multiplicar(num1, num2)
                operador = "*"
                funcao = "multiplicar"
            elif opcao == "4":
                resultado = dividir(num1, num2)
                operador = "/"
                funcao = "dividir"
            elif opcao == "5":
                resultado = porcentagem(num1, num2)
                operador = "%"
                funcao = "porcentagem"

            print("\n" + "-" * 40)
            print(f"Chamada Python: {funcao}({num1}, {num2})")
            print(f"Expressão:      {num1} {operador} {num2} = {resultado}")
            print("-" * 40)

        except ZeroDivisionError as erro:
            print("\n" + "!" * 40)
            print(f"EXCEÇÃO CAPTURADA: {erro}")
            print("Explicação: Divisão por zero é matematicamente indefinida.")
            print("!" * 40)


if __name__ == "__main__":
    main()
