#!/usr/bin/env node
// Parses Company-Prompt-Library-PRO.md into content/library.json.
// Convention (see the md file header):
//   # <emoji> القسم N — <section name>       -> section header
//   ### 🔹 <CODE> — <title>                   -> prompt header
//   **متى تستخدمه:** ...                       -> optional "when to use" line
//   **المتغيرات:** `[x]` · `[y]`               -> informational only, not authoritative
//   ```...```                                  -> the prompt template
//   **💬 أوامر الشات...:** `cmd` · `cmd`        -> chat commands
// Variables are extracted dynamically via regex over the template itself,
// so the library stays in sync automatically when prompts change.

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const SOURCE_PATH = join(ROOT, "Company-Prompt-Library-PRO.md");
const OUTPUT_PATH = join(ROOT, "content", "library.json");

const SECTION_RE = /^#\s+(\S+)\s+القسم\s+(\d+)\s+—\s+(.+?)\s*$/u;
const PROMPT_RE = /^###\s+🔹\s+([A-Za-z]+\d+)\s+—\s+(.+?)\s*$/u;
const WHEN_TO_USE_RE = /^\*\*متى تستخدمه:\*\*\s*(.+?)\s*$/u;
const CHAT_COMMANDS_RE = /^\*\*💬\s*أوامر الشات.*?:\*\*\s*(.+?)\s*$/u;
const BACKTICK_RE = /`([^`]+)`/g;
const VARIABLE_RE = /\[([^\]]+)\]/g;

function extractVariables(template) {
  const seen = new Set();
  const ordered = [];
  for (const match of template.matchAll(VARIABLE_RE)) {
    const name = match[1].trim();
    if (!seen.has(name)) {
      seen.add(name);
      ordered.push(name);
    }
  }
  return ordered;
}

function parse(markdown) {
  const lines = markdown.split(/\r?\n/);
  const sections = [];
  const prompts = [];

  let currentSection = null;
  let currentPrompt = null;
  let inTemplate = false;
  let templateLines = [];

  const flushPrompt = () => {
    if (!currentPrompt) return;
    const template = templateLines.join("\n").trim();
    prompts.push({
      id: currentPrompt.code.toLowerCase(),
      code: currentPrompt.code,
      sectionId: currentPrompt.sectionId,
      title: currentPrompt.title,
      whenToUse: currentPrompt.whenToUse,
      template,
      variables: extractVariables(template),
      chatCommands: currentPrompt.chatCommands,
    });
    currentPrompt = null;
    templateLines = [];
  };

  for (const rawLine of lines) {
    const line = rawLine;

    if (inTemplate) {
      if (line.trim() === "```") {
        inTemplate = false;
      } else {
        templateLines.push(line);
      }
      continue;
    }

    const sectionMatch = line.match(SECTION_RE);
    if (sectionMatch) {
      flushPrompt();
      const [, emoji, number, name] = sectionMatch;
      currentSection = {
        id: `section-${number}`,
        number: Number(number),
        emoji,
        name,
      };
      sections.push(currentSection);
      continue;
    }

    const promptMatch = line.match(PROMPT_RE);
    if (promptMatch) {
      flushPrompt();
      const [, code, title] = promptMatch;
      currentPrompt = {
        code,
        title,
        sectionId: currentSection ? currentSection.id : "uncategorized",
        whenToUse: undefined,
        chatCommands: [],
      };
      continue;
    }

    if (!currentPrompt) continue;

    if (line.trim() === "```") {
      inTemplate = true;
      continue;
    }

    const whenToUseMatch = line.match(WHEN_TO_USE_RE);
    if (whenToUseMatch) {
      currentPrompt.whenToUse = whenToUseMatch[1];
      continue;
    }

    const chatCommandsMatch = line.match(CHAT_COMMANDS_RE);
    if (chatCommandsMatch) {
      currentPrompt.chatCommands = [...chatCommandsMatch[1].matchAll(BACKTICK_RE)].map(
        (m) => m[1]
      );
      continue;
    }
  }
  flushPrompt();

  return { sections, prompts };
}

function main() {
  const markdown = readFileSync(SOURCE_PATH, "utf-8");
  const { sections, prompts } = parse(markdown);

  if (sections.length === 0 || prompts.length === 0) {
    throw new Error(
      `Parsed 0 sections or 0 prompts from ${SOURCE_PATH} — check the markdown format.`
    );
  }

  const library = {
    sections,
    prompts,
    generatedAt: new Date().toISOString(),
  };

  mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
  writeFileSync(OUTPUT_PATH, JSON.stringify(library, null, 2) + "\n", "utf-8");

  console.log(
    `✅ Built ${prompts.length} prompts across ${sections.length} sections -> ${OUTPUT_PATH}`
  );
}

main();
