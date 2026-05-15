import subscribe from "../netlify/functions/subscribe.mts";

const originalFetch = globalThis.fetch;
const originalNetlify = globalThis.Netlify;

function setEnv(env) {
  globalThis.Netlify = {
    env: {
      get(key) {
        return env[key];
      },
    },
  };
}

function makeRequest(body) {
  return new Request("https://www.aihealthwellness.com/.netlify/functions/subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

async function readJson(response) {
  return {
    status: response.status,
    body: await response.json(),
  };
}

async function test(name, run) {
  try {
    await run();
    console.log(`PASS ${name}`);
  } catch (error) {
    console.error(`FAIL ${name}`);
    console.error(error);
    process.exitCode = 1;
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

await test("sends welcome email through Resend before returning success", async () => {
  const calls = [];
  setEnv({
    RESEND_API_KEY: "re_test",
    RESEND_FROM_EMAIL: "AI Health & Wellness Hub <welcome@aihealthwellness.com>",
    RESEND_REPLY_TO: "aihealthwellnesshub@gmail.com",
    SITE_URL: "https://www.aihealthwellness.com",
  });

  globalThis.fetch = async (url, options) => {
    calls.push({ url, options });
    return Response.json({ id: "email_123" }, { status: 200 });
  };

  const response = await readJson(await subscribe(makeRequest({ email: "NewUser@Example.com", firstName: "Rui" })));
  const sentPayload = JSON.parse(calls[0].options.body);

  assert(response.status === 200, `Expected 200, got ${response.status}`);
  assert(response.body.emailProvider === "resend", "Expected resend provider in response");
  assert(response.body.emailId === "email_123", "Expected Resend email id in response");
  assert(calls[0].url === "https://api.resend.com/emails", "Expected Resend emails endpoint");
  assert(sentPayload.to[0] === "newuser@example.com", "Expected normalized recipient email");
  assert(sentPayload.subject.includes("7-day AI meal generator"), "Expected welcome subject");
  assert(sentPayload.html.includes("Open the free meal generator"), "Expected generator CTA");
  assert(sentPayload.html.includes("access=welcome"), "Expected email-only generator access marker");
});

await test("fails honestly when Resend API key is missing", async () => {
  let fetchCalled = false;
  setEnv({});
  globalThis.fetch = async () => {
    fetchCalled = true;
    return Response.json({ id: "unexpected" });
  };

  const response = await readJson(await subscribe(makeRequest({ email: "user@example.com" })));

  assert(response.status === 502, `Expected 502, got ${response.status}`);
  assert(response.body.error.includes("welcome email"), "Expected welcome email error");
  assert(fetchCalled === false, "Fetch should not be called without a Resend key");
});

await test("fails honestly when Resend rejects the message", async () => {
  setEnv({ RESEND_API_KEY: "re_test" });
  globalThis.fetch = async () => new Response("domain not verified", { status: 403 });

  const response = await readJson(await subscribe(makeRequest({ email: "user@example.com" })));

  assert(response.status === 502, `Expected 502, got ${response.status}`);
  assert(response.body.error.includes("welcome email"), "Expected welcome email error");
});

globalThis.fetch = originalFetch;
globalThis.Netlify = originalNetlify;
