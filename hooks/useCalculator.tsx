import { useRef, useState, useEffect } from 'react';

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

  // Mantener la fórmula y el resultado parcial actualizados en pantalla
  useEffect(() => {
    if (lastOperation.current) {
      const firstPart = formula.split(' ').at(0);
      setFormula(`${firstPart} ${lastOperation.current} ${numero}`);
    } else {
      setFormula(numero);
    }
  }, [numero]);

  useEffect(() => {
  // Si la fórmula es Error, limpiamos prevNumero para que no calcule ni muestre NaN
  if (formula === 'Error') {
    setPrevNumero('');
    return;
  }
  const subResult = calcularSubResultado();
  setPrevNumero(`${subResult}`);
}, [formula]);

  // Limpiar todo
  const limpiar = () => {
    setNumero('0');
    setPrevNumero('0');
    setFormula('0');
    lastOperation.current = null;
  };

  // Intercambiar signo +/-
  const invertirSigno = () => {
    if (numero.includes('-')) {
      setNumero(numero.replace('-', ''));
    } else if (numero !== '0') {
      setNumero('-' + numero);
    }
  };

  // Borrar el último carácter introducido
  const borrarUltimo = () => {
    let signoActual = '';
    let numeroTemporal = numero;

    if (numero.startsWith('-')) {
      signoActual = '-';
      numeroTemporal = numero.substring(1);
    }

    if (numeroTemporal.length > 1) {
      setNumero(signoActual + numeroTemporal.slice(0, -1));
    } else {
      setNumero('0');
    }
  };

  // Guarda el número previo antes de aplicar la operación
  const setLastnumero = () => {
    if (numero.endsWith('.')) {
      setPrevNumero(numero.slice(0, -1));
    } else {
      setPrevNumero(numero);
    }
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

  // Calcula la operación matemática según el operador activo
  const calcularSubResultado = (): number => {
    const [firstValue, operation, secondValue] = formula.split(' ');

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
        if (num2 === 0) return 0; // Previene Infinity / NaN
        return num1 / num2;
      default:
        return 0;
    }
  };

  // Obtiene el resultado final al presionar "=" y permite continuidad
  const calcularResultado = () => {
    const [firstValue, operation, secondValue] = formula.split(' ');
    const num1 = Number(firstValue);
    const num2 = Number(secondValue);

    // Control de división entre cero
    if (operation === Operator.divide && num2 === 0) {
      setNumero('0');
      setPrevNumero('');
      setFormula('Error');
      lastOperation.current = null;
      return;
    }

    const resultado = calcularSubResultado();
    setFormula(`${resultado}`);
    setNumero(`${resultado}`);
    setPrevNumero('0');
    lastOperation.current = null;
  };

  // Construcción del número validando puntos y ceros a la izquierda
  const construirNumero = (numeroString: string) => {
    // Evitar más de un punto decimal
    if (numero.includes('.') && numeroString === '.') return;

    if (numero.startsWith('0') || numero.startsWith('-0')) {
      // Punto decimal sobre un 0 inicial
      if (numeroString === '.') {
        return setNumero(numero + numeroString);
      }

      // Evitar acumulación de ceros innecesarios al inicio
      if (numeroString === '0' && !numero.includes('.')) {
        return;
      }

      // Reemplazar el 0 inicial por el dígito ingresado
      if (numeroString !== '0' && !numero.includes('.')) {
        return setNumero((numero.startsWith('-') ? '-' : '') + numeroString);
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