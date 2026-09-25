import CalculatorButton from '@/components/CalculatorButton';
import ThemeText from '@/components/ThemeText';
import { Colors } from '@/constants/Colors';
import { useCalculator } from '@/hooks/useCalculator';
import { globalStyles } from '@/styles/global-styles';
import { View } from 'react-native';

const CalculatorApp = () => {
    const {
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
    } = useCalculator();

    return (
        <View style={globalStyles.calculatorContainer}>
            {/* Resultados */}
            <View style={{ paddingHorizontal: 30, marginBottom: 20 }}>
                <ThemeText variant="h1">{formula}</ThemeText>

                {formula === prevNumero || numero === '0' ? (
                    <ThemeText variant="h2"> </ThemeText>
                ) : (
                    <ThemeText variant="h2">{prevNumero}</ThemeText>
                )}
            </View>

            {/* Filas de botones */}

            <View style={globalStyles.row}>
                <CalculatorButton
                    label="C"
                    blackText
                    color={Colors.lightGray}
                    onPress={limpiar}
                />
                <CalculatorButton
                    label="+/-"
                    blackText
                    color={Colors.lightGray}
                    onPress={invertirSigno}
                />
                <CalculatorButton
                    label="del"
                    blackText
                    color={Colors.lightGray}
                    onPress={borrarUltimo}
                />
                <CalculatorButton
                    label="÷"
                    color={Colors.orange}
                    onPress={dividirOperation}
                />
            </View>

            <View style={globalStyles.row}>
                <CalculatorButton label="7" onPress={() => construirNumero('7')} />
                <CalculatorButton label="8" onPress={() => construirNumero('8')} />
                <CalculatorButton label="9" onPress={() => construirNumero('9')} />
                <CalculatorButton
                    label="x"
                    color={Colors.orange}
                    onPress={multiplicarOperation}
                />
            </View>

            <View style={globalStyles.row}>
                <CalculatorButton label="4" onPress={() => construirNumero('4')} />
                <CalculatorButton label="5" onPress={() => construirNumero('5')} />
                <CalculatorButton label="6" onPress={() => construirNumero('6')} />
                <CalculatorButton
                    label="-"
                    color={Colors.orange}
                    onPress={restarOperation}
                />
            </View>

            <View style={globalStyles.row}>
                <CalculatorButton label="1" onPress={() => construirNumero('1')} />
                <CalculatorButton label="2" onPress={() => construirNumero('2')} />
                <CalculatorButton label="3" onPress={() => construirNumero('3')} />
                <CalculatorButton
                    label="+"
                    color={Colors.orange}
                    onPress={sumarOperation}
                />
            </View>

            <View style={globalStyles.row}>
                <CalculatorButton
                    label="0"
                    doubleSize
                    onPress={() => construirNumero('0')}
                />
                <CalculatorButton label="." onPress={() => construirNumero('.')} />

                <CalculatorButton
                    label="="
                    color={Colors.orange}
                    onPress={calcularResultado}
                />
            </View>
        </View>
    );
};

export default CalculatorApp;
