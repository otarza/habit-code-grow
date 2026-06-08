#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { GoogleAuth } from "google-auth-library";
import http from "node:http";
import { URL } from "node:url";

const DEFAULT_PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT || process.env.GCLOUD_PROJECT || "bitcamp-flitt";
const DEFAULT_POSTMARK_SECRET = process.env.POSTMARK_SECRET_NAME || "postmark-token";
const DEFAULT_PORT = Number(process.env.CAMPAIGN_DASHBOARD_PORT || process.env.PORT || 8787);
const POSTMARK_API_BASE = "https://api.postmarkapp.com";
const GOOGLE_SCOPES = ["https://www.googleapis.com/auth/cloud-platform"];

let cachedPostmarkToken = null;
let cachedGoogleToken = null;
let cachedGoogleTokenExpiresAt = 0;
let googleAuthClientPromise = null;

function usage() {
  console.log(`BitCamp campaign dashboard

Usage:
  npm run dashboard
  CAMPAIGN_DASHBOARD_PORT=8790 npm run dashboard

Credentials:
  Firestore uses GOOGLE_APPLICATION_CREDENTIALS service account credentials first, then gcloud user credentials.
  Postmark token is read from POSTMARK_SERVER_TOKEN, POSTMARK_TOKEN, or Secret Manager secret "${DEFAULT_POSTMARK_SECRET}".
`);
}

function parseArgs() {
  if (process.argv.includes("--help") || process.argv.includes("-h")) {
    usage();
    process.exit(0);
  }
}

function sendJson(res, payload, status = 200) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  res.end(JSON.stringify(payload));
}

function explainOperationalError(err) {
  const message = err?.message || String(err || "");
  if (message.includes("invalid_rapt") || message.includes("invalid_grant") || message.includes("Reauthentication failed")) {
    return [
      "Google Cloud user authentication needs refresh.",
      "Best fix: use a local service account key and set GOOGLE_APPLICATION_CREDENTIALS.",
      "Temporary fix: run gcloud auth login, then restart npm run dashboard.",
    ].join(" ");
  }

  if (message.includes("Could not load the default credentials") || message.includes("Application Default Credentials")) {
    return [
      "Firestore credentials are not configured.",
      "Set GOOGLE_APPLICATION_CREDENTIALS to a local service account JSON key.",
      "Temporary alternative: run gcloud auth login",
      "Then restart: npm run dashboard",
    ].join(" ");
  }

  return message || "Internal error";
}

function sendHtml(res, html) {
  res.writeHead(200, {
    "Content-Type": "text/html; charset=utf-8",
    "Cache-Control": "no-store",
  });
  res.end(html);
}

function notFound(res) {
  sendJson(res, { ok: false, error: "Not found" }, 404);
}

function withTimeout(promise, label, ms = 8000) {
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error(`${label} timed out. ${explainOperationalError({ message: "invalid_grant" })}`)), ms);
    }),
  ]);
}

function normalizeDateParam(value, fallback) {
  if (!value) return fallback;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? fallback : date;
}

function startOfWindow(days) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}

function toPostmarkDate(date) {
  return date.toISOString().slice(0, 10);
}

function serializeFirestoreValue(value) {
  if (!value) return value;
  if (typeof value.toDate === "function") return value.toDate().toISOString();
  if (Array.isArray(value)) return value.map(serializeFirestoreValue);
  if (typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, nested]) => [key, serializeFirestoreValue(nested)]));
  }
  return value;
}

function decodeFirestoreValue(value) {
  if (!value || typeof value !== "object") return value;
  if ("stringValue" in value) return value.stringValue;
  if ("integerValue" in value) return Number(value.integerValue);
  if ("doubleValue" in value) return Number(value.doubleValue);
  if ("booleanValue" in value) return Boolean(value.booleanValue);
  if ("timestampValue" in value) return value.timestampValue;
  if ("nullValue" in value) return null;
  if ("arrayValue" in value) return (value.arrayValue.values || []).map(decodeFirestoreValue);
  if ("mapValue" in value) return decodeFirestoreFields(value.mapValue.fields || {});
  return value;
}

function decodeFirestoreFields(fields = {}) {
  return Object.fromEntries(Object.entries(fields).map(([key, value]) => [key, decodeFirestoreValue(value)]));
}

function normalizeLead(doc) {
  const data = serializeFirestoreValue(doc.data() || {});
  return {
    id: doc.id,
    email: data.email || data.emailNormalized || "",
    source: data.source || "",
    masterclassStatus: data.masterclassStatus || "not_registered",
    name: data.name || "",
    phone: data.phone || "",
    teachingSubject: data.teachingSubject || "",
    firstSubmittedAt: data.firstSubmittedAt || "",
    lastSubmittedAt: data.lastSubmittedAt || "",
    emailSentAt: data.emailSentAt || "",
    masterclassRegisteredAt: data.masterclassRegisteredAt || "",
    masterclassDetailsSubmittedAt: data.masterclassDetailsSubmittedAt || "",
    guideOpenCount: Number(data.guideOpenCount || 0),
    legacyDownloadClickCount: Number(data.legacyDownloadClickCount || 0),
    submitCount: Number(data.submitCount || 0),
    utmSource: data.utmSource || "",
    utmMedium: data.utmMedium || "",
    utmCampaign: data.utmCampaign || "",
    fbclid: data.fbclid || "",
    updatedAt: data.updatedAt || "",
  };
}

function normalizeEvent(doc) {
  const data = serializeFirestoreValue(doc.data() || {});
  return {
    id: doc.id,
    type: data.type || "",
    emailHash: data.emailHash || "",
    createdAt: data.createdAt || "",
    metadata: data.metadata || {},
  };
}

function dateMs(value) {
  if (!value) return 0;
  const ms = new Date(value).getTime();
  return Number.isNaN(ms) ? 0 : ms;
}

function filterByDate(items, field, from, to) {
  const fromMs = from.getTime();
  const toMs = to.getTime();
  return items.filter((item) => {
    const ms = dateMs(item[field]);
    return ms >= fromMs && ms <= toMs;
  });
}

function countBy(items, field) {
  return items.reduce((acc, item) => {
    const key = item[field] || "unknown";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
}

function eventCounts(events) {
  return events.reduce((acc, event) => {
    acc[event.type] = (acc[event.type] || 0) + 1;
    return acc;
  }, {});
}

async function getGoogleAuthClient() {
  if (!googleAuthClientPromise) {
    const auth = new GoogleAuth({
      projectId: DEFAULT_PROJECT_ID,
      scopes: GOOGLE_SCOPES,
    });
    googleAuthClientPromise = auth.getClient();
  }

  return googleAuthClientPromise;
}

async function getGoogleAccessTokenFromApplicationCredentials() {
  const client = await getGoogleAuthClient();
  const tokenResponse = await client.getAccessToken();
  const token = typeof tokenResponse === "string" ? tokenResponse : tokenResponse?.token;
  if (!token) throw new Error("Google Application Credentials did not return an access token");

  cachedGoogleToken = token;
  cachedGoogleTokenExpiresAt = Date.now() + 45 * 60 * 1000;
  return cachedGoogleToken;
}

function getGoogleAccessTokenFromGcloud() {
  try {
    cachedGoogleToken = execFileSync("gcloud", ["auth", "print-access-token"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    }).trim();
  } catch (err) {
    const stderr = err.stderr?.toString?.().trim();
    throw new Error(stderr || err.message || "gcloud auth print-access-token failed");
  }

  cachedGoogleTokenExpiresAt = Date.now() + 45 * 60 * 1000;
  return cachedGoogleToken;
}

async function getGoogleAccessToken() {
  if (cachedGoogleToken && Date.now() < cachedGoogleTokenExpiresAt - 60_000) return cachedGoogleToken;

  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    try {
      return await getGoogleAccessTokenFromApplicationCredentials();
    } catch (err) {
      throw new Error(explainOperationalError(err));
    }
  }

  try {
    return getGoogleAccessTokenFromGcloud();
  } catch (err) {
    throw new Error(explainOperationalError(err));
  }
}

async function firestoreRest(path, options = {}) {
  const response = await fetch(`https://firestore.googleapis.com/v1/${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${await getGoogleAccessToken()}`,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const text = await response.text();
  const payload = text ? JSON.parse(text) : {};
  if (!response.ok) {
    throw new Error(payload.error?.message || text || `Firestore REST failed with ${response.status}`);
  }

  return payload;
}

function restDocumentToLocalDoc(document) {
  const parts = String(document.name || "").split("/");
  const id = parts[parts.length - 1] || "";
  const data = {
    ...decodeFirestoreFields(document.fields || {}),
    createTime: document.createTime,
    updateTime: document.updateTime,
  };

  return { id, data: () => data };
}

async function getSnapshot(collectionName, limit = 500, orderField = "updatedAt") {
  const basePath = `projects/${DEFAULT_PROJECT_ID}/databases/(default)/documents/${encodeURIComponent(collectionName)}`;
  const params = new URLSearchParams({ pageSize: String(limit) });
  if (orderField) params.set("orderBy", `${orderField} desc`);

  try {
    const payload = await firestoreRest(`${basePath}?${params.toString()}`);
    return { docs: (payload.documents || []).map(restDocumentToLocalDoc) };
  } catch (err) {
    if (!orderField) throw err;
    const fallbackPayload = await firestoreRest(`${basePath}?pageSize=${limit}`);
    return { docs: (fallbackPayload.documents || []).map(restDocumentToLocalDoc) };
  }
}

async function getTeacherData(limit = 1000) {
  const [leadSnapshot, eventSnapshot] = await Promise.all([
    getSnapshot("teacher_guide_leads", limit, "updatedAt"),
    getSnapshot("teacher_guide_events", limit * 3, "createdAt"),
  ]);

  return {
    leads: leadSnapshot.docs.map(normalizeLead),
    events: eventSnapshot.docs.map(normalizeEvent),
  };
}

async function getCollectionCount(collectionId) {
  try {
    const payload = await firestoreRest(`projects/${DEFAULT_PROJECT_ID}/databases/(default)/documents:runAggregationQuery`, {
      method: "POST",
      body: JSON.stringify({
        structuredAggregationQuery: {
          query: {
            structuredQuery: {
              from: [{ collectionId }],
            },
          },
          aggregations: [{ alias: "count", count: {} }],
        },
      }),
    });
    const countValue = payload.find((row) => row.result?.aggregateFields?.count)?.result?.aggregateFields?.count;
    return Number(countValue?.integerValue || 0);
  } catch {
    const snapshot = await getSnapshot(collectionId, 1000, "");
    return snapshot.docs.length;
  }
}

async function listFirestoreCollections() {
  const collectionIds = [];
  let pageToken = "";

  do {
    const payload = await firestoreRest(`projects/${DEFAULT_PROJECT_ID}/databases/(default)/documents:listCollectionIds`, {
      method: "POST",
      body: JSON.stringify({
        pageSize: 100,
        pageToken,
      }),
    });
    collectionIds.push(...(payload.collectionIds || []));
    pageToken = payload.nextPageToken || "";
  } while (pageToken);

  const rows = await Promise.all(
    collectionIds.map(async (collectionId) => {
      const [count, sample] = await Promise.all([
        getCollectionCount(collectionId),
        getSnapshot(collectionId, 5, "updatedAt"),
      ]);

      return {
        id: collectionId,
        count,
        sample: sample.docs.map((doc) => ({ id: doc.id, ...serializeFirestoreValue(doc.data() || {}) })),
      };
    })
  );

  return rows.sort((a, b) => a.id.localeCompare(b.id));
}

async function getSecretValue(secretName) {
  const response = await fetch(
    `https://secretmanager.googleapis.com/v1/projects/${DEFAULT_PROJECT_ID}/secrets/${encodeURIComponent(secretName)}/versions/latest:access`,
    {
      headers: {
        Authorization: `Bearer ${await getGoogleAccessToken()}`,
        Accept: "application/json",
      },
    }
  );

  const text = await response.text();
  const payload = text ? JSON.parse(text) : {};
  if (!response.ok) {
    throw new Error(payload.error?.message || text || `Secret Manager failed with ${response.status}`);
  }

  const encoded = payload.payload?.data || "";
  return Buffer.from(encoded, "base64").toString("utf8").trim();
}

async function getPostmarkToken() {
  if (cachedPostmarkToken !== null) return cachedPostmarkToken;

  cachedPostmarkToken = process.env.POSTMARK_SERVER_TOKEN || process.env.POSTMARK_TOKEN || "";
  if (cachedPostmarkToken) return cachedPostmarkToken;

  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    try {
      cachedPostmarkToken = await getSecretValue(DEFAULT_POSTMARK_SECRET);
      return cachedPostmarkToken;
    } catch {
      cachedPostmarkToken = "";
    }
  }

  try {
    cachedPostmarkToken = execFileSync(
      "gcloud",
      ["secrets", "versions", "access", "latest", `--secret=${DEFAULT_POSTMARK_SECRET}`, `--project=${DEFAULT_PROJECT_ID}`],
      { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }
    ).trim();
  } catch (err) {
    const stderr = err.stderr?.toString?.().trim();
    if (stderr) console.warn(`POSTMARK_SECRET_GCLOUD_FAIL ${stderr}`);
    cachedPostmarkToken = "";
  }

  return cachedPostmarkToken;
}

async function postmarkGet(path, params = {}) {
  const token = await getPostmarkToken();
  if (!token) {
    return { ok: false, unavailable: true, error: "Postmark token not configured" };
  }

  const url = new URL(path, POSTMARK_API_BASE);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") url.searchParams.set(key, String(value));
  });

  const response = await fetch(url, {
    headers: {
      "X-Postmark-Server-Token": token,
      Accept: "application/json",
    },
  });

  const text = await response.text();
  let payload;
  try {
    payload = text ? JSON.parse(text) : {};
  } catch {
    payload = { raw: text };
  }

  if (!response.ok) {
    return { ok: false, status: response.status, error: payload.Message || payload.ErrorCode || text };
  }

  return { ok: true, ...payload };
}

async function getPostmarkMessages({ from, to, count = 100, offset = 0, recipient = "" }) {
  return postmarkGet("/messages/outbound", {
    count: Math.min(Number(count) || 100, 500),
    offset: Number(offset) || 0,
    fromdate: toPostmarkDate(from),
    todate: toPostmarkDate(to),
    recipient,
  });
}

async function getPostmarkStats({ from, to }) {
  const params = {
    fromdate: toPostmarkDate(from),
    todate: toPostmarkDate(to),
  };

  const [overview, sends, opens, clicks, bounces] = await Promise.all([
    postmarkGet("/stats/outbound", params),
    postmarkGet("/stats/outbound/sends", params),
    postmarkGet("/stats/outbound/opens", params),
    postmarkGet("/stats/outbound/clicks", params),
    postmarkGet("/stats/outbound/bounces", params),
  ]);

  return { overview, sends, opens, clicks, bounces };
}

async function buildSummary(query) {
  const days = Math.max(1, Math.min(Number(query.get("days") || 30), 365));
  const from = normalizeDateParam(query.get("from"), startOfWindow(days));
  const to = normalizeDateParam(query.get("to"), new Date());
  const { leads, events } = await getTeacherData(Number(query.get("limit") || 1500));
  const periodLeads = filterByDate(leads, "firstSubmittedAt", from, to);
  const periodEvents = filterByDate(events, "createdAt", from, to);
  const registered = leads.filter((lead) => lead.masterclassStatus === "registered");
  const periodRegistered = filterByDate(registered, "masterclassRegisteredAt", from, to);
  const detailsSubmitted = leads.filter((lead) => lead.masterclassDetailsSubmittedAt);
  const emailSent = leads.filter((lead) => lead.emailSentAt);
  const guideOpened = leads.filter((lead) => lead.guideOpenCount > 0);
  const postmark = await getPostmarkStats({ from, to });

  return {
    ok: true,
    generatedAt: new Date().toISOString(),
    projectId: DEFAULT_PROJECT_ID,
    dateRange: { from: from.toISOString(), to: to.toISOString(), days },
    teacherGuide: {
      totals: {
        leads: leads.length,
        leadsInPeriod: periodLeads.length,
        emailSent: emailSent.length,
        guideOpened: guideOpened.length,
        masterclassRegistered: registered.length,
        masterclassRegisteredInPeriod: periodRegistered.length,
        masterclassDetailsSubmitted: detailsSubmitted.length,
      },
      rates: {
        guideOpenRate: leads.length ? guideOpened.length / leads.length : 0,
        masterclassRegistrationRate: leads.length ? registered.length / leads.length : 0,
        detailsCompletionRate: registered.length ? detailsSubmitted.length / registered.length : 0,
      },
      sources: countBy(leads, "source"),
      utmCampaigns: countBy(leads, "utmCampaign"),
      events: eventCounts(events),
      periodEvents: eventCounts(periodEvents),
      recentLeads: [...leads].sort((a, b) => dateMs(b.updatedAt) - dateMs(a.updatedAt)).slice(0, 120),
      recentEvents: [...events].sort((a, b) => dateMs(b.createdAt) - dateMs(a.createdAt)).slice(0, 120),
    },
    postmark,
  };
}

async function routeApi(req, res, url) {
  if (url.pathname === "/api/summary") {
    return sendJson(res, await withTimeout(buildSummary(url.searchParams), "Summary load"));
  }

  if (url.pathname === "/api/firestore/collections") {
    return sendJson(res, { ok: true, collections: await withTimeout(listFirestoreCollections(), "Firestore collections load") });
  }

  if (url.pathname.startsWith("/api/firestore/collection/")) {
    const collectionId = decodeURIComponent(url.pathname.replace("/api/firestore/collection/", ""));
    const limit = Math.min(Number(url.searchParams.get("limit") || 100), 1000);
    const snapshot = await withTimeout(
      getSnapshot(collectionId, limit, url.searchParams.get("orderBy") || "updatedAt"),
      `Firestore collection ${collectionId} load`
    );
    return sendJson(res, {
      ok: true,
      collection: collectionId,
      docs: snapshot.docs.map((doc) => ({ id: doc.id, ...serializeFirestoreValue(doc.data() || {}) })),
    });
  }

  if (url.pathname === "/api/postmark/messages") {
    const days = Math.max(1, Math.min(Number(url.searchParams.get("days") || 30), 365));
    const from = normalizeDateParam(url.searchParams.get("from"), startOfWindow(days));
    const to = normalizeDateParam(url.searchParams.get("to"), new Date());
    return sendJson(
      res,
      await getPostmarkMessages({
        from,
        to,
        count: url.searchParams.get("count") || 100,
        offset: url.searchParams.get("offset") || 0,
        recipient: url.searchParams.get("recipient") || "",
      })
    );
  }

  if (url.pathname === "/api/postmark/stats") {
    const days = Math.max(1, Math.min(Number(url.searchParams.get("days") || 30), 365));
    const from = normalizeDateParam(url.searchParams.get("from"), startOfWindow(days));
    const to = normalizeDateParam(url.searchParams.get("to"), new Date());
    return sendJson(res, { ok: true, ...(await getPostmarkStats({ from, to })) });
  }

  return notFound(res);
}

function pageHtml() {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>BitCamp Campaign Dashboard</title>
  <style>
    :root {
      color-scheme: dark;
      --bg: #05091d;
      --panel: #071025;
      --panel-2: #0d1730;
      --line: #293a52;
      --red: #df3342;
      --red-2: #ff7a83;
      --cream: #fff4e8;
      --muted: #9fb0c3;
      --text: #d6e0eb;
      --green: #31c27c;
      --yellow: #ffd166;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      background:
        linear-gradient(rgba(255, 244, 232, 0.045) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 244, 232, 0.045) 1px, transparent 1px),
        var(--bg);
      background-size: 32px 32px;
      color: var(--cream);
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }
    button, input, select { font: inherit; }
    .shell { max-width: 1440px; margin: 0 auto; padding: 22px; }
    .top {
      display: flex; align-items: center; justify-content: space-between; gap: 16px;
      border: 1px solid var(--line); background: rgba(7,16,37,.95); padding: 18px;
      box-shadow: 6px 6px 0 rgba(223,51,66,.8);
    }
    .brand { display: flex; align-items: center; gap: 14px; min-width: 0; }
    .logo {
      background: var(--cream); color: var(--bg); padding: 9px 12px; font-weight: 1000;
      letter-spacing: 2px; box-shadow: 3px 3px 0 var(--red);
    }
    h1 { margin: 0; font-size: clamp(24px, 3vw, 40px); line-height: 1.05; }
    .muted { color: var(--muted); }
    .controls { display: flex; align-items: end; gap: 10px; flex-wrap: wrap; }
    label { display: grid; gap: 5px; color: var(--muted); font-size: 12px; font-weight: 800; }
    input, select {
      background: var(--bg); color: var(--cream); border: 1px solid var(--line); padding: 10px 11px;
      min-height: 42px;
    }
    button {
      border: 0; background: var(--red); color: var(--cream); padding: 11px 16px;
      min-height: 42px; font-weight: 1000; cursor: pointer;
    }
    button.secondary { background: var(--cream); color: var(--bg); }
    .tabs { display: flex; gap: 8px; flex-wrap: wrap; margin: 24px 0 18px; }
    .tab { background: var(--panel); border: 1px solid var(--line); color: var(--muted); }
    .tab.active { background: var(--red); color: var(--cream); border-color: var(--red); }
    .grid { display: grid; gap: 16px; }
    .kpis { grid-template-columns: repeat(6, minmax(140px, 1fr)); }
    .two { grid-template-columns: 1.1fr .9fr; }
    .three { grid-template-columns: repeat(3, minmax(0, 1fr)); }
    .card {
      background: rgba(7,16,37,.95); border: 1px solid var(--line); padding: 18px;
      min-width: 0;
    }
    .kpi .label { color: var(--muted); font-size: 12px; font-weight: 900; text-transform: uppercase; }
    .kpi .value { margin-top: 7px; font-size: 30px; font-weight: 1000; }
    .kpi .note { color: var(--muted); margin-top: 4px; font-size: 12px; }
    .bar-row { display: grid; grid-template-columns: minmax(120px, 1fr) 3fr 54px; gap: 10px; align-items: center; margin: 10px 0; }
    .bar-label { color: var(--text); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .bar-track { height: 12px; background: #111a31; border: 1px solid var(--line); }
    .bar-fill { height: 100%; background: var(--red); }
    .rate { color: var(--green); font-weight: 1000; }
    table { width: 100%; border-collapse: collapse; font-size: 13px; }
    th, td { border-bottom: 1px solid var(--line); padding: 10px; text-align: left; vertical-align: top; }
    th { color: var(--muted); font-size: 11px; text-transform: uppercase; position: sticky; top: 0; background: var(--panel); z-index: 1; }
    td { color: var(--text); }
    .table-wrap { overflow: auto; max-height: 620px; border: 1px solid var(--line); }
    .pill { display: inline-flex; align-items: center; gap: 5px; border: 1px solid var(--line); padding: 4px 7px; color: var(--muted); }
    .pill.green { color: var(--green); border-color: rgba(49,194,124,.5); }
    .pill.red { color: var(--red-2); border-color: rgba(223,51,66,.7); }
    .status { margin: 16px 0; color: var(--muted); }
    .error { color: var(--red-2); border: 1px solid rgba(223,51,66,.6); padding: 12px; background: rgba(223,51,66,.1); }
    .hidden { display: none; }
    pre { overflow: auto; margin: 0; color: var(--text); white-space: pre-wrap; }
    .collection-list { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 14px; }
    .collection-card { cursor: pointer; transition: border-color .12s ease; }
    .collection-card:hover { border-color: var(--red); }
    .row-actions { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
    @media (max-width: 1100px) { .kpis, .two, .three { grid-template-columns: 1fr 1fr; } }
    @media (max-width: 720px) {
      .shell { padding: 12px; }
      .top, .brand, .controls { align-items: stretch; flex-direction: column; }
      .kpis, .two, .three { grid-template-columns: 1fr; }
      .bar-row { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  <div class="shell">
    <header class="top">
      <div class="brand">
        <div class="logo">BITCAMP</div>
        <div>
          <h1>Campaign Dashboard</h1>
          <div class="muted">Firestore + Postmark local monitor</div>
        </div>
      </div>
      <div class="controls">
        <label>Range
          <select id="days">
            <option value="7">Last 7 days</option>
            <option value="30" selected>Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
        </label>
        <label>Recipient search
          <input id="recipient" placeholder="email filter for Postmark" />
        </label>
        <button id="refresh">Refresh</button>
      </div>
    </header>

    <nav class="tabs">
      <button class="tab active" data-tab="overview">Overview</button>
      <button class="tab" data-tab="teacher">Teacher Funnel</button>
      <button class="tab" data-tab="postmark">Postmark</button>
      <button class="tab" data-tab="firestore">Firestore Explorer</button>
    </nav>

    <div id="status" class="status">Loading…</div>
    <main id="app"></main>
  </div>

  <script>
    const state = {
      tab: "overview",
      summary: null,
      collections: null,
      selectedCollection: null,
      selectedDocs: null,
      postmarkMessages: null
    };

    const app = document.getElementById("app");
    const statusEl = document.getElementById("status");
    const fmt = new Intl.NumberFormat();
    const pct = (v) => Math.round((Number(v || 0) * 1000)) / 10 + "%";

    function escapeHtml(value) {
      return String(value ?? "").replace(/[&<>"']/g, ch => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
      }[ch]));
    }

    function shortDate(value) {
      if (!value) return "";
      const d = new Date(value);
      if (Number.isNaN(d.getTime())) return escapeHtml(value);
      return d.toLocaleString();
    }

    function setStatus(message, error = false) {
      statusEl.className = error ? "status error" : "status";
      statusEl.textContent = message;
    }

    async function getJson(url) {
      const res = await fetch(url);
      const data = await res.json();
      if (!res.ok || data.ok === false) throw new Error(data.error || "Request failed");
      return data;
    }

    function apiQuery() {
      const days = document.getElementById("days").value;
      return new URLSearchParams({ days });
    }

    async function loadSummary() {
      const qs = apiQuery();
      state.summary = await getJson("/api/summary?" + qs.toString());
    }

    async function loadCollections() {
      if (!state.collections) state.collections = (await getJson("/api/firestore/collections")).collections;
    }

    async function loadPostmarkMessages() {
      const qs = apiQuery();
      const recipient = document.getElementById("recipient").value.trim();
      if (recipient) qs.set("recipient", recipient);
      qs.set("count", "100");
      state.postmarkMessages = await getJson("/api/postmark/messages?" + qs.toString());
    }

    async function refresh() {
      try {
        setStatus("Loading data…");
        await loadSummary();
        if (state.tab === "firestore") await loadCollections();
        if (state.tab === "postmark") await loadPostmarkMessages();
        setStatus("Updated " + new Date(state.summary.generatedAt).toLocaleString() + " · Project " + state.summary.projectId);
        render();
      } catch (err) {
        setStatus(err.message, true);
      }
    }

    function kpi(label, value, note = "") {
      return \`<div class="card kpi"><div class="label">\${escapeHtml(label)}</div><div class="value">\${escapeHtml(value)}</div><div class="note">\${escapeHtml(note)}</div></div>\`;
    }

    function bars(map) {
      const entries = Object.entries(map || {}).sort((a, b) => b[1] - a[1]).slice(0, 12);
      const max = Math.max(1, ...entries.map(([, n]) => n));
      if (!entries.length) return '<div class="muted">No data</div>';
      return entries.map(([label, n]) => \`
        <div class="bar-row">
          <div class="bar-label" title="\${escapeHtml(label)}">\${escapeHtml(label || "blank")}</div>
          <div class="bar-track"><div class="bar-fill" style="width:\${Math.max(3, (n / max) * 100)}%"></div></div>
          <div class="muted">\${fmt.format(n)}</div>
        </div>
      \`).join("");
    }

    function renderOverview() {
      const s = state.summary;
      const t = s.teacherGuide;
      const postmarkUnavailable = s.postmark?.overview?.unavailable;
      app.innerHTML = \`
        <section class="grid kpis">
          \${kpi("Guide leads", fmt.format(t.totals.leads), fmt.format(t.totals.leadsInPeriod) + " in range")}
          \${kpi("Guide emails", fmt.format(t.totals.emailSent), "sent by funnel")}
          \${kpi("Guide opens", fmt.format(t.totals.guideOpened), pct(t.rates.guideOpenRate) + " of leads")}
          \${kpi("Masterclass", fmt.format(t.totals.masterclassRegistered), pct(t.rates.masterclassRegistrationRate) + " of leads")}
          \${kpi("Details", fmt.format(t.totals.masterclassDetailsSubmitted), pct(t.rates.detailsCompletionRate) + " of registered")}
          \${kpi("Postmark", postmarkUnavailable ? "No token" : "Connected", postmarkUnavailable ? "Set token/secret" : "API reachable")}
        </section>
        <section class="grid two" style="margin-top:16px">
          <div class="card"><h2>Sources</h2>\${bars(t.sources)}</div>
          <div class="card"><h2>Event Types</h2>\${bars(t.periodEvents)}</div>
        </section>
        <section class="grid two" style="margin-top:16px">
          <div class="card"><h2>Recent Leads</h2>\${leadTable(t.recentLeads.slice(0, 12))}</div>
          <div class="card"><h2>Recent Events</h2>\${eventTable(t.recentEvents.slice(0, 14))}</div>
        </section>
      \`;
    }

    function leadTable(leads) {
      return \`<div class="table-wrap"><table>
        <thead><tr><th>Email</th><th>Status</th><th>Name</th><th>Subject</th><th>Phone</th><th>Submitted</th><th>Updated</th></tr></thead>
        <tbody>\${leads.map(lead => \`
          <tr>
            <td>\${escapeHtml(lead.email)}</td>
            <td><span class="pill \${lead.masterclassStatus === "registered" ? "green" : ""}">\${escapeHtml(lead.masterclassStatus)}</span></td>
            <td>\${escapeHtml(lead.name)}</td>
            <td>\${escapeHtml(lead.teachingSubject)}</td>
            <td>\${escapeHtml(lead.phone)}</td>
            <td>\${shortDate(lead.firstSubmittedAt || lead.lastSubmittedAt)}</td>
            <td>\${shortDate(lead.updatedAt)}</td>
          </tr>\`).join("")}</tbody>
      </table></div>\`;
    }

    function eventTable(events) {
      return \`<div class="table-wrap"><table>
        <thead><tr><th>Type</th><th>Email hash</th><th>Created</th><th>Metadata</th></tr></thead>
        <tbody>\${events.map(event => \`
          <tr>
            <td><span class="pill">\${escapeHtml(event.type)}</span></td>
            <td>\${escapeHtml(event.emailHash.slice(0, 12))}</td>
            <td>\${shortDate(event.createdAt)}</td>
            <td><pre>\${escapeHtml(JSON.stringify(event.metadata || {}, null, 2))}</pre></td>
          </tr>\`).join("")}</tbody>
      </table></div>\`;
    }

    function renderTeacher() {
      const t = state.summary.teacherGuide;
      const registered = t.recentLeads.filter(lead => lead.masterclassStatus === "registered");
      app.innerHTML = \`
        <section class="grid three">
          <div class="card"><h2>Funnel Rates</h2>
            <p>Guide open rate: <span class="rate">\${pct(t.rates.guideOpenRate)}</span></p>
            <p>Masterclass registration rate: <span class="rate">\${pct(t.rates.masterclassRegistrationRate)}</span></p>
            <p>Details completion rate: <span class="rate">\${pct(t.rates.detailsCompletionRate)}</span></p>
          </div>
          <div class="card"><h2>UTM Campaigns</h2>\${bars(t.utmCampaigns)}</div>
          <div class="card"><h2>All Events</h2>\${bars(t.events)}</div>
        </section>
        <section class="card" style="margin-top:16px">
          <div class="row-actions"><h2 style="margin-right:auto">Guide Leads</h2><span class="pill">\${fmt.format(t.recentLeads.length)} latest loaded</span></div>
          \${leadTable(t.recentLeads)}
        </section>
        <section class="card" style="margin-top:16px">
          <h2>Masterclass Registrations</h2>
          \${leadTable(registered)}
        </section>
      \`;
    }

    function postmarkStatsBlock(name, data) {
      if (!data) return "";
      if (data.unavailable) return \`<div class="card"><h2>\${name}</h2><p class="error">\${escapeHtml(data.error)}</p></div>\`;
      if (data.ok === false) return \`<div class="card"><h2>\${name}</h2><p class="error">\${escapeHtml(data.error)}</p></div>\`;
      return \`<div class="card"><h2>\${name}</h2><pre>\${escapeHtml(JSON.stringify(data, null, 2))}</pre></div>\`;
    }

    async function renderPostmark() {
      if (!state.postmarkMessages) await loadPostmarkMessages();
      const p = state.summary.postmark || {};
      const messages = state.postmarkMessages?.Messages || [];
      app.innerHTML = \`
        <section class="grid three">
          \${postmarkStatsBlock("Overview", p.overview)}
          \${postmarkStatsBlock("Opens", p.opens)}
          \${postmarkStatsBlock("Clicks", p.clicks)}
        </section>
        <section class="card" style="margin-top:16px">
          <div class="row-actions"><h2 style="margin-right:auto">Outbound Messages</h2><button class="secondary" id="reload-postmark">Reload Postmark</button></div>
          <div class="table-wrap"><table>
            <thead><tr><th>To</th><th>Subject</th><th>Status</th><th>Received</th><th>Opens</th><th>Clicks</th></tr></thead>
            <tbody>\${messages.map(m => \`
              <tr>
                <td>\${escapeHtml(m.Recipients?.join(", ") || m.Recipient || "")}</td>
                <td>\${escapeHtml(m.Subject || "")}</td>
                <td><span class="pill \${m.Status === "Sent" ? "green" : "red"}">\${escapeHtml(m.Status || "")}</span></td>
                <td>\${shortDate(m.ReceivedAt || m.CreatedAt)}</td>
                <td>\${escapeHtml(m.Opens ?? "")}</td>
                <td>\${escapeHtml(m.Clicks ?? "")}</td>
              </tr>\`).join("")}</tbody>
          </table></div>
        </section>
      \`;
      document.getElementById("reload-postmark")?.addEventListener("click", async () => {
        state.postmarkMessages = null;
        await refresh();
      });
    }

    async function renderFirestore() {
      await loadCollections();
      app.innerHTML = \`
        <section class="collection-list">
          \${state.collections.map(collection => \`
            <article class="card collection-card" data-collection="\${escapeHtml(collection.id)}">
              <h2>\${escapeHtml(collection.id)}</h2>
              <p class="muted">\${fmt.format(collection.count)} document(s)</p>
              <pre>\${escapeHtml(JSON.stringify(collection.sample?.[0] || {}, null, 2).slice(0, 700))}</pre>
            </article>
          \`).join("")}
        </section>
        <section id="collection-detail" class="card" style="margin-top:16px"></section>
      \`;
      document.querySelectorAll("[data-collection]").forEach(el => {
        el.addEventListener("click", async () => {
          const id = el.getAttribute("data-collection");
          const detail = document.getElementById("collection-detail");
          detail.innerHTML = "<p class='muted'>Loading " + escapeHtml(id) + "…</p>";
          const data = await getJson("/api/firestore/collection/" + encodeURIComponent(id) + "?limit=100");
          detail.innerHTML = \`<h2>\${escapeHtml(id)}</h2><div class="table-wrap"><table>
            <thead><tr><th>ID</th><th>Document</th></tr></thead>
            <tbody>\${data.docs.map(doc => \`<tr><td>\${escapeHtml(doc.id)}</td><td><pre>\${escapeHtml(JSON.stringify(doc, null, 2))}</pre></td></tr>\`).join("")}</tbody>
          </table></div>\`;
        });
      });
    }

    function render() {
      document.querySelectorAll(".tab").forEach(tab => tab.classList.toggle("active", tab.dataset.tab === state.tab));
      if (!state.summary) return;
      if (state.tab === "overview") return renderOverview();
      if (state.tab === "teacher") return renderTeacher();
      if (state.tab === "postmark") return renderPostmark();
      if (state.tab === "firestore") return renderFirestore();
    }

    document.querySelectorAll(".tab").forEach(tab => tab.addEventListener("click", async () => {
      state.tab = tab.dataset.tab;
      setStatus("Loading " + state.tab + "…");
      try {
        if (!state.summary) await loadSummary();
        render();
        setStatus("Ready");
      } catch (err) {
        setStatus(err.message, true);
      }
    }));
    document.getElementById("refresh").addEventListener("click", refresh);
    document.getElementById("days").addEventListener("change", refresh);

    refresh();
  </script>
</body>
</html>`;
}

async function handleRequest(req, res) {
  const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);

  try {
    if (url.pathname === "/") return sendHtml(res, pageHtml());
    if (url.pathname.startsWith("/api/")) return await routeApi(req, res, url);
    return notFound(res);
  } catch (err) {
    console.error("DASHBOARD_ERROR", err);
    return sendJson(res, { ok: false, error: explainOperationalError(err) }, 500);
  }
}

parseArgs();

process.on("unhandledRejection", (err) => {
  console.error("DASHBOARD_UNHANDLED_REJECTION", explainOperationalError(err));
});

process.on("uncaughtException", (err) => {
  console.error("DASHBOARD_UNCAUGHT_EXCEPTION", explainOperationalError(err));
});

const server = http.createServer(handleRequest);
server.listen(DEFAULT_PORT, "127.0.0.1", () => {
  console.log(`Campaign dashboard running: http://127.0.0.1:${DEFAULT_PORT}`);
  console.log(`Firestore project: ${DEFAULT_PROJECT_ID}`);
  console.log("Press Ctrl+C to stop.");
});
