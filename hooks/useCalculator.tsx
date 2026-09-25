import { useRef, useState } from 'react';

enum Operator {
  add = '+',
  subtract = '-',
  multiply = 'x',
  divide = '÷',
}

const redondear = (valor: number) => Math.round(valor * 1e10) / 1e10;

export const useCalculator = () => {
  const [formula, setFormula] = useState('0');

  const [numero, setNumero] = useState('0');
  const [prevNumero, setPrevNumero] = useState('0');

  const lastOperation = useRef<Operator | null>(null);
  const justCalculated = useRef(false);
  const numeroIngresado = useRef(false);

  const lastOperadorUsado = useRef<Operator | null>(null);
  const lastSegundoOperando = useRef('0');

  const limpiar = () => {
    setNumero('0');
    setPrevNumero('0');
    setFormula('0');
    lastOperation.current = null;
    justCalculated.current = false;
    numeroIngresado.current = false;
    lastOperadorUsado.current = null;
    lastSegundoOperando.current = '0';
  };

  const invertirSigno = () => {
    if (numero === '0') return;
    setNumero(numero.startsWith('-') ? numero.slice(1) : '-' + numero);
  };

  const borrarUltimo = () => {
    const esNegativoDeUnDigito = numero.length === 2 && numero.startsWith('-');
    if (numero.length === 1 || esNegativoDeUnDigito) {
      return setNumero('0');
    }
    setNumero(numero.slice(0, -1));
  };

  const setLastnumero = () => {
    setPrevNumero(numero);
    setNumero('0');
  };

  const calcularSubResultado = (): string | null => {
    const num1 = Number(prevNumero);
    const num2 = Number(numero);
    let resultado = 0;

    switch (lastOperation.current) {
      case Operator.add:
        resultado = num1 + num2;
        break;
      case Operator.subtract:
        resultado = num1 - num2;
        break;
      case Operator.multiply:
        resultado = num1 * num2;
        break;
      case Operator.divide:
        if (num2 === 0) {
          setFormula('Error');
          setNumero('0');
          setPrevNumero('0');
          lastOperation.current = null;
          return null;
        }
        resultado = num1 / num2;
        break;
      default:
        resultado = num2;
    }

    const resultadoString = `${redondear(resultado)}`;
    setPrevNumero(resultadoString);
    setNumero('0');

    return resultadoString;
  };

  const manejarOperador = (operador: Operator) => {
    if (lastOperation.current && !numeroIngresado.current) {
      lastOperation.current = operador;
      setFormula(`${prevNumero} ${operador}`);
      return;
    }

    let base = numero;

    if (lastOperation.current) {
      const resultado = calcularSubResultado();
      if (resultado === null) return; 
      base = resultado;
    } else {
      setLastnumero();
    }

    lastOperation.current = operador;
    numeroIngresado.current = false;
    setFormula(`${base} ${operador}`);
  };

  const sumarOperation = () => manejarOperador(Operator.add);
  const restarOperation = () => manejarOperador(Operator.subtract);
  const multiplicarOperation = () => manejarOperador(Operator.multiply);
  const dividirOperation = () => manejarOperador(Operator.divide);

  const calcularResultado = () => {
    let operador = lastOperation.current;
    let num1: number;
    let num2: number;

    if (!operador) {
      if (!lastOperadorUsado.current) return;
      operador = lastOperadorUsado.current;
      num1 = Number(numero);
      num2 = Number(lastSegundoOperando.current);
    } else {
      num1 = Number(prevNumero);
      num2 = Number(numero);
    }

    if (operador === Operator.divide && num2 === 0) {
      setFormula('Error');
      setNumero('0');
      setPrevNumero('0');
      lastOperation.current = null;
      justCalculated.current = true;
      return;
    }

    let resultado = 0;
    switch (operador) {
      case Operator.add:
        resultado = num1 + num2;
        break;
      case Operator.subtract:
        resultado = num1 - num2;
        break;
      case Operator.multiply:
        resultado = num1 * num2;
        break;
      case Operator.divide:
        resultado = num1 / num2;
        break;
    }

    const resultadoRedondeado = redondear(resultado);

    setFormula(`${num1} ${operador} ${num2} = ${resultadoRedondeado}`);
    setNumero(`${resultadoRedondeado}`);
    setPrevNumero('0');

    lastOperadorUsado.current = operador;
    lastSegundoOperando.current = `${num2}`;
    lastOperation.current = null;
    numeroIngresado.current = false;
    justCalculated.current = true;
  };

  const construirNumero = (numeroString: string) => {
    numeroIngresado.current = true;

    if (justCalculated.current) {
      justCalculated.current = false;
      return setNumero(numeroString === '.' ? '0.' : numeroString);
    }

    if (numero.includes('.') && numeroString === '.') return;

    if (numero === '0' && numeroString !== '.') {
      return setNumero(numeroString);
    }
    if (numero === '-0' && numeroString !== '.') {
      return setNumero('-' + numeroString);
    }

    setNumero(numero + numeroString);
  };

  return {
    formula,
    numero,
    prevNumero,

    construirNumero,
    limpiar,
    invertirSigno,
    borrarUltimo,

    dividirOperation,
    multiplicarOperation,
    restarOperation,
    sumarOperation,
    calcularSubResultado,
    calcularResultado,
  };
};