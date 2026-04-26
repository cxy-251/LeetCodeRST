import React from "react";
import {
  CoverAvatarAtom,
  SceneBodyAtom,
  SceneBulletsAtom,
  SceneKickerAtom,
  SceneTitleAtom,
  SubtitlePanelAtom,
} from "@paper-to-video/atomic-ui";
import {getSceneBody, getSceneBullets, getSceneTitle, getThemePalette} from "@paper-to-video/content-pipeline";
import type {
  AtomicComponentId,
  RenderManifest,
  RenderScene,
  TemplateNode,
  TemplateZoneId,
} from "@paper-to-video/shared-types";

export type TemplateRenderContext = {
  manifest: RenderManifest;
  scene: RenderScene;
  coverSrc: string | null;
  subtitleText: string | null;
};

const selectSceneTemplate = (manifest: RenderManifest, scene: RenderScene) => {
  return (
    manifest.templateDocument.sceneTemplates.find((item) => item.sceneType === scene.type) ??
    manifest.templateDocument.sceneTemplates.find((item) => item.sceneType === "default") ??
    null
  );
};

const componentRegistry: Record<
  AtomicComponentId,
  (node: TemplateNode, context: TemplateRenderContext) => React.ReactNode | null
> = {
  "cover-avatar": (_node, context) => {
    if (!context.coverSrc) {
      return null;
    }

    return <CoverAvatarAtom src={context.coverSrc} />;
  },
  "scene-kicker": (_node, context) => (
    <SceneKickerAtom
      text={`${context.manifest.paper.paperId} · AI Paper Digest`}
      color={getThemePalette(context.manifest.theme.id).accent}
    />
  ),
  "scene-title": (_node, context) => <SceneTitleAtom text={getSceneTitle(context.scene)} />,
  "scene-body": (_node, context) => {
    const text = getSceneBody(context.scene);
    return text ? <SceneBodyAtom text={text} /> : null;
  },
  "scene-bullets": (_node, context) => {
    const bullets = getSceneBullets(context.scene);
    return bullets.length > 0 ? <SceneBulletsAtom bullets={bullets} /> : null;
  },
  "subtitle-panel": (_node, context) => {
    if (!context.subtitleText) {
      return null;
    }

    const palette = getThemePalette(context.manifest.theme.id);
    return (
      <SubtitlePanelAtom
        text={context.subtitleText}
        panelColor={palette.panel}
        foreground={palette.fg}
      />
    );
  },
};

export const renderTemplateZone = ({
  zone,
  context,
}: {
  zone: TemplateZoneId;
  context: TemplateRenderContext;
}) => {
  const template = selectSceneTemplate(context.manifest, context.scene);
  if (!template) {
    return [];
  }

  return template.nodes
    .filter((node) => node.zone === zone)
    .map((node) => {
      const renderer = componentRegistry[node.componentId];
      if (!renderer) {
        return null;
      }

      const result = renderer(node, context);
      if (!result) {
        return null;
      }

      return <React.Fragment key={node.id}>{result}</React.Fragment>;
    })
    .filter(Boolean);
};
