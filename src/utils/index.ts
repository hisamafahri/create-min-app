import path from "path";
import fs from "fs";
import { render } from "../utils/template.js";

export const createDirectory = (path: string) => {
  if (fs.existsSync(path)) {
    console.warn(path, "is already exists!");
    process.exit(1);
  } else if (!fs.existsSync(path)) {
    console.info("Generating project...");
    fs.mkdirSync(path);
  }
};

export const createProjectContents = (
  templatePath: string,
  projectName: string,
) => {
  const currentDirectory = process.cwd();
  const skipFiles = ["node_modules"];

  const template = fs.readdirSync(templatePath);
  template.forEach((content) => {
    const originalFilePath = path.join(templatePath, content);
    const fileStats = fs.statSync(originalFilePath);
    if (skipFiles.indexOf(content) > -1) return;

    if (fileStats.isFile()) {
      let contents = fs.readFileSync(originalFilePath, "utf8");
      contents = render(contents, { projectName });

      const writePath = path.join(currentDirectory, projectName, content);
      fs.writeFileSync(writePath, contents, "utf8");
    } else {
      // NOTE: create directory if the content is not a 'file' recursively
      if (!fs.existsSync(path.join(currentDirectory, projectName, content))) {
        fs.mkdirSync(path.join(currentDirectory, projectName, content));
      }
      createProjectContents(
        path.join(templatePath, content),
        path.join(projectName, content),
      );
    }
  });
};

export const kebabToTitleCase = (input: string): string => {
  return input
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};
