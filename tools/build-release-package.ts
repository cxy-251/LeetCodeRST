import fs from "node:fs/promises";
import path from "node:path";

import {buildReleasePackage} from "./lib/release-package";

const readPackageVersion = async (root: string) => {
  const packageJsonPath = path.join(root, "package.json");
  const packageJson = JSON.parse(await fs.readFile(packageJsonPath, "utf-8")) as {
    version?: string;
  };

  return packageJson.version ?? "0.1.0";
};

const readArgValue = (args: string[], flag: string) => {
  const index = args.indexOf(flag);
  if (index === -1) {
    return null;
  }

  return args[index + 1] ?? null;
};

const main = async () => {
  const root = path.resolve(".");
  const args = process.argv.slice(2);
  const versionOverride = readArgValue(args, "--version");
  const outputDirName = readArgValue(args, "--output-dir") ?? "release";
  const version = versionOverride ?? (await readPackageVersion(root));

  const result = await buildReleasePackage(root, version, outputDirName);

  console.log("Release package is ready.");
  console.log("");
  console.log(`Release name: ${result.releaseName}`);
  console.log(`Staged directory: ${path.relative(root, result.releaseDir)}`);
  console.log(`Tracked files copied: ${result.fileCount}`);

  if (result.zipPath) {
    console.log(`Zip archive: ${path.relative(root, result.zipPath)}`);
  } else {
    console.log("Zip archive: skipped (zip command unavailable)");
  }

  console.log("");
  console.log("Recommended next steps:");
  console.log(`1. Inspect: ${path.relative(root, result.releaseDir)}`);
  console.log("2. Deliver the zip archive if present, otherwise deliver the staged folder");
  console.log("3. Keep .git history private unless you intentionally want to share commit history");
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
