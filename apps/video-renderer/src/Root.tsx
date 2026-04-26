import React from "react";
import {AbsoluteFill, Audio, Img, Sequence, staticFile, useCurrentFrame, useVideoConfig} from "remotion";
import {
  buildCellularLifeCells,
  getCoverLayoutConfig,
  getCellularLaunchOrigin,
  getInterpolatedCoverLayoutConfig,
  getSceneBody,
  getSceneBullets,
  getSceneTitle,
  getSceneVisualIds,
  getThemePalette,
} from "@paper-to-video/content-pipeline";
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

const GameOfLifeEffect: React.FC<{
  absoluteFrame: number;
  activationFrame: number;
  width: number;
  height: number;
  seed: number;
}> = ({absoluteFrame, activationFrame, width, height, seed}) => {
  const cols = 18;
  const rows = 32;
  const cells = buildCellularLifeCells({
    cols,
    rows,
    globalFrame: absoluteFrame,
    activationFrame,
    seed,
  });
  const cellWidth = width / cols;
  const cellHeight = height / rows;

  return (
    <AbsoluteFill style={{pointerEvents: "none"}}>
      <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="100%" preserveAspectRatio="none">
        {cells.map((cell) => {
          const fill = cell.tone === 1 ? "rgba(87,216,196,0.42)" : "rgba(255,255,255,0.22)";
          const inset = cell.age >= 3 ? 5 : 3;
          return (
            <rect
              key={`${cell.x}-${cell.y}`}
              x={cell.x * cellWidth + inset}
              y={cell.y * cellHeight + inset}
              width={Math.max(4, cellWidth - inset * 2)}
              height={Math.max(4, cellHeight - inset * 2)}
              rx={Math.max(2, cell.age)}
              fill={fill}
            />
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

const BackgroundImageLayer: React.FC<{
  coverSrc: string | null;
  fromLayoutId: BackgroundImageLayoutId;
  toLayoutId: BackgroundImageLayoutId;
  progress: number;
}> = ({coverSrc, fromLayoutId, toLayoutId, progress}) => {
  if (!coverSrc || toLayoutId === "gradient-default") {
    return null;
  }

  const config =
    fromLayoutId === toLayoutId
      ? getCoverLayoutConfig(toLayoutId)
      : getInterpolatedCoverLayoutConfig({fromLayoutId, toLayoutId, progress});
  return (
    <AbsoluteFill style={{overflow: "hidden"}}>
      <Img
        src={coverSrc}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: config.objectPosition,
          opacity: config.opacity,
          filter: `blur(${config.blurPx}px) saturate(${config.saturation}) brightness(${config.brightness})`,
          transform: `scale(${config.scale})`,
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
}> = ({effectId, sceneFrame, absoluteFrame, activationFrame, themeId, seed}) => {
  const palette = getThemePalette(themeId);
  const {width, height} = useVideoConfig();

  if (effectId === "cellular-life") {
    return (
      <GameOfLifeEffect
        absoluteFrame={absoluteFrame}
        activationFrame={activationFrame}
        width={width}
        height={height}
        seed={seed}
      />
    );
  }

  if (effectId === "cellular-launch") {
    const buttonOrigin = getCellularLaunchOrigin();
    const pulse = 1 + Math.sin(sceneFrame / 7) * 0.04;
    const ready = absoluteFrame >= activationFrame;
    return (
      <>
        <GameOfLifeEffect
          absoluteFrame={absoluteFrame}
          activationFrame={activationFrame}
          width={width}
          height={height}
          seed={seed}
        />
        {!ready ? (
          <AbsoluteFill
            style={{
              justifyContent: "center",
              alignItems: "center",
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                width: 320,
                padding: "22px 28px",
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.16)",
                background: "rgba(5,12,20,0.58)",
                color: "#f4f7fb",
                fontSize: 28,
                letterSpacing: 1,
                textAlign: "center",
                boxShadow: "0 0 0 12px rgba(87,216,196,0.08), 0 18px 48px rgba(0,0,0,0.28)",
                transform: `translate(${(buttonOrigin.x - 0.5) * 120}px, ${(buttonOrigin.y - 0.5) * 120}px) scale(${pulse})`,
              }}
            >
              Start Life Simulation
            </div>
          </AbsoluteFill>
        ) : (
          <AbsoluteFill
            style={{
              pointerEvents: "none",
              background: `radial-gradient(circle at ${buttonOrigin.x * 100}% ${buttonOrigin.y * 100}%, rgba(87,216,196,0.12) 0%, transparent ${Math.min(34, 8 + (absoluteFrame - activationFrame) * 0.16)}%)`,
            }}
          />
        )}
      </>
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
}> = ({themeId, sceneFrame, absoluteFrame, scene, previousLayoutId, activationFrame, coverImage, seed}) => {
  const palette = getThemePalette(themeId);
  const glowX = 15 + (sceneFrame % 160) * 0.38;
  const glowY = 18 + (sceneFrame % 220) * 0.18;
  const accentAlpha = sceneFrame % 120 < 60 ? "88" : "66";
  const coverSrc = resolveCoverImageSrc(coverImage);
  const {backgroundImageLayoutId, backgroundEffectId} = getSceneVisualIds(scene);
  const usesCoverImage = backgroundImageLayoutId !== "gradient-default";
  const motionProgress = Math.min(1, Math.max(0, sceneFrame / Math.max(1, scene.durationInFrames - 1)));

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
      />
      <BackgroundEffectLayer
        effectId={backgroundEffectId}
        sceneFrame={sceneFrame}
        absoluteFrame={absoluteFrame}
        activationFrame={activationFrame}
        themeId={themeId}
        seed={seed}
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
  const enterFrames = Math.max(1, scene.timing.enterFrames);
  const contentOpacity = Math.min(1, Math.max(0.28, sceneFrame / Math.max(6, enterFrames * 0.55)));
  const lift = Math.max(0, 14 - sceneFrame * 2.4);
  const bullets = getSceneBullets(scene);
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
  const launchScene =
    manifest.scenes.find((item) => getSceneVisualIds(item).backgroundEffectId === "cellular-launch") ?? null;
  const activationFrame = (launchScene?.fromFrame ?? 0) + 36;

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
            opacity: contentOpacity,
            transform: `translateY(${lift}px)`,
          }}
        >
          {isHero && coverSrc ? (
            <div
              style={{
                width: 148,
                height: 148,
                borderRadius: 999,
                overflow: "hidden",
                border: "3px solid rgba(255,255,255,0.18)",
                boxShadow: "0 24px 64px rgba(0,0,0,0.28)",
              }}
            >
              <Img
                src={coverSrc}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
          ) : null}
          <div style={{fontSize: 26, letterSpacing: 4, color: theme.accent}}>
            {manifest.paper.paperId} · AI Paper Digest
          </div>
          <div style={{fontSize: 78, lineHeight: 1.08, fontWeight: 700, maxWidth: 860}}>
            {getSceneTitle(scene)}
          </div>
          <div style={{fontSize: 34, lineHeight: 1.5, maxWidth: 860, color: "#dbe7f5"}}>
            {getSceneBody(scene)}
          </div>
          {bullets.length > 0 ? (
            <div style={{display: "flex", flexDirection: "column", gap: 18, maxWidth: 860}}>
              {bullets.map((bullet) => (
                <div key={bullet} style={{fontSize: 30, lineHeight: 1.5, color: "#ecf6ff"}}>
                  {"• "}{bullet}
                </div>
              ))}
            </div>
          ) : null}
        </div>
        {subtitle ? (
          <div
            style={{
              fontSize: 28,
              lineHeight: 1.45,
              color: theme.fg,
              padding: "24px 28px",
              borderRadius: 28,
              backgroundColor: theme.panel,
              border: "1px solid rgba(255,255,255,0.08)",
              minHeight: 120,
              opacity: 0.98,
            }}
          >
            {subtitle.text}
          </div>
        ) : null}
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
