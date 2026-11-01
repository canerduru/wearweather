import test from "node:test";
import assert from "node:assert/strict";
import { buildPlan, calibrationFrom } from "./engine";
import { CATALOG, DEFAULT_PREFERENCES, garmentFor, SCENARIOS } from "./catalog";
const all = CATALOG.map((x) => garmentFor(x.category));
test("empty wardrobe has no invented clothes and actionable missing items", () => {
  const p = buildPlan([], DEFAULT_PREFERENCES, SCENARIOS[0], 0);
  assert.equal(p.morning.items.length, 0);
  assert.ok(p.morning.missing.length);
});
test("warm day never forces three layers", () => {
  const p = buildPlan(all, DEFAULT_PREFERENCES, SCENARIOS[1], 0);
  assert.equal(p.morning.items.length, 1);
  assert.equal(p.evening.items.length, 1);
});
test("rain without owned waterproof shell reports gap", () => {
  const p = buildPlan(
    all.filter((x) => x.category !== "raincoat"),
    DEFAULT_PREFERENCES,
    SCENARIOS[2],
    0,
  );
  assert.ok(p.morning.missing.some((x) => x.includes("yağmur")));
  assert.ok(p.morning.items.every((x) => x.category !== "raincoat"));
});
test("all recommended and packed items are owned", () => {
  const owned = [garmentFor("tee"), garmentFor("knit")];
  for (const w of SCENARIOS) {
    const p = buildPlan(owned, DEFAULT_PREFERENCES, w, 0);
    assert.ok(
      [...p.morning.items, ...p.evening.items, ...p.pack].every((x) =>
        owned.some((y) => x.id === y.id),
      ),
    );
  }
});
test("apparent temperature is not corrected twice for wind", () => {
  const weather = {
    ...SCENARIOS[0],
    morning: { temp: 12, feelsLike: 9, wind: 80, rain: false },
  };
  assert.equal(
    buildPlan(all, DEFAULT_PREFERENCES, weather, 0).morning.effectiveTemp,
    9,
  );
});
test("sensitivity and feedback remain bounded", () => {
  assert.equal(
    calibrationFrom(
      Array.from({ length: 50 }, (_, i) => ({
        date: String(i),
        value: "cold" as const,
      })),
    ),
    3,
  );
  assert.equal(calibrationFrom([{ date: "x", value: "hot" }]), -0.5);
  assert.ok(
    buildPlan(
      all,
      { ...DEFAULT_PREFERENCES, sensitivity: "cold" },
      SCENARIOS[0],
      0,
    ).morning.effectiveTemp < 7,
  );
});
test("a colder return packs only owned additional pieces", () => {
  const p = buildPlan(
    all,
    DEFAULT_PREFERENCES,
    {
      ...SCENARIOS[0],
      morning: SCENARIOS[1].morning,
      evening: SCENARIOS[3].evening,
    },
    0,
  );
  assert.ok(p.pack.length > 0);
  assert.ok(p.pack.every((x) => !p.morning.items.some((y) => y.id === x.id)));
});

test("18 degree boundary explains the single base layer consistently", () => {
  const w = {
    ...SCENARIOS[0],
    morning: { temp: 18, feelsLike: 18, wind: 5, rain: false },
  };
  const p = buildPlan(all, DEFAULT_PREFERENCES, w, 0);
  assert.equal(p.morning.items.length, 1);
  assert.ok(!p.morning.reason.includes("ara katman"));
});
