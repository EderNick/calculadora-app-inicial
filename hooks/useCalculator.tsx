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

  const lastOperation = useRef<Operator | undefined>(undefined);

  useEffect(() => {
    if (lastOperation.current) {
      const primeraParteFormula = formula.split(' ').at(0);
      setFormula(`${primeraParteFormula} ${lastOperation.current} ${numero}`);
    } else {
      setFormula(numero);
    }
  }, [numero]);

  useEffect(() => {
    const subResultado = calcularSubResultado();
    setPrevNumero(`${subResultado}`);
  }, [formula]);

  const limpiar = () => {
    setNumero('0');
    setPrevNumero('0');
    setFormula('0');
    lastOperation.current = undefined;
  };

  const invertirSigno = () => {
    if (numero.includes('-')) {
      setNumero(numero.slice(1));
    } else {
      setNumero('-' + numero);
    }
  };

  const borrarUltimo = () => {
    let signoActual = '';
    let numeroTemporal = numero;

    if (numero.includes('-')) {
      signoActual = '-';
      numeroTemporal = numero.substring(1);
    }

    if (numeroTemporal.length > 1) {
      return setNumero(signoActual + numeroTemporal.slice(0, -1));
    }

    setNumero('0');
  };

  const setLastnumero = () => {
    calcularResultado();

    if (numero.endsWith('.')) {
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

  const calcularSubResultado = (): number => {
    const [primerValor, operacion, segundoValor] = formula.split(' ');

    const num1 = Number(primerValor);
    const num2 = Number(segundoValor);

    if (isNaN(num2)) return num1;

    switch (operacion) {
      case Operator.add:
        return num1 + num2;
      case Operator.subtract:
        return num1 - num2;
      case Operator.multiply:
        return num1 * num2;
      case Operator.divide:
        return num1 / num2;
      default:
        throw new Error(`Operación ${operacion} no implementada`);
    }
  };

  const calcularResultado = () => {
    const resultado = calcularSubResultado();
    setFormula(`${resultado}`);

    lastOperation.current = undefined;
    setPrevNumero('0');
  };

  const construirNumero = (numeroString: string) => {
    if (numero.includes('.') && numeroString === '.') return;

    if (numero.startsWith('0') || numero.startsWith('-0')) {
      if (numeroString === '.') {
        return setNumero(numero + numeroString);
      }

      if (numeroString === '0' && numero.includes('.')) {
        return setNumero(numero + numeroString);
      }

      if (numeroString !== '0' && !numero.includes('.')) {
        return setNumero(numeroString);
      }

      if (numeroString === '0' && !numero.includes('.')) {
        return;
      }
    }

    setNumero(numero + numeroString);
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
