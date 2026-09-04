import assert from "node:assert/strict"
import { test } from "node:test"
import { psychologistTypeFromPercent, PSYCHOLOGIST_TYPE_IDS, PSYCHOLOGIST_TYPES } from "../src/lib/psychologist-types.ts"

test("commercial types use the six illustrated cards in ladder order", () => {
  assert.deepEqual([...PSYCHOLOGIST_TYPE_IDS], [
    "dinosaurio",
    "godinez",
    "smartt",
    "automatizado",
    "anonimus",
    "futurista",
  ])
  for (const id of PSYCHOLOGIST_TYPE_IDS) {
    assert.match(PSYCHOLOGIST_TYPES[id].image, /\/experience\/tipos_psicologos\/.+\.jpg$/)
  }
  assert.equal(psychologistTypeFromPercent(0), "dinosaurio")
  assert.equal(psychologistTypeFromPercent(20), "godinez")
  assert.equal(psychologistTypeFromPercent(40), "smartt")
  assert.equal(psychologistTypeFromPercent(60), "automatizado")
  assert.equal(psychologistTypeFromPercent(80), "anonimus")
  assert.equal(psychologistTypeFromPercent(100), "futurista")
})
