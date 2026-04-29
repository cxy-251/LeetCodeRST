import fs from "node:fs/promises";
import path from "node:path";

const ensureDir = async (targetPath: string) => {
  await fs.mkdir(targetPath, {recursive: true});
};

const copyIfMissing = async (sourcePath: string, targetPath: string) => {
  try {
    await fs.access(targetPath);
    return false;
  } catch {
    await fs.copyFile(sourcePath, targetPath);
    return true;
  }
};

const main = async () => {
  const root = path.resolve(".");
  const directories = [
    path.join(root, "output"),
    path.join(root, "public", "generated-audio"),
    path.join(root, "public", "generated-images"),
    path.join(root, "data", "images", "prepared"),
    path.join(root, "data", "source-bundles", "generated"),
    path.join(root, "data", "manifests", "generated"),
    path.join(root, "data", "video-batches", "generated"),
    path.join(root, "data", "content-profiles", "generated"),
  ];

  await Promise.all(directories.map((directory) => ensureDir(directory)));

  const envExamplePath = path.join(root, ".env.example");
  const envPath = path.join(root, ".env");
  const createdEnv = await copyIfMissing(envExamplePath, envPath);

  console.log("PaperToVideo deployment scaffold is ready.");
  console.log("");
  console.log("Prepared directories:");
  for (const directory of directories) {
    console.log(`- ${path.relative(root, directory)}`);
  }

  console.log("");
  console.log(createdEnv ? "Created .env from .env.example" : ".env already exists, kept as-is");

  console.log("");
  console.log("Recommended next steps:");
  console.log("1. Review .env and confirm LM_STUDIO_MODEL / LM_STUDIO_BASE_URL");
  console.log("2. Run: docker compose build");
  console.log("3. Run: docker compose up");
  console.log("4. Read: docs/docker-first-run-checklist.md");
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
