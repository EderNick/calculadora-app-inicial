import { useEffect, useRef, useState } from 'react';

enum Operator {
  add = '+',
  subtract = '-',
  multiply = 'x',
  divide = '÷',
}

export const useCalculator = () => {
  const [formula, setFormula] = useState('0');
  const [numero, setNumero] = useState('0');
  const [prevNumero, setPrevNumero] = useState('0');

  const lastOperation = useRef<Operator | undefined>(undefined);

  useEffect(() => {
    if (lastOperation.current) {
      const firstFormulaPart = formula.split(' ').at(0);
      setFormula(`${firstFormulaPart} ${lastOperation.current} ${numero}`);
    } else {
      setFormula(numero);
    }
  }, [numero]);

  useEffect(() => {
    const subResult = calcularSubResultado();
    setPrevNumero(`${subResult}`);
  }, [formula]);

  const limpiar = () => {
    setFormula('0');
    setNumero('0');
    setPrevNumero('0');
    lastOperation.current = undefined;
  };

  const invertirSigno = () => {
    if (numero === '0') return;

    if (numero.startsWith('-')) {
      setNumero(numero.substring(1));
    } else {
      setNumero('-' + numero);
    }
  };

  const borrarUltimo = () => {
    let currentSign = '';
    let temporalNumero = numero;

    if (numero.includes('-')) {
      currentSign = '-';
      temporalNumero = numero.substring(1);
    }

    if (temporalNumero.length > 1) {
      setNumero(currentSign + temporalNumero.slice(0, -1));
      return;
    }

    setNumero('0');
  };

  const setLastnumero = () => {
    if (numero.endsWith('.')) {
      setPrevNumero(numero.slice(0, -1));
    } else {
      setPrevNumero(numero);
    }

    setNumero('0');
  };

  const dividirOperation = () => {
    setLastnumero();
    lastOperation.current = Operator.divide;
  };

  const multiplicarOperation = () => {
    setLastnumero();
    lastOperation.current = Operator.multiply;
  };

  const restarOperation = () => {
    setLastnumero();
    lastOperation.current = Operator.subtract;
  };

  const sumarOperation = () => {
    setLastnumero();
    lastOperation.current = Operator.add;
  };

  const calcularSubResultado = () => {
    const [firstValue, operation, secondValue] = formula.split(' ');

    const num1 = Number(firstValue);
    const num2 = Number(secondValue);

    if (isNaN(num2)) return num1;

    switch (operation) {
      case Operator.add:
        return num1 + num2;

      case Operator.subtract:
        return num1 - num2;

      case Operator.multiply:
        return num1 * num2;

      case Operator.divide:
        if (num2 === 0) return 0;
        return num1 / num2;

      default:
        return num1;
    }
  };

  const calcularResultado = () => {
    if (!lastOperation.current) return;

    if (
      lastOperation.current === Operator.divide &&
      Number(numero) === 0
    ) {
      setFormula('Error');
      setNumero('Error');
      setPrevNumero('0');
      lastOperation.current = undefined;
      return;
    }

    const resultado = calcularSubResultado();

    setFormula(`${resultado}`);
    setNumero(`${resultado}`);
    setPrevNumero('0');

    lastOperation.current = undefined;
  };

  const construirNumero = (numeroString: string) => {
    if (numero === 'Error') {
      setNumero(numeroString);
      setFormula(numeroString);
      return;
    }

    if (numero.includes('.') && numeroString === '.') return;

    if (numero.startsWith('0') || numero.startsWith('-0')) {
      if (numeroString === '.') {
        setNumero(numero + numeroString);
        return;
      }

      if (numeroString === '0' && numero.includes('.')) {
        setNumero(numero + numeroString);
        return;
      }

      if (numeroString !== '0' && !numero.includes('.')) {
        setNumero(numeroString);
        return;
      }

      if (numeroString === '0' && !numero.includes('.')) {
        return;
      }
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