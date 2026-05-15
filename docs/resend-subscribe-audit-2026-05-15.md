# Resend Subscribe Audit

Audit date: 2026-05-15

## Root Cause

The deployed subscribe function accepted valid subscribers and returned success, but it did not call Resend. It only logged the signup and optionally posted the payload to `SUBSCRIBE_WEBHOOK_URL`.

That meant the frontend could show `Success. Your generator is ready.` while no welcome email was created or queued.

## Fix Applied

- `netlify/functions/subscribe.mts` now sends the welcome email through Resend before returning success.
- If `RESEND_API_KEY` is missing or Resend rejects the message, the function returns HTTP 502 instead of a false success.
- The welcome email links subscribers to `https://www.aihealthwellness.com/meal-plan.html#free-meal-generator`.
- Existing optional `SUBSCRIBE_WEBHOOK_URL` behavior is preserved after the welcome email send.
- `scripts/test-subscribe-function.mjs` mocks the function and verifies:
  - successful Resend send returns HTTP 200 and a Resend email id,
  - missing `RESEND_API_KEY` returns HTTP 502,
  - Resend rejection returns HTTP 502.
- `scripts/predeploy-check.ps1` now runs the subscribe function regression test.

## Required Netlify Environment Variables

- `RESEND_API_KEY`: required.
- `RESEND_FROM_EMAIL`: recommended, for example `AI Health & Wellness Hub <welcome@aihealthwellness.com>`.
- `RESEND_REPLY_TO`: optional, defaults to `aihealthwellnesshub@gmail.com`.
- `SITE_URL`: optional, defaults to `https://www.aihealthwellness.com`.
- `SUBSCRIBE_WEBHOOK_URL`: optional, preserved for any external subscriber database or automation.

## Publishing Gate

Before publishing articles on social media, run:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\predeploy-check.ps1
```

After deploying, test one real subscription using an inbox you control and confirm the message appears in Resend logs as accepted or delivered.
