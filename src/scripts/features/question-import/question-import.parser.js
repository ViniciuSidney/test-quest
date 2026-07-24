import {
  getCorrectAlternativeId,
  getAlternativePresentation,
  normalizeObjectiveAlternatives
} from "../../core/objective-question.js";

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

  const id = createQuestionId(index);

  if (category === "objetiva") {
    const trueFalse = isTrueFalseType(data.tipo);
    const alternativas = normalizeObjectiveAlternatives(
      trueFalse
        ? [
            { chaveOriginal: "V", texto: "Verdadeiro" },
            { chaveOriginal: "F", texto: "Falso" }
          ]
        : { A: data.a, B: data.b, C: data.c, D: data.d, E: data.e },
      id
    );
    const question = {
      id,
      categoria: category,
      assunto: data.assunto || "Sem assunto",
      tipo: data.tipo || (trueFalse ? "verdadeiro ou falso" : category),
      enunciado: data.enunciado || data.afirmativa || "",
      alternativas,
      respostaCorretaId: "",
      correta: normalizeObjectiveCorrectAnswer(data.correta, trueFalse),
      explicacao: data.explicacao || "",
      respostaEsperada: "",
      criterios: ""
    };
    const respostaCorretaId = getCorrectAlternativeId(question);
    const correta = getAlternativePresentation(question, respostaCorretaId)?.originalKey || question.correta;

    return {
      ...question,
      respostaCorretaId,
      correta
    };
  }

  return {
    id,
    categoria: category,
    assunto: data.assunto || "Sem assunto",
    tipo: data.tipo || category,
    enunciado: data.enunciado || data.afirmativa || "",
    alternativas: null,
    respostaCorretaId: null,
    correta: null,
    explicacao: "",
    respostaEsperada: data.resposta_esperada || "",
    criterios: data.criterios_de_correcao || ""
  };
}

function extractFields(body) {
  const fieldNames = [
    "criterios_de_correcao",
    "resposta_esperada",
    "explicacao",
    "afirmativa",
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
  const trueFalse = isTrueFalseType(data.tipo);
  const statementField = data.enunciado || data.afirmativa ? [] : ["enunciado"];
  const required = trueFalse
    ? ["assunto", ...statementField, "correta", "explicacao"]
    : ["assunto", ...statementField, "a", "b", "c", "d", "e", "correta", "explicacao"];
  const missing = required.filter((field) => !data[field]);

  if (missing.length) {
    throw new Error(`Questão objetiva ${index + 1}: campos ausentes — ${missing.join(", ")}.`);
  }

  const validAnswers = trueFalse
    ? ["V", "F", "VERDADEIRO", "FALSO", "A", "B"]
    : ["A", "B", "C", "D", "E"];

  if (!validAnswers.includes(String(data.correta || "").toUpperCase().trim())) {
    throw new Error(
      trueFalse
        ? `Questão objetiva ${index + 1}: “correta” deve ser V, F, Verdadeiro ou Falso.`
        : `Questão objetiva ${index + 1}: “correta” deve ser A, B, C, D ou E.`
    );
  }
}

function validateDiscursive(data, index) {
  const required = ["assunto", "enunciado", "resposta_esperada", "criterios_de_correcao"];
  const missing = required.filter((field) => !data[field]);

  if (missing.length) {
    throw new Error(`Questão discursiva ${index + 1}: campos ausentes — ${missing.join(", ")}.`);
  }
}

function isTrueFalseType(type) {
  const normalized = String(type || "").trim().toLocaleLowerCase("pt-BR");
  return normalized === "vf" || normalized.includes("verdadeiro") || normalized.includes("falso");
}

function normalizeObjectiveCorrectAnswer(rawAnswer, trueFalse = false) {
  const normalized = String(rawAnswer || "").trim().toUpperCase();

  if (!trueFalse) {
    return normalized;
  }

  if (["V", "VERDADEIRO", "A"].includes(normalized)) {
    return "V";
  }

  if (["F", "FALSO", "B"].includes(normalized)) {
    return "F";
  }

  return normalized;
}

function createQuestionId(index) {
  if (globalThis.crypto && typeof globalThis.crypto.randomUUID === "function") {
    return globalThis.crypto.randomUUID();
  }

  return `q-${Date.now()}-${index}-${Math.random().toString(16).slice(2)}`;
}
