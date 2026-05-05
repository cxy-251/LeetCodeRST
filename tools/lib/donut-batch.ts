import fs from "node:fs/promises";
import path from "node:path";
import type {DonutEffectConfig, ProductionManifest} from "@paper-to-video/shared-types";
import type {VideoBatchRow} from "./video-batch";

const createSeededRandom = (seed: number) => {
  let value = seed % 2147483647;
  if (value <= 0) {
    value += 2147483646;
  }

  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
};

const pick = <T,>(items: readonly T[], random: () => number) =>
  items[Math.floor(random() * items.length)] ?? items[0];

const range = (random: () => number, min: number, max: number) => min + (max - min) * random();

const round = (value: number, digits = 2) => Number.parseFloat(value.toFixed(digits));

const DONUT_PALETTES: Array<Pick<DonutEffectConfig, "primaryColor" | "secondaryColor" | "accentColor">> = [
  {
    primaryColor: "#ff9fcf",
    secondaryColor: "#79e6ff",
    accentColor: "#ffd576",
  },
  {
    primaryColor: "#8ddfff",
    secondaryColor: "#ff9fd8",
    accentColor: "#ffe58d",
  },
  {
    primaryColor: "#b8a6ff",
    secondaryColor: "#86f2ff",
    accentColor: "#ffc98b",
  },
  {
    primaryColor: "#ffa9a0",
    secondaryColor: "#8fd8ff",
    accentColor: "#d9ff8a",
  },
];

export const buildRandomDonutEffectConfig = (seed: number): Partial<DonutEffectConfig> => {
  const random = createSeededRandom(seed * 97 + 13);
  const palette = pick(DONUT_PALETTES, random);
  const variant = pick(["classic", "arcade", "cosmic"] as const, random);

  return {
    variant,
    ringRadius: round(range(random, 1.08, 1.28)),
    tubeRadius: round(range(random, 0.28, 0.38)),
    spinSpeed: round(range(random, 0.76, 1.28)),
    orbitSpeed: round(range(random, 0.72, 1.18)),
    wobbleAmount: round(range(random, 0.16, 0.36)),
    pearlCount: Math.max(4, Math.min(10, Math.round(range(random, 4, 10)))),
    glowIntensity: round(range(random, 0.14, 0.34)),
    ...palette,
  };
};

export const applyDonutBatchPreset = ({
  manifest,
  seed,
}: {
  manifest: ProductionManifest;
  seed: number;
}): ProductionManifest => {
  const donutEffect = buildRandomDonutEffectConfig(seed);

  return {
    ...manifest,
    effectProfile: {
      id: "donut-spin",
    },
    coverImage: undefined,
    coverProfile: undefined,
    modules: {
      ...manifest.modules,
      donutEffect: {
        ...manifest.modules?.donutEffect,
        ...donutEffect,
      },
    },
    scenes: manifest.scenes.map((scene) => ({
      ...scene,
      backgroundImageLayoutId: "gradient-default",
      backgroundEffectId: "donut-spin",
    })),
  };
};

export const writeDonutBatchManifests = async ({
  manifestDir,
  rows,
}: {
  manifestDir: string;
  rows: Array<Pick<VideoBatchRow, "contentProfileId" | "rowId" | "seed">>;
}) => {
  const updatedPaths: string[] = [];

  for (const [index, row] of rows.entries()) {
    const profileId = row.contentProfileId;
    const seed = row.seed ?? 100 + index;
    const manifestPath = path.join(manifestDir, `${profileId}.json`);
    const raw = await fs.readFile(manifestPath, "utf-8");
    const manifest = JSON.parse(raw) as ProductionManifest;
    const nextManifest = applyDonutBatchPreset({manifest, seed});
    await fs.writeFile(manifestPath, JSON.stringify(nextManifest, null, 2), "utf-8");
    updatedPaths.push(manifestPath);
  }

  return updatedPaths;
};

export const writeDonutBatchCsv = async ({
  outputPath,
  manifestDir,
  rows,
  voiceName,
  voiceRate,
  voicePitch,
}: {
  outputPath: string;
  manifestDir: string;
  rows: Array<{
    rowId: string;
    contentProfileId: string;
    seed: number;
  }>;
  voiceName: string;
  voiceRate: string;
  voicePitch: string;
}) => {
  const headers = [
    "enabled",
    "row_id",
    "content_profile_id",
    "cover_image_path",
    "cover_profile_id",
    "effect_profile_id",
    "project_id",
    "cover_image_source",
    "seed",
    "voice_name",
    "voice_rate",
    "voice_pitch",
    "base_manifest_path",
  ];

  const lines = [
    `# ${headers.join(",")}`,
    ...rows.map((row) =>
      [
        "true",
        row.rowId,
        row.contentProfileId,
        "",
        "",
        "donut-spin",
        "",
        "",
        String(row.seed),
        voiceName,
        voiceRate,
        voicePitch,
        path.relative(path.resolve("."), path.join(manifestDir, `${row.contentProfileId}.json`)),
      ].join(","),
    ),
  ];

  await fs.mkdir(path.dirname(outputPath), {recursive: true});
  await fs.writeFile(outputPath, `${lines.join("\n")}\n`, "utf-8");
};
