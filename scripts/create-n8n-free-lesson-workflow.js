import fs from "node:fs";
import path from "node:path";

const DEFAULT_N8N_BASE_URL = "https://n8n.bitcamp.ge";
const WORKFLOW_PATH = path.resolve("n8n-workflows/free-lesson-listmonk-subscribe.json");

async function main() {
  const apiKey = readSecret("N8N_API_TOKEN", "N8N_API_TOKEN_FILE");
  const baseUrl = (process.env.N8N_BASE_URL || DEFAULT_N8N_BASE_URL).replace(/\/+$/, "");
  const credentialId = process.env.N8N_LISTMONK_CREDENTIAL_ID || "";
  const credentialName = process.env.N8N_LISTMONK_CREDENTIAL_NAME || "Listmonk Basic Auth";
  const shouldActivate = process.env.N8N_ACTIVATE_WORKFLOW === "true";

  if (!apiKey) {
    throw new Error("Missing N8N_API_TOKEN or N8N_API_TOKEN_FILE");
  }

  const workflow = JSON.parse(fs.readFileSync(WORKFLOW_PATH, "utf8"));
  const payload = buildCreateWorkflowPayload(workflow, { credentialId, credentialName });

  const created = await n8nFetch(`${baseUrl}/api/v1/workflows`, {
    method: "POST",
    apiKey,
    body: payload,
  });

  console.log(`Created n8n workflow: ${created.name || payload.name}`);
  console.log(`Workflow ID: ${created.id}`);
  console.log(`Editor URL: ${baseUrl}/workflow/${created.id}`);
  console.log(`Production webhook: ${baseUrl}/webhook/free-lesson-subscribe`);

  if (!credentialId) {
    console.log("Listmonk credential ID was not provided, so the workflow was left inactive for manual credential binding.");
    console.log("Set N8N_LISTMONK_CREDENTIAL_ID and N8N_ACTIVATE_WORKFLOW=true to create and activate in one step.");
    return;
  }

  if (shouldActivate) {
    await n8nFetch(`${baseUrl}/api/v1/workflows/${created.id}/activate`, {
      method: "POST",
      apiKey,
    });
    console.log("Workflow activated.");
  } else {
    console.log("Workflow created but not activated. Set N8N_ACTIVATE_WORKFLOW=true to activate it automatically.");
  }
}

function buildCreateWorkflowPayload(workflow, { credentialId, credentialName }) {
  const nodes = workflow.nodes.map((node) => {
    if (!credentialId || node.type !== "n8n-nodes-base.httpRequest") {
      return stripNodeRuntimeFields(node);
    }

    return {
      ...stripNodeRuntimeFields(node),
      credentials: {
        httpBasicAuth: {
          id: credentialId,
          name: credentialName,
        },
      },
    };
  });

  return {
    name: workflow.name,
    nodes,
    connections: workflow.connections || {},
    settings: workflow.settings || { executionOrder: "v1" },
  };
}

function stripNodeRuntimeFields(node) {
  const { disabled, notes, notesInFlow, retryOnFail, maxTries, waitBetweenTries, ...cleanNode } = node;
  return cleanNode;
}

function readSecret(envName, fileEnvName) {
  if (process.env[envName]) {
    return process.env[envName].trim();
  }

  const filePath = process.env[fileEnvName];
  if (filePath) {
    return fs.readFileSync(filePath, "utf8").trim();
  }

  return "";
}

async function n8nFetch(url, { method, apiKey, body }) {
  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      "X-N8N-API-KEY": apiKey,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await response.text();
  const parsed = text ? JSON.parse(text) : {};

  if (!response.ok) {
    throw new Error(`n8n API ${method} ${url} failed (${response.status}): ${JSON.stringify(parsed)}`);
  }

  return parsed;
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
