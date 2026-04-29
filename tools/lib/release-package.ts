import fs from "node:fs/promises";
import path from "node:path";
import {spawnSync} from "node:child_process";

export interface ReleasePackageResult {
  releaseName: string;
  releaseRoot: string;
  releaseDir: string;
  zipPath: string | null;
  fileCount: number;
}

const SKIP_PREFIXES = [".git/", "node_modules/", "output/", "release/"];
const SKIP_EXACT = new Set([".env"]);

const shouldSkipTrackedPath = (trackedPath: string) => {
  if (!trackedPath || SKIP_EXACT.has(trackedPath)) {
    return true;
  }

  return SKIP_PREFIXES.some((prefix) => trackedPath.startsWith(prefix));
};

const ensureDir = async (targetPath: string) => {
  await fs.mkdir(targetPath, {recursive: true});
};

const removeIfExists = async (targetPath: string) => {
  await fs.rm(targetPath, {recursive: true, force: true});
};

const readTrackedFiles = (root: string) => {
  const result = spawnSync("git", ["ls-files"], {
    cwd: root,
    encoding: "utf-8",
  });

  if (result.status !== 0) {
    throw new Error(result.stderr.trim() || "Failed to read tracked files with git ls-files.");
  }

  return result.stdout
    .split("\n")
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0)
    .filter((entry) => !shouldSkipTrackedPath(entry));
};

const copyTrackedFiles = async (root: string, destinationRoot: string, trackedFiles: string[]) => {
  for (const trackedFile of trackedFiles) {
    const sourcePath = path.join(root, trackedFile);
    const targetPath = path.join(destinationRoot, trackedFile);

    await ensureDir(path.dirname(targetPath));
    await fs.copyFile(sourcePath, targetPath);
  }
};

const writeReleaseReadme = async (destinationRoot: string, releaseName: string) => {
  const readmePath = path.join(destinationRoot, "RELEASE_PACKAGE.md");
  const content = `# Release Package

This directory is a packaged snapshot of the PaperToVideo project.

## Included

- Source code tracked by git
- Deployment docs
- Docker configuration
- Example data and manifests tracked in the repository

## Excluded

- \`.git/\`
- \`node_modules/\`
- \`output/\`
- local-only \`.env\`
- untracked local assets

## Recommended first steps

1. Run \`npm install\`
2. Run \`npm run init:deployment\`
3. Review \`.env\`
4. Read \`docs/docker-deployment.md\`
5. Read \`docs/video-production-manual.md\`

Package name: \`${releaseName}\`
`;

  await fs.writeFile(readmePath, content, "utf-8");
};

const tryCreateZip = (releaseRoot: string, releaseName: string) => {
  const result = spawnSync("zip", ["-qr", `${releaseName}.zip`, releaseName], {
    cwd: releaseRoot,
    encoding: "utf-8",
  });

  if (result.status !== 0) {
    return null;
  }

  return path.join(releaseRoot, `${releaseName}.zip`);
};

export const buildReleasePackage = async (root: string, version: string, outputDirName = "release") => {
  const sanitizedVersion = version.replace(/[^0-9A-Za-z._-]/g, "-");
  const releaseName = `paper-to-video-${sanitizedVersion}`;
  const releaseRoot = path.join(root, outputDirName);
  const releaseDir = path.join(releaseRoot, releaseName);

  const trackedFiles = readTrackedFiles(root);

  await ensureDir(releaseRoot);
  await removeIfExists(releaseDir);
  await copyTrackedFiles(root, releaseDir, trackedFiles);
  await writeReleaseReadme(releaseDir, releaseName);

  const zipPath = tryCreateZip(releaseRoot, releaseName);

  return {
    releaseName,
    releaseRoot,
    releaseDir,
    zipPath,
    fileCount: trackedFiles.length,
  } satisfies ReleasePackageResult;
};
