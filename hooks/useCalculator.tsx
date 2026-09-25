import { useRef, useState } from 'react';

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

  const limpiar = () => {
    setFormula('0');
    setNumero('0');
    setPrevNumero('0');
    lastOperation.current = null;
  };

  const invertirSigno = () => {
    const nuevoNumero = numero.includes('-') ? numero.replace('-', '') : '-' + numero;
    setNumero(nuevoNumero);
    if (!lastOperation.current) {
        setFormula(nuevoNumero);
    } else {
        setFormula(`${prevNumero} ${lastOperation.current} ${nuevoNumero}`);
    }
  };

  const borrarUltimo = () => {
    let currentSign = '';
    let tempNumber = numero;

    if (numero.includes('-')) {
      currentSign = '-';
      tempNumber = numero.substring(1);
    }

    let nuevoNumero = '0';
    if (tempNumber.length > 1) {
      nuevoNumero = currentSign + tempNumber.slice(0, -1);
    }

    setNumero(nuevoNumero);

    if (!lastOperation.current) {
        setFormula(nuevoNumero);
    } else {

        setFormula(`${prevNumero} ${lastOperation.current} ${nuevoNumero !== '0' ? nuevoNumero : ''}`);
    }
  };

  const cambiarOperacion = (op: Operator) => {
    if (numero !== '0') {
      const numLimpio = numero.endsWith('.') ? numero.slice(0, -1) : numero;
      setPrevNumero(numLimpio);
      setFormula(`${numLimpio} ${op}`);
      setNumero('0');
    } else {
      setFormula(`${prevNumero} ${op}`);
    }
    lastOperation.current = op;
  };

  const dividirOperation = () => cambiarOperacion(Operator.divide);
  const multiplicarOperation = () => cambiarOperacion(Operator.multiply);
  const restarOperation = () => cambiarOperacion(Operator.subtract);
  const sumarOperation = () => cambiarOperacion(Operator.add);

  const calcularSubResultado = () => {
    calcularResultado();
  };

  const calcularResultado = () => {

    if (!lastOperation.current) return;

    const num1 = Number(prevNumero);
    const num2 = Number(numero);
    let resultado = 0;

    switch (lastOperation.current) {
      case Operator.add: resultado = num1 + num2; break;
      case Operator.subtract: resultado = num1 - num2; break;
      case Operator.multiply: resultado = num1 * num2; break;
      case Operator.divide:
        if (num2 === 0) {
          setFormula('0');
          setNumero('0');
          setPrevNumero('0');
          lastOperation.current = null;
          return;
        }
        resultado = num1 / num2;
        break;
    }

    const resultadoStr = resultado.toString();
    setFormula(resultadoStr);
    setNumero(resultadoStr);
    setPrevNumero('0');
    lastOperation.current = null;
  };

  const construirNumero = (numeroString: string) => {
    if (numero.includes('.') && numeroString === '.') return;

    let newNumero = numero;
    if (numero.startsWith('0') || numero.startsWith('-0')) {
      if (numeroString === '.') {
        newNumero = numero + numeroString;
      } else if (numeroString === '0' && numero.includes('.')) {
        newNumero = numero + numeroString;
      } else if (numeroString !== '0' && !numero.includes('.')) {
        newNumero = numeroString;
      } else if (numeroString === '0' && !numero.includes('.')) {
        newNumero = numero;
      } else {
        newNumero = numero + numeroString;
      }
    } else {
      newNumero = numero + numeroString;
    }

    setNumero(newNumero);

    if (lastOperation.current) {
      setFormula(`${prevNumero} ${lastOperation.current} ${newNumero}`);
    } else {
      setFormula(newNumero);
    }
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