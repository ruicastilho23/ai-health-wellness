function jsonResponse(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function getEnv(name: string) {
  const netlifyGlobal = globalThis as typeof globalThis & {
    Netlify?: { env?: { get?: (key: string) => string | undefined } };
  };

  return netlifyGlobal.Netlify?.env?.get?.(name);
}

export default async (req: Request) => {
  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  let payload: { email?: unknown; firstName?: unknown };

  try {
    payload = await req.json();
  } catch {
    return jsonResponse({ error: "Invalid request body" }, 400);
  }

  const email = typeof payload.email === "string" ? payload.email.trim().toLowerCase() : "";
  const firstName = typeof payload.firstName === "string" ? payload.firstName.trim() : "";

  if (!isValidEmail(email)) {
    return jsonResponse({ error: "Valid email is required" }, 400);
  }

  const webhookUrl = getEnv("SUBSCRIBE_WEBHOOK_URL");

  if (webhookUrl) {
    const webhookResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        firstName,
        source: "ai_health_meal_generator",
        submittedAt: new Date().toISOString(),
      }),
    });

    if (!webhookResponse.ok) {
      return jsonResponse({ error: "Could not save subscription. Please try again." }, 502);
    }
  }

  console.log("Meal generator signup received", { email, firstName });

  return jsonResponse({
    ok: true,
    message: "Subscription received.",
    generatorPath: "/meal-plan.html#free-meal-generator",
  });
};
