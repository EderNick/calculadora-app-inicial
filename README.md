# Práctica calificada: lógica de calculadora móvil

## Curso

**Programación de Aplicaciones Móviles — VI ciclo**

- **Modalidad:** Individual
- **Puntaje máximo:** 20 puntos
- **Tiempo para la entrega:** 60 min.
- **Entrega:** Pull request en GitHub
- **Repositorio base:** Este repositorio

---

## Propósito

Implementar la lógica de una calculadora móvil utilizando React Native, Expo,
TypeScript, `useState`, `useRef` y un hook personalizado.

La interfaz visual, los botones y los estilos ya están desarrollados. Su tarea
consiste en completar la lógica para que la calculadora procese correctamente
las acciones del usuario.

## Archivo de trabajo

El único archivo que debe modificar es:

```text
hooks/useCalculator.tsx
```

## Funcionalidades requeridas

La calculadora debe permitir:

- Construir números enteros.
- Construir números decimales.
- Evitar más de un punto decimal.
- Evitar ceros innecesarios al inicio.
- Limpiar los valores de la calculadora.
- Cambiar el signo del número actual.
- Borrar el último carácter ingresado.
- Sumar, restar, multiplicar y dividir.
- Mostrar la fórmula correspondiente.
- Calcular resultados parciales y finales.
- Continuar operando después de obtener un resultado.
- Controlar la división entre cero sin mostrar `Infinity` ni `NaN`.

## Restricciones

No está permitido modificar:

```text
.github/
grader/
jest.grader.config.js
package.json
package-lock.json
```

Tampoco debe:

- Cambiar los nombres de los métodos o propiedades retornadas por `useCalculator`.
- Eliminar el `enum Operator`.
- Modificar la interfaz visual para ocultar errores.
- Instalar librerías adicionales para resolver la lógica.
- Copiar una solución completa de otro repositorio.

---

# Procedimiento de desarrollo y entrega

## 1. Crear una copia personal del repositorio

1. Inicie sesión en su cuenta de GitHub.
2. Abra el repositorio proporcionado por el docente.
3. Presione el botón **Fork**, ubicado en la parte superior derecha.
4. En **Owner**, seleccione su cuenta personal.
5. Mantenga el nombre sugerido para el repositorio.
6. Mantenga marcada la opción **Copy the `main` branch only**.
7. Presione **Create fork**.

Al terminar, GitHub mostrará una copia del proyecto bajo su propio nombre de
usuario.

## 2. Clonar su fork en la computadora

Dentro de su fork:

1. Presione el botón verde **Code**.
2. Seleccione **Local**.
3. Seleccione **HTTPS**.
4. Copie la dirección mostrada.
5. Abra una terminal en la carpeta donde guardará el proyecto.
6. Ejecute:

```bash
git clone URL_DE_SU_FORK
```

Ejemplo:

```bash
git clone https://github.com/usuario/calculadora-app.git
```

7. Ingrese a la carpeta descargada:

```bash
cd calculadora-app
```

## 3. Instalar las dependencias

Ejecute:

```bash
npm install
```

Espere a que el proceso finalice correctamente antes de continuar.

## 4. Crear y seleccionar su rama de trabajo

No trabaje directamente en la rama `main`.

La rama debe tener sus apellidos y nombres completos separados por guiones.

Reglas:

- La rama debe iniciar con `practica/`
- Luego escribir sus apellidos y nombres separados por guiones (`-`).
- Utilice solo letras minúsculas.
- No utilice espacios.
- No utilice tildes.
- No utilice la letra `ñ`.

Ejemplo para el estudiante Eder Nicanor Figueroa Piscoya:

```text
practica/figueroa-piscoya-eder-nicanor
```

### Paso 4.1: Crear la rama

Ejecute el siguiente comando, reemplazando el ejemplo por sus datos:

```bash
git branch practica/figueroa-piscoya-eder-nicanor
```

### Paso 4.2: Cambiarse a la rama creada

Ejecute:

```bash
git switch practica/figueroa-piscoya-eder-nicanor
```

### Paso 4.3: Verificar la rama activa

Ejecute:

```bash
git branch
```

La rama activa aparecerá con un asterisco (`*`).

Ejemplo:

```text
* practica/figueroa-piscoya-eder-nicanor
  main
```

Solo después de comprobar que el asterisco está junto a su rama personal,
puede iniciar el desarrollo.

> También puede crear y cambiarse a la rama con un solo comando:
>
> ```bash
> git switch -c practica/figueroa-piscoya-eder-nicanor
> ```

## 5. Implementar la calculadora

Abra el archivo:

```text
hooks/useCalculator.tsx
```

Complete las funciones incompletas:

```text
limpiar
invertirSigno
borrarUltimo
setLastnumero
dividirOperation
multiplicarOperation
restarOperation
sumarOperation
calcularSubResultado
calcularResultado
construirNumero
```

## 6. Probar la aplicación

Inicie el proyecto:

```bash
npx expo start
```

Pruebe manualmente cada botón de la calculadora:

- Números enteros.
- Números decimales.
- Botón de limpieza.
- Cambio de signo.
- Borrado.
- Operaciones básicas.
- División entre cero.
- Continuidad después de obtener un resultado.

## 7. Registrar los cambios realizados

Cuando termine su implementación, abra la terminal dentro de la carpeta del
proyecto.

### Paso 7.1: Agregar el archivo trabajado

```bash
git add hooks/useCalculator.tsx
```

### Paso 7.2: Crear un commit

Reemplazar el ejemplo con sus datos personales:

```bash
git commit -m "Implementa logica de calculadora por Eder N. Figueroa P."
```

### Paso 7.3: Publicar su rama en GitHub

Ejecute:

```bash
git push -u origin nombre-de-su-rama
```

Ejemplo:

```bash
git push -u origin practica/figueroa-piscoya-eder-nicanor
```

## 8. Crear el pull request

Después de publicar su rama, abra su fork en GitHub.

### Opción A: aparece una sugerencia

Si aparece el botón:

```text
Compare & pull request
```

presiónelo.

### Opción B: no aparece la sugerencia

1. Ingrese al repositorio original del docente.
2. Abra la pestaña **Pull requests**.
3. Presione **New pull request**.
4. Seleccione **compare across forks**.
5. Configure los campos así:

| Campo | Selección correcta |
|---|---|
| **base repository** | Repositorio original del docente |
| **base** | `main` |
| **head repository** | Su fork personal |
| **compare** | Su rama con apellidos y nombres |

## 9. Completar la plantilla del pull request

Al crear el pull request, GitHub cargará una plantilla que debe completar
obligatoriamente.

Utilice exactamente este formato como título:

```text
PC Calculadora - APELLIDOS Y NOMBRES
```

Ejemplo:

```text
PC Calculadora - FIGUEROA PISCOYA EDER NICANOR
```

Complete todos los apartados de la plantilla:

- Apellidos y nombres.
- Código universitario.
- Usuario de GitHub.
- Sección.
- Descripción breve de su solución.
- Lista de funcionalidades verificadas.
- Captura de la calculadora funcionando.
- Declaración de autoría.

Después, presione:

```text
Create pull request
```

No presione **Merge pull request**.

## 10. Realizar cambios después de enviar el pull request

Si todavía se encuentra dentro del tiempo establecido para la práctica y desea
corregir o mejorar su código, puede hacerlo en la misma rama.

### Paso 10.1: Realizar la corrección

Modifique nuevamente:

```text
hooks/useCalculator.tsx
```

### Paso 10.2: Agregar los cambios

```bash
git add hooks/useCalculator.tsx
```

### Paso 10.3: Registrar la corrección

```bash
git commit -m "Corrige logica de calculadora"
```

### Paso 10.4: Publicar la corrección

```bash
git push
```

No es necesario crear otro pull request.

El pull request ya está vinculado a su rama personal. Cada vez que publique
nuevos cambios mediante `git push`, GitHub actualizará automáticamente el
mismo pull request con la nueva versión de su código.

## 11. Finalizar la entrega

Cuando termine:

- No fusione el pull request.
- No cierre el pull request.
- No elimine la rama.
- No elimine su fork.
- Copie la URL de su pull request.
- Envíe la URL como entrega en el Moodle.

---

# Evaluación

| Código | Criterio |
|---|---|
| C01 | Construcción de números enteros |
| C02 | Manejo de números decimales |
| C03 | Limpieza de la calculadora |
| C04 | Cambio de signo y borrado |
| C05 | Preparación de operaciones |
| C06 | Suma y resta |
| C07 | Multiplicación y división |
| C08 | Resultado y continuidad |
| C09 | Calidad técnica y respeto de la estructura |
| C10 | Entrega mediante rama y pull request |

Cada criterio puede obtener:

| Nivel | Puntaje |
|---|---:|
| Cumple | 2 puntos |
| Parcial | 1 punto |
| No cumple | 0 puntos |

**Puntaje máximo: 20 puntos.**

> La calificación definitiva corresponde al docente.

---

# Integridad académica

La práctica es individual. El estudiante debe ser capaz de explicar cualquier
parte de su implementación cuando el docente lo solicite.

No se permite presentar código copiado o modificar las pruebas, la
configuración de GitHub Actions ni archivos que no correspondan al hook
asignado.