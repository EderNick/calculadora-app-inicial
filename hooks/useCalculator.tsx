import { CurrentRenderContext } from 'expo-router/build/react-navigation';
import {useEffect, useRef, useState } from 'react';

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
  const mostrarResultado= useRef(false);
  const esperandoOperando = useRef(false);

  useEffect(() => {
    if (lastOperation.current) {
      setFormula(`${prevNumero} ${lastOperation.current} ${numero}`);
      return;
    }else{
      setFormula(numero);

    }
    
  }, [numero, prevNumero]);


  const limpiar = () => {
    //Limpiar todo
    setFormula('0');
    setNumero('0');
    setPrevNumero('0');
    lastOperation.current=null;
    mostrarResultado.current = false;
    esperandoOperando.current = false;

  };

  const invertirSigno = () => {
    //intercambiar de signo +/-
    if(numero === '0')
      return;
    setNumero(numero.startsWith('-')?numero.slice(1):`-${numero}`);
    mostrarResultado.current= false;
  };

  const borrarUltimo = () => {
    //borra lo último digitado
    if(numero.length === 1||(numero.startsWith('-')&& numero.length === 2)){
      setNumero('0');
      return;
    }

    setNumero(numero.slice(0,-1));

  };

  const setLastnumero = () => {

    const numeroActual = numero.endsWith('-')? numero.slice(0,-1): numero;

    setPrevNumero(numeroActual);
    setNumero('0');
    mostrarResultado.current = false;
    esperandoOperando.current =false;

  };

  const prepararOperacion = (operator: Operator) => {
    if (lastOperation.current && !esperandoOperando.current) {
      const resultadoParcial = calcularSubResultado();
      const resultadoString = String(resultadoParcial);

      setPrevNumero(resultadoString);
      setNumero('0');
      setFormula(`${resultadoString} ${operator} 0`);
      esperandoOperando.current = true;
    } else if (lastOperation.current) {
      setFormula(`${prevNumero} ${operator} 0`);
    } else {
      setLastnumero();
    }

    lastOperation.current = operator;
  };


  const dividirOperation = () => {
    prepararOperacion(Operator.divide);
  };

  const multiplicarOperation = () => {
    prepararOperacion(Operator.multiply);
  };

  const restarOperation = () => {
    prepararOperacion(Operator.subtract);

  };

  const sumarOperation = () => {
    prepararOperacion(Operator.add);

  };

  const calcularSubResultado = () => {
    // Realizar la operacion correspendiente dependiendo del Operator
   const primerOperando = Number(prevNumero);
    const segundoOperando = Number(numero);

    switch (lastOperation.current) {
      case Operator.add:
        return primerOperando + segundoOperando;
      case Operator.subtract:
        return primerOperando - segundoOperando;
      case Operator.multiply:
        return primerOperando * segundoOperando;
      case Operator.divide:
        return segundoOperando === 0 ? 0 : primerOperando / segundoOperando;
      default:
        return segundoOperando;
    }

  };

  const calcularResultado = () => {
    if (lastOperation.current === null) return;

    if (lastOperation.current === Operator.divide && Number(numero) === 0) {
      setFormula('Error');
      setNumero('0');
      setPrevNumero('0');
      lastOperation.current = null;
      mostrarResultado.current = true;
      esperandoOperando.current = false;
      return;
    }

    const resultado = calcularSubResultado();
    const resultadoString = String(resultado);

    setFormula(resultadoString);
    setNumero(resultadoString);
    setPrevNumero('0');
    lastOperation.current = null;
    mostrarResultado.current = true;
    esperandoOperando.current = false;

    
  };


  const construirNumero = (numeroString: string) => {
    // mostrar el numero grande en el Display.
      if (!/^\d$|^\.$/.test(numeroString)) return;

    if (mostrarResultado.current) {
      mostrarResultado.current = false;
      esperandoOperando.current = false;
      setFormula('0');
      setNumero(numeroString === '.' ? '0.' : numeroString);
      return;
    }

    if (numeroString === '.') {
      if (numero.includes('.')) return;
      esperandoOperando.current = false;
      setNumero(`${numero}.`);
      return;
    }

    if (numero === '0') {
      esperandoOperando.current = false;
      setNumero(numeroString);
      return;
    }

    if (numero === '-0') {
      esperandoOperando.current = false;
      setNumero(`-${numeroString}`);
      return;
    }

    esperandoOperando.current = false;
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



