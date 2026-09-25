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
      const primeraParteForm = formula.split(" ").at(0);
      setFormula(`${primeraParteForm} ${lastOperation.current} ${numero}`);
    } else {
      setFormula(numero);
    }
  }, [numero]);

  useEffect(() => {
    const subResultado = calcularSubResultado();
    setPrevNumero(`${subResultado}`);
  }, [formula]);

  const limpiar = () => {
    //Limpiar todo
    setFormula("0");
    setNumero("0");
    setPrevNumero("0");
    lastOperation.current = null;
  };

  const invertirSigno = () => {
    //intercambiar de signo +/-
    if (numero.includes("-")) {
      setNumero(numero.replace("-", ""));
    } else {
      setNumero("-" + numero);
    }
  };

  const borrarUltimo = () => {
    //borra lo último digitado
    let signo = "";
    let numeroTemp = numero;
    if (numeroTemp.includes("-")) {
      signo = "-";
      numeroTemp = numeroTemp.substring(1);
    }
    if (numeroTemp.length > 1) {
      return setNumero(signo + numeroTemp.slice(0, -1));
    }
  };

  const setLastnumero = () => {
    calcularResultado();
    if (numero.endsWith(".")) {
      setPrevNumero(numero.slice(0, -1));
    }
    setPrevNumero(numero);
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
    // Realizar la operacion correspendiente dependiendo del Operator

    const [primerValor, operacion, segundoValor] = formula.split(" ");
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
        throw new Error("Operación ${operacion} no implementada");
    }
  };

  const calcularResultado = () => {
    const resultado = calcularSubResultado();
    setFormula(`${resultado}`);
    lastOperation.current = null;
    setPrevNumero("0");
  };

  const construirNumero = (numeroString: string) => {
    if (numero.includes(".") && numeroString === ".") return;
    if (numero.startsWith("0") || numero.startsWith("-0")) {
      if (numeroString === ".") {
        setNumero(numero + numeroString);
        return;
      }

      if (numeroString === "0" && numero.includes(".")) {
        setNumero(numero + numeroString);
        return;
      }
      if (numeroString === "0" && !numero.includes(".")) {
        return;
      }
      if (numeroString !== "0" && !numero.includes(".")) {
        return setNumero(numeroString);
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
