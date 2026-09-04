import assert from "node:assert/strict"
import { test } from "node:test"
import {
  READINESS_IDS,
  READINESS_MAX_TOTAL,
  READINESS_QUESTIONS,
  READINESS_VERSION,
  evaluateReadiness,
  readinessPoints,
  setReadinessAnswer,
  type ReadinessAnswers,
  type ReadinessId,
  type ReadinessLetter,
} from "../src/lib/readiness-index.ts"

function all(letter: ReadinessLetter): ReadinessAnswers {
  return Object.fromEntries(READINESS_IDS.map((id) => [id, letter === "E" && (id === "R1" || id === "R2") ? "D" : letter])) as ReadinessAnswers
}

test("instrument has ten questions and a 40-point ceiling", () => {
  assert.equal(READINESS_VERSION, "dpr-0.1-candidate")
  assert.equal(READINESS_QUESTIONS.length, 10)
  assert.equal(READINESS_MAX_TOTAL, 40)
  assert.equal(readinessPoints("R1", "D"), 4)
  assert.equal(readinessPoints("R2", "D"), 4)
  assert.equal(readinessPoints("R4", "E"), 4)
  assert.equal(readinessPoints("R4", "A"), 0)
})

test("all A is foundation with documentation and consent flags, not a clinical penalty on R9", () => {
  const result = evaluateReadiness(all("A"))
  assert.equal(result.status, "ready")
  assert.equal(result.total, 0)
  assert.equal(result.band.id, "foundation")
  assert.equal(result.flags.some((flag) => flag.id === "R9"), false)
  assert.ok(result.flags.some((flag) => flag.id === "R3" && flag.severity === "critical"))
  assert.ok(result.flags.some((flag) => flag.id === "R6" && flag.severity === "critical"))
  assert.equal(result.priority?.id, "R3")
})

test("max answers reach 40 and ai-ready", () => {
  const result = evaluateReadiness(all("E"))
  assert.equal(result.total, 40)
  assert.equal(result.percent, 100)
  assert.equal(result.band.id, "ai-ready")
  assert.equal(result.flags.length, 0)
})

test("public AI without protocol stays a critical flag even with a high score", () => {
  const answers = all("E")
  answers.R4 = "B"
  const result = evaluateReadiness(answers)
  assert.equal(result.total, 37)
  assert.equal(result.band.id, "ai-ready")
  assert.ok(result.flags.some((flag) => flag.id === "R4" && flag.severity === "critical"))
  assert.equal(result.priority?.id, "R4")
  assert.match(result.priority?.action ?? "", /marco seguro para incorporar IA/)
})

test("31/40 lands in digital professional", () => {
  const answers: ReadinessAnswers = {
    R1: "D",
    R2: "D",
    R3: "D",
    R4: "C",
    R5: "E",
    R6: "D",
    R7: "C",
    R8: "D",
    R9: "D",
    R10: "D",
  }
  const result = evaluateReadiness(answers)
  assert.equal(result.total, 31)
  assert.equal(result.percent, 78)
  assert.equal(result.band.id, "professional")
  assert.ok(result.strengths.some((item) => item.id === "R5"))
  assert.ok(result.offer?.href.includes("01-genesis"))
})

test("R9 A is an opportunity, never a risk flag", () => {
  const answers = all("C")
  answers.R9 = "A"
  const result = evaluateReadiness(answers)
  assert.equal(result.flags.some((flag) => flag.id === "R9"), false)
  assert.ok(result.opportunities.some((item) => item.id === "R9") || result.priority?.id === "R9" || result.scores.find((item) => item.id === "R9")?.points === 0)
})

test("rejects letters that do not exist on a four-option item", () => {
  assert.throws(() => evaluateReadiness({ ...all("C"), R1: "E" }))
  assert.throws(() => setReadinessAnswer(all("C"), "R2", "E"))
})

test("incomplete answers do not invent a score", () => {
  const result = evaluateReadiness({ R1: "B", R2: "B" })
  assert.equal(result.status, "incomplete")
  assert.equal(result.total, 0)
  assert.equal(result.offer, null)
  assert.ok(result.unanswered.includes("R3"))
})
