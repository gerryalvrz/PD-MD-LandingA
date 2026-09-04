import assert from "node:assert/strict"
import { test } from "node:test"
import {
  CONTEXT_OPTIONS,
  METHOD_VERSION,
  MIN_NUMERIC_COVERAGE,
  QUESTION_IDS,
  QUESTIONS,
  evaluatePractice,
  setAnswer,
  type Answers,
  type QuestionId,
} from "../src/lib/practice-index.ts"

function fill(template: Partial<Record<QuestionId, Answers[QuestionId]>>): Answers {
  return { ...template }
}

function all(value: Answers[QuestionId]): Answers {
  return Object.fromEntries(QUESTION_IDS.map((id) => [id, value])) as Answers
}

test("instrument version and question coverage", () => {
  assert.equal(METHOD_VERSION, "mpi-0.1-candidate")
  assert.equal(QUESTIONS.length, 10)
  assert.equal(QUESTION_IDS.length, 10)
  assert.equal(MIN_NUMERIC_COVERAGE, 6)
  assert.equal(CONTEXT_OPTIONS.length, 3)
  for (const question of QUESTIONS) {
    assert.equal(question.options.length, 8)
    assert.deepEqual(
      question.options.map((option) => option.value),
      [0, 1, 2, 3, 4, "UNKNOWN", "NA", "SKIP"],
    )
  }
})

test("accepts exact codes 0-4 without a total", () => {
  const mixed = fill({ Q1: 0, Q2: 1, Q3: 2, Q4: 3, Q5: 4, Q6: 3, Q7: 2, Q8: 1, Q9: 0, Q10: 4 })
  const result = evaluatePractice(mixed)
  assert.equal(result.status, "ready")
  assert.equal(result.numericCount, 10)
  assert.equal("score" in result, false)
  assert.equal("index" in result, false)
  assert.equal("maturity" in result, false)
  assert.ok(result.priority)
  assert.notEqual(result.priority?.title.includes("72"), true)
})

test("all zeros select Q7 by sensitive policy, never as certification", () => {
  const result = evaluatePractice(all(0))
  assert.equal(result.status, "ready")
  assert.equal(result.priority?.questionId, "Q7")
  assert.equal(result.priority?.mode, "start")
  assert.equal(result.alternative?.questionId, "Q5")
  assert.equal(result.established, null)
})

test("all fours select Q7 to maintain, without declaring completion", () => {
  const result = evaluatePractice(all(4))
  assert.equal(result.status, "ready")
  assert.equal(result.priority?.questionId, "Q7")
  assert.equal(result.priority?.mode, "maintain")
  assert.equal(result.priority?.level, 4)
  assert.equal(result.established?.questionId, "Q3")
})

test("rejects invalid domain values without coercion", () => {
  const base = all(3)
  const invalid = [-1, 5, 1.5, Number.NaN, Number.POSITIVE_INFINITY, "0", true, {}, null]
  for (const value of invalid) {
    assert.throws(() => setAnswer(base, "Q3", value as never))
    assert.throws(() => evaluatePractice({ ...base, Q3: value } as never))
  }
  assert.throws(() => setAnswer(base, "Q99" as never, 1))
  assert.throws(() => evaluatePractice({ Q11: 1 } as never))
  assert.throws(() => evaluatePractice([] as never))
})

test("five numeric answers stay insufficient; six become ready", () => {
  const five = fill({ Q1: 3, Q2: 3, Q3: 3, Q4: 3, Q5: 3, Q6: "NA", Q7: "SKIP", Q8: "UNKNOWN", Q9: "NA", Q10: "SKIP" })
  const fiveResult = evaluatePractice(five)
  assert.equal(fiveResult.status, "insufficient")
  assert.equal(fiveResult.numericCount, 5)
  assert.equal(fiveResult.priority, null)
  assert.equal(fiveResult.established, null)
  assert.equal(fiveResult.actions.length, 3)

  const six = setAnswer(five, "Q6", 2)
  const sixResult = evaluatePractice(six)
  assert.equal(sixResult.status, "ready")
  assert.equal(sixResult.numericCount, 6)
  assert.ok(sixResult.priority)
})

test("Q3 and Q4 tied at 1 choose agenda with technique as alternative", () => {
  const answers = fill({
    Q1: 3,
    Q2: 3,
    Q3: 1,
    Q4: 1,
    Q5: 3,
    Q6: 3,
    Q7: 3,
    Q8: 3,
    Q9: 3,
    Q10: 3,
  })
  const result = evaluatePractice(answers)
  assert.equal(result.priority?.questionId, "Q3")
  assert.equal(result.alternative?.questionId, "Q4")
})

test("Q7 at 2 outranks Q1 at 0 by sensitive policy", () => {
  const answers = fill({
    Q1: 0,
    Q2: 4,
    Q3: 4,
    Q4: 4,
    Q5: 4,
    Q6: 4,
    Q7: 2,
    Q8: 4,
    Q9: 4,
    Q10: 4,
  })
  const result = evaluatePractice(answers)
  assert.equal(result.priority?.questionId, "Q7")
  assert.equal(result.priority?.title, "revisar la preparación online")
  assert.equal(result.priority?.mode, "develop")
  assert.equal(result.alternative, null)
})

test("example A: agenda is the focus and presence is established", () => {
  const answers = fill({
    Q1: 3,
    Q2: 2,
    Q3: 0,
    Q4: 3,
    Q5: 3,
    Q6: 3,
    Q7: 3,
    Q8: 2,
    Q9: 3,
    Q10: 2,
  })
  const result = evaluatePractice(answers)
  assert.equal(result.priority?.questionId, "Q3")
  assert.equal(result.priority?.title, "organizar la agenda")
  assert.equal(result.established?.questionId, "Q1")
  assert.equal(result.actions.length, 3)
  assert.equal(result.recommendation?.href.includes("02-fundamentos"), true)
})

test("all omissions yield general orientation without a forced profile", () => {
  const result = evaluatePractice(all("NA"))
  assert.equal(result.status, "insufficient")
  assert.equal(result.priority, null)
  assert.equal(result.established, null)
  assert.equal(result.numericCount, 0)
  assert.ok(result.unorientedAreas.includes("Situaciones urgentes"))
})

test("unanswered questions stay incomplete and have no actions", () => {
  const result = evaluatePractice(fill({ Q1: 2, Q2: 2 }))
  assert.equal(result.status, "incomplete")
  assert.ok(result.unanswered.includes("Q3"))
  assert.deepEqual(result.actions, [])
  assert.equal(result.recommendation, null)
})

test("setAnswer overwrites by id and is reversible", () => {
  let answers = all(0)
  answers = setAnswer(answers, "Q3", 4)
  assert.equal(evaluatePractice(answers).priority?.questionId, "Q7")
  const afterRaise = evaluatePractice(fill({ ...all(3), Q3: 4, Q5: 3, Q6: 3, Q7: 3 }))
  assert.notEqual(afterRaise.priority?.questionId, "Q3")
  answers = setAnswer(answers, "Q3", 0)
  assert.equal(answers.Q3, 0)
  assert.equal(evaluatePractice(answers).priority?.questionId, "Q7")
})

test("omitted Q5-Q7 with remaining fours note coverage and never claim completion", () => {
  const answers = fill({
    Q1: 4,
    Q2: 4,
    Q3: 4,
    Q4: 4,
    Q5: "SKIP",
    Q6: "UNKNOWN",
    Q7: "NA",
    Q8: 4,
    Q9: 4,
    Q10: 4,
  })
  const result = evaluatePractice(answers)
  assert.equal(result.status, "ready")
  assert.equal(result.priority?.questionId, "Q3")
  assert.equal(result.unorientedAreas.length, 3)
  assert.notEqual(result.priority?.mode, "start")
})

test("context adapts action wording without changing the focus", () => {
  const answers = fill({
    Q1: 3,
    Q2: 3,
    Q3: 1,
    Q4: 3,
    Q5: 3,
    Q6: 3,
    Q7: 3,
    Q8: 3,
    Q9: 3,
    Q10: 3,
  })
  const online = evaluatePractice(answers, "online")
  const starting = evaluatePractice(answers, "starting")
  assert.equal(online.priority?.questionId, starting.priority?.questionId)
  assert.equal(online.priority?.level, starting.priority?.level)
  assert.ok(starting.actions[0]?.includes("todavía no atiendes"))
  assert.equal(online.actions[0]?.includes("todavía no atiendes"), false)
})

test("Q8 and Q9 recommend Praxis; Q7 does not treat purchase as sufficient", () => {
  const formation = evaluatePractice(fill({ ...all(4), Q8: 1 }))
  assert.equal(formation.priority?.questionId, "Q8")
  assert.equal(formation.recommendation?.href.includes("03-praxis"), true)

  const urgency = evaluatePractice(fill({ ...all(4), Q7: 0 }))
  assert.equal(urgency.priority?.questionId, "Q7")
  assert.match(urgency.recommendation?.description ?? "", /no resuelve por sí sola/)
})

test("invalid context is rejected", () => {
  assert.throws(() => evaluatePractice(all(3), " intern" as never))
})
