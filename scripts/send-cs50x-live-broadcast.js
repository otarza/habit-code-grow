#!/usr/bin/env node
/**
 * Send a CS50x Georgian YouTube Live invite through Postmark.
 *
 * Dry run first:
 *   node scripts/send-cs50x-live-broadcast.js \
 *     --csv preregistered.csv \
 *     --youtube-url https://www.youtube.com/watch?v=...
 *
 * Real send:
 *   POSTMARK_TOKEN=<token> node scripts/send-cs50x-live-broadcast.js \
 *     --csv preregistered.csv \
 *     --youtube-url https://www.youtube.com/watch?v=... \
 *     --send
 */

import fs from "node:fs/promises";
import { execFileSync } from "node:child_process";
import path from "node:path";
import process from "node:process";
import postmark from "postmark";
import { parse } from "csv-parse/sync";

const FROM = "BitCamp <oto@bitcamp.ge>";
const REPLY_TO = "hello@bitcamp.ge";
const DEFAULT_STARTS_AT = "4 ივლისს, შაბათს, 10:00-ზე";
const DEFAULT_STREAM = "cs50x-georgia";
const DEFAULT_PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT || process.env.GCLOUD_PROJECT || "bitcamp-flitt";
const DEFAULT_POSTMARK_SECRET = process.env.POSTMARK_SECRET_NAME || "postmark-token";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const LETTERS = {
  invite: {
    subject: "ხვალ 10:00-ზე ვიწყებთ CS50x-ს ქართულად",
    tag: "cs50x-live-invite",
    htmlTemplate: path.join(ROOT, "email-templates", "cs50x-live-invite.html"),
    textTemplate: path.join(ROOT, "email-templates", "cs50x-live-invite.txt"),
  },
  "reminder-10min": {
    subject: "ლექცია იწყება 10 წუთში",
    tag: "cs50x-live-reminder-10min",
    htmlTemplate: path.join(ROOT, "email-templates", "cs50x-live-reminder-10min.html"),
    textTemplate: path.join(ROOT, "email-templates", "cs50x-live-reminder-10min.txt"),
  },
};

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = {
    send: false,
    letter: "invite",
    startsAt: DEFAULT_STARTS_AT,
    stream: process.env.POSTMARK_BROADCAST_STREAM || DEFAULT_STREAM,
    batchSize: 100,
    delayMs: 1000,
    limit: 0,
    offset: 0,
    directLinks: false,
  };

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === "--csv") opts.csv = args[++i];
    else if (arg === "--letter") opts.letter = args[++i];
    else if (arg === "--youtube-url") opts.youtubeUrl = args[++i];
    else if (arg === "--subject") opts.subject = args[++i];
    else if (arg === "--starts-at") opts.startsAt = args[++i];
    else if (arg === "--stream") opts.stream = args[++i];
    else if (arg === "--batch-size") opts.batchSize = Number(args[++i]);
    else if (arg === "--delay-ms") opts.delayMs = Number(args[++i]);
    else if (arg === "--limit") opts.limit = Number(args[++i]);
    else if (arg === "--offset") opts.offset = Number(args[++i]);
    else if (arg === "--send") opts.send = true;
    else if (arg === "--direct-links") opts.directLinks = true;
    else if (arg === "--help" || arg === "-h") usageAndExit();
    else usageAndExit(`unknown argument: ${arg}`);
  }

  return opts;
}

function usageAndExit(message) {
  if (message) console.error(`error: ${message}\n`);
  console.error(`Usage:
  node scripts/send-cs50x-live-broadcast.js \\
    --csv <file.csv> \\
    [--letter invite|reminder-10min] \\
    --youtube-url <scheduled-youtube-live-url> \\
    [--starts-at "4 ივლისს, შაბათს, 10:00-ზე"] \\
    [--subject "<override subject>"] \\
    [--stream cs50x-georgia] \\
    [--batch-size 100] \\
    [--delay-ms 1000] \\
    [--offset 0] \\
    [--limit 100] \\
    [--direct-links] \\
    [--send]

CSV:
  Preferred headers: email,name
  Headerless CSV is also accepted; the first column is treated as email.

Environment:
  POSTMARK_TOKEN=<server-token> or POSTMARK_SERVER_TOKEN=<server-token>
  Or Google Secret Manager secret "${DEFAULT_POSTMARK_SECRET}" in project "${DEFAULT_PROJECT_ID}"
  POSTMARK_BROADCAST_STREAM=<stream-id> optional, default: cs50x-georgia

Examples:
  node scripts/send-cs50x-live-broadcast.js --csv leads.csv --youtube-url https://youtube.com/live/abc
  POSTMARK_TOKEN=... node scripts/send-cs50x-live-broadcast.js --csv leads.csv --youtube-url https://youtube.com/live/abc --send
`);
  process.exit(message ? 1 : 0);
}

function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

function cleanName(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function hasHeaderRow(csvText) {
  const firstLine = csvText.split(/\r?\n/).find((line) => line.trim());
  return Boolean(firstLine && /(^|,)\s*"?(e-?mail|email address|ელფოსტა)"?\s*(,|$)/i.test(firstLine));
}

async function readRecipients(csvPath) {
  const csvText = await fs.readFile(csvPath, "utf8");
  const columns = hasHeaderRow(csvText);
  const rows = parse(csvText, {
    bom: true,
    columns,
    skip_empty_lines: true,
    trim: true,
    relax_column_count: true,
  });

  const seen = new Set();
  const recipients = [];
  const invalid = [];
  const duplicates = [];

  rows.forEach((row, index) => {
    const rowNumber = index + (columns ? 2 : 1);
    const rawEmail = columns
      ? row.email ||
        row.Email ||
        row.EMAIL ||
        row["Email Address"] ||
        row["email address"] ||
        row["ელფოსტა"] ||
        row.mail ||
        row.Mail
      : row[0];
    const rawFirstName = columns ? row["First Name"] || row.firstName || row.first_name || row.name || row.Name || row.NAME || row["სახელი"] || "" : row[1] || "";
    const email = normalizeEmail(rawEmail);
    const name = cleanName(rawFirstName);

    if (!EMAIL_RE.test(email)) {
      invalid.push({ row: rowNumber, value: rawEmail || "" });
      return;
    }

    if (seen.has(email)) {
      duplicates.push({ row: rowNumber, email });
      return;
    }

    seen.add(email);
    recipients.push({ email, name });
  });

  return { recipients, invalid, duplicates };
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function render(template, model, html = false) {
  return template.replace(/\{\{([a-zA-Z0-9_]+)\}\}/g, (_, key) => {
    const value = model[key] ?? "";
    return html ? escapeHtml(value) : String(value);
  });
}

function chunk(items, size) {
  const chunks = [];
  for (let i = 0; i < items.length; i += size) chunks.push(items.slice(i, i + size));
  return chunks;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const opts = parseArgs();
  const letter = LETTERS[opts.letter];
  if (!letter) usageAndExit(`unknown letter: ${opts.letter} (use invite or reminder-10min)`);
  opts.subject ||= letter.subject;

  if (!opts.csv) usageAndExit("--csv is required");
  if (!opts.youtubeUrl) usageAndExit("--youtube-url is required");
  if (!opts.youtubeUrl.startsWith("https://")) usageAndExit("--youtube-url must be an https URL");
  if (!Number.isInteger(opts.batchSize) || opts.batchSize < 1 || opts.batchSize > 500) {
    usageAndExit("--batch-size must be an integer between 1 and 500");
  }
  if (!Number.isInteger(opts.delayMs) || opts.delayMs < 0) usageAndExit("--delay-ms must be a non-negative integer");
  if (!Number.isInteger(opts.offset) || opts.offset < 0) usageAndExit("--offset must be a non-negative integer");
  if (!Number.isInteger(opts.limit) || opts.limit < 0) usageAndExit("--limit must be a non-negative integer");

  const token = await getPostmarkToken();
  if (opts.send && !token) {
    usageAndExit(
      `Postmark token not found. Set POSTMARK_TOKEN/POSTMARK_SERVER_TOKEN, or make sure gcloud can access Secret Manager secret "${DEFAULT_POSTMARK_SECRET}" in project "${DEFAULT_PROJECT_ID}".`
    );
  }

  const csvPath = path.resolve(process.cwd(), opts.csv);
  const [{ recipients, invalid, duplicates }, htmlTemplate, textTemplate] = await Promise.all([
    readRecipients(csvPath),
    fs.readFile(letter.htmlTemplate, "utf8"),
    fs.readFile(letter.textTemplate, "utf8"),
  ]);

  const selected = recipients.slice(opts.offset, opts.limit ? opts.offset + opts.limit : undefined);
  if (selected.length === 0) usageAndExit("no valid recipients selected");

  console.log(`\n${"=".repeat(64)}`);
  console.log(`CS50x YouTube Live broadcast`);
  console.log(`${"=".repeat(64)}`);
  console.log(`CSV:          ${csvPath}`);
  console.log(`Mode:         ${opts.send ? "SEND" : "DRY RUN"}`);
  console.log(`Letter:       ${opts.letter}`);
  console.log(`Recipients:   ${selected.length} selected (${recipients.length} valid total)`);
  console.log(`Invalid rows: ${invalid.length}`);
  console.log(`Duplicates:   ${duplicates.length}`);
  console.log(`Subject:      ${opts.subject}`);
  console.log(`Starts at:    ${opts.startsAt}`);
  console.log(`YouTube:      ${opts.youtubeUrl}`);
  console.log(`Stream:       ${opts.stream}`);
  console.log(`Batch size:   ${opts.batchSize}`);
  console.log(`Track links:  ${opts.directLinks ? "off" : "on"}`);
  console.log(`${"=".repeat(64)}\n`);

  if (invalid.length) {
    console.log("Invalid rows:");
    invalid.slice(0, 20).forEach((item) => console.log(`  row ${item.row}: ${item.value}`));
    if (invalid.length > 20) console.log(`  ...and ${invalid.length - 20} more`);
    console.log("");
  }

  if (duplicates.length) {
    console.log("Duplicate emails skipped:");
    duplicates.slice(0, 20).forEach((item) => console.log(`  row ${item.row}: ${item.email}`));
    if (duplicates.length > 20) console.log(`  ...and ${duplicates.length - 20} more`);
    console.log("");
  }

  console.log("Recipient preview:");
  selected.slice(0, 10).forEach((recipient) => {
    console.log(`  ${recipient.email}${recipient.name ? ` (${recipient.name})` : ""}`);
  });
  if (selected.length > 10) console.log(`  ...and ${selected.length - 10} more`);
  console.log("");

  const sampleModel = buildModel(selected[0], opts);
  console.log("Subject preview:");
  console.log(`  ${opts.subject}`);
  console.log("Text preview:");
  console.log(render(textTemplate, sampleModel).split("\n").slice(0, 12).join("\n"));
  console.log("");

  if (!opts.send) {
    console.log("DRY RUN - no emails sent. Add --send with POSTMARK_TOKEN to deliver.");
    return;
  }

  const client = new postmark.ServerClient(token);
  let sent = 0;
  const failures = [];
  const batches = chunk(selected, opts.batchSize);

  for (let batchIndex = 0; batchIndex < batches.length; batchIndex += 1) {
    const batch = batches[batchIndex];
    const messages = batch.map((recipient) => {
      const model = buildModel(recipient, opts);
      return {
        From: FROM,
        To: recipient.email,
        ReplyTo: REPLY_TO,
        Subject: opts.subject,
        HtmlBody: render(htmlTemplate, model, true),
        TextBody: render(textTemplate, model),
        MessageStream: opts.stream,
        TrackOpens: true,
        TrackLinks: opts.directLinks ? "None" : "HtmlAndText",
        Tag: letter.tag,
        Metadata: {
          campaign: letter.tag,
          source: "csv-broadcast-cli",
        },
      };
    });

    console.log(`Sending batch ${batchIndex + 1}/${batches.length} (${batch.length} emails)...`);
    const results = await client.sendEmailBatch(messages);
    results.forEach((result, index) => {
      const recipient = batch[index];
      if (result.ErrorCode && result.ErrorCode !== 0) {
        failures.push({ email: recipient.email, errorCode: result.ErrorCode, message: result.Message });
      } else {
        sent += 1;
      }
    });

    console.log(`  sent so far: ${sent}, failures: ${failures.length}`);
    if (batchIndex < batches.length - 1 && opts.delayMs > 0) await sleep(opts.delayMs);
  }

  if (failures.length) {
    console.error("\nFailures:");
    failures.forEach((failure) => {
      console.error(`  ${failure.email}: [${failure.errorCode}] ${failure.message}`);
    });
    process.exitCode = 1;
  }

  console.log(`\nDone. Sent: ${sent}. Failed: ${failures.length}.`);
}

async function getPostmarkToken() {
  const envToken = process.env.POSTMARK_TOKEN || process.env.POSTMARK_SERVER_TOKEN;
  if (envToken) return envToken;

  try {
    return execFileSync(
      "gcloud",
      ["secrets", "versions", "access", "latest", `--secret=${DEFAULT_POSTMARK_SECRET}`, `--project=${DEFAULT_PROJECT_ID}`],
      { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }
    ).trim();
  } catch (err) {
    if (process.argv.includes("--send")) {
      const stderr = err.stderr?.toString?.().trim();
      if (stderr) console.warn(`POSTMARK_SECRET_GCLOUD_FAIL ${stderr}`);
    }
    return "";
  }
}

function buildModel(recipient, opts) {
  return {
    subject: opts.subject,
    starts_at: opts.startsAt,
    youtube_live_url: opts.youtubeUrl,
    recipient_name_suffix: recipient.name ? `, ${recipient.name}` : "",
  };
}

main().catch((err) => {
  console.error("fatal:", err);
  process.exit(1);
});
