import fs from "node:fs/promises";
import path from "node:path";

type AnalysisBundle = {
  papers: Array<{
    arxivId: string;
  }>;
};

const DEFAULT_ANALYSIS_PATH = path.resolve("data/source-bundles/latest-ai-analysis.json");
const DEFAULT_OUTPUT_PATH = path.resolve("data/video-batches/generated/latest-ai-batch.csv");

const parseArgs = (args: string[]) => {
  const take = (flag: string) => {
    const index = args.indexOf(flag);
    return index >= 0 ? args[index + 1] : undefined;
  };

  return {
    input: take("--input") ? path.resolve(take("--input") as string) : DEFAULT_ANALYSIS_PATH,
    output: take("--output") ? path.resolve(take("--output") as string) : DEFAULT_OUTPUT_PATH,
    effectCycle: (take("--effect-cycle") ?? "life-game").split(",").map((item) => item.trim()).filter(Boolean),
    voiceName: take("--voice-name") ?? "zh-CN-XiaoxiaoNeural",
    voiceRate: take("--voice-rate") ?? "+80%",
    voicePitch: take("--voice-pitch") ?? "+0Hz",
    seedStart: Number.parseInt(take("--seed-start") ?? "100", 10),
  };
};

const toProfileId = (arxivId: string) => `arxiv-${arxivId.replace(/[^\w]+/g, "-").toLowerCase()}`;

const toManifestPath = (profileId: string) => `data/manifests/ingest/${profileId}.json`;

const main = async () => {
  const options = parseArgs(process.argv.slice(2));
  const raw = await fs.readFile(options.input, "utf-8");
  const bundle = JSON.parse(raw) as AnalysisBundle;

  const headers = [
    "enabled",
    "row_id",
    "project_id",
    "content_profile_id",
    "cover_profile_id",
    "effect_profile_id",
    "seed",
    "voice_name",
    "voice_rate",
    "voice_pitch",
    "base_manifest_path",
  ];

  const lines = [
    `# ${headers.join(",")}`,
    ...bundle.papers.map((paper, index) => {
      const profileId = toProfileId(paper.arxivId);
      const effectProfileId = options.effectCycle[index % options.effectCycle.length] ?? "life-game";
      return [
        "true",
        paper.arxivId,
        "",
        profileId,
        "",
        effectProfileId,
        String(options.seedStart + index),
        options.voiceName,
        options.voiceRate,
        options.voicePitch,
        toManifestPath(profileId),
      ].join(",");
    }),
  ];

  await fs.mkdir(path.dirname(options.output), {recursive: true});
  await fs.writeFile(options.output, `${lines.join("\n")}\n`, "utf-8");

  console.log(`Video batch config written to ${options.output}`);
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
