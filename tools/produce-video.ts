import path from "node:path";
import {spawn} from "node:child_process";
import {materializeBatchManifest, parseRowSelection, readVideoBatchRows} from "./lib/video-batch";

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

const parseArgs = (args: string[]) => {
  const take = (flag: string) => {
    const index = args.indexOf(flag);
    return index >= 0 ? args[index + 1] : undefined;
  };

  const mockMode = args.includes("--mock");
  const batchConfigPath = take("--batch-config");
  const rows = take("--rows");
  const batchManifestDir = take("--batch-manifests-dir");
  const positionalArgs = args.filter((arg, index) => {
    const isBatchConfigValue = batchConfigPath && index === args.indexOf("--batch-config") + 1;
    const isRowsValue = rows && index === args.indexOf("--rows") + 1;
    const isBatchDirValue =
      batchManifestDir && index === args.indexOf("--batch-manifests-dir") + 1;

    return arg !== "--mock" &&
      arg !== "--batch-config" &&
      arg !== "--rows" &&
      arg !== "--batch-manifests-dir" &&
      !isBatchConfigValue &&
      !isRowsValue &&
      !isBatchDirValue;
  });

  return {
    mockMode,
    batchConfigPath: batchConfigPath ? path.resolve(batchConfigPath) : undefined,
    rows,
    batchManifestDir: batchManifestDir
      ? path.resolve(batchManifestDir)
      : path.resolve("data/manifests/generated"),
    inputManifest: positionalArgs[0] ? path.resolve(positionalArgs[0]) : path.resolve("data/manifests/demo-paper.json"),
  };
};

const renderSingleManifest = async ({
  manifestPath,
  mockMode,
}: {
  manifestPath: string;
  mockMode: boolean;
}) => {
  await run("node", ["--import", "tsx", "tools/compose-manifest.ts", manifestPath]);
  await run("node", [
    "--import",
    "tsx",
    "tools/generate-audio.ts",
    ...(mockMode ? ["--mock"] : []),
  ]);
  await run("node", ["--import", "tsx", "tools/build-video.ts"]);
};

const main = async () => {
  const options = parseArgs(process.argv.slice(2));

  if (!options.batchConfigPath) {
    await renderSingleManifest({
      manifestPath: options.inputManifest,
      mockMode: options.mockMode,
    });
    return;
  }

  const rows = await readVideoBatchRows(options.batchConfigPath);
  const rowSelection = parseRowSelection(options.rows, rows.length);

  for (const row of rows) {
    if (!row.enabled) {
      continue;
    }

    if (rowSelection && !rowSelection.has(row.rowNumber)) {
      continue;
    }

    // We materialize manifests first so the user can inspect the exact input for each video.
    const {outputPath} = await materializeBatchManifest({
      row,
      outputDir: options.batchManifestDir,
    });

    await renderSingleManifest({
      manifestPath: outputPath,
      mockMode: options.mockMode,
    });
  }
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
