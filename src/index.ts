#!/usr/bin/env node

import fs from "fs";
import inquirer from "inquirer";
import path from "path";
import { fileURLToPath } from "url";
import { render } from "./utils/template.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const currentDirectory = process.cwd();
const SKIP_FILES = ["node_modules"];

const KIND = [
  {
    name: "kind",
    type: "list",
    message: "What kind of project you want to start?",
    choices: ["Backend", "Web"],
  },
];

inquirer
  .prompt(KIND)
  .then((kind: Record<string, string>) => {
    const projectKind = kind["kind"]?.toLowerCase() || "";
    inquirer
      .prompt([
        {
          name: "type",
          type: "list",
          message: `What ${projectKind} project you want to generate?`,
          choices: fs.readdirSync(
            path.join(__dirname, "../src/templates", projectKind)
          ),
        },
        {
          name: "name",
          type: "input",
          message: "What's your project name?",
        },
      ])
      .then((answers: Record<string, string>) => {
        const projectName = answers["name"];
        const template = answers["type"];

        if (!projectName || !template) {
          console.error("Project type/name not being selected!");
          return;
        }
        const templatePath = path.join(
          __dirname,
          "../src/templates",
          projectKind,
          template
        );

        createDirectory(path.join(currentDirectory, projectName));
        createProjectContents(templatePath, projectName);
        console.info("Project successfully generated!");
      })
      .catch((err) => console.error(err));
  })
  .catch((err) => console.error(err));

function createDirectory(path: string) {
  if (fs.existsSync(path)) {
    console.warn(path, "is already exists!");
  } else if (!fs.existsSync(path)) {
    console.info("Generating project...");
    fs.mkdirSync(path);
  }
}

function createProjectContents(templatePath: string, projectName: string) {
  const template = fs.readdirSync(templatePath);
  template.forEach((file) => {
    const originalFilePath = path.join(templatePath, file);
    const fileStats = fs.statSync(originalFilePath);
    if (SKIP_FILES.indexOf(file) > -1) return;

    if (fileStats.isFile()) {
      let contents = fs.readFileSync(originalFilePath, "utf8");
      contents = render(contents, { projectName });

      const writePath = path.join(currentDirectory, projectName, file);
      fs.writeFileSync(writePath, contents, "utf8");
    } else {
      // is not a 'file' (e.g a folder)
      if (!fs.existsSync(path.join(currentDirectory, projectName, file))) {
        fs.mkdirSync(path.join(currentDirectory, projectName, file));
      }
      createProjectContents(
        path.join(templatePath, file),
        path.join(projectName, file)
      );
    }
  });
}
