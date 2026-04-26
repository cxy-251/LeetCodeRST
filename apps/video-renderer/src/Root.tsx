import React from "react";
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig} from "remotion";
import {getSceneBody, getSceneBullets, getSceneTitle, getThemePalette} from "@paper-to-video/content-pipeline";
import type {AudioAsset, RenderManifest, RenderScene, SubtitleSegment} from "@paper-to-video/shared-types";

const findSubtitle = (segments: SubtitleSegment[], frame: number) =>
  segments.find((segment) => frame >= segment.startFrame && frame < segment.endFrame);

const Background: React.FC<{themeId: string; sceneFrame: number}> = ({themeId, sceneFrame}) => {
  const palette = getThemePalette(themeId);
  const glowX = 15 + (sceneFrame % 160) * 0.38;
  const glowY = 18 + (sceneFrame % 220) * 0.18;
  const accentAlpha = sceneFrame % 120 < 60 ? "88" : "66";

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
      <AbsoluteFill
        style={{
          opacity: 0.28,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)
          `,
          backgroundSize: "64px 64px",
          maskImage: "linear-gradient(180deg, rgba(0,0,0,0.85), rgba(0,0,0,0.25))",
        }}
      />
    </AbsoluteFill>
  );
};

const SceneCard: React.FC<{
  scene: RenderScene;
  manifest: RenderManifest;
}> = ({scene, manifest}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const theme = getThemePalette(manifest.theme.id);
  const sceneFrame = frame - scene.fromFrame;
  const enterFrames = Math.max(1, scene.timing.enterFrames);
  const contentOpacity = Math.min(1, Math.max(0.18, sceneFrame / enterFrames));
  const lift = Math.max(0, 20 - sceneFrame * 1.2);
  const bullets = getSceneBullets(scene);
  const subtitle = findSubtitle(
    manifest.subtitleSegments.filter((segment) => segment.sceneId === scene.id),
    frame,
  );

  return (
    <AbsoluteFill>
      <Background themeId={manifest.theme.id} sceneFrame={sceneFrame} />
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
          {subtitle?.text ?? `配音与字幕会根据 scene 音频自动同步，当前场景时长约 ${(scene.durationInFrames / fps).toFixed(1)}s`}
        </div>
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
