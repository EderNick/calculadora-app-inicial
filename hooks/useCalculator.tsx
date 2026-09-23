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
  };

  const invertirSigno = () => {
    //intercambiar de signo +/-
  };

  const borrarUltimo = () => {
    //borra lo último digitado
  };

  const setLastnumero = () => {

  };

  const dividirOperation = () => {
  };

  const multiplicarOperation = () => {

  };

  const restarOperation = () => {

  };

  const sumarOperation = () => {

  };

  const calcularSubResultado = () => {
    // Realizar la operacion correspendiente dependiendo del Operator
  };

  const calcularResultado = () => {

  };

  const construirNumero = (numeroString: string) => {
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
