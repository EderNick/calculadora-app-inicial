import fs from 'node:fs';

const branch = process.env.BRANCH_NAME ?? 'rama-no-identificada';
const githubUser = process.env.GITHUB_USER ?? 'usuario-no-identificado';
const pullRequestTitle = process.env.PR_TITLE ?? '';
const pullRequestBody = process.env.PR_BODY ?? '';

const studentName = branch
    .replace(/^practica\//, '')
    .replaceAll('-', ' ')
    .trim()
    .toUpperCase();

const criteria = [
    {
        id: 'C01',
        description: 'Construcción de números enteros',
        expectedTests: 2,
    },
    {
        id: 'C02',
        description: 'Manejo de números decimales',
        expectedTests: 3,
    },
    {
        id: 'C03',
        description: 'Limpieza de la calculadora',
        expectedTests: 1,
    },
    {
        id: 'C04',
        description: 'Cambio de signo y borrado',
        expectedTests: 3,
    },
    {
        id: 'C05',
        description: 'Preparación de las operaciones',
        expectedTests: 2,
    },
    {
        id: 'C06',
        description: 'Suma y resta',
        expectedTests: 3,
    },
    {
        id: 'C07',
        description: 'Multiplicación y división',
        expectedTests: 3,
    },
    {
        id: 'C08',
        description: 'Resultado y continuidad',
        expectedTests: 2,
    },
];

let assertions = [];

if (fs.existsSync('resultado-jest.json')) {
    try {
        const jestResult = JSON.parse(
            fs.readFileSync('resultado-jest.json', 'utf8')
        );

        assertions = jestResult.testResults.flatMap((testResult) =>
            (testResult.assertionResults ?? []).map((assertion) => ({
                name: `${assertion.fullName ?? ''} ${assertion.title ?? ''}`,
                status: assertion.status,
            }))
        );
    } catch (error) {
        console.error('No se pudo leer resultado-jest.json', error);
    }
}

const report = criteria.map((criterion) => {
    const criterionTests = assertions.filter((assertion) =>
        assertion.name.includes(`[${criterion.id}-`)
    );

    const passedTests = criterionTests.filter(
        (assertion) => assertion.status === 'passed'
    ).length;

    let score = 0;

    if (passedTests === criterion.expectedTests) {
        score = 2;
    } else if (passedTests > 0) {
        score = 1;
    }

    return {
        code: criterion.id,
        description: criterion.description,
        passedTests,
        expectedTests: criterion.expectedTests,
        level:
            score === 2
                ? 'Cumple'
                : score === 1
                    ? 'Parcial'
                    : 'No cumple',
        score,
    };
});

const typecheckOk = process.env.TYPECHECK_OK === '1';
const protectedFilesOk = process.env.PROTECTED_OK === '1';

const technicalChecks = [typecheckOk, protectedFilesOk].filter(Boolean).length;

report.push({
    code: 'C09',
    description: 'Calidad técnica y respeto de la estructura',
    passedTests: technicalChecks,
    expectedTests: 2,
    level:
        technicalChecks === 2
            ? 'Cumple'
            : technicalChecks === 1
                ? 'Parcial'
                : 'No cumple',
    score:
        technicalChecks === 2
            ? 2
            : technicalChecks === 1
                ? 1
                : 0,
});

const validBranch =
    /^practica\/[a-z0-9]+(?:-[a-z0-9]+){2,}$/.test(branch);

const validTitle = /^PC Calculadora - .+/i.test(
    pullRequestTitle.trim()
);

const validDescription =
    pullRequestBody.includes('Apellidos y nombres:') &&
    pullRequestBody.includes('Código universitario:') &&
    pullRequestBody.includes('Declaración de autoría');

const deliveryChecks = [
    validBranch,
    validTitle,
    validDescription,
].filter(Boolean).length;

report.push({
    code: 'C10',
    description: 'Entrega mediante rama y pull request',
    passedTests: deliveryChecks,
    expectedTests: 3,
    level:
        deliveryChecks === 3
            ? 'Cumple'
            : deliveryChecks > 0
                ? 'Parcial'
                : 'No cumple',
    score:
        deliveryChecks === 3
            ? 2
            : deliveryChecks > 0
                ? 1
                : 0,
});

const total = report.reduce(
    (sum, criterion) => sum + criterion.score,
    0
);

const rows = report
    .map(
        (criterion) =>
            `| ${criterion.code} | ${criterion.description} | ` +
            `${criterion.passedTests}/${criterion.expectedTests} | ` +
            `${criterion.level} | ${criterion.score} |`
    )
    .join('\n');

const markdown = `# Resultado de la práctica calificada

**Estudiante:** ${studentName || 'NO IDENTIFICADO'}  
**Usuario de GitHub:** @${githubUser}  
**Rama:** \`${branch}\`  
**Puntaje automático:** **${total}/20**

| Código | Criterio | Pruebas | Nivel | Puntaje |
|---|---|:---:|:---:|:---:|
${rows}
|  | **PUNTAJE TOTAL** |  |  | **${total}/20** |

## Verificaciones adicionales

- TypeScript sin errores: ${typecheckOk ? '✅' : '❌'}
- Solo se modificó el hook permitido: ${protectedFilesOk ? '✅' : '❌'}
- Nombre de rama válido: ${validBranch ? '✅' : '❌'}
- Título del pull request válido: ${validTitle ? '✅' : '❌'}
- Plantilla del pull request completada: ${validDescription ? '✅' : '❌'}

> El puntaje automático es una evidencia. La calificación definitiva corresponde al docente.
`;

const jsonReport = {
    student: studentName,
    githubUser,
    branch,
    total,
    maximumScore: 20,
    criteria: report,
};

fs.writeFileSync('resultado-calificacion.md', markdown, 'utf8');

fs.writeFileSync(
    'resultado-calificacion.json',
    JSON.stringify(jsonReport, null, 2),
    'utf8'
);

if (process.env.GITHUB_STEP_SUMMARY) {
    fs.appendFileSync(
        process.env.GITHUB_STEP_SUMMARY,
        markdown,
        'utf8'
    );
}

if (process.env.GITHUB_OUTPUT) {
    fs.appendFileSync(
        process.env.GITHUB_OUTPUT,
        `total=${total}\n`,
        'utf8'
    );
}

console.log(markdown);