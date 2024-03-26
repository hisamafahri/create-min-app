#!/usr/bin/env node

import path from "path";
import fs from "fs";
import select from "@inquirer/select";
import input from "@inquirer/input";
import { fileURLToPath } from "url";
import {
  createDirectory,
  createProjectContents,
  kebabToTitleCase,
} from "./utils/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const runtime = await select({
  message: "What runtime you want to use?",
  choices: [
    {
      name: "Node.js",
      value: "node",
    },
    {
      name: "Bun",
      value: "bun",
    },
  ],
}).catch(() => {
  console.error("Runtime is not selected!");
  process.exit(1);
});

const type = await select({
  message: "What kind of project you want to generate?",
  choices: fs
    .readdirSync(path.join(__dirname, "../src/templates", runtime))
    .map((file) => ({
      name: kebabToTitleCase(file),
      value: file.replace(" ", "-"),
    })),
}).catch(() => {
  console.error("Project type is not selected!");
  process.exit(1);
});

const template = await select({
  message: "What template you want to use?",
  choices: fs
    .readdirSync(path.join(__dirname, "../src/templates", runtime, type))
    .map((file) => ({
      name: kebabToTitleCase(file),
      value: file.replace(" ", "-"),
    })),
}).catch(() => {
  console.error("Template is not selected!");
  process.exit(1);
});

const name = await input({
  message: "What's project name? ",
  validate: (value) => {
    if (value.trim()) {
      return true;
    }
    return "Project name is required!";
  },
}).catch(() => {
  console.error("Invalid input!");
  process.exit(1);
});

const templatePath = path.join(
  __dirname,
  "../src/templates",
  runtime,
  type,
  template,
);

createDirectory(path.join(process.cwd(), name));
createProjectContents(templatePath, name);
console.info(`Project ${name} successfully generated!`);
