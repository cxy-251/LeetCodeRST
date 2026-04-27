import React from "react";
import {AbsoluteFill, Audio, Img, Sequence, staticFile, useCurrentFrame, useVideoConfig} from "remotion";
import {
  EffectRuntimeAdapter,
  getCoverLayoutConfig,
  getCellularLaunchOrigin,
  getInterpolatedCoverLayoutConfig,
  getSceneVisualIds,
  getThemePalette,
  getTextMotionState,
  resolveBackgroundMotionConfig,
  resolveLifeGameActivationFrame,
  resolveTextMotionConfig,
} from "@paper-to-video/content-pipeline";
import {renderTemplateZone} from "@paper-to-video/timeline-engine";
import type {
  AudioAsset,
  BackgroundEffectId,
  BackgroundImageLayoutId,
  CoverImageAsset,
  RenderManifest,
  RenderScene,
  SubtitleSegment,
} from "@paper-to-video/shared-types";

const findSubtitle = (segments: SubtitleSegment[], frame: number) =>
  segments.find((segment) => frame >= segment.startFrame && frame < segment.endFrame);

const resolveCoverImageSrc = (coverImage?: CoverImageAsset) => {
  if (!coverImage?.path) {
    return null;
  }

  return coverImage.source === "remote" ? coverImage.path : staticFile(coverImage.path);
};

const BackgroundImageLayer: React.FC<{
  coverSrc: string | null;
  fromLayoutId: BackgroundImageLayoutId;
  toLayoutId: BackgroundImageLayoutId;
  progress: number;
  overscanPercent: number;
  panTravelPercent: number;
}> = ({coverSrc, fromLayoutId, toLayoutId, progress, overscanPercent, panTravelPercent}) => {
  if (!coverSrc || toLayoutId === "gradient-default") {
    return null;
  }

  const config =
    fromLayoutId === toLayoutId
      ? getCoverLayoutConfig(toLayoutId, panTravelPercent)
      : getInterpolatedCoverLayoutConfig({fromLayoutId, toLayoutId, progress, panTravelPercent});
  const overscan = `${100 + overscanPercent}%`;
  const offset = `${-(overscanPercent / 2)}%`;
  return (
    <AbsoluteFill style={{overflow: "hidden"}}>
      <Img
        src={coverSrc}
        style={{
          width: overscan,
          height: overscan,
          left: offset,
          top: offset,
          position: "absolute",
          objectFit: "cover",
          objectPosition: "center center",
          opacity: config.opacity,
          filter: `blur(${config.blurPx}px) saturate(${config.saturation}) brightness(${config.brightness})`,
          transform: `translate(${config.translateX}%, ${config.translateY}%) scale(${config.scale})`,
        }}
      />
      <AbsoluteFill style={{background: config.shade}} />
    </AbsoluteFill>
  );
};

const BackgroundEffectLayer: React.FC<{
  effectId: BackgroundEffectId;
  sceneFrame: number;
  absoluteFrame: number;
  activationFrame: number;
  themeId: string;
  seed: number;
  modules?: RenderManifest["modules"];
}> = ({effectId, sceneFrame, absoluteFrame, activationFrame, themeId, seed, modules}) => {
  const palette = getThemePalette(themeId);
  const {width, height} = useVideoConfig();
  if (effectId === "cellular-life" || effectId === "cellular-launch" || effectId === "snake-grid") {
    return (
      <EffectRuntimeAdapter
        absoluteFrame={absoluteFrame}
        activationFrame={activationFrame}
        effectId={effectId}
        height={height}
        mode="render"
        modules={modules}
        seed={seed}
        width={width}
      />
    );
  }

  if (effectId === "grid-drift") {
    return (
      <AbsoluteFill
        style={{
          opacity: 0.38,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(87,216,196,0.14) 0%, transparent 40%, rgba(255,255,255,0.08) 100%)
          `,
          backgroundSize: "44px 44px, 44px 44px, 100% 100%",
          backgroundPosition: `${(sceneFrame * 0.8) % 44}px ${(sceneFrame * 0.3) % 44}px, ${(sceneFrame * 0.8) % 44}px ${(sceneFrame * 0.3) % 44}px, 0 0`,
        }}
      />
    );
  }

  if (effectId === "noise-bloom") {
    return (
      <AbsoluteFill
        style={{
          opacity: 0.92,
          background: `
            radial-gradient(circle at ${22 + (sceneFrame % 24)}% 24%, rgba(87,216,196,0.18) 0%, transparent 24%),
            radial-gradient(circle at 80% ${68 + (sceneFrame % 16) * 0.4}%, rgba(255,255,255,0.12) 0%, transparent 18%)
          `,
        }}
      />
    );
  }

  if (effectId === "aurora") {
    return (
      <AbsoluteFill
        style={{
          background: `
            radial-gradient(circle at 18% 22%, ${palette.accent}22 0%, transparent 22%),
            radial-gradient(circle at 82% 76%, rgba(255,255,255,0.10) 0%, transparent 18%)
          `,
        }}
      />
    );
  }

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0))",
        opacity: 0.8,
      }}
    />
  );
};

const Background: React.FC<{
  themeId: string;
  sceneFrame: number;
  absoluteFrame: number;
  scene: RenderScene;
  previousLayoutId: BackgroundImageLayoutId;
  activationFrame: number;
  coverImage?: CoverImageAsset;
  seed: number;
  modules?: RenderManifest["modules"];
}> = ({themeId, sceneFrame, absoluteFrame, scene, previousLayoutId, activationFrame, coverImage, seed, modules}) => {
  const palette = getThemePalette(themeId);
  const glowX = 15 + (sceneFrame % 160) * 0.38;
  const glowY = 18 + (sceneFrame % 220) * 0.18;
  const accentAlpha = sceneFrame % 120 < 60 ? "88" : "66";
  const coverSrc = resolveCoverImageSrc(coverImage);
  const {backgroundImageLayoutId, backgroundEffectId} = getSceneVisualIds(scene);
  const usesCoverImage = backgroundImageLayoutId !== "gradient-default";
  const motionProgress = Math.min(1, Math.max(0, sceneFrame / Math.max(1, scene.durationInFrames - 1)));
  const backgroundMotion = resolveBackgroundMotionConfig(modules);

  return (
    <AbsoluteFill
      style={{
        background:
          usesCoverImage
            ? "linear-gradient(180deg, #050c13 0%, #071019 100%)"
            : `
                linear-gradient(115deg, rgba(255,255,255,0.04) 0%, transparent 30%),
                radial-gradient(circle at ${glowX}% ${glowY}%, ${palette.accent}${accentAlpha} 0%, transparent 24%),
                radial-gradient(circle at 78% 82%, rgba(255,255,255,0.06) 0%, transparent 18%),
                linear-gradient(135deg, ${palette.bg}, #10253a 48%, #081018)
              `,
      }}
    >
      <BackgroundImageLayer
        coverSrc={coverSrc}
        fromLayoutId={previousLayoutId}
        toLayoutId={backgroundImageLayoutId}
        progress={motionProgress}
        overscanPercent={backgroundMotion.overscanPercent}
        panTravelPercent={backgroundMotion.panTravelPercent}
      />
      <BackgroundEffectLayer
        effectId={backgroundEffectId}
        sceneFrame={sceneFrame}
        absoluteFrame={absoluteFrame}
        activationFrame={activationFrame}
        themeId={themeId}
        seed={seed}
        modules={modules}
      />
    </AbsoluteFill>
  );
};

const SceneCard: React.FC<{
  scene: RenderScene;
  manifest: RenderManifest;
}> = ({scene, manifest}) => {
  const localFrame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const theme = getThemePalette(manifest.theme.id);
  const sceneFrame = localFrame;
  const absoluteFrame = scene.fromFrame + localFrame;
  const textMotion = resolveTextMotionConfig(scene.motionPresetId, manifest.modules);
  const subtitle = findSubtitle(
    manifest.subtitleSegments.filter((segment) => segment.sceneId === scene.id),
    absoluteFrame,
  );
  const coverSrc = resolveCoverImageSrc(manifest.coverImage);
  const isHero = scene.type === "hero";
  const sceneIndex = manifest.scenes.findIndex((item) => item.id === scene.id);
  const previousScene = sceneIndex > 0 ? manifest.scenes[sceneIndex - 1] : null;
  const previousLayoutId = previousScene
    ? getSceneVisualIds(previousScene).backgroundImageLayoutId
    : "cover-full";
  const activationFrame = resolveLifeGameActivationFrame(manifest);
  const primaryNodes = renderTemplateZone({
    zone: "primary",
    context: {
      manifest,
      scene,
      coverSrc,
      subtitleText: subtitle?.text ?? null,
    },
  });
  const secondaryNodes = renderTemplateZone({
    zone: "secondary",
    context: {
      manifest,
      scene,
      coverSrc,
      subtitleText: subtitle?.text ?? null,
    },
  });

  return (
    <AbsoluteFill>
      <Background
        themeId={manifest.theme.id}
        sceneFrame={sceneFrame}
        absoluteFrame={absoluteFrame}
        scene={scene}
        previousLayoutId={previousLayoutId}
        activationFrame={activationFrame}
        coverImage={manifest.coverImage}
        seed={manifest.seed}
        modules={manifest.modules}
      />
      <AbsoluteFill
        style={{
          padding: 72,
          color: theme.fg,
          justifyContent: "space-between",
          fontFamily: "PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 24,
            marginTop: 60,
          }}
        >
          {primaryNodes.map((node, index) => {
            const state = getTextMotionState({
              frame: sceneFrame,
              durationInFrames: scene.durationInFrames,
              delayFrames: index === 0 ? 0 : textMotion.bodyDelayFrames + (index - 1) * textMotion.bulletsStaggerFrames,
              config: textMotion,
            });

            return (
              <div
                key={`primary-node-${index}`}
                style={{
                  opacity: state.opacity,
                  transform: `translateY(${state.translateY}px)`,
                }}
              >
                {node}
              </div>
            );
          })}
        </div>
        {secondaryNodes.length > 0 ? secondaryNodes[0] : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const SceneAudio: React.FC<{audioAssets: AudioAsset[]; scenes: RenderScene[]}> = ({
  audioAssets,
  scenes,
}) => {
  const playableAssets = audioAssets.filter((asset) => asset.filePath);

  return (
    <>
      {playableAssets.map((asset) => (
        <Sequence
          key={asset.id}
          from={
            (scenes.find((scene) => scene.id === asset.sceneId)?.fromFrame ?? 0) +
            (scenes.find((scene) => scene.id === asset.sceneId)?.timing.audioOffsetFrames ?? 0)
          }
        >
          <Audio src={staticFile(asset.filePath)} />
        </Sequence>
      ))}
    </>
  );
};

export const PaperVideo: React.FC<{manifest: RenderManifest}> = ({manifest}) => {
  return (
    <AbsoluteFill style={{backgroundColor: "#050a10"}}>
      {manifest.audioAssets.some((asset) => asset.filePath) ? (
        <SceneAudio audioAssets={manifest.audioAssets} scenes={manifest.scenes} />
      ) : null}
      {manifest.scenes.map((scene) => (
        <Sequence key={scene.id} from={scene.fromFrame} durationInFrames={scene.durationInFrames}>
          <SceneCard scene={scene} manifest={manifest} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
