import { useEffect, useRef, useState } from "react";

enum Operator {
  add = "+",
  subtract = "-",
  multiply = "x",
  divide = "÷",
}

export const useCalculator = () => {
  const [formula, setFormula] = useState("0");

  const [numero, setNumero] = useState("0");
  const [prevNumero, setPrevNumero] = useState("0");

  const lastOperation = useRef<Operator | null>(null);

  useEffect(() => {
    if (lastOperation.current) {
      const primeraParte = formula.split(" ").at(0);
      setFormula(`${primeraParte} ${lastOperation.current} ${numero}`);
    } else {
      setFormula(numero);
    }
  }, [numero]);

  useEffect(() => {
    const subResultado = calcularSubResultado();
    setPrevNumero(`${subResultado}`);
  }, [formula]);

  const limpiar = () => {
    setNumero("0");
    setPrevNumero("0");
    setFormula("0");
    lastOperation.current = null;
  };

  const invertirSigno = () => {
    if (numero === "0") return;
    if (numero.includes("-")) {
      return setNumero(numero.replace("-", ""));
    }
    setNumero("-" + numero);
  };

  const borrarUltimo = () => {
    let currentSign = "";
    let numeroTemporal = numero;

    if (numero.includes("-")) {
      currentSign = "-";
      numeroTemporal = numero.substring(1);
    }

    if (numeroTemporal.length > 1) {
      return setNumero(currentSign + numeroTemporal.slice(0, -1));
    }

    setNumero("0");
  };

  const setLastnumero = () => {
    calcularResultado();

    const limpio = numero.endsWith(".") ? numero.slice(0, -1) : numero;
    setPrevNumero(limpio);
    setNumero("0");
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
    const [primerV, operacion, segundoV] = formula.split(" ");

    const num1 = Number(primerV);
    const num2 = Number(segundoV); // q puede ser nan

    if (isNaN(num2)) return num1;

    switch (operacion) {
      case Operator.add:
        return num1 + num2;

      case Operator.subtract:
        return num1 - num2;

      case Operator.multiply:
        return num1 * num2;

      case Operator.divide:
        if (num2 === 0) return 0; // por si es div /0
        return num1 / num2;

      default:
        throw new Error(`Operation ${operacion} not implemented`);
    }
  };

  const calcularResultado = () => {
    const result = calcularSubResultado();
    setFormula(`${result}`);

    lastOperation.current = null;
    setPrevNumero("0");
  };

  const construirNumero = (numeroString: string) => {
    // Verificar si ya existe el punto decimal
    if (numero.includes(".") && numeroString === ".") return;

    if (numero.startsWith("0") || numero.startsWith("-0")) {
      if (numeroString === ".") {
        return setNumero(numero + numeroString);
      }

      // Evaluar si es otro cero y no hay punto
      if (numeroString === "0" && numero.includes(".")) {
        return setNumero(numero + numeroString);
      }

      // Evaluar si es diferente de cero, no hay punto y es el primer número
      if (numeroString !== "0" && !numero.includes(".")) {
        return setNumero(numeroString);
      }

      // Evitar el 0000000.00
      if (numeroString === "0" && !numero.includes(".")) {
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
