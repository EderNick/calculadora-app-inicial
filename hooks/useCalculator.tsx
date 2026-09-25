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
    //Limpiar todo
    setNumero('0');
    setPrevNumero('0');
    setFormula('0');
    lastOperation.current = null;
  };

  const invertirSigno = () => {
    //intercambiar de signo +/-
    const nuevoNumero = numero.includes('-')
      ? numero.replace('-', '')
      : '-' + numero;

    setNumero(nuevoNumero);

    let nuevaFormula = nuevoNumero;
    if (lastOperation.current) {
      const primeraParte = formula.split(' ').at(0);
      nuevaFormula = `${primeraParte} ${lastOperation.current} ${nuevoNumero}`;
    }
    setFormula(nuevaFormula);
    setPrevNumero(`${calcularSubResultado(nuevaFormula)}`);
  };

  const borrarUltimo = () => {
    //borra lo último digitado
    let currentSign = '';
    let temporalNumero = numero;

    if (numero.includes('-')) {
      currentSign = '-';
      temporalNumero = numero.substring(1);
    }

    const nuevoNumero =
      temporalNumero.length > 1
        ? currentSign + temporalNumero.slice(0, -1)
        : '0';

    setNumero(nuevoNumero);

    let nuevaFormula = nuevoNumero;
    if (lastOperation.current) {
      const primeraParte = formula.split(' ').at(0);
      nuevaFormula = `${primeraParte} ${lastOperation.current} ${nuevoNumero}`;
    }
    setFormula(nuevaFormula);
    setPrevNumero(`${calcularSubResultado(nuevaFormula)}`);
  };

  const setLastnumero = () => {
    const resultado = calcularSubResultado();
    setFormula(`${resultado}`);
    setPrevNumero(`${resultado}`);
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

  const calcularSubResultado = (formulaActual: string = formula) => {
    // Realizar la operacion correspendiente dependiendo del Operator
    const [firstValue, operation, secondValue] = formulaActual.split(' ');

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
    const resultado = calcularSubResultado();
    setFormula(`${resultado}`);
    setNumero(`${resultado}`);
    setPrevNumero('0');
    lastOperation.current = null;
  };

  const construirNumero = (numeroString: string) => {
    // mostrar el numero grande en el Display.
    let nuevoNumero = numero;

    if (numero.includes('.') && numeroString === '.') return;

    if (numero.startsWith('0') || numero.startsWith('-0')) {
      if (numeroString === '.') {
        nuevoNumero = numero + numeroString;
      } else if (numeroString === '0' && numero.includes('.')) {
        nuevoNumero = numero + numeroString;
      } else if (numeroString !== '0' && !numero.includes('.')) {
        nuevoNumero = numeroString;
      } else if (numeroString === '0' && !numero.includes('.')) {
        return;
      } else {
        nuevoNumero = numero + numeroString;
      }
    } else {
      nuevoNumero = numero + numeroString;
    }

    setNumero(nuevoNumero);

    let nuevaFormula = nuevoNumero;
    if (lastOperation.current) {
      const primeraParte = formula.split(' ').at(0);
      nuevaFormula = `${primeraParte} ${lastOperation.current} ${nuevoNumero}`;
    }
    setFormula(nuevaFormula);
    setPrevNumero(`${calcularSubResultado(nuevaFormula)}`);
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