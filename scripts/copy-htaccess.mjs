import { copyFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const sourcePath = resolve("public", ".htaccess");
const targetPath = resolve("out", ".htaccess");

async function main() {
  await mkdir(dirname(targetPath), { recursive: true });
  await copyFile(sourcePath, targetPath);
  console.log("Copied public/.htaccess to out/.htaccess");
}

main().catch((error) => {
  console.error("Failed to copy .htaccess after build", error);
  process.exitCode = 1;
});
