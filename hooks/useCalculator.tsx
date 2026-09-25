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

  const lastOperation = useRef<Operator | null>(null);

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
    setNumero('0');
    setPrevNumero('0');
    setFormula('0');
    lastOperation.current = null;
  };

  const invertirSigno = () => {
    if (numero === '0') return;
    
    if (numero.includes('-')) {
      return setNumero(numero.replace('-', ''));
    }
    setNumero('-' + numero);
  };

  const borrarUltimo = () => {
    let currentSign = '';
    let temporalNumero = numero;

    if (numero.includes('-')) {
      currentSign = '-';
      temporalNumero = numero.substring(1);
    }

    if (temporalNumero.length > 1) {
      return setNumero(currentSign + temporalNumero.slice(0, -1));
    }

    setNumero('0');
  };

  const setLastnumero = () => {
    calcularResultado();

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
        if (num2 === 0) return 0; // Controla la división entre cero
        return num1 / num2;
      default:
        throw new Error(`Operation ${operation} not implemented`);
    }
  };

  const calcularResultado = () => {
    const result = calcularSubResultado();
    setFormula(`${result}`);

    lastOperation.current = null;
    setPrevNumero('0');
  };

  const construirNumero = (numeroString: string) => {
    if (numero.includes('.') && numeroString === '.') return;

    if (numero.startsWith('0') || numero.startsWith('-0')) {
      if (numeroString === '.') {
        return setNumero(numero + numeroString);
      }

      if (numeroString === '0' && numero.includes('.')) {
        return setNumero(numero + numeroString);
      }

      if (numeroString !== '0' && !numero.includes('.')) {
        return setNumero(numeroString);
      }

      if (numeroString === '0' && !numero.includes('.')) {
        return;
      }
    }

    setNumero(numero + numeroString);
  };

  return {
    // Props
    formula,
    numero,
    prevNumero,

    // Methods
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