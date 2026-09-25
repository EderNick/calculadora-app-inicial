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
      const segundoOperando = numero === '0' ? '' : ` ${numero}`;
      setFormula(`${prevNumero} ${lastOperation.current}${segundoOperando}`);
    } else {
      setFormula(numero);
    }
  }, [numero, prevNumero]);

  const limpiar = () => {
    lastOperation.current = null;
    setNumero('0');
    setPrevNumero('0');
  };

  const invertirSigno = () => {
    setNumero(`${parseFloat(numero) * -1}`);
  };

  const borrarUltimo = () => {
    setNumero(numero.length > 1 ? numero.slice(0, -1) : '0');
  };

  // Calcula prevNumero (operador) numero SIN tocar el estado (evita bugs de closures)
  const resolver = (): number => {
    const num1 = parseFloat(prevNumero);
    const num2 = parseFloat(numero);

    switch (lastOperation.current) {
      case Operator.add:
        return num1 + num2;
      case Operator.subtract:
        return num1 - num2;
      case Operator.multiply:
        return num1 * num2;
      case Operator.divide:
        return num2 === 0 ? 0 : num1 / num2; // evita Infinity/NaN
      default:
        return num2;
    }
  };

  const operar = (siguienteOperacion: Operator) => {
    if (lastOperation.current !== null) {
      // Ya había una operación pendiente -> resuélvela para permitir encadenar (5 + 3 + 2)
      setPrevNumero(`${resolver()}`);
    } else {
      setPrevNumero(numero.endsWith('.') ? numero.slice(0, -1) : numero);
    }

    setNumero('0');
    lastOperation.current = siguienteOperacion;
  };

  const dividirOperation = () => operar(Operator.divide);
  const multiplicarOperation = () => operar(Operator.multiply);
  const restarOperation = () => operar(Operator.subtract);
  const sumarOperation = () => operar(Operator.add);

  const calcularSubResultado = () => {
    const resultado = resolver();
    setPrevNumero(`${resultado}`);
    return resultado;
  };

  const calcularResultado = () => {
    if (lastOperation.current === null) return;

    const resultado = resolver();

    lastOperation.current = null;
    setPrevNumero('0');
    setNumero(`${resultado}`); // clave: deja el resultado en "numero" para poder seguir operando
  };

  const construirNumero = (numeroString: string) => {
    if (numero.includes('.') && numeroString === '.') return;

    if (numero === '0' && numeroString !== '.') {
      setNumero(numeroString);
      return;
    }

    setNumero(`${numero}${numeroString}`);
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
