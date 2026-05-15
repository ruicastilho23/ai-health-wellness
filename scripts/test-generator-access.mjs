import { readFileSync } from "node:fs";

const appJs = readFileSync("site/app.js", "utf8");
const mealPlanHtml = readFileSync("site/meal-plan.html", "utf8");
const subscribeFunction = readFileSync("netlify/functions/subscribe.mts", "utf8");

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function test(name, run) {
  try {
    run();
    console.log(`PASS ${name}`);
  } catch (error) {
    console.error(`FAIL ${name}`);
    console.error(error);
    process.exitCode = 1;
  }
}

test("site subscribe flow tells users to check email instead of opening the generator", () => {
  assert(
    appJs.includes("Check your email"),
    "Expected app.js to tell subscribers to check their email",
  );
  assert(
    !appJs.includes("window.location.href = data.generatorPath"),
    "Site should not redirect subscribers directly to the generator",
  );
});

test("welcome email link includes the generator email access marker", () => {
  assert(
    subscribeFunction.includes("access=welcome"),
    "Expected welcome email generator link to include access=welcome",
  );
});

test("meal generator redirects direct visitors back to the subscribe form", () => {
  assert(
    mealPlanHtml.includes("URLSearchParams(window.location.search)") &&
      mealPlanHtml.includes("index.html#subscribe") &&
      mealPlanHtml.includes("access") &&
      mealPlanHtml.includes("welcome"),
    "Expected meal-plan.html to gate direct access and redirect to subscribe",
  );
});
