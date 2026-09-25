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
  const empezarNuevoNumero = useRef(false);
  const resultadoFinal = useRef(false);

  const formatearResultado = (valor: number): string => {
    if (!Number.isFinite(valor)) return 'Error';
    return String(Number(valor.toPrecision(12)));
  };

  const operar = (
    primero: string,
    segundo: string,
    operador: Operator,
  ): string => {
    const a = Number(primero);
    const b = Number(segundo);

    switch (operador) {
      case Operator.add:
        return formatearResultado(a + b);
      case Operator.subtract:
        return formatearResultado(a - b);
      case Operator.multiply:
        return formatearResultado(a * b);
      case Operator.divide:
        return b === 0 ? 'Error' : formatearResultado(a / b);
    }
  };

  const actualizarFormula = (valor: string) => {
    setFormula(
      lastOperation.current
        ? `${prevNumero} ${lastOperation.current} ${valor}`
        : valor,
    );
  };

  const limpiar = () => {
    setFormula('0');
    setNumero('0');
    setPrevNumero('0');
    lastOperation.current = null;
    empezarNuevoNumero.current = false;
    resultadoFinal.current = false;
  };

  const invertirSigno = () => {
    if (numero === 'Error' || Number(numero) === 0) return;

    const nuevo = numero.startsWith('-')
      ? numero.slice(1)
      : `-${numero}`;

    setNumero(nuevo);
    actualizarFormula(nuevo);
    resultadoFinal.current = false;
  };

  const borrarUltimo = () => {
    if (numero === 'Error') {
      limpiar();
      return;
    }

    const nuevo =
      numero.length <= 1 || (numero.length === 2 && numero.startsWith('-'))
        ? '0'
        : numero.slice(0, -1);

    setNumero(nuevo);
    actualizarFormula(nuevo);
    empezarNuevoNumero.current = false;
    resultadoFinal.current = false;
  };

  const setLastnumero = (operador: Operator) => {
    if (numero === 'Error') return;

    let primero = numero;

    if (lastOperation.current && !empezarNuevoNumero.current) {
      primero = operar(prevNumero, numero, lastOperation.current);

      if (primero === 'Error') {
        setNumero('Error');
        setFormula('Error');
        setPrevNumero('Error');
        lastOperation.current = null;
        empezarNuevoNumero.current = true;
        return;
      }
    } else if (lastOperation.current && empezarNuevoNumero.current) {
      primero = prevNumero;
    }

    setPrevNumero(primero);
    setNumero(primero);
    setFormula(`${primero} ${operador}`);
    lastOperation.current = operador;
    empezarNuevoNumero.current = true;
    resultadoFinal.current = false;
  };

  const dividirOperation = () => setLastnumero(Operator.divide);
  const multiplicarOperation = () => setLastnumero(Operator.multiply);
  const restarOperation = () => setLastnumero(Operator.subtract);
  const sumarOperation = () => setLastnumero(Operator.add);

  const calcularSubResultado = (): string => {
    if (!lastOperation.current || empezarNuevoNumero.current) return numero;
    return operar(prevNumero, numero, lastOperation.current);
  };

  const calcularResultado = () => {
    if (!lastOperation.current || empezarNuevoNumero.current) return;

    const resultado = calcularSubResultado();

    setFormula(resultado);
    setNumero(resultado);
    setPrevNumero(resultado);
    lastOperation.current = null;
    empezarNuevoNumero.current = true;
    resultadoFinal.current = true;
  };

  const construirNumero = (numeroString: string) => {
    if (!/^[0-9.]$/.test(numeroString)) return;

    if (numero === 'Error' || resultadoFinal.current) {
      const nuevo = numeroString === '.' ? '0.' : numeroString;
      setNumero(nuevo);
      setFormula(nuevo);
      setPrevNumero(nuevo);
      lastOperation.current = null;
      empezarNuevoNumero.current = false;
      resultadoFinal.current = false;
      return;
    }

    let nuevo: string;

    if (empezarNuevoNumero.current) {
      nuevo = numeroString === '.' ? '0.' : numeroString;
      empezarNuevoNumero.current = false;
    } else if (numeroString === '.') {
      if (numero.includes('.')) return;
      nuevo = `${numero}.`;
    } else if (numero === '0') {
      nuevo = numeroString;
    } else if (numero === '-0') {
      nuevo = `-${numeroString}`;
    } else {
      nuevo = `${numero}${numeroString}`;
    }

    setNumero(nuevo);
    actualizarFormula(nuevo);
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