import React from "react";
import type {RenderManifest} from "@paper-to-video/shared-types";
import {PaperVideo} from "./Root";

type VideoProps = {
  manifest: RenderManifest;
};

export const Video: React.FC<VideoProps> = (props) => {
  return <PaperVideo manifest={props.manifest} />;
};
