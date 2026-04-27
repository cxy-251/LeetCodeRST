import fs from "node:fs/promises";
import path from "node:path";
import {slugify} from "./run-artifacts";
import type {
  ContentProfileDocument,
  ContentProfileRegistryDocument,
  ProductionManifest,
  WebGLEffectProfileId,
} from "@paper-to-video/shared-types";

const DEFAULT_BASE_MANIFEST = path.resolve("data/manifests/demo-paper.json");
const DEFAULT_CONTENT_PROFILE_REGISTRY = path.resolve("data/content-profiles/index.json");

export type CreateManifestOptions = {
  baseManifestPath?: string;
  projectId?: string;
  seed?: number;
  contentProfileId: string;
  coverProfileId?: string;
  effectProfileId: WebGLEffectProfileId;
};

const resolveContentProfileDocument = async (contentProfileId: string) => {
  const registryRaw = await fs.readFile(DEFAULT_CONTENT_PROFILE_REGISTRY, "utf-8");
  const registry = JSON.parse(registryRaw) as ContentProfileRegistryDocument;
  const registryEntry = registry.profiles.find((item) => item.id === contentProfileId);

  const candidatePaths = [
    registryEntry?.path ? path.resolve(registryEntry.path) : null,
    path.resolve("data/content-profiles/generated", `${contentProfileId}.json`),
  ].filter(Boolean) as string[];

  for (const candidatePath of candidatePaths) {
    try {
      const raw = await fs.readFile(candidatePath, "utf-8");
      return JSON.parse(raw) as ContentProfileDocument;
    } catch {
      continue;
    }
  }

  return null;
};

export const buildProfileDrivenManifest = async ({
  baseManifestPath = DEFAULT_BASE_MANIFEST,
  projectId,
  seed,
  contentProfileId,
  coverProfileId,
  effectProfileId,
}: CreateManifestOptions): Promise<ProductionManifest> => {
  const raw = await fs.readFile(baseManifestPath, "utf-8");
  const baseManifest = JSON.parse(raw) as ProductionManifest;
  const contentProfileDocument = await resolveContentProfileDocument(contentProfileId);

  const resolvedProjectId =
    projectId ?? slugify(`${contentProfileId}-${coverProfileId ?? "cover-local"}-${effectProfileId}`);

  const nextManifest: ProductionManifest = {
    ...baseManifest,
    projectId: resolvedProjectId,
    seed: seed ?? baseManifest.seed,
    contentProfile: {
      id: contentProfileId,
    },
    paper: {
      ...baseManifest.paper,
      ...(contentProfileDocument?.paper ?? {}),
    },
    effectProfile: {
      id: effectProfileId,
    },
  };

  if (coverProfileId) {
    nextManifest.coverProfile = {
      id: coverProfileId,
    };
    delete nextManifest.coverImage;
  }

  return nextManifest;
};
