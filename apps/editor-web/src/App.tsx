import React, {useEffect, useMemo, useState} from "react";
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
import type {BackgroundEffectId, BackgroundImageLayoutId, RenderManifest} from "@paper-to-video/shared-types";

const formatSeconds = (frames: number, fps: number) => `${(frames / fps).toFixed(1)}s`;

declare const __LATEST_RUN_FILE__: string;
declare const __DEFAULT_RENDER_MANIFEST__: string;
declare const __WORKSPACE_ROOT__: string;

const buildLocalAssetSrc = (relativePath?: string) => {
  if (!relativePath) {
    return null;
  }

  return `/@fs${__WORKSPACE_ROOT__}/${relativePath}`;
};

const fetchJson = async <T,>(absolutePath: string) => {
  const response = await fetch(`/@fs${absolutePath}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${absolutePath}: ${response.status}`);
  }

  return (await response.json()) as T;
};

const PreviewGameOfLifeEffect: React.FC<{
  absoluteFrame: number;
  activationFrame: number;
  seed: number;
}> = ({absoluteFrame, activationFrame, seed}) => {
  const cols = 14;
  const rows = 24;
  const cells = buildCellularLifeCells({cols, rows, globalFrame: absoluteFrame, activationFrame, seed});
  const cellWidth = 100 / cols;
  const cellHeight = 100 / rows;

  return (
    <svg className="preview-effect-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
      {cells.map((cell) => {
        const fill = cell.tone === 1 ? "rgba(87,216,196,0.44)" : "rgba(255,255,255,0.24)";
        const inset = cell.age >= 3 ? 0.7 : 0.4;
        return (
          <rect
            key={`${cell.x}-${cell.y}`}
            x={cell.x * cellWidth + inset}
            y={cell.y * cellHeight + inset}
            width={Math.max(0.8, cellWidth - inset * 2)}
            height={Math.max(0.8, cellHeight - inset * 2)}
            rx={0.6}
            fill={fill}
          />
        );
      })}
    </svg>
  );
};

const PreviewEffectLayer: React.FC<{
  effectId: BackgroundEffectId;
  frame: number;
  absoluteFrame: number;
  activationFrame: number;
  seed: number;
}> = ({effectId, frame, absoluteFrame, activationFrame, seed}) => {
  if (effectId === "cellular-life") {
    return <PreviewGameOfLifeEffect absoluteFrame={absoluteFrame} activationFrame={activationFrame} seed={seed} />;
  }

  if (effectId === "cellular-launch") {
    const buttonOrigin = getCellularLaunchOrigin();
    const pulse = 1 + Math.sin(frame / 7) * 0.04;
    const ready = absoluteFrame >= activationFrame;
    return (
      <>
        <PreviewGameOfLifeEffect absoluteFrame={absoluteFrame} activationFrame={activationFrame} seed={seed} />
        {!ready ? (
          <div
            className="preview-launch-button"
            style={{
              transform: `translate(${(buttonOrigin.x - 0.5) * 110}px, ${(buttonOrigin.y - 0.5) * 110}px) scale(${pulse})`,
            }}
          >
            Start Life Simulation
          </div>
        ) : (
          <div
            className="preview-effect-layer"
            style={{
              background: `radial-gradient(circle at ${buttonOrigin.x * 100}% ${buttonOrigin.y * 100}%, rgba(87,216,196,0.12) 0%, transparent ${Math.min(34, 8 + (absoluteFrame - activationFrame) * 0.16)}%)`,
            }}
          />
        )}
      </>
    );
  }

  if (effectId === "grid-drift") {
    return (
      <div
        className="preview-effect-layer"
        style={{
          opacity: 0.38,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(87,216,196,0.14) 0%, transparent 40%, rgba(255,255,255,0.08) 100%)
          `,
          backgroundSize: "44px 44px, 44px 44px, 100% 100%",
          backgroundPosition: `${(frame * 0.8) % 44}px ${(frame * 0.3) % 44}px, ${(frame * 0.8) % 44}px ${(frame * 0.3) % 44}px, 0 0`,
        }}
      />
    );
  }

  if (effectId === "noise-bloom") {
    return (
      <div
        className="preview-effect-layer"
        style={{
          opacity: 0.92,
          background: `
            radial-gradient(circle at ${22 + (frame % 24)}% 24%, rgba(87,216,196,0.18) 0%, transparent 24%),
            radial-gradient(circle at 80% ${68 + (frame % 16) * 0.4}%, rgba(255,255,255,0.12) 0%, transparent 18%)
          `,
        }}
      />
    );
  }

  if (effectId === "aurora") {
    return (
      <div
        className="preview-effect-layer"
        style={{
          background:
            "radial-gradient(circle at 18% 22%, rgba(87,216,196,0.14) 0%, transparent 22%), radial-gradient(circle at 82% 76%, rgba(255,255,255,0.1) 0%, transparent 18%)",
        }}
      />
    );
  }

  return <div className="preview-effect-layer preview-effect-layer--soft" />;
};

export const App: React.FC = () => {
  const [manifest, setManifest] = useState<RenderManifest | null>(null);
  const [activeSceneId, setActiveSceneId] = useState("");
  const [previewFrame, setPreviewFrame] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const loadManifest = async () => {
      try {
        const latestRun = await fetchJson<{
          renderManifestPath: string;
        }>(__LATEST_RUN_FILE__);

        const nextManifest = await fetchJson<RenderManifest>(latestRun.renderManifestPath);
        if (!cancelled) {
          setManifest(nextManifest);
          setActiveSceneId(nextManifest.scenes[0]?.id ?? "");
        }
        return;
      } catch {
        const fallback = await fetchJson<RenderManifest>(__DEFAULT_RENDER_MANIFEST__);
        if (!cancelled) {
          setManifest(fallback);
          setActiveSceneId(fallback.scenes[0]?.id ?? "");
        }
      }
    };

    loadManifest().catch((error) => {
      console.error(error);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setPreviewFrame((frame) => (frame + 1) % 240);
    }, 100);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  const activeScene = useMemo(
    () => manifest?.scenes.find((scene) => scene.id === activeSceneId) ?? manifest?.scenes[0] ?? null,
    [activeSceneId, manifest],
  );

  const activeSubtitles = useMemo(
    () => manifest?.subtitleSegments.filter((segment) => segment.sceneId === activeScene?.id) ?? [],
    [activeScene?.id, manifest],
  );

  if (!manifest || !activeScene) {
    return <div className="app-loading">Loading latest render manifest...</div>;
  }

  const palette = getThemePalette(manifest.theme.id);
  const bullets = getSceneBullets(activeScene);
  const {backgroundImageLayoutId, backgroundEffectId} = getSceneVisualIds(activeScene);
  const activeSceneIndex = manifest.scenes.findIndex((scene) => scene.id === activeScene.id);
  const previousScene = activeSceneIndex > 0 ? manifest.scenes[activeSceneIndex - 1] : null;
  const previousLayoutId = previousScene ? getSceneVisualIds(previousScene).backgroundImageLayoutId : "cover-full";
  const sceneDuration = Math.max(1, activeScene.durationInFrames);
  const sceneMotionProgress = previewFrame / sceneDuration;
  const layoutConfig =
    previousLayoutId === backgroundImageLayoutId
      ? getCoverLayoutConfig(backgroundImageLayoutId)
      : getInterpolatedCoverLayoutConfig({
          fromLayoutId: previousLayoutId,
          toLayoutId: backgroundImageLayoutId,
          progress: Math.min(1, Math.max(0, sceneMotionProgress)),
        });
  const usesCoverImage = backgroundImageLayoutId !== "gradient-default";
  const absolutePreviewFrame = activeScene.fromFrame + previewFrame;
  const launchScene =
    manifest.scenes.find((scene) => getSceneVisualIds(scene).backgroundEffectId === "cellular-launch") ?? null;
  const activationFrame = (launchScene?.fromFrame ?? 0) + 36;
  const coverImageSrc =
    manifest.coverImage?.source === "remote"
      ? manifest.coverImage.path
      : buildLocalAssetSrc(manifest.coverImage?.path);
  const stageBackground =
    usesCoverImage
      ? "linear-gradient(180deg, #050c13 0%, #071019 100%)"
      : `radial-gradient(circle at 20% 20%, ${palette.accent}33, transparent 28%), linear-gradient(135deg, ${palette.bg}, #10253a 48%, #081018)`;

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar__header">
          <div className="eyebrow">PaperToVideo</div>
          <h1>{manifest.paper.title}</h1>
          <p>用 React 预览多场景论文短视频页面，后续这里会继续接 AI 总结、配图和时间轴编辑。</p>
        </div>

        <div className="meta-grid">
          <div>
            <span>Paper ID</span>
            <strong>{manifest.paper.paperId}</strong>
          </div>
          <div>
            <span>Theme</span>
            <strong>{manifest.theme.id}</strong>
          </div>
          <div>
            <span>Scenes</span>
            <strong>{manifest.scenes.length}</strong>
          </div>
          <div>
            <span>Total</span>
            <strong>{formatSeconds(manifest.totalFrames, manifest.fps)}</strong>
          </div>
        </div>

        <div className="scene-list">
          {manifest.scenes.map((scene, index) => (
            <button
              key={scene.id}
              className={scene.id === activeScene.id ? "scene-item scene-item--active" : "scene-item"}
              onClick={() => setActiveSceneId(scene.id)}
              type="button"
            >
              <span className="scene-item__index">{String(index + 1).padStart(2, "0")}</span>
              <span className="scene-item__content">
                <strong>{getSceneTitle(scene)}</strong>
                <span>{scene.type} · {formatSeconds(scene.durationInFrames, manifest.fps)}</span>
              </span>
            </button>
          ))}
        </div>
      </aside>

      <main className="stage">
        <div className="phone-frame">
          <div
            className="slide-preview"
            style={{
              color: palette.fg,
              background: stageBackground,
            }}
          >
            {coverImageSrc ? (
              <div className="preview-cover-layer">
                <img
                  alt={manifest.coverImage?.alt ?? "cover"}
                  className="preview-cover-layer__img"
                  style={{
                    objectPosition: layoutConfig.objectPosition,
                    opacity: layoutConfig.opacity,
                    filter: `blur(${layoutConfig.blurPx}px) saturate(${layoutConfig.saturation}) brightness(${layoutConfig.brightness})`,
                    transform: `scale(${layoutConfig.scale})`,
                  }}
                  src={coverImageSrc}
                />
                <div className="preview-cover-layer__shade" style={{background: layoutConfig.shade}} />
                <PreviewEffectLayer
                  effectId={backgroundEffectId}
                  frame={previewFrame}
                  absoluteFrame={absolutePreviewFrame}
                  activationFrame={activationFrame}
                  seed={manifest.seed}
                />
              </div>
            ) : null}
            <div className="slide-top">
              <div className="slide-kicker">{manifest.paper.paperId} · AI Paper Digest</div>
              <h2>{getSceneTitle(activeScene)}</h2>
              <p>{getSceneBody(activeScene)}</p>
              {bullets.length > 0 ? (
                <div className="bullet-list">
                  {bullets.map((bullet) => (
                    <div key={bullet} className="bullet-item">
                      <span className="bullet-dot" />
                      <span>{bullet}</span>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="subtitle-panel">
              {activeSubtitles.map((segment) => (
                <div key={segment.id} className="subtitle-line">
                  {segment.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
