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
      const primeraParteFormula = formula.split(" ").at(0);
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
    //Limpiar todo
    setFormula("0");
    setNumero("0");
    setPrevNumero("0");
    lastOperation.current = null;
  };

  const invertirSigno = () => {
    //intercambiar de signo +/-
    if (numero.includes("-")) {
      return setNumero(numero.replace("-", ""));
    }
    setNumero("-" + numero);
  };

  const borrarUltimo = () => {
    //borra lo último digitado
    let signoActual = "";
    let numeroTemporal = numero;

    if (numero.includes("-")) {
      signoActual = "-";
      numeroTemporal = numero.substring(1);
    }

    if (numeroTemporal.length > 1) {
      return setNumero(signoActual + numeroTemporal.slice(0, -1));
    }

    setNumero("0");
  };

  const setLastnumero = () => {
    calcularResultado();

    if (numero.endsWith(".")) {
      setPrevNumero(numero.slice(0, -1));
    } else {
      setPrevNumero(numero);
    }

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
    const [primerValor, operacion, segundoValor] = formula.split(" ");

    const numero1 = Number(primerValor);
    const numero2 = Number(segundoValor);

    if (isNaN(numero2)) return numero1;

    switch (operacion) {
      case Operator.add:
        return numero1 + numero2;
      case Operator.subtract:
        return numero1 - numero2;
      case Operator.multiply:
        return numero1 * numero2;
      case Operator.divide:
        if (numero2 === 0) return 0;
        return numero1 / numero2;
      default:
        throw new Error(`Operación ${operacion} no implementada`);
    }
  };

  const calcularResultado = () => {
    const resultado = calcularSubResultado();
    setFormula(`${resultado}`);

    lastOperation.current = null;
    setPrevNumero("0");
  };

  const construirNumero = (numeroString: string) => {
    // mostrar el numero grande en el Display.
    if (numero.includes(".") && numeroString === ".") return;

    if (numero.startsWith("0") || numero.startsWith("-0")) {
      if (numeroString === ".") {
        return setNumero(numero + numeroString);
      }

      if (numeroString === "0" && numero.includes(".")) {
        return setNumero(numero + numeroString);
      }

      if (numeroString !== "0" && !numero.includes(".")) {
        return setNumero(numeroString);
      }

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
