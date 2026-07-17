export class QuestionImportError extends Error {
  constructor(message, issues = []) {
    super(message);
    this.name = "QuestionImportError";
    this.issues = issues.length ? issues : [message];
  }
}

export function parseQuestions(text) {
  const blocks = String(text || "")
    .split(/\n\s*\+\+\+\s*/g)
    .map((block) => block.trim())
    .filter(Boolean);

  if (!blocks.length) {
    throw new QuestionImportError(
      "Nenhum bloco de questão foi encontrado.",
      ["Use @questao ou @discursiva e separe os blocos com +++." ]
    );
  }

  const questions = [];
  const issues = [];

  blocks.forEach((block, index) => {
    try {
      questions.push(parseBlock(block, index));
    } catch (error) {
      issues.push(error instanceof Error ? error.message : String(error));
    }
  });

  if (issues.length) {
    throw new QuestionImportError(
      `${issues.length} problema(s) encontrado(s) na importação.`,
      issues
    );
  }

  return questions;
}

export function summarizeQuestions(questions) {
  const objective = questions.filter((question) => question.categoria === "objetiva").length;
  const discursive = questions.filter((question) => question.categoria === "discursiva").length;
  const subjects = new Set(
    questions
      .map((question) => String(question.assunto || "").trim().toLocaleLowerCase("pt-BR"))
      .filter(Boolean)
  ).size;

  return {
    total: questions.length,
    objective,
    discursive,
    subjects
  };
}

function parseBlock(block, index) {
  const firstLine = block.trim().split(/\r?\n/)[0].trim().toLowerCase();
  let category = "";

  if (firstLine.startsWith("@questao")) category = "objetiva";
  if (firstLine.startsWith("@discursiva")) category = "discursiva";

  if (!category) {
    throw new Error(`Bloco ${index + 1}: deve começar com @questao ou @discursiva.`);
  }

  const body = block.replace(/^@(questao|discursiva)\s*/i, "").trim();
  const data = extractFields(body);

  if (category === "objetiva") validateObjective(data, index);
  if (category === "discursiva") validateDiscursive(data, index);

  return {
    id: createQuestionId(index),
    categoria: category,
    assunto: data.assunto || "Sem assunto",
    tipo: data.tipo || category,
    enunciado: data.enunciado || "",
    alternativas: category === "objetiva"
      ? { A: data.a, B: data.b, C: data.c, D: data.d, E: data.e }
      : null,
    correta: category === "objetiva" ? data.correta.toUpperCase().trim() : null,
    explicacao: data.explicacao || "",
    respostaEsperada: data.resposta_esperada || "",
    criterios: data.criterios_de_correcao || ""
  };
}

function extractFields(body) {
  const fieldNames = [
    "criterios_de_correcao",
    "resposta_esperada",
    "explicacao",
    "enunciado",
    "correta",
    "assunto",
    "tipo",
    "a",
    "b",
    "c",
    "d",
    "e"
  ].join("|");

  const regex = new RegExp(`(?:^|\\n)\\s*(${fieldNames})\\s*:\\s*`, "gi");
  const matches = [...body.matchAll(regex)];
  const data = {};

  matches.forEach((match, matchIndex) => {
    const key = match[1].toLowerCase();
    const valueStart = match.index + match[0].length;
    const valueEnd = matchIndex + 1 < matches.length ? matches[matchIndex + 1].index : body.length;
    data[key] = body.slice(valueStart, valueEnd).trim();
  });

  return data;
}

function validateObjective(data, index) {
  const required = ["assunto", "enunciado", "a", "b", "c", "d", "e", "correta", "explicacao"];
  const missing = required.filter((field) => !data[field]);

  if (missing.length) {
    throw new Error(`Questão objetiva ${index + 1}: campos ausentes — ${missing.join(", ")}.`);
  }

  if (!["A", "B", "C", "D", "E"].includes(data.correta.toUpperCase().trim())) {
    throw new Error(`Questão objetiva ${index + 1}: “correta” deve ser A, B, C, D ou E.`);
  }
}

function validateDiscursive(data, index) {
  const required = ["assunto", "enunciado", "resposta_esperada", "criterios_de_correcao"];
  const missing = required.filter((field) => !data[field]);

  if (missing.length) {
    throw new Error(`Questão discursiva ${index + 1}: campos ausentes — ${missing.join(", ")}.`);
  }
}

function createQuestionId(index) {
  if (globalThis.crypto && typeof globalThis.crypto.randomUUID === "function") {
    return globalThis.crypto.randomUUID();
  }

  return `q-${Date.now()}-${index}-${Math.random().toString(16).slice(2)}`;
}
