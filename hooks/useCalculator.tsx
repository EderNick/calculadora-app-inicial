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

  useEffect(()=>{
    if(lastOperation.current){
      const firstFormulaPart = formula.split(' ').at(0);
      setFormula(`${firstFormulaPart} ${lastOperation.current} ${numero}`);
    }else{
      setFormula(numero);
    }
  },[numero]);

  useEffect(()=>{
    const subResultado = calcularSubResultado();
    setPrevNumero(`${subResultado}`);
  },[formula]);

  const limpiar = () => {
    setNumero('0');
    setPrevNumero('0');
    setFormula('0');
    lastOperation.current = null;
  };

  const invertirSigno = () => {
    if (numero === '0') return;

    if (numero.startsWith('-')) {
      setNumero(numero.substring(1));
    } else {
      setNumero('-' + numero);
    }
  };

  const borrarUltimo = () => {
    let currentSign ='';
    let temporalNumero = numero;

    if(numero.includes('-')){
      currentSign ='-';
      temporalNumero = numero.substring(1);
    }

    if(temporalNumero.length>1){
      return setNumero(currentSign + temporalNumero.slice(0, -1));
    }

    setNumero('0');
  };

  const setLastnumero = () => {
    calcularResultado();

    if(numero.endsWith('.')){
      setPrevNumero(numero.slice(0, -1));
    }

    setPrevNumero(numero);
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
    const[firstValue, operation, secondValue ] = formula.split(' ');

    const num1 = Number(firstValue);
    const num2 = Number(secondValue);

    if(isNaN(num2)) return num1;

    switch (operation){
      case Operator.add:
        return num1 + num2;

      case Operator.subtract:
        return num1 - num2;

      case Operator.multiply:
        return num1 * num2;

      case Operator.divide:
        if(num2!=0){
          return num1 / num2;
        }else{
          return 0;
        }
      default:
        throw new Error(`Operation ${operation} not implementada`);
    }

  };

  const calcularResultado = () => {
    const resultado = calcularSubResultado();
    setFormula(`${resultado}`);

    lastOperation.current = null;
    setPrevNumero('0');
  };

  const construirNumero = (numeroString: string) => {
    // mostrar el numero grande en el Display.
    if(numero.includes('.') && numero.startsWith('-0')) return;

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
