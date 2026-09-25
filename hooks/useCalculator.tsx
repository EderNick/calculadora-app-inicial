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

  const mostrarNumero = (nuevoNumero: string) => {
    setNumero(nuevoNumero);

    if (lastOperation.current) {
      setFormula(`${prevNumero} ${lastOperation.current} ${nuevoNumero}`);
    } else {
      setFormula(nuevoNumero);
    }
  };


  const limpiar = () => {
    //Limpiar todo
    setNumero('0');
    setPrevNumero('0');
    setFormula('0');
    lastOperation.current = null;
  };

  const invertirSigno = () => {
    //intercambiar de signo +/-
    if (numero.startsWith('-')) {
      setNumero(numero.slice(1));
    } else {
      setNumero('-' + numero);
    }
  };

  const borrarUltimo = () => {
    //borra lo último digitado
    const sinUltimo = numero.slice(0, -1);
    if (sinUltimo === '') {
      mostrarNumero('0');
    } else {
      mostrarNumero(sinUltimo);
    }
  };



  const setLastnumero = () => {
    let primerNumero = numero;

    if (lastOperation.current && numero !== '0') {
      primerNumero = `${calcularSubResultado()}`;
    } else if (lastOperation.current) {
      // Solo cambiaste de operador (tocaste + y luego x): se mantiene el primero
      primerNumero = prevNumero;
    }

    // "5." no es un número completo -> le quitamos el punto
    if (primerNumero.endsWith('.')) {
      primerNumero = primerNumero.slice(0, -1);
    }

    setPrevNumero(primerNumero);
    setNumero('0'); // el segundo número empieza en 0
    return primerNumero;

  };



  const dividirOperation = () => {
    const primerNumero = setLastnumero();
    lastOperation.current = Operator.divide;
    setFormula(`${primerNumero} ${Operator.divide}`);
  };

  const multiplicarOperation = () => {
    const primerNumero = setLastnumero();
    lastOperation.current = Operator.multiply;
    setFormula(`${primerNumero} ${Operator.multiply}`);
  };

  const restarOperation = () => {
    const primerNumero = setLastnumero();
    lastOperation.current = Operator.subtract;
    setFormula(`${primerNumero} ${Operator.subtract}`);

  };

  const sumarOperation = () => {
    const primerNumero = setLastnumero();
    lastOperation.current = Operator.add;
    setFormula(`${primerNumero} ${Operator.add}`);

  };

  const calcularSubResultado = () => {

    const primerNumero = Number(prevNumero);
    const segundoNumero = Number(numero);
    let preResultado = segundoNumero;

    if (lastOperation.current === Operator.add) {
      preResultado = primerNumero + segundoNumero;
    }

    return preResultado;


  };

  const calcularResultado = () => {
    if (!lastOperation.current) return;

    let resultado: number;
    if (lastOperation.current === Operator.add) {
      resultado = Number(prevNumero) + Number(numero);
    } else if (lastOperation.current === Operator.subtract) {
      resultado = Number(prevNumero) - Number(numero);
    } else if (lastOperation.current === Operator.multiply) {
      resultado = Number(prevNumero) * Number(numero);
    } else if (lastOperation.current === Operator.divide) {
      resultado = Number(prevNumero) / Number(numero);
    }

    lastOperation.current = null;
    setPrevNumero('0');
    mostrarNumero(resultado.toString());

  };

  const construirNumero = (numeroString: string) => {
    // mostrar el numero grande en el Display.
    if (numeroString === '.' && numero.includes('.')) return;

    // Si el número es 0, lo reemplazamos (evita "0004")...
    if (numero === '0') {
      // ...salvo el punto: "0" + "." = "0."
      mostrarNumero(numeroString === '.' ? '0.' : numeroString);
      return;
    }

    // En cualquier otro caso, agregamos el dígito al final ("78" + "5" = "785")
    mostrarNumero(numero + numeroString);
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
