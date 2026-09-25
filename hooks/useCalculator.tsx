import { useRef, useState } from 'react';

enum Operator {
  add = '+',
  subtract = '-',
  multiply = 'x',
  divide = '÷',
}

export const useCalculator = () => {
  const [formula, setFormula] = useState('0');
  const [number, setNumber] = useState('0');
  const [prevNumber, setPrevNumber] = useState('0');
  const lastOperation = useRef<Operator | undefined>(undefined);
  const hasResult = useRef(false);

  const clean = () => {
    setFormula('0');
    setNumber('0');
    setPrevNumber('0');
    lastOperation.current = undefined;
    hasResult.current = false;
  };

  const toggleSign = () => {
    if (number === '0') return;
    setNumber(number.startsWith('-') ? number.slice(1) : `-${number}`);
  };

  const deleteLast = () => {
    if (number.length <= 1 || (number.length === 2 && number.startsWith('-'))) {
      setNumber('0');
      return;
    }

    const updatedNumber = number.slice(0, -1);
    setNumber(updatedNumber === '-0' || updatedNumber === '-' ? '0' : updatedNumber);
  };

  const setOperation = (operation: Operator) => {
    const currentNumber = number.endsWith('.') ? number.slice(0, -1) : number;
    let firstNumber = currentNumber;

    if (lastOperation.current) {
      firstNumber = `${calculateSubResult()}`;
    }

    setFormula(`${firstNumber} ${operation}`);
    setPrevNumber(firstNumber);
    setNumber('0');
    lastOperation.current = operation;
    hasResult.current = false;
  };

  const divideOperation = () => setOperation(Operator.divide);

  const multiplyOperation = () => setOperation(Operator.multiply);

  const subtractOperation = () => setOperation(Operator.subtract);

  const addOperation = () => setOperation(Operator.add);

  const calculateSubResult = (currentFormula = formula) => {
    const [firstValue, operation, secondValue] = currentFormula.split(' ');

    const num1 = Number(firstValue);
    const num2 = Number(secondValue);

    if (!Number.isFinite(num1) || !operation || !Number.isFinite(num2)) return Number.isFinite(num1) ? num1 : 0;

    switch (operation) {
      case Operator.add:
        return num1 + num2;
      case Operator.subtract:
        return num1 - num2;
      case Operator.multiply:
        return num1 * num2;
      case Operator.divide:
        return num2 === 0 ? 0 : num1 / num2;

      default:
        return num1;
    }
  };

  const calculateResult = () => {
    const subResult = calculateSubResult();
    const result = Number.isFinite(subResult) ? subResult : 0;
    const resultText = `${result}`;

    setFormula(resultText);
    setNumber(resultText);
    setPrevNumber('0');
    lastOperation.current = undefined;
    hasResult.current = true;
  };

  const buildNumber = (numberString: string) => {
    if (hasResult.current) {
      setFormula('0');
      setPrevNumber('0');
      hasResult.current = false;
      const initialNumber = numberString === '.' ? '0.' : numberString;
      setNumber(initialNumber);
      setFormula(initialNumber);
      return;
    }

    if (number.includes('.') && numberString === '.') return;

    let nextNumber = number;

    if (numberString === '.') {
      nextNumber = number === '0' ? '0.' : number === '-0' ? '-0.' : `${number}.`;
    } else if (number === '0') {
      nextNumber = numberString;
    } else if (number === '-0') {
      nextNumber = `-${numberString}`;
    } else {
      nextNumber = `${number}${numberString}`;
    }

    setNumber(nextNumber);

    if (lastOperation.current) {
      const firstNumber = formula.split(' ')[0];
      const nextFormula = `${firstNumber} ${lastOperation.current} ${nextNumber}`;
      setFormula(nextFormula);
      setPrevNumber(`${calculateSubResult(nextFormula)}`);
    } else {
      setFormula(nextNumber);
    }
  };

  return {
    formula,
    number,
    prevNumber,
    numero: number,
    prevNumero: prevNumber,
    construirNumero: buildNumber,
    limpiar: clean,
    invertirSigno: toggleSign,
    borrarUltimo: deleteLast,
    dividirOperation: divideOperation,
    multiplicarOperation: multiplyOperation,
    restarOperation: subtractOperation,
    sumarOperation: addOperation,
    calcularSubResultado: calculateSubResult,
    calcularResultado: calculateResult,
  };
};
