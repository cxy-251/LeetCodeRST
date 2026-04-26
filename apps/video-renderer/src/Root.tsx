import React from "react";
import {AbsoluteFill, Audio, Sequence, useCurrentFrame, useVideoConfig} from "remotion";
import {getSceneBody, getSceneBullets, getSceneTitle, getThemePalette} from "@paper-to-video/content-pipeline";
import type {AudioAsset, RenderManifest, RenderScene, SubtitleSegment} from "@paper-to-video/shared-types";

const findSubtitle = (segments: SubtitleSegment[], frame: number) =>
  segments.find((segment) => frame >= segment.startFrame && frame < segment.endFrame);

const Background: React.FC<{themeId: string; sceneFrame: number}> = ({themeId, sceneFrame}) => {
  const palette = getThemePalette(themeId);
  const glowX = 15 + (sceneFrame % 120) * 0.55;
  const glowY = 20 + (sceneFrame % 180) * 0.25;

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at ${glowX}% ${glowY}%, ${palette.accent}33, transparent 28%), linear-gradient(135deg, ${palette.bg}, #10253a 48%, #081018)`,
      }}
    />
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
  const opacity = Math.min(1, Math.max(0, sceneFrame / enterFrames));
  const bullets = getSceneBullets(scene);
  const subtitle = findSubtitle(
    manifest.subtitleSegments.filter((segment) => segment.sceneId === scene.id),
    frame,
  );

  return (
    <AbsoluteFill style={{opacity}}>
      <Background themeId={manifest.theme.id} sceneFrame={sceneFrame} />
      <AbsoluteFill
        style={{
          padding: 72,
          color: theme.fg,
          justifyContent: "space-between",
          fontFamily: "PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif",
        }}
      >
        <div style={{display: "flex", flexDirection: "column", gap: 24, marginTop: 60}}>
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
          }}
        >
          {subtitle?.text ?? `配音与字幕会根据 scene 音频自动同步，当前场景时长约 ${(scene.durationInFrames / fps).toFixed(1)}s`}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const SceneAudio: React.FC<{audioAssets: AudioAsset[]}> = ({audioAssets}) => {
  const playableAssets = audioAssets.filter((asset) => asset.filePath);

  return (
    <>
      {playableAssets.map((asset) => (
        <Sequence key={asset.id} from={0}>
          <Audio src={asset.filePath} />
        </Sequence>
      ))}
    </>
  );
};

export const PaperVideo: React.FC<{manifest: RenderManifest}> = ({manifest}) => {
  return (
    <AbsoluteFill style={{backgroundColor: "#050a10"}}>
      {manifest.audioAssets.some((asset) => asset.filePath) ? (
        <SceneAudio audioAssets={manifest.audioAssets} />
      ) : null}
      {manifest.scenes.map((scene) => (
        <Sequence key={scene.id} from={scene.fromFrame} durationInFrames={scene.durationInFrames}>
          <SceneCard scene={scene} manifest={manifest} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
