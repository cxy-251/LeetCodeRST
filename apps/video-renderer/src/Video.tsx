import React from "react";
import fs from "node:fs";
import path from "node:path";
import type {RenderManifest} from "@paper-to-video/shared-types";
import {PaperVideo} from "./Root";

type VideoProps = {
  manifest?: RenderManifest;
  manifestPath?: string;
};

const resolveManifest = (props: VideoProps): RenderManifest => {
  if (props.manifest) {
    return props.manifest;
  }

  if (props.manifestPath) {
    const absolutePath = path.resolve(props.manifestPath);
    const raw = fs.readFileSync(absolutePath, "utf-8");
    return JSON.parse(raw) as RenderManifest;
  }

  throw new Error("Either manifest or manifestPath must be provided");
};

export const Video: React.FC<VideoProps> = (props) => {
  const manifest = resolveManifest(props);
  return <PaperVideo manifest={manifest} />;
};
