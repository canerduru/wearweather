import test from "node:test";
import assert from "node:assert/strict";
import { decodeState, INITIAL_STATE, recordFeedback } from "./storage";
test("empty wardrobe is preserved after onboarding", () => {
  const s = { ...INITIAL_STATE, onboarded: true };
  assert.deepEqual(decodeState(JSON.stringify(s)).state.wardrobe, []);
  assert.equal(decodeState(JSON.stringify(s)).state.onboarded, true);
});
test("corrupt and future records are protected", () => {
  for (const raw of [
    "broken",
    JSON.stringify({ ...INITIAL_STATE, version: 2 }),
    JSON.stringify({ ...INITIAL_STATE, wardrobe: [{ id: "x" }] }),
  ]) {
    const r = decodeState(raw);
    assert.equal(r.readOnly, true);
    assert.ok(r.warning);
  }
});
test("feedback can be replaced once per day without farming adjustments", () => {
  const h = recordFeedback(
    [{ date: "2026-10-28", value: "cold" }],
    "hot",
    "2026-10-28",
  );
  assert.equal(h.length, 1);
  assert.equal(h[0].value, "hot");
});
