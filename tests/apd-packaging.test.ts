import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { LANDING_APD, LANDING_META, LANDING_MEMBERSHIP } from "../src/content/landing.ts";
import { APP_MODULES } from "../src/lib/app-experience.ts";

describe("APD packaging", () => {
  it("hero accompaniment line is present and non-AI-powered", () => {
    assert.match(LANDING_META.accompanimentLine, /Acompañamiento Personalizado Digital/);
    assert.doesNotMatch(LANDING_META.accompanimentLine, /AI-powered|powered by AI/i);
  });

  it("APD block copy matches locked brief", () => {
    assert.equal(LANDING_APD.eyebrow, "Acompañamiento Personalizado Digital");
    assert.equal(LANDING_APD.heading, "Formación que te acompaña.");
    assert.match(LANDING_APD.how, /MotusAI/);
    assert.match(LANDING_APD.limit, /no sustituye supervisión humana/i);
  });

  it("membership notes APD during Fundamentos", () => {
    assert.match(
      LANDING_MEMBERSHIP.community.accompanimentNote,
      /Acompañamiento Personalizado Digital durante Fundamentos/,
    );
  });

  it("MotusAI module aligns with APD without rewriting clinical claims", () => {
    const motusai = APP_MODULES.find((m) => m.id === "motusai");
    assert.ok(motusai);
    assert.match(motusai.line, /Acompañamiento Personalizado Digital/);
    assert.match(motusai.aside ?? "", /No sustituye/);
  });
});
