import path from "node:path";
import {spawn} from "node:child_process";
import {
  buildPaperUrlBatchPaths,
  makePaperUrlBatchId,
  readPaperUrlCsvRecords,
  writePaperUrlCsvRecords,
} from "./lib/paper-url-batch";
import {
  resolveDonutBatchBaseSeed,
  writeDonutBatchCsv,
  writeDonutBatchManifests,
} from "./lib/donut-batch";

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

  const paperUrlCsv = take("--paper-url-csv");
  if (!paperUrlCsv) {
    throw new Error("Missing required argument: --paper-url-csv <csv-file>");
  }

  return {
    paperUrlCsv: path.resolve(paperUrlCsv),
    summaryMode: take("--summary-mode") ?? "lm-studio",
    lmStudioBaseUrl: take("--lm-studio-base-url"),
    lmStudioModel: take("--lm-studio-model"),
    lmStudioApiKey: take("--lm-studio-api-key"),
    lmStudioTemperature: take("--lm-studio-temperature"),
    lmStudioMaxOutputTokens: take("--lm-studio-max-output-tokens"),
    batchId: take("--batch-id"),
    seed: take("--seed") ? Number.parseInt(take("--seed") as string, 10) : undefined,
    voiceName: take("--voice-name") ?? "zh-CN-XiaoxiaoNeural",
    voiceRate: take("--voice-rate") ?? "+80%",
    voicePitch: take("--voice-pitch") ?? "+0Hz",
  };
};

const toProfileId = (arxivId: string) => `arxiv-${arxivId.replace(/[^\w]+/g, "-").toLowerCase()}`;

const main = async () => {
  const options = parseArgs(process.argv.slice(2));
  const paperRecords = await readPaperUrlCsvRecords(options.paperUrlCsv);
  const unprocessedRecords = paperRecords.filter((record) => record.status !== "processed");
  const paperUrls = unprocessedRecords.map((record) => record.paperUrl);

  if (paperUrls.length === 0) {
    throw new Error("The CSV file did not contain any unprocessed paper URLs.");
  }

  const batchId = options.batchId ?? makePaperUrlBatchId("paper-url-donut-batch");
  const baseSeed = resolveDonutBatchBaseSeed({
    batchId,
    explicitSeed: options.seed,
  });
  const paths = buildPaperUrlBatchPaths(batchId);

  const fetchedRaw = await runWithCapture("node", [
    "--import",
    "tsx",
    "tools/fetch-arxiv-ai.ts",
    ...paperUrls.flatMap((paperUrl) => ["--paper-url", paperUrl]),
    "--download-pdf",
  ]);
  const fetchedPapers = JSON.parse(fetchedRaw) as FetchedPaper[];
  const fetchedIds = fetchedPapers.map((paper) => paper.arxivId).join(",");

  for (const paper of fetchedPapers) {
    if (!paper.localPdfPath) {
      continue;
    }

    const inputPdf = path.resolve(paper.localPdfPath);
    const outputText = path.join(path.dirname(inputPdf), "source.txt");
    await run("node", [
      "--import",
      "tsx",
      "tools/extract-pdf-text.ts",
      "--input-pdf",
      inputPdf,
      "--output-text",
      outputText,
    ]).catch(async () => {
      return;
    });
  }

  await run("node", [
    "--import",
    "tsx",
    "tools/build-source-bundle.ts",
    "--paper-ids",
    fetchedIds,
    "--output",
    paths.sourceBundlePath,
    "--cover-selection-mode",
    "none",
    "--seed",
    String(options.seed),
  ]);

  await run("node", [
    "--import",
    "tsx",
    "tools/analyze-paper-sources.ts",
    "--input",
    paths.sourceBundlePath,
    "--output",
    paths.analysisBundlePath,
    "--summary-mode",
    options.summaryMode,
    ...(options.lmStudioBaseUrl ? ["--lm-studio-base-url", options.lmStudioBaseUrl] : []),
    ...(options.lmStudioModel ? ["--lm-studio-model", options.lmStudioModel] : []),
    ...(options.lmStudioApiKey ? ["--lm-studio-api-key", options.lmStudioApiKey] : []),
    ...(options.lmStudioTemperature ? ["--lm-studio-temperature", options.lmStudioTemperature] : []),
    ...(options.lmStudioMaxOutputTokens ? ["--lm-studio-max-output-tokens", options.lmStudioMaxOutputTokens] : []),
  ]);

  await run("node", [
    "--import",
    "tsx",
    "tools/scaffold-paper-manifests.ts",
    "--input",
    paths.analysisBundlePath,
    "--output-dir",
    paths.manifestDir,
  ]);

  const rows = fetchedPapers.map((paper, index) => ({
    rowId: paper.arxivId,
    contentProfileId: toProfileId(paper.arxivId),
    seed: baseSeed + index * 101,
  }));

  await writeDonutBatchManifests({
    manifestDir: paths.manifestDir,
    rows,
  });

  await writeDonutBatchCsv({
    outputPath: paths.batchCsvPath,
    manifestDir: paths.manifestDir,
    rows,
    voiceName: options.voiceName,
    voiceRate: options.voiceRate,
    voicePitch: options.voicePitch,
  });

  await run("node", [
    "--import",
    "tsx",
    "tools/produce-video.ts",
    "--batch-config",
    paths.batchCsvPath,
  ]);

  const processedUrlSet = new Set(paperUrls);
  const updatedRecords = paperRecords.map((record) =>
    processedUrlSet.has(record.paperUrl)
      ? {
          ...record,
          status: "processed" as const,
        }
      : record,
  );

  await writePaperUrlCsvRecords({
    filePath: options.paperUrlCsv,
    records: updatedRecords,
  });
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
