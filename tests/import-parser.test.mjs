import { getAlternativePresentation } from "../src/scripts/core/objective-question.js";
import assert from "node:assert/strict";
import { parseQuestions, QuestionImportError, summarizeQuestions } from "../src/scripts/features/question-import/question-import.parser.js";

const validText = `@questao
assunto: Estatística
tipo: objetiva
enunciado: Qual é a média de 2 e 4?
a: 2
b: 3
c: 4
d: 5
e: 6
correta: B
explicacao: A média é 3.
+++

@discursiva
assunto: Estatística
tipo: discursiva curta
enunciado: Explique o que representa a média.
resposta_esperada: Um valor central calculado pela soma dividida pela quantidade.
criterios_de_correcao: Mencionar soma, quantidade e interpretação.
+++`;

const questions = parseQuestions(validText);
assert.equal(questions.length, 2);
assert.equal(questions[0].categoria, "objetiva");
assert.equal(questions[0].correta, "B");
assert.equal(Array.isArray(questions[0].alternativas), true);
assert.equal(questions[0].alternativas.length, 5);
assert.ok(questions[0].alternativas.every((alternative) => alternative.id));
assert.equal(
  getAlternativePresentation(questions[0], questions[0].respostaCorretaId)?.displayLetter,
  "B"
);
assert.equal(questions[1].categoria, "discursiva");

const trueFalseText = `@questao
assunto: Estatística
tipo: verdadeiro ou falso
enunciado: Em uma pesquisa, toda população corresponde ao conjunto completo dos elementos estudados.
correta: V
explicacao: A afirmação está correta porque população representa o conjunto total dos elementos analisados.
+++`;

const trueFalseQuestions = parseQuestions(trueFalseText);
assert.equal(trueFalseQuestions.length, 1);
assert.equal(trueFalseQuestions[0].alternativas.length, 2);
assert.equal(trueFalseQuestions[0].correta, "V");
assert.equal(
  getAlternativePresentation(trueFalseQuestions[0], trueFalseQuestions[0].respostaCorretaId)?.displayLetter,
  "V"
);
assert.deepEqual(summarizeQuestions(questions), {
  total: 2,
  objective: 1,
  discursive: 1,
  subjects: 1
});

assert.throws(
  () => parseQuestions("@questao\nassunto: Incompleta\n+++"),
  (error) => error instanceof QuestionImportError && error.issues[0].includes("campos ausentes")
);

const multipleInvalid = `@questao
assunto: A
+++
@discursiva
assunto: B
+++`;

assert.throws(
  () => parseQuestions(multipleInvalid),
  (error) => error instanceof QuestionImportError && error.issues.length === 2
);

console.log("Import parser: todos os testes passaram.");
