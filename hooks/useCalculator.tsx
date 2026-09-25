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
    if (numero === '0') return;

    const nuevoNumero = numero.startsWith('-')
      ? numero.substring(1)
      : `-${numero}`;

    setNumero(nuevoNumero);
    setFormula(nuevoNumero);
  };

  const borrarUltimo = () => {
    if (numero.length === 1 || (numero.length === 2 && numero.startsWith('-'))) {
      setNumero('0');
      setFormula('0');
      return;
    }

    const nuevoNumero = numero.slice(0, -1);

    setNumero(nuevoNumero);
    setFormula(nuevoNumero);
  };

  const setLastnumero = () => {
    setPrevNumero(numero);
  };

  const dividirOperation = () => {
    setLastnumero();
    lastOperation.current = Operator.divide;
    setFormula(`${numero} ÷`);
    setNumero('0');
  };

  const multiplicarOperation = () => {
    setLastnumero();
    lastOperation.current = Operator.multiply;
    setFormula(`${numero} x`);
    setNumero('0');
  };

  const restarOperation = () => {
    setLastnumero();
    lastOperation.current = Operator.subtract;
    setFormula(`${numero} -`);
    setNumero('0');
  };

  const sumarOperation = () => {
    setLastnumero();
    lastOperation.current = Operator.add;
    setFormula(`${numero} +`);
    setNumero('0');
  };

  const calcularSubResultado = () => {
    const anterior = parseFloat(prevNumero);
    const actual = parseFloat(numero);

    if (isNaN(anterior) || isNaN(actual)) {
      return;
    }

    let resultado = 0;

    switch (lastOperation.current) {
      case Operator.add:
        resultado = anterior + actual;
        break;

      case Operator.subtract:
        resultado = anterior - actual;
        break;

      case Operator.multiply:
        resultado = anterior * actual;
        break;

      case Operator.divide:
        if (actual === 0) {
          setNumero('0');
          setFormula('Error');
          lastOperation.current = null;
          return;
        }

        resultado = anterior / actual;
        break;

      default:
        return;
    }

    if (!Number.isFinite(resultado)) {
      setNumero('0');
      setFormula('Error');
      lastOperation.current = null;
      return;
    }

    const resultadoString = resultado.toString();

    setNumero(resultadoString);
    setFormula(resultadoString);
    setPrevNumero(resultadoString);
  };

  const calcularResultado = () => {
    if (lastOperation.current === null) {
      return;
    }

    calcularSubResultado();
    lastOperation.current = null;
  };

  const construirNumero = (numeroString: string) => {
    // Permitir solamente números y punto decimal
    if (!/^[0-9.]$/.test(numeroString)) {
      return;
    }

    // Evitar más de un punto decimal
    if (numeroString === '.' && numero.includes('.')) {
      return;
    }

    // Si se pulsa punto al inicio, formar "0."
    if (numeroString === '.') {
      if (numero === '0') {
        setNumero('0.');
        setFormula('0.');
        return;
      }
    }

    // Evitar ceros iniciales innecesarios
    if (numero === '0' && numeroString === '0') {
      return;
    }

    let nuevoNumero = numero;

    // Reemplazar el cero inicial
    if (numero === '0' && numeroString !== '.') {
      nuevoNumero = numeroString;
    } else {
      nuevoNumero += numeroString;
    }

    setNumero(nuevoNumero);
    setFormula(nuevoNumero);
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