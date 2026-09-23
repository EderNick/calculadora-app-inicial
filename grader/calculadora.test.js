import {
    act,
    renderHook,
} from '@testing-library/react-native';

import { useCalculator } from '../hooks/useCalculator';

const createCalculator = async () => {
    return await renderHook(() => useCalculator());
};

const press = async (operation) => {
    await act(() => {
        operation();
    });
};

const writeNumber = async (calculator, value) => {
    for (const character of value) {
        await press(() => {
            calculator.result.current.construirNumero(character);
        });
    }
};

describe('Criterio 01: construcción de números enteros', () => {
    test('[S01] inicia con el número cero', async () => {
        const calculator = await createCalculator();

        expect(calculator.result.current.numero).toBe('0');
    });

    test('[C01-2] construye un número de varios dígitos', async () => {
        const calculator = await createCalculator();

        await writeNumber(calculator, '785');

        expect(calculator.result.current.numero).toBe('785');
    });

    test('[C01-3] evita ceros innecesarios al inicio', async () => {
        const calculator = await createCalculator();

        await writeNumber(calculator, '0004');

        expect(calculator.result.current.numero).toBe('4');
    });
});

describe('Criterio 02: manejo de números decimales', () => {
    test('[C02-1] permite construir un número decimal', async () => {
        const calculator = await createCalculator();

        await writeNumber(calculator, '12.75');

        expect(calculator.result.current.numero).toBe('12.75');
    });

    test('[C02-2] impide ingresar más de un punto decimal', async () => {
        const calculator = await createCalculator();

        await writeNumber(calculator, '8.4.6');

        expect(calculator.result.current.numero).toBe('8.46');
    });

    test('[C02-3] permite iniciar un decimal desde cero', async () => {
        const calculator = await createCalculator();

        await writeNumber(calculator, '.25');

        expect(calculator.result.current.numero).toBe('0.25');
    });
});

describe('Criterio 03: limpieza de la calculadora', () => {
    test('[C03-1] restablece todos los valores visibles', async () => {
        const calculator = await createCalculator();

        await writeNumber(calculator, '25');

        await press(() => {
            calculator.result.current.sumarOperation();
        });

        await writeNumber(calculator, '13');

        expect(calculator.result.current.numero).toBe('13');
        expect(calculator.result.current.formula).not.toBe('0');

        await press(() => {
            calculator.result.current.limpiar();
        });

        expect(calculator.result.current.formula).toBe('0');
        expect(calculator.result.current.numero).toBe('0');
        expect(calculator.result.current.prevNumero).toBe('0');
    });
});

describe('Criterio 04: cambio de signo y borrado', () => {
    test('[C04-1] convierte un número positivo en negativo', async () => {
        const calculator = await createCalculator();

        await writeNumber(calculator, '9');

        await press(() => {
            calculator.result.current.invertirSigno();
        });

        expect(calculator.result.current.numero).toBe('-9');
    });

    test('[C04-2] permite recuperar el signo positivo', async () => {
        const calculator = await createCalculator();

        await writeNumber(calculator, '9');

        await press(() => {
            calculator.result.current.invertirSigno();
        });

        await press(() => {
            calculator.result.current.invertirSigno();
        });

        expect(calculator.result.current.numero).toBe('9');
    });

    test('[C04-3] borra dígitos sin dejar una cadena vacía', async () => {
        const calculator = await createCalculator();

        await writeNumber(calculator, '123');

        await press(() => {
            calculator.result.current.borrarUltimo();
        });

        expect(calculator.result.current.numero).toBe('12');

        await press(() => {
            calculator.result.current.limpiar();
        });

        await writeNumber(calculator, '7');

        await press(() => {
            calculator.result.current.borrarUltimo();
        });

        expect(calculator.result.current.numero).toBe('0');
    });
});

describe('Criterio 05: preparación de las operaciones', () => {
    test('[C05-1] conserva el primer operando', async () => {
        const calculator = await createCalculator();

        await writeNumber(calculator, '18');

        await press(() => {
            calculator.result.current.sumarOperation();
        });

        expect(calculator.result.current.prevNumero).toBe('18');
        expect(calculator.result.current.numero).toBe('0');
    });

    test('[C05-2] muestra el operador seleccionado', async () => {
        const calculator = await createCalculator();

        await writeNumber(calculator, '18');

        await press(() => {
            calculator.result.current.multiplicarOperation();
        });

        expect(calculator.result.current.formula).toContain('x');
    });
});

describe('Criterio 06: suma y resta', () => {
    test('[C06-1] suma correctamente dos números', async () => {
        const calculator = await createCalculator();

        await writeNumber(calculator, '15');

        await press(() => {
            calculator.result.current.sumarOperation();
        });

        await writeNumber(calculator, '7');

        await press(() => {
            calculator.result.current.calcularResultado();
        });

        expect(Number(calculator.result.current.formula)).toBeCloseTo(22);
    });

    test('[C06-2] resta correctamente dos números', async () => {
        const calculator = await createCalculator();

        await writeNumber(calculator, '20');

        await press(() => {
            calculator.result.current.restarOperation();
        });

        await writeNumber(calculator, '8');

        await press(() => {
            calculator.result.current.calcularResultado();
        });

        expect(Number(calculator.result.current.formula)).toBeCloseTo(12);
    });

    test('[C06-3] genera resultados negativos', async () => {
        const calculator = await createCalculator();

        await writeNumber(calculator, '5');

        await press(() => {
            calculator.result.current.restarOperation();
        });

        await writeNumber(calculator, '9');

        await press(() => {
            calculator.result.current.calcularResultado();
        });

        expect(Number(calculator.result.current.formula)).toBeCloseTo(-4);
    });
});

describe('Criterio 07: multiplicación y división', () => {
    test('[C07-1] multiplica correctamente', async () => {
        const calculator = await createCalculator();

        await writeNumber(calculator, '6');

        await press(() => {
            calculator.result.current.multiplicarOperation();
        });

        await writeNumber(calculator, '7');

        await press(() => {
            calculator.result.current.calcularResultado();
        });

        expect(Number(calculator.result.current.formula)).toBeCloseTo(42);
    });

    test('[C07-2] divide correctamente', async () => {
        const calculator = await createCalculator();

        await writeNumber(calculator, '24');

        await press(() => {
            calculator.result.current.dividirOperation();
        });

        await writeNumber(calculator, '6');

        await press(() => {
            calculator.result.current.calcularResultado();
        });

        expect(Number(calculator.result.current.formula)).toBeCloseTo(4);
    });

    test('[C07-3] controla la división entre cero', async () => {
        const calculator = await createCalculator();

        await writeNumber(calculator, '8');

        await press(() => {
            calculator.result.current.dividirOperation();
        });

        await writeNumber(calculator, '0');

        await expect(
            press(() => {
                calculator.result.current.calcularResultado();
            })
        ).resolves.toBeUndefined();

        expect(calculator.result.current.formula).not.toMatch(
            /Infinity|NaN/
        );
    });
});

describe('Criterio 08: resultado y continuidad', () => {
    test('[C08-1] obtiene correctamente el resultado parcial', async () => {
        const calculator = await createCalculator();

        await writeNumber(calculator, '4');

        await press(() => {
            calculator.result.current.sumarOperation();
        });

        await writeNumber(calculator, '6');

        expect(
            calculator.result.current.calcularSubResultado()
        ).toBeCloseTo(10);
    });

    test('[C08-2] permite continuar operando con un resultado', async () => {
        const calculator = await createCalculator();

        await writeNumber(calculator, '2');

        await press(() => {
            calculator.result.current.sumarOperation();
        });

        await writeNumber(calculator, '3');

        await press(() => {
            calculator.result.current.calcularResultado();
        });

        await press(() => {
            calculator.result.current.multiplicarOperation();
        });

        await writeNumber(calculator, '4');

        await press(() => {
            calculator.result.current.calcularResultado();
        });

        expect(Number(calculator.result.current.formula)).toBeCloseTo(20);
    });
});