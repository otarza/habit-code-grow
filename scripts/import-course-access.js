#!/usr/bin/env node
/**
 * Import course entitlements into Firestore without sending emails.
 *
 * Examples:
 *   node scripts/import-course-access.js --file students.csv --course ai-bootcamp --dry-run
 *   node scripts/import-course-access.js --file students.csv --course ai-bootcamp --source google_classroom --apply
 */

import fs from "node:fs";
import crypto from "node:crypto";
import { createRequire } from "node:module";
import { parse } from "csv-parse/sync";

const require = createRequire(import.meta.url);
const { Firestore, FieldValue } = require("@google-cloud/firestore");

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/g;
const SINGLE_EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DEFAULT_PROJECT_ID = "bitcamp-flitt";
const COURSE_SLUGS = new Set(["ai-bootcamp", "ai-pro"]);
const EMAIL_COLUMNS = [
  "email",
  "Email",
  "EMAIL",
  "Email Address",
  "ელფოსტა",
  "ელ.ფოსტა",
  "ელფოსტა:",
  "E-mail",
  "e-mail",
];

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = {
    project: DEFAULT_PROJECT_ID,
    source: "google_classroom_import",
    dryRun: true,
    apply: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--file") opts.file = args[++i];
    else if (arg === "--course") opts.course = args[++i];
    else if (arg === "--source") opts.source = args[++i];
    else if (arg === "--note") opts.note = args[++i];
    else if (arg === "--project") opts.project = args[++i];
    else if (arg === "--email-column") opts.emailColumn = args[++i];
    else if (arg === "--dry-run") opts.dryRun = true;
    else if (arg === "--apply") {
      opts.apply = true;
      opts.dryRun = false;
    } else {
      usageAndExit(`unknown argument: ${arg}`);
    }
  }

  return opts;
}

function usageAndExit(message) {
  if (message) console.error(`error: ${message}\n`);
  console.error(`Usage:
  node scripts/import-course-access.js \\
    --file <students.csv> \\
    --course <course-slug> \\
    [--source google_classroom_import] \\
    [--note "Imported from Google Classroom"] \\
    [--email-column email] \\
    [--project bitcamp-flitt] \\
    [--dry-run | --apply]

Course slugs:
  ai-bootcamp
  ai-pro
`);
  process.exit(1);
}

function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

function hashEmail(email) {
  return crypto.createHash("sha256").update(email).digest("hex");
}

function extractEmails(row, emailColumn) {
  const emails = new Set();

  if (emailColumn && row[emailColumn]) {
    const normalized = normalizeEmail(row[emailColumn]);
    if (SINGLE_EMAIL_RE.test(normalized)) emails.add(normalized);
  }

  for (const column of EMAIL_COLUMNS) {
    if (!row[column]) continue;
    const normalized = normalizeEmail(row[column]);
    if (SINGLE_EMAIL_RE.test(normalized)) emails.add(normalized);
  }

  if (emails.size > 0) return [...emails];

  for (const value of Object.values(row)) {
    const text = String(value || "");
    const matches = text.match(EMAIL_RE) || [];
    for (const match of matches) {
      emails.add(normalizeEmail(match));
    }
  }

  return [...emails];
}

async function commitBatch(firestore, records, opts) {
  let batch = firestore.batch();
  let pending = 0;
  let written = 0;

  for (const record of records) {
    const docRef = firestore.collection("course_access").doc(hashEmail(record.email));
    const courseAccess = {
      status: "active",
      source: opts.source,
      grantedAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };

    if (opts.note) courseAccess.note = opts.note;

    batch.set(
      docRef,
      {
        email: record.email,
        emailNormalized: record.email,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
        courses: {
          [opts.course]: courseAccess,
        },
      },
      { merge: true }
    );

    pending += 1;
    written += 1;

    if (pending >= 450) {
      await batch.commit();
      batch = firestore.batch();
      pending = 0;
    }
  }

  if (pending > 0) {
    await batch.commit();
  }

  return written;
}

async function main() {
  const opts = parseArgs();

  if (!opts.file) usageAndExit("--file is required");
  if (!opts.course) usageAndExit("--course is required");
  if (!COURSE_SLUGS.has(opts.course)) usageAndExit(`unknown course: ${opts.course}`);
  if (!fs.existsSync(opts.file)) usageAndExit(`file not found: ${opts.file}`);

  const raw = fs.readFileSync(opts.file, "utf8");
  const rows = parse(raw, {
    bom: true,
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });

  const emails = new Map();
  const invalidRows = [];

  rows.forEach((row, index) => {
    const found = extractEmails(row, opts.emailColumn);
    if (found.length === 0) {
      invalidRows.push(index + 2);
      return;
    }

    for (const email of found) {
      emails.set(email, { email });
    }
  });

  const records = [...emails.values()].sort((a, b) => a.email.localeCompare(b.email));
  const extractedCount = rows.reduce((count, row) => count + extractEmails(row, opts.emailColumn).length, 0);
  const duplicateCount = Math.max(0, extractedCount - records.length);

  console.log("\nCourse access import preview");
  console.log("─".repeat(48));
  console.log(`Project:       ${opts.project}`);
  console.log(`File:          ${opts.file}`);
  console.log(`Course:        ${opts.course}`);
  console.log(`Source:        ${opts.source}`);
  console.log(`Rows:          ${rows.length}`);
  console.log(`Valid emails:  ${records.length}`);
  console.log(`Duplicates:    ${duplicateCount}`);
  console.log(`Invalid rows:  ${invalidRows.length}`);
  if (invalidRows.length > 0) {
    console.log(`Invalid sample: ${invalidRows.slice(0, 10).join(", ")}`);
  }
  console.log("─".repeat(48));

  if (records.length > 0) {
    console.log("Sample:");
    for (const record of records.slice(0, 5)) {
      console.log(`  ${record.email}`);
    }
    if (records.length > 5) console.log(`  ...and ${records.length - 5} more`);
  }

  if (opts.dryRun) {
    console.log("\nDRY RUN — no Firestore writes. Re-run with --apply to import.");
    return;
  }

  const firestore = new Firestore({ projectId: opts.project });
  const written = await commitBatch(firestore, records, opts);
  console.log(`\nImported ${written} entitlement record(s) into Firestore.`);
}

main().catch((err) => {
  if (String(err?.message || err).includes("Could not load the default credentials")) {
    console.error("fatal: Firestore Application Default Credentials are not configured.");
    console.error("Run this once before importing:");
    console.error("  gcloud auth application-default login");
    console.error("\nThen re-run the import command.");
    process.exit(1);
  }

  console.error("fatal:", err);
  process.exit(1);
});
