
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectDir = path.resolve(scriptDir, "..");

const publicDir = path.join(projectDir, "public");
const sourceIcon = path.join(publicDir, "favicon.svg");

async function generateIcons() {
  await mkdir(publicDir, { recursive: true });

  const sizes = [192, 512];

  for (const size of sizes) {
    const outputPath = path.join(
      publicDir,
      `pwa-${size}x${size}.png`
    );

    await sharp(sourceIcon)
      .resize(size, size, {
        fit: "contain",
        background: "#0f172a",
      })
      .png()
      .toFile(outputPath);

    console.log(`Created: public/pwa-${size}x${size}.png`);
  }

  console.log("Spendly PWA icons generated successfully!");
}

generateIcons().catch((error) => {
  console.error("Failed to generate PWA icons:", error);
  process.exitCode = 1;
});
