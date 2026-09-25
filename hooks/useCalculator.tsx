import { useRef, useState } from 'react';

enum Operator {
  add = '+',
  subtract = '-',
  multiply = 'x',
  divide = '÷',
}

export const useCalculator = () => {
  // 1. Iniciamos formula vacía para que no se duplique el texto en pantalla
  const [formula, setFormula] = useState('');
  const [numero, setNumero] = useState('0');
  const [prevNumero, setPrevNumero] = useState('0');

  const lastOperation = useRef<Operator | null>(null);

  const limpiar = () => {
    setFormula('');
    setNumero('0');
    setPrevNumero('0');
    lastOperation.current = null;
  };

  const invertirSigno = () => {
    if (numero === '0' || numero === 'Error') return;
    setNumero(numero.includes('-') ? numero.replace('-', '') : '-' + numero);
  };

  const borrarUltimo = () => {
    if (numero === 'Error') return limpiar();
    if (numero.length === 1 || (numero.length === 2 && numero.startsWith('-'))) {
      setNumero('0');
    } else {
      setNumero(numero.slice(0, -1));
    }
  };

  const setLastnumero = () => {
    setPrevNumero(numero.endsWith('.') ? numero.slice(0, -1) : numero);
    setNumero('0');
  };

  // Función agrupada sin código innecesario
  const handleOperation = (op: Operator) => {
    if (numero === 'Error') return;
    setLastnumero();
    lastOperation.current = op;
    setFormula(`${numero} ${op}`); // Muestra resultado parcial/fórmula
  };

  const dividirOperation = () => handleOperation(Operator.divide);
  const multiplicarOperation = () => handleOperation(Operator.multiply);
  const restarOperation = () => handleOperation(Operator.subtract);
  const sumarOperation = () => handleOperation(Operator.add);

  const calcularSubResultado = () => {
    const num1 = Number(prevNumero);
    const num2 = Number(numero);

    switch (lastOperation.current) {
      case Operator.add: return num1 + num2;
      case Operator.subtract: return num1 - num2;
      case Operator.multiply: return num1 * num2;
      case Operator.divide:
        if (num2 === 0) return 'Error'; // Control estricto de Infinity/NaN
        return num1 / num2;
      default: return num2;
    }
  };

  const calcularResultado = () => {
    if (!lastOperation.current || numero === 'Error') return;

    const resultado = calcularSubResultado();

    if (resultado === 'Error') {
      setNumero('Error');
      setFormula('');
    } else {
      setFormula(`${prevNumero} ${lastOperation.current} ${numero}`); // Fórmula completa
      setNumero(`${resultado}`); // Continuidad de operaciones
    }
    
    setPrevNumero('0');
    lastOperation.current = null;
  };

  const construirNumero = (numeroString: string) => {
    if (numero === 'Error') return setNumero(numeroString);

    // Control de múltiples puntos
    if (numeroString === '.' && numero.includes('.')) return;

    // Control de ceros iniciales innecesarios
    if (numero === '0' && numeroString !== '.') {
      setNumero(numeroString);
      return;
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