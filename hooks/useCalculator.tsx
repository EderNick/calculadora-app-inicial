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
  const esperandoNumero = useRef(false);
  const resultadoMostrado = useRef(false);

  const formatearResultado = (valor: number) => {
    if (!Number.isFinite(valor)) return null;

    return Number.parseFloat(valor.toPrecision(12)).toString();
  };

  const actualizarNumero = (valor: string) => {
    setNumero(valor);

    if (lastOperation.current) {
      setFormula(`${prevNumero} ${lastOperation.current} ${valor}`);
    } else {
      setFormula(valor);
    }
  };

  const limpiar = () => {
    setFormula('0');
    setNumero('0');
    setPrevNumero('0');
    lastOperation.current = null;
    esperandoNumero.current = false;
    resultadoMostrado.current = false;
  };

  const invertirSigno = () => {
    if (numero === '0') return;

    const nuevoNumero = numero.startsWith('-')
      ? numero.substring(1)
      : `-${numero}`;

    resultadoMostrado.current = false;
    actualizarNumero(nuevoNumero);
  };

  const borrarUltimo = () => {
    if (esperandoNumero.current) return;

    const nuevoNumero =
      numero.length === 1 || (numero.startsWith('-') && numero.length === 2)
        ? '0'
        : numero.slice(0, -1);

    resultadoMostrado.current = false;
    actualizarNumero(nuevoNumero);
  };

  const obtenerSubResultado = () => {
    if (!lastOperation.current) return Number(numero);

    const primerNumero = Number(prevNumero);
    const segundoNumero = Number(numero);

    switch (lastOperation.current) {
      case Operator.add:
        return primerNumero + segundoNumero;
      case Operator.subtract:
        return primerNumero - segundoNumero;
      case Operator.multiply:
        return primerNumero * segundoNumero;
      case Operator.divide:
        return segundoNumero === 0 ? null : primerNumero / segundoNumero;
    }
  };

  const setLastnumero = (operador: Operator) => {
    if (lastOperation.current && esperandoNumero.current) {
      lastOperation.current = operador;
      setFormula(`${prevNumero} ${operador}`);
      return;
    }

    if (lastOperation.current) {
      const resultado = obtenerSubResultado();
      const resultadoFormateado =
        resultado === null ? null : formatearResultado(resultado);

      if (resultadoFormateado === null) {
        setFormula('Error');
        setNumero('0');
        setPrevNumero('0');
        lastOperation.current = null;
        esperandoNumero.current = false;
        resultadoMostrado.current = true;
        return;
      }

      setPrevNumero(resultadoFormateado);
      setNumero('0');
      setFormula(`${resultadoFormateado} ${operador}`);
    } else {
      const valorBase = resultadoMostrado.current ? formula : numero;
      setPrevNumero(valorBase);
      setNumero('0');
      setFormula(`${valorBase} ${operador}`);
    }

    lastOperation.current = operador;
    esperandoNumero.current = true;
    resultadoMostrado.current = false;
  };

  const dividirOperation = () => {
    setLastnumero(Operator.divide);
  };

  const multiplicarOperation = () => {
    setLastnumero(Operator.multiply);
  };

  const restarOperation = () => {
    setLastnumero(Operator.subtract);
  };

  const sumarOperation = () => {
    setLastnumero(Operator.add);
  };

  const calcularSubResultado = () => {
    return obtenerSubResultado() ?? 0;
  };

  const calcularResultado = () => {
    if (!lastOperation.current) {
      setFormula(numero);
      resultadoMostrado.current = true;
      return;
    }

    const resultado = obtenerSubResultado();
    const resultadoFormateado =
      resultado === null ? null : formatearResultado(resultado);

    if (resultadoFormateado === null) {
      setFormula('Error');
      setNumero('0');
      setPrevNumero('0');
    } else {
      setFormula(resultadoFormateado);
      setNumero(resultadoFormateado);
      setPrevNumero(resultadoFormateado);
    }

    lastOperation.current = null;
    esperandoNumero.current = false;
    resultadoMostrado.current = true;
  };

  const construirNumero = (numeroString: string) => {
    if (!/^\d$|^\.$/.test(numeroString)) return;

    const iniciarNumero = esperandoNumero.current || resultadoMostrado.current;
    const numeroBase = iniciarNumero ? '0' : numero;

    if (numeroString === '.' && numeroBase.includes('.')) return;

    let nuevoNumero: string;

    if (numeroString === '.') {
      nuevoNumero = `${numeroBase}.`;
    } else if (numeroBase === '0') {
      nuevoNumero = numeroString;
    } else if (numeroBase === '-0') {
      nuevoNumero = `-${numeroString}`;
    } else {
      nuevoNumero = `${numeroBase}${numeroString}`;
    }

    esperandoNumero.current = false;
    resultadoMostrado.current = false;
    actualizarNumero(nuevoNumero);
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
