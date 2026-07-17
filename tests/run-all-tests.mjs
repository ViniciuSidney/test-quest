import { readdir } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const testsDirectory = dirname(fileURLToPath(import.meta.url));
const files = (await readdir(testsDirectory))
  .filter((file) => file.endsWith(".test.mjs"))
  .sort();

let failed = 0;

for (const file of files) {
  console.log(`\n▶ ${file}`);
  const result = spawnSync(process.execPath, [join(testsDirectory, file)], {
    stdio: "inherit"
  });

  if (result.status !== 0) {
    failed += 1;
  }
}

if (failed > 0) {
  console.error(`\n${failed} arquivo(s) de teste falharam.`);
  process.exit(1);
}

console.log(`\n✓ ${files.length} arquivos de teste concluídos com sucesso.`);
