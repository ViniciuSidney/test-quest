import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";

const root = process.cwd();
const mainCss = fs.readFileSync(path.join(root, "src/styles/main.css"), "utf8");
const shellCss = fs.readFileSync(path.join(root, "src/styles/layouts/app-shell.css"), "utf8");
const resolutionCss = fs.readFileSync(path.join(root, "src/styles/pages/resolution.css"), "utf8");
const resultsCss = fs.readFileSync(path.join(root, "src/styles/pages/results.css"), "utf8");

assert.match(mainCss, /layouts\/app-shell\.css/);
assert.match(shellCss, /--tq-app-max-width:\s*1880px/);
assert.match(shellCss, /calc\(100vw - var\(--tq-app-gutter\) - var\(--tq-app-gutter\)\)/);
assert.match(shellCss, /@media \(min-width: 1440px\)/);
assert.match(shellCss, /\.home-layout/);
assert.match(shellCss, /\.import-layout/);
assert.match(shellCss, /\.resolution-layout/);
assert.match(shellCss, /\.results-layout/);
assert.match(resolutionCss, /clamp\(300px, 28vw, 500px\)/);
assert.match(resultsCss, /clamp\(310px, 28vw, 480px\)/);

console.log("App shell: todos os testes passaram.");
