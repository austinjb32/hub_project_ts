const {
  readdirSync,
  statSync,
  readFileSync,
  writeFileSync,
  mkdirSync,
} = require("fs");
const { join, relative, dirname, extname } = require("path");

const SOURCE_DIR = "./src";
const DIST_DIR = "./dist/src";

const copyFiles = (directory) => {
  readdirSync(directory).forEach((file) => {
    const sourceDir = join(directory, file).replace(/\\/g, "/"); // Corrected backslash replacement
    const relativePath = relative(SOURCE_DIR, sourceDir);

    if (statSync(sourceDir).isDirectory()) {
      // Ensure the corresponding directory structure exists in the destination
      const distDirectory = join(DIST_DIR, relativePath);
      mkdirSync(distDirectory, { recursive: true });

      return copyFiles(sourceDir);
    } else {
      if (extname(sourceDir) === ".graphql") {
        const distDir = join(DIST_DIR, relativePath);
        writeFileSync(distDir, readFileSync(sourceDir, "utf-8"));
      }
    }
  });
};

copyFiles(SOURCE_DIR);
