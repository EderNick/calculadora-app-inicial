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
  const hasResult = useRef(false);


  const limpiar = () => {
    //Limpiar todo
    setFormula('0');
    setNumero('0');
    setPrevNumero('0');
    lastOperation.current = null;
    hasResult.current = false;
  };

  const invertirSigno = () => {
    //intercambiar de signo +/-
    if (numero === '0') return;
    setNumero(numero.startsWith('-') ? numero.slice(1) : `-${numero}`);
    hasResult.current = false;
  };

  const borrarUltimo = () => {
    //borra lo último digitado
    if (numero.length <= 1 || (numero.length === 2 && numero.startsWith('-'))) {
      setNumero('0');
      setFormula(lastOperation.current ? `${prevNumero} ${lastOperation.current}` : '0');
      return;
    }
    const nuevoNumero = numero.slice(0, -1);
    setNumero(nuevoNumero);
    setFormula(lastOperation.current ? `${prevNumero} ${lastOperation.current} ${nuevoNumero}` : nuevoNumero);
    hasResult.current = false;
  };

  const setLastnumero = (operador: Operator) => {
    const primerNumero = lastOperation.current ? String(calcularSubResultado()) : numero;
    setPrevNumero(primerNumero);
    setNumero('0');
    setFormula(`${primerNumero} ${operador}`);
    lastOperation.current = operador;
    hasResult.current = false;
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
    // Realizar la operacion correspendiente dependiendo del Operator
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
        return segundoNumero === 0 ? 0 : primerNumero / segundoNumero;
      default:
        return segundoNumero;
    }
  };

  const calcularResultado = () => {
    const resultado = calcularSubResultado();
    const resultadoString = String(resultado);
    setNumero(resultadoString);
    setFormula(resultadoString);
    setPrevNumero(`${resultadoString} `);
    lastOperation.current = null;
    hasResult.current = true;
  };

  const construirNumero = (numeroString: string) => {
    // mostrar el numero grande en el Display.
    if (!/^[0-9.]$/.test(numeroString)) return;

    if (hasResult.current) {
      setNumero(numeroString === '.' ? '0.' : numeroString);
      setFormula(numeroString === '.' ? '0.' : numeroString);
      hasResult.current = false;
      return;
    }

    if (numeroString === '.' && numero.includes('.')) return;

    let nuevoNumero = numero;
    if (numeroString === '.') {
      nuevoNumero = numero === '0' ? '0.' : `${numero}.`;
    } else if (numero === '0') {
      nuevoNumero = numeroString;
    } else if (numero === '-0') {
      nuevoNumero = `-${numeroString}`;
    } else {
      nuevoNumero = `${numero}${numeroString}`;
    }

    setNumero(nuevoNumero);
    setFormula(lastOperation.current ? `${prevNumero} ${lastOperation.current} ${nuevoNumero}` : nuevoNumero);
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
