import React from "react";
import {AbsoluteFill, Audio, Img, Sequence, staticFile, useCurrentFrame, useVideoConfig} from "remotion";
import {getSceneBody, getSceneBullets, getSceneTitle, getThemePalette} from "@paper-to-video/content-pipeline";
import type {AudioAsset, CoverImageAsset, RenderManifest, RenderScene, SubtitleSegment} from "@paper-to-video/shared-types";

const findSubtitle = (segments: SubtitleSegment[], frame: number) =>
  segments.find((segment) => frame >= segment.startFrame && frame < segment.endFrame);

const resolveCoverImageSrc = (coverImage?: CoverImageAsset) => {
  if (!coverImage?.path) {
    return null;
  }

  return coverImage.source === "remote" ? coverImage.path : staticFile(coverImage.path);
};

const Background: React.FC<{
  themeId: string;
  sceneFrame: number;
  backgroundPresetId: string;
  sceneType: RenderScene["type"];
  coverImage?: CoverImageAsset;
}> = ({themeId, sceneFrame, backgroundPresetId, sceneType, coverImage}) => {
  const palette = getThemePalette(themeId);
  const glowX = 15 + (sceneFrame % 160) * 0.38;
  const glowY = 18 + (sceneFrame % 220) * 0.18;
  const accentAlpha = sceneFrame % 120 < 60 ? "88" : "66";
  const coverSrc = resolveCoverImageSrc(coverImage);
  const isHero = sceneType === "hero";
  const usesCoverBlur = backgroundPresetId.startsWith("cover-");

  const presetStyle = (() => {
    switch (backgroundPresetId) {
      case "cover-grid-drift":
        return {
          imageOpacity: 0.36,
          imageFilter: "blur(24px) saturate(0.82) brightness(0.58)",
          imageTransform: "scale(1.12) translateX(-1.5%)",
          overlayOpacity: 0.24,
          extraOverlay:
            "linear-gradient(90deg, rgba(87,216,196,0.04) 0%, transparent 38%, rgba(255,255,255,0.04) 100%)",
        };
      case "cover-noise-bloom":
        return {
          imageOpacity: 0.4,
          imageFilter: "blur(34px) saturate(0.9) brightness(0.52)",
          imageTransform: "scale(1.18)",
          overlayOpacity: 0.12,
          extraOverlay:
            "radial-gradient(circle at 22% 24%, rgba(87,216,196,0.12) 0%, transparent 24%), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.07) 0%, transparent 18%)",
        };
      case "cover-soft-focus":
      default:
        return {
          imageOpacity: 0.34,
          imageFilter: "blur(28px) saturate(0.86) brightness(0.56)",
          imageTransform: "scale(1.14)",
          overlayOpacity: 0.16,
          extraOverlay: "",
        };
    }
  })();

  return (
    <AbsoluteFill
      style={{
        background: `
          linear-gradient(115deg, rgba(255,255,255,0.04) 0%, transparent 30%),
          radial-gradient(circle at ${glowX}% ${glowY}%, ${palette.accent}${accentAlpha} 0%, transparent 24%),
          radial-gradient(circle at 78% 82%, rgba(255,255,255,0.06) 0%, transparent 18%),
          linear-gradient(135deg, ${palette.bg}, #10253a 48%, #081018)
        `,
      }}
    >
      {coverSrc ? (
        <AbsoluteFill style={{overflow: "hidden"}}>
          <Img
            src={coverSrc}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: isHero ? 0.9 : presetStyle.imageOpacity,
              filter: isHero ? "contrast(1.02) saturate(1.02)" : presetStyle.imageFilter,
              transform: isHero ? "scale(1.02)" : presetStyle.imageTransform,
            }}
          />
          <AbsoluteFill
            style={{
              background: isHero
                ? "linear-gradient(90deg, rgba(6,10,16,0.08) 0%, rgba(6,10,16,0.40) 46%, rgba(6,10,16,0.78) 100%)"
                : "linear-gradient(180deg, rgba(5,10,16,0.62) 0%, rgba(5,10,16,0.72) 100%)",
            }}
          />
          {!isHero && presetStyle.extraOverlay ? (
            <AbsoluteFill
              style={{
                background: presetStyle.extraOverlay,
                opacity: 0.85,
              }}
            />
          ) : null}
        </AbsoluteFill>
      ) : null}
      <AbsoluteFill
        style={{
          opacity: coverSrc && !isHero ? presetStyle.overlayOpacity : 0.28,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)
          `,
          backgroundSize: backgroundPresetId === "cover-grid-drift" ? "56px 56px" : "64px 64px",
          maskImage: "linear-gradient(180deg, rgba(0,0,0,0.85), rgba(0,0,0,0.25))",
        }}
      />
      {!coverSrc || !usesCoverBlur ? (
        <AbsoluteFill
          style={{
            background:
              backgroundPresetId === "noise-gradient"
                ? "radial-gradient(circle at 18% 22%, rgba(87,216,196,0.12) 0%, transparent 20%), radial-gradient(circle at 82% 76%, rgba(255,255,255,0.06) 0%, transparent 16%)"
                : "transparent",
          }}
        />
      ) : null}
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

  return (
    <AbsoluteFill>
      <Background
        themeId={manifest.theme.id}
        sceneFrame={sceneFrame}
        backgroundPresetId={scene.backgroundPresetId}
        sceneType={scene.type}
        coverImage={manifest.coverImage}
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
