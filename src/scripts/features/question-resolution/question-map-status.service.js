import { isObjectiveAnswerCorrect } from "../../core/objective-question.js";
import { getFinalVerdict, getMetacognitionLevel } from "./metacognition.service.js";

export function getImmediateQuestionMapStatus({
  state = {},
  question = null,
  immediate = false,
  confirmed = false
} = {}) {
  if (!immediate || !confirmed || !question) {
    return { className: "", label: "" };
  }

  if (question.categoria === "objetiva") {
    const correct = isObjectiveAnswerCorrect(question, state.respostas?.[question.id]);
    return {
      className: correct ? "is-correct" : "is-incorrect",
      label: correct ? "correta" : "incorreta"
    };
  }

  if (question.categoria !== "discursiva") {
    return { className: "", label: "" };
  }

  const level = getMetacognitionLevel(getFinalVerdict(state, question.id)?.nivel);
  const status = {
    completa: { className: "is-correct", label: "completa" },
    parcial: { className: "is-partial", label: "parcial" },
    incorreta: { className: "is-incorrect", label: "incorreta" }
  };

  return status[level?.key] || { className: "", label: "" };
}
