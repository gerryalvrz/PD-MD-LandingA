import assert from "node:assert/strict"
import { test } from "node:test"
import { evaluatePractice } from "../src/lib/practice-index.ts"
import { evaluateReadiness, READINESS_IDS, type ReadinessAnswers, type ReadinessLetter } from "../src/lib/readiness-index.ts"
import {
  assertPublicShareText,
  campaignShareUrl,
  colleagueShareText,
  isShareReferral,
  practiceShareDraft,
  readinessShareDraft,
  socialShareUrl,
  usesImageShare,
} from "../src/lib/share-card.ts"

function allReadiness(letter: ReadinessLetter): ReadinessAnswers {
  return Object.fromEntries(
    READINESS_IDS.map((id) => [id, letter === "E" && (id === "R1" || id === "R2") ? "D" : letter]),
  ) as ReadinessAnswers
}

test("share URL only carries an aggregate campaign tag", () => {
  const url = campaignShareUrl("/readiness", "https://example.com")
  assert.equal(url, "https://example.com/readiness?src=share")
  assert.equal(isShareReferral("src=share"), true)
  assert.equal(isShareReferral(""), false)
  assert.equal(url.includes("31"), false)
  assert.equal(url.includes("R4"), false)
})

test("readiness share uses the commercial type and omits score", () => {
  const answers = allReadiness("E")
  answers.R4 = "B"
  const result = evaluateReadiness(answers)
  const draft = readinessShareDraft(result)
  const check = assertPublicShareText(draft)
  assert.equal(check.hasScore, false)
  assert.equal(check.hasSensitiveCue, false)
  assert.match(draft.headline, /Psicólogo|Smart Psychologist/)
  assert.ok(draft.typeId)
})

test("safe readiness type still omits numbers", () => {
  const answers = allReadiness("E")
  answers.R5 = "A"
  const draft = readinessShareDraft(evaluateReadiness(answers))
  assert.equal(draft.redacted, false)
  assert.equal(assertPublicShareText(draft).hasScore, false)
  assert.match(draft.headline, /Soy /)
})

test("social intent URLs keep the campaign link and omit scores", () => {
  const pageUrl = campaignShareUrl("/readiness", "https://example.com")
  const text = colleagueShareText({
    kicker: "Practice Readiness",
    headline: "Estoy revisando la organización digital de mi práctica.",
    detail: "Una autoevaluación orientativa.",
    path: "/readiness",
    version: "dpr-0.1-candidate",
    redacted: true,
  })
  const whatsapp = socialShareUrl("whatsapp", pageUrl, text)
  const linkedin = socialShareUrl("linkedin", pageUrl, text)
  const x = socialShareUrl("x", pageUrl, text)
  const facebook = socialShareUrl("facebook", pageUrl, text)
  const instagram = socialShareUrl("instagram", pageUrl, text)
  assert.equal(instagram, null)
  assert.equal(usesImageShare("instagram"), true)
  assert.equal(usesImageShare("linkedin"), false)
  for (const href of [whatsapp, linkedin, x, facebook]) {
    assert.ok(href)
    assert.match(href, /readiness%3Fsrc%3Dshare|readiness\?src=share/)
    assert.equal(href.includes("31"), false)
    assert.equal(/R3|R4|R6|puntaje|certific/i.test(href), false)
  }
  assert.match(linkedin, /linkedin\.com\/feed\/\?shareActive=true/)
  assert.equal(linkedin.includes(encodeURIComponent(pageUrl)), true)
  assert.equal(facebook.includes(encodeURIComponent(pageUrl)), true)
})

test("practice index share uses a type card and omits urgency", () => {
  const urgent = evaluatePractice({
    Q1: 4, Q2: 4, Q3: 4, Q4: 4, Q5: 4, Q6: 4, Q7: 0, Q8: 4, Q9: 4, Q10: 4,
  })
  const urgentDraft = practiceShareDraft(urgent)
  assert.equal(urgentDraft.typeId, "dinosaurio")
  assert.equal(assertPublicShareText(urgentDraft).hasSensitiveCue, false)

  const agenda = evaluatePractice({
    Q1: 3, Q2: 2, Q3: 0, Q4: 3, Q5: 3, Q6: 3, Q7: 3, Q8: 2, Q9: 3, Q10: 2,
  })
  const agendaDraft = practiceShareDraft(agenda)
  assert.equal(agendaDraft.typeId, "dinosaurio")
  assert.match(agendaDraft.headline, /Dinosaurio/)
})
