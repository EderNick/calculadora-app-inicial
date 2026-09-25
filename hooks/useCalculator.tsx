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
    
      return setFormula('0');
      
      // puede ser nesesario el numero tambien 
  };

  const invertirSigno = () => {
    const signo='-';
    calcularSubResultado();
         return signo

  };

  const borrarUltimo = () => {
    const numero1 = Number(0);
   
  };

  const dividirOperation = () => {
    let currentSign = '';
    let temporalNumber = numero;

    if (numero.includes('-')) {
      currentSign = '-';
      temporalNumber = numero.substring(1);
    }

    if (temporalNumber.length > 1) {
      return setNumero(currentSign + temporalNumber.slice(0, -1));
    }

    setNumero('0');

  };

  const multiplicarOperation = () => {
    calcularResultado();
    if (numero.endsWith('.')) {
      setPrevNumero(numero.slice(0, -1));
    }
    setPrevNumero(numero);
    setNumero('0');
  };

  const restarOperation = () => {
    let currentSign = '';
    let temporalNumber = numero;

    if (numero.includes('-')) {
      currentSign = '-';
      temporalNumber = numero.substring(1);
    }

    if (temporalNumber.length > 1) {
      return setNumero(currentSign + temporalNumber.slice(0, -1));
    }

    setNumero('0');
  };

  const sumarOperation = () => {
    calcularResultado();
    if (numero.endsWith('.')) {
      setPrevNumero(numero.slice(0, -1));
    }
    setPrevNumero(numero);
    setNumero('0');
  };


  
  const calcularSubResultado = () => {
   
    const result = calcularSubResultado();
    setFormula(`${result}`);

    // lastOperation.current = undefined;
    calcularSubResultado();

  };

  const calcularResultado = () => {
  

   const [firstValue, operation, secondValue] = formula.split(' ');

    const num1 = Number(firstValue);
    const num2 = Number(secondValue); // NaN

    if (isNaN(num2)) return num1;

    switch (operation) {
      case Operator.add:
        return num1 + num2;
      case Operator.subtract:
        return num1 - num2;
      case Operator.multiply:
        return num1 * num2;
      case Operator.divide:
        return num1 / num2;

      default:
        throw new Error(`Operation ${operation} not implemented`);
    }



  };

  const construirNumero = (numeroString: string) => {
        if (numero.includes('.') && numeroString === '.') return;

    if (numero.startsWith('0') || numero.startsWith('-0')) {
      if (numeroString === '.') {
        return setNumero(numero + numeroString);
      }

      // Evaluar si es otro cero y no hay punto
      if (numeroString === '0' && numero.includes('.')) {
        return setNumero(numero + numeroString);
      }

      // Evaluar si es diferente de cero, no hay punto y es el primer número
      if (numeroString !== '0' && !numero.includes('.')) {
        return setNumero(numeroString);
      }

      // Evitar el 0000000.00
      if (numeroString === '0' && !numero.includes('.')) {
        return;
      }
    }

    setNumero(numero + numeroString);
    
    // mostrar el numero grande en el Display.
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




