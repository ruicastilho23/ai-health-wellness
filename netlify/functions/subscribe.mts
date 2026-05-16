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

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildWelcomeEmail(firstName: string) {
  const safeFirstName = firstName ? escapeHtml(firstName) : "there";
  const siteUrl = (getEnv("SITE_URL") || "https://www.aihealthwellness.com").replace(/\/$/, "");
  const generatorUrl = `${siteUrl}/meal-plan.html?access=welcome#free-meal-generator`;

  return {
    subject: "Your free 7-day AI meal generator is ready",
    text: [
      `Hi ${firstName || "there"},`,
      "",
      "Welcome to AI Health & Wellness Hub. Your free 7-day AI meal generator is ready here:",
      generatorUrl,
      "",
      "Use it to build a practical meal plan around your goal, diet preference, calories, and protein target.",
      "",
      "To your health,",
      "AI Health & Wellness Hub",
    ].join("\n"),
    html: `
      <div style="font-family: Arial, sans-serif; color: #10231f; line-height: 1.6; max-width: 620px; margin: 0 auto;">
        <h1 style="color: #0f766e; font-size: 26px;">Your free 7-day AI meal generator is ready</h1>
        <p>Hi ${safeFirstName},</p>
        <p>Welcome to <strong>AI Health &amp; Wellness Hub</strong>. Your free generator is ready to help you build a practical 7-day meal plan around your goal, diet preference, calories, and protein target.</p>
        <p>
          <a href="${generatorUrl}" style="display: inline-block; background: #0f766e; color: #ffffff; padding: 13px 18px; border-radius: 8px; text-decoration: none; font-weight: 700;">
            Open the free meal generator
          </a>
        </p>
        <p>If the button does not open, use this link:</p>
        <p><a href="${generatorUrl}">${generatorUrl}</a></p>
        <p>To your health,<br>AI Health &amp; Wellness Hub</p>
      </div>
    `,
  };
}

function getResendHeaders(apiKey: string) {
  return {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  };
}

async function readResendJson(response: Response) {
  const text = await response.text();
  if (!text) return undefined;

  try {
    return JSON.parse(text);
  } catch {
    return undefined;
  }
}

function buildContactPayload(email: string, firstName: string) {
  const segmentId = getEnv("RESEND_SEGMENT_ID");
  const topicId = getEnv("RESEND_TOPIC_ID");
  const payload: Record<string, unknown> = {
    email,
    unsubscribed: false,
    properties: {
      source: "ai_health_meal_generator",
      signup_path: "meal_plan",
    },
  };

  if (firstName) {
    payload.firstName = firstName;
  }

  if (segmentId) {
    payload.segments = [{ id: segmentId }];
  }

  if (topicId) {
    payload.topics = [{ id: topicId, subscription: "opt_in" }];
  }

  return payload;
}

async function updateExistingContact(apiKey: string, email: string, firstName: string) {
  const payload: Record<string, unknown> = {
    unsubscribed: false,
    properties: {
      source: "ai_health_meal_generator",
      signup_path: "meal_plan",
      ...(firstName ? { first_name: firstName } : {}),
    },
  };

  const resendResponse = await fetch(`https://api.resend.com/contacts/${encodeURIComponent(email)}`, {
    method: "PATCH",
    headers: getResendHeaders(apiKey),
    body: JSON.stringify(payload),
  });

  if (!resendResponse.ok) {
    const details = await resendResponse.text();
    console.error("Resend contact update failed", {
      status: resendResponse.status,
      details,
    });
    throw new Error("Resend contact update failed");
  }

  return readResendJson(resendResponse);
}

async function saveResendSubscriber(email: string, firstName: string) {
  const resendApiKey = getEnv("RESEND_API_KEY");

  if (!resendApiKey) {
    throw new Error("Missing RESEND_API_KEY");
  }

  const resendResponse = await fetch("https://api.resend.com/contacts", {
    method: "POST",
    headers: getResendHeaders(resendApiKey),
    body: JSON.stringify(buildContactPayload(email, firstName)),
  });

  if (resendResponse.status === 409) {
    return updateExistingContact(resendApiKey, email, firstName);
  }

  if (!resendResponse.ok) {
    const details = await resendResponse.text();
    console.error("Resend contact creation failed", {
      status: resendResponse.status,
      details,
    });
    throw new Error("Resend contact creation failed");
  }

  return readResendJson(resendResponse);
}

async function sendWelcomeEmail(email: string, firstName: string) {
  const resendApiKey = getEnv("RESEND_API_KEY");
  const from =
    getEnv("RESEND_FROM_EMAIL") ||
    getEnv("RESEND_FROM") ||
    "AI Health & Wellness Hub <welcome@aihealthwellness.com>";
  const replyTo = getEnv("RESEND_REPLY_TO") || "aihealthwellnesshub@gmail.com";

  if (!resendApiKey) {
    throw new Error("Missing RESEND_API_KEY");
  }

  const emailContent = buildWelcomeEmail(firstName);
  const resendResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: getResendHeaders(resendApiKey),
    body: JSON.stringify({
      from,
      to: [email],
      reply_to: replyTo,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text,
      tags: [
        { name: "source", value: "meal_generator" },
        { name: "type", value: "welcome" },
      ],
    }),
  });

  if (!resendResponse.ok) {
    const details = await resendResponse.text();
    console.error("Resend welcome email failed", {
      status: resendResponse.status,
      details,
    });
    throw new Error("Resend welcome email failed");
  }

  return resendResponse.json();
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

  let contactData: unknown;
  let resendData: unknown;

  try {
    contactData = await saveResendSubscriber(email, firstName);
  } catch (error) {
    console.error("Subscriber save failed", {
      email,
      error: error instanceof Error ? error.message : String(error),
    });

    return jsonResponse({ error: "Could not save subscription. Please try again." }, 502);
  }

  try {
    resendData = await sendWelcomeEmail(email, firstName);
  } catch (error) {
    console.error("Welcome email delivery failed", {
      email,
      error: error instanceof Error ? error.message : String(error),
    });

    return jsonResponse({ error: "Could not send welcome email. Please try again." }, 502);
  }

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
    message: "Subscription received. Check your email for the generator link.",
    generatorPath: "/meal-plan.html?access=welcome#free-meal-generator",
    emailProvider: "resend",
    contactId:
      typeof contactData === "object" && contactData !== null && "id" in contactData
        ? (contactData as { id: unknown }).id
        : undefined,
    emailId:
      typeof resendData === "object" && resendData !== null && "id" in resendData
        ? (resendData as { id: unknown }).id
        : undefined,
  });
};
