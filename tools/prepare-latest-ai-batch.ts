import fs from "node:fs/promises";
import path from "node:path";
import {spawn} from "node:child_process";

type FetchedPaper = {
  arxivId: string;
  localPdfPath?: string;
};

const run = (command: string, args: string[]) =>
  new Promise<void>((resolve, reject) => {
    const child = spawn(command, args, {stdio: "inherit"});
    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`${command} exited with code ${code ?? "unknown"}`));
    });
    child.on("error", reject);
  });

const runWithCapture = (command: string, args: string[]) =>
  new Promise<string>((resolve, reject) => {
    const child = spawn(command, args, {stdio: ["ignore", "pipe", "inherit"]});
    let stdout = "";

    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });

    child.on("exit", (code) => {
      if (code === 0) {
        resolve(stdout.trim());
        return;
      }

      reject(new Error(`${command} exited with code ${code ?? "unknown"}`));
    });

    child.on("error", reject);
  });

const parseArgs = (args: string[]) => {
  const take = (flag: string) => {
    const index = args.indexOf(flag);
    return index >= 0 ? args[index + 1] : undefined;
  };

  return {
    category: take("--category") ?? "cs.AI",
    limit: Number.parseInt(take("--limit") ?? "3", 10),
    batchOutput: take("--batch-output")
      ? path.resolve(take("--batch-output") as string)
      : path.resolve("data/video-batches/generated/latest-ai-batch.csv"),
    effectCycle: take("--effect-cycle") ?? "life-game,snake-grid,particle-orbit,rubiks-solver",
  };
};

const main = async () => {
  const options = parseArgs(process.argv.slice(2));

  const fetchedRaw = await runWithCapture("node", [
    "--import",
    "tsx",
    "tools/fetch-arxiv-ai.ts",
    "--category",
    options.category,
    "--limit",
    String(options.limit),
    "--download-pdf",
  ]);
  const fetchedPapers = JSON.parse(fetchedRaw) as FetchedPaper[];

  for (const paper of fetchedPapers) {
    if (!paper.localPdfPath) {
      continue;
    }

    const inputPdf = path.resolve(paper.localPdfPath);
    const outputText = path.join(path.dirname(inputPdf), "source.txt");

    try {
      await fs.access(outputText);
    } catch {
      await run("node", [
        "--import",
        "tsx",
        "tools/extract-pdf-text.ts",
        "--input-pdf",
        inputPdf,
        "--output-text",
        outputText,
      ]);
    }
  }

  const fetchedIds = fetchedPapers.map((paper) => paper.arxivId).join(",");
  await run("node", [
    "--import",
    "tsx",
    "tools/build-source-bundle.ts",
    "--paper-ids",
    fetchedIds,
  ]);
  await run("node", ["--import", "tsx", "tools/analyze-paper-sources.ts"]);
  await run("node", ["--import", "tsx", "tools/scaffold-paper-manifests.ts"]);
  await run("node", [
    "--import",
    "tsx",
    "tools/build-video-batch.ts",
    "--output",
    options.batchOutput,
    "--effect-cycle",
    options.effectCycle,
  ]);
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
