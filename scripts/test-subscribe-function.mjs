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

await test("creates a Resend subscriber before sending the welcome email", async () => {
  const calls = [];
  setEnv({
    RESEND_API_KEY: "re_test",
    RESEND_FROM_EMAIL: "AI Health & Wellness Hub <welcome@aihealthwellness.com>",
    RESEND_REPLY_TO: "aihealthwellnesshub@gmail.com",
    SITE_URL: "https://www.aihealthwellness.com",
  });

  globalThis.fetch = async (url, options) => {
    calls.push({ url, options });
    if (url === "https://api.resend.com/contacts") {
      return Response.json({ object: "contact", id: "contact_123" }, { status: 200 });
    }
    if (url === "https://api.resend.com/emails") {
      return Response.json({ id: "email_123" }, { status: 200 });
    }
    return Response.json({ error: "unexpected endpoint" }, { status: 500 });
  };

  const response = await readJson(await subscribe(makeRequest({ email: "NewUser@Example.com", firstName: "Rui" })));
  const contactPayload = JSON.parse(calls[0].options.body);
  const sentPayload = JSON.parse(calls[1].options.body);

  assert(response.status === 200, `Expected 200, got ${response.status}`);
  assert(response.body.emailProvider === "resend", "Expected resend provider in response");
  assert(response.body.emailId === "email_123", "Expected Resend email id in response");
  assert(response.body.contactId === "contact_123", "Expected Resend contact id in response");
  assert(calls[0].url === "https://api.resend.com/contacts", "Expected Resend contacts endpoint first");
  assert(calls[1].url === "https://api.resend.com/emails", "Expected Resend emails endpoint second");
  assert(contactPayload.email === "newuser@example.com", "Expected normalized subscriber email");
  assert(contactPayload.firstName === "Rui", "Expected subscriber first name");
  assert(contactPayload.unsubscribed === false, "Expected contact to be subscribed");
  assert(!("properties" in contactPayload), "Expected no custom contact properties that require Resend setup");
  assert(!("segments" in contactPayload), "Expected no segment assignment without a verified segment id");
  assert(!("topics" in contactPayload), "Expected no topic assignment without a verified topic id");
  assert(!("Idempotency-Key" in calls[1].options.headers), "Expected no static Resend idempotency key");
  assert(sentPayload.to[0] === "newuser@example.com", "Expected normalized recipient email");
  assert(sentPayload.subject.includes("7-day AI meal generator"), "Expected welcome subject");
  assert(sentPayload.html.includes("Open the free meal generator"), "Expected generator CTA");
  assert(sentPayload.html.includes("access=welcome"), "Expected email-only generator access marker");
});

await test("does not send the welcome email when Resend subscriber creation fails", async () => {
  const calls = [];
  setEnv({
    RESEND_API_KEY: "re_test",
  });

  globalThis.fetch = async (url, options) => {
    calls.push({ url, options });
    return new Response("contact service unavailable", { status: 404 });
  };

  const response = await readJson(await subscribe(makeRequest({ email: "user@example.com" })));

  assert(response.status === 502, `Expected 502, got ${response.status}`);
  assert(response.body.error.includes("subscription"), "Expected subscription save error");
  assert(calls.length === 1, `Expected only contact call, got ${calls.length}`);
  assert(calls[0].url === "https://api.resend.com/contacts", "Expected contact creation endpoint");
});

await test("resubscribes an existing Resend contact before sending the welcome email", async () => {
  const calls = [];
  setEnv({ RESEND_API_KEY: "re_test" });

  globalThis.fetch = async (url, options) => {
    calls.push({ url, options });
    if (url === "https://api.resend.com/contacts" && options.method === "POST") {
      return new Response("contact already exists", { status: 409 });
    }
    if (url === "https://api.resend.com/contacts/user%40example.com" && options.method === "PATCH") {
      return Response.json({ object: "contact", id: "contact_existing" }, { status: 200 });
    }
    if (url === "https://api.resend.com/emails") {
      return Response.json({ id: "email_existing" }, { status: 200 });
    }
    return Response.json({ error: "unexpected endpoint" }, { status: 500 });
  };

  const response = await readJson(await subscribe(makeRequest({ email: "user@example.com" })));
  const updatePayload = JSON.parse(calls[1].options.body);

  assert(response.status === 200, `Expected 200, got ${response.status}`);
  assert(response.body.contactId === "contact_existing", "Expected updated contact id in response");
  assert(calls.length === 3, `Expected create, update, and email calls; got ${calls.length}`);
  assert(updatePayload.unsubscribed === false, "Expected existing contact to be resubscribed");
  assert(!("properties" in updatePayload), "Expected no custom contact properties on update");
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
  assert(response.body.error.includes("subscription"), "Expected subscription save error");
  assert(fetchCalled === false, "Fetch should not be called without a Resend key");
});

await test("fails honestly when Resend rejects the message", async () => {
  setEnv({ RESEND_API_KEY: "re_test" });
  globalThis.fetch = async (url) => {
    if (url === "https://api.resend.com/contacts") {
      return Response.json({ object: "contact", id: "contact_123" }, { status: 200 });
    }
    return new Response("domain not verified", { status: 403 });
  };

  const response = await readJson(await subscribe(makeRequest({ email: "user@example.com" })));

  assert(response.status === 502, `Expected 502, got ${response.status}`);
  assert(response.body.error.includes("welcome email"), "Expected welcome email error");
});

globalThis.fetch = originalFetch;
globalThis.Netlify = originalNetlify;
