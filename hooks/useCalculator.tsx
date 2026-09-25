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
    setFormula('0');
    setNumero('0');
    setPrevNumero('0');
    lastOperation.current = null;
  };

  const invertirSigno = () => {
    //intercambiar de signo +/-
    if (numero.includes('-')) {
    setNumero(numero.replace('-', ''));
    } else {
    setNumero('-' + numero);
    }
  };

  const borrarUltimo = () => {
    //borra lo último digitado
    if (numero.length <= 1 || (numero.startsWith('-') && numero.length === 2)) {
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
    setNumero('0');
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
    // Realizar la operacion correspendiente dependiendo del Operator
    const num1 = Number(prevNumero);
    const num2 = Number(numero);
    
    switch (lastOperation.current) {
    
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
    return num2;
    }
  };

  const calcularResultado = () => {
    const resultado = calcularSubResultado();
    
    setNumero(`${resultado}`);
    setPrevNumero('0');
    setFormula(`${resultado}`);
  };

  const construirNumero = (numeroString: string) => {
    // mostrar el numero grande en el Display.
    if (numeroString === '.' && numero.includes('.')) return;
    
    if (numero === '0' && numeroString !== '.') {
      setNumero(numeroString);
      setFormula(numeroString);
      return;
    }
    
    const nuevoNumero = numero + numeroString;
    
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
