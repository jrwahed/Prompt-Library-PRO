#!/usr/bin/env node
// Parses Company-Prompt-Library-PRO.md into content/library.json.
// Convention (see the md file header):
//   # <emoji> القسم N — <section name>       -> section header
//   ### 🔹 <CODE> — <title>                   -> prompt header
//   **متى تستخدمه:** ...                       -> optional one-liner shown on cards
//   **بيعمل إيه:** ...                          -> optional plain-Arabic explainer
//   **إزاي تستخدمه:**                           -> optional numbered list ("1. ...")
//   **عشان تطلع بأحسن نتيجة:**                  -> optional bullet list ("- ...")
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
const WHAT_IT_DOES_RE = /^\*\*بيعمل إيه:\*\*\s*(.+?)\s*$/u;
const HOW_TO_USE_RE = /^\*\*إزاي تستخدمه:\*\*\s*$/u;
const TIPS_RE = /^\*\*عشان تطلع بأحسن نتيجة:\*\*\s*$/u;
const EXAMPLES_RE = /^\*\*أمثلة للحقول:\*\*\s*$/u;
const CHAT_COMMANDS_RE = /^\*\*💬\s*أوامر الشات.*?:\*\*\s*(.+?)\s*$/u;
const ORDERED_ITEM_RE = /^\d+\.\s+(.+?)\s*$/u;
const BULLET_ITEM_RE = /^[-*]\s+(.+?)\s*$/u;
const BACKTICK_RE = /`([^`]+)`/g;
const VARIABLE_RE = /\[([^\]]+)\]/g;

function extractVariables(template) {
  const seen = new Set();
  const ordered = [];
  for (const match of template.matchAll(VARIABLE_RE)) {
    const name = match[1].trim();
    if (!name || seen.has(name)) continue;
    seen.add(name);
    ordered.push(name);
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
  // Which multi-line list we are currently collecting: "howToUse" | "tips" | null
  let listMode = null;

  const flushPrompt = () => {
    if (!currentPrompt) return;
    const template = templateLines.join("\n").trim();
    prompts.push({
      id: currentPrompt.code.toLowerCase(),
      code: currentPrompt.code,
      sectionId: currentPrompt.sectionId,
      title: currentPrompt.title,
      whenToUse: currentPrompt.whenToUse,
      whatItDoes: currentPrompt.whatItDoes,
      howToUse: currentPrompt.howToUse,
      tips: currentPrompt.tips,
      examples: currentPrompt.examples,
      template,
      variables: extractVariables(template),
      chatCommands: currentPrompt.chatCommands,
    });
    currentPrompt = null;
    templateLines = [];
    listMode = null;
  };

  for (const line of lines) {
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
      currentSection = { id: `section-${number}`, number: Number(number), emoji, name };
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
        whatItDoes: undefined,
        howToUse: [],
        tips: [],
        examples: {},
        chatCommands: [],
      };
      continue;
    }

    if (!currentPrompt) continue;

    // While collecting a list, keep taking matching items and skip blank lines.
    // Anything else ends the list.
    if (listMode) {
      const itemRe = listMode === "howToUse" ? ORDERED_ITEM_RE : BULLET_ITEM_RE;
      const itemMatch = line.match(itemRe);
      if (itemMatch) {
        if (listMode === "examples") {
          // "- <variable>: <example value>" — split on the first colon only,
          // since example values routinely contain colons of their own.
          const separator = itemMatch[1].indexOf(":");
          if (separator === -1) {
            throw new Error(
              `Malformed example for ${currentPrompt.code}: "${itemMatch[1]}" — expected "- اسم المتغير: المثال".`
            );
          }
          const name = itemMatch[1].slice(0, separator).trim();
          const value = itemMatch[1].slice(separator + 1).trim();
          if (name && value) currentPrompt.examples[name] = value;
        } else {
          currentPrompt[listMode].push(itemMatch[1]);
        }
        continue;
      }
      if (line.trim() === "") continue;
      listMode = null;
      // fall through so this line is still matched against the rules below
    }

    if (line.trim() === "```") {
      inTemplate = true;
      continue;
    }

    if (HOW_TO_USE_RE.test(line)) {
      listMode = "howToUse";
      continue;
    }

    if (TIPS_RE.test(line)) {
      listMode = "tips";
      continue;
    }

    if (EXAMPLES_RE.test(line)) {
      listMode = "examples";
      continue;
    }

    const whenToUseMatch = line.match(WHEN_TO_USE_RE);
    if (whenToUseMatch) {
      currentPrompt.whenToUse = whenToUseMatch[1];
      continue;
    }

    const whatItDoesMatch = line.match(WHAT_IT_DOES_RE);
    if (whatItDoesMatch) {
      currentPrompt.whatItDoes = whatItDoesMatch[1];
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

// The guide fields render as plain text, so markdown markers survive to the
// screen as literal characters. Fail the build instead of shipping "**كده**".
function assertGuideTextIsPlain(prompts) {
  const problems = [];
  for (const p of prompts) {
    const fields = [
      ["بيعمل إيه", p.whatItDoes ? [p.whatItDoes] : []],
      ["إزاي تستخدمه", p.howToUse],
      ["نصايح", p.tips],
      ["أمثلة", Object.values(p.examples)],
    ];
    for (const [label, values] of fields) {
      for (const value of values) {
        if (/\*\*|\\n|`/.test(value)) {
          problems.push(`  ${p.code} (${label}): ${value}`);
        }
      }
    }
  }
  if (problems.length > 0) {
    throw new Error(
      `Markdown markers found in plain-text guide fields — they would render literally:\n${problems.join(
        "\n"
      )}`
    );
  }
}

// Examples and variables have to line up in both directions. An example keyed
// to a name that is not in the template silently never shows up; a variable
// with no example is usually a stray `[bracket]` written inside prose, which
// turns into a phantom input field on the prompt page.
function assertExamplesMatchVariables(prompts) {
  const problems = [];
  for (const p of prompts) {
    const documented = Object.keys(p.examples).length > 0;
    for (const name of Object.keys(p.examples)) {
      if (!p.variables.includes(name)) {
        problems.push(`  ${p.code}: example "${name}" is not a variable in the template`);
      }
    }
    if (!documented) continue;
    for (const name of p.variables) {
      if (!(name in p.examples)) {
        problems.push(
          `  ${p.code}: variable "${name}" has no example — is it a stray [bracket] in prose?`
        );
      }
    }
  }
  if (problems.length > 0) {
    throw new Error(`Field examples and template variables disagree:\n${problems.join("\n")}`);
  }
}

function main() {
  const markdown = readFileSync(SOURCE_PATH, "utf-8");
  const { sections, prompts } = parse(markdown);

  if (sections.length === 0 || prompts.length === 0) {
    throw new Error(
      `Parsed 0 sections or 0 prompts from ${SOURCE_PATH} — check the markdown format.`
    );
  }

  assertGuideTextIsPlain(prompts);
  assertExamplesMatchVariables(prompts);

  const library = { sections, prompts, generatedAt: new Date().toISOString() };

  mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
  writeFileSync(OUTPUT_PATH, JSON.stringify(library, null, 2) + "\n", "utf-8");

  const documented = prompts.filter((p) => p.whatItDoes).length;
  console.log(
    `✅ Built ${prompts.length} prompts across ${sections.length} sections ` +
      `(${documented} with a "بيعمل إيه" explainer) -> ${OUTPUT_PATH}`
  );
}

main();
