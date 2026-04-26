import React, {useEffect, useMemo, useState} from "react";
import {
  getCoverLayoutConfig,
  getCellularLaunchOrigin,
  getInterpolatedCoverLayoutConfig,
  getSceneTitle,
  getSceneVisualIds,
  getThemePalette,
  getTextMotionState,
  resolveBackgroundMotionConfig,
  resolveCellularEffectConfig,
  resolveTextMotionConfig,
  ThreeLifeEffect,
} from "@paper-to-video/content-pipeline";
import {renderTemplateZone} from "@paper-to-video/timeline-engine";
import type {BackgroundEffectId, RenderManifest} from "@paper-to-video/shared-types";

const formatSeconds = (frames: number, fps: number) => `${(frames / fps).toFixed(1)}s`;

declare const __LATEST_RUN_FILE__: string;
declare const __DEFAULT_RENDER_MANIFEST__: string;
declare const __WORKSPACE_ROOT__: string;

type PreviewRoute = {
  description: string;
  href: string;
  id: string;
  loadManifest: () => Promise<RenderManifest>;
  title: string;
};

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

const loadLatestManifest = async () => {
  const latestRun = await fetchJson<{
    renderManifestPath: string;
  }>(__LATEST_RUN_FILE__);

  return fetchJson<RenderManifest>(latestRun.renderManifestPath);
};

const loadDefaultManifest = async () => fetchJson<RenderManifest>(__DEFAULT_RENDER_MANIFEST__);

const previewRoutes: PreviewRoute[] = [
  {
    id: "latest-run",
    href: "/previews/latest",
    title: "Latest Run Preview",
    description: "读取 output/latest-run.json 指向的最新产物，用来验证本地案例和最新模板编排。",
    loadManifest: loadLatestManifest,
  },
  {
    id: "repo-demo",
    href: "/previews/demo",
    title: "Repository Demo",
    description: "读取仓库内默认 render manifest，作为稳定基线案例。",
    loadManifest: loadDefaultManifest,
  },
];

const findPreviewRoute = (pathname: string) => previewRoutes.find((route) => route.href === pathname) ?? null;

const PreviewEffectLayer: React.FC<{
  effectId: BackgroundEffectId;
  frame: number;
  absoluteFrame: number;
  activationFrame: number;
  seed: number;
  modules?: RenderManifest["modules"];
}> = ({effectId, frame, absoluteFrame, activationFrame, seed, modules}) => {
  if (effectId === "cellular-life") {
    return (
      <ThreeLifeEffect
        absoluteFrame={absoluteFrame}
        activationFrame={activationFrame}
        width={378}
        height={672}
        seed={seed}
        modules={modules}
      />
    );
  }

  if (effectId === "cellular-launch") {
    const buttonOrigin = getCellularLaunchOrigin();
    const pulse = 1 + Math.sin(frame / 7) * 0.04;
    const ready = absoluteFrame >= activationFrame;
    return (
      <>
        <ThreeLifeEffect
          absoluteFrame={absoluteFrame}
          activationFrame={activationFrame}
          width={378}
          height={672}
          seed={seed}
          modules={modules}
        />
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

const AppIndex: React.FC<{
  currentPath: string;
  navigate: (href: string) => void;
}> = ({currentPath, navigate}) => {
  return (
    <div className="index-shell">
      <div className="index-hero">
        <div className="eyebrow">PaperToVideo</div>
        <h1>Preview Index</h1>
        <p>首页现在作为预览索引。不同组合版本会挂到各自的子路径下，当前这个站点已经支持继续往里扩更多模板、主题和案例。</p>
      </div>

      <div className="index-grid">
        {previewRoutes.map((route) => (
          <button
            key={route.id}
            className="index-card"
            onClick={() => navigate(route.href)}
            type="button"
          >
            <span className="index-card__path">{route.href}</span>
            <strong>{route.title}</strong>
            <span>{route.description}</span>
            <span className="index-card__cta">
              {currentPath === route.href ? "Open now" : "Open preview"}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

const PreviewPage: React.FC<{
  navigate: (href: string) => void;
  route: PreviewRoute;
}> = ({navigate, route}) => {
  const [manifest, setManifest] = useState<RenderManifest | null>(null);
  const [activeSceneId, setActiveSceneId] = useState("");
  const [previewFrame, setPreviewFrame] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    route
      .loadManifest()
      .then((nextManifest) => {
        if (cancelled) {
          return;
        }

        setManifest(nextManifest);
        setActiveSceneId(nextManifest.scenes[0]?.id ?? "");
        setErrorMessage(null);
      })
      .catch((error: unknown) => {
        console.error(error);
        if (!cancelled) {
          setErrorMessage(error instanceof Error ? error.message : "Failed to load manifest");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [route]);

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

  if (errorMessage) {
    return (
      <div className="app-loading">
        <div className="loading-card">
          <strong>Failed to load preview</strong>
          <span>{errorMessage}</span>
          <button className="back-link" onClick={() => navigate("/")} type="button">
            Back to index
          </button>
        </div>
      </div>
    );
  }

  if (!manifest || !activeScene) {
    return <div className="app-loading">Loading preview manifest...</div>;
  }

  const palette = getThemePalette(manifest.theme.id);
  const {backgroundImageLayoutId, backgroundEffectId} = getSceneVisualIds(activeScene);
  const backgroundMotion = resolveBackgroundMotionConfig(manifest.modules);
  const textMotion = resolveTextMotionConfig(activeScene.motionPresetId, manifest.modules);
  const activeSceneIndex = manifest.scenes.findIndex((scene) => scene.id === activeScene.id);
  const previousScene = activeSceneIndex > 0 ? manifest.scenes[activeSceneIndex - 1] : null;
  const previousLayoutId = previousScene ? getSceneVisualIds(previousScene).backgroundImageLayoutId : "cover-full";
  const sceneDuration = Math.max(1, activeScene.durationInFrames);
  const sceneMotionProgress = previewFrame / sceneDuration;
  const layoutConfig =
    previousLayoutId === backgroundImageLayoutId
      ? getCoverLayoutConfig(backgroundImageLayoutId, backgroundMotion.panTravelPercent)
      : getInterpolatedCoverLayoutConfig({
          fromLayoutId: previousLayoutId,
          toLayoutId: backgroundImageLayoutId,
          progress: Math.min(1, Math.max(0, sceneMotionProgress)),
          panTravelPercent: backgroundMotion.panTravelPercent,
        });
  const usesCoverImage = backgroundImageLayoutId !== "gradient-default";
  const absolutePreviewFrame = activeScene.fromFrame + previewFrame;
  const launchScene =
    manifest.scenes.find((scene) => getSceneVisualIds(scene).backgroundEffectId === "cellular-launch") ?? null;
  const activationFrame = (launchScene?.fromFrame ?? 0) + resolveCellularEffectConfig(manifest.modules).activationDelayFrames;
  const coverImageSrc =
    manifest.coverImage?.source === "remote"
      ? manifest.coverImage.path
      : buildLocalAssetSrc(manifest.coverImage?.path);
  const primaryNodes = renderTemplateZone({
    zone: "primary",
    context: {
      manifest,
      scene: activeScene,
      coverSrc: coverImageSrc,
      subtitleText: activeSubtitles[0]?.text ?? null,
    },
  });
  const secondaryNodes = renderTemplateZone({
    zone: "secondary",
    context: {
      manifest,
      scene: activeScene,
      coverSrc: coverImageSrc,
      subtitleText: activeSubtitles[0]?.text ?? null,
    },
  });
  const stageBackground =
    usesCoverImage
      ? "linear-gradient(180deg, #050c13 0%, #071019 100%)"
      : `radial-gradient(circle at 20% 20%, ${palette.accent}33, transparent 28%), linear-gradient(135deg, ${palette.bg}, #10253a 48%, #081018)`;

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar__header">
          <button className="back-link" onClick={() => navigate("/")} type="button">
            Back to index
          </button>
          <div className="eyebrow">PaperToVideo</div>
          <h1>{manifest.paper.title}</h1>
          <p>{route.description}</p>
        </div>

        <div className="meta-grid">
          <div>
            <span>Route</span>
            <strong>{route.href}</strong>
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
                    width: `${100 + backgroundMotion.overscanPercent}%`,
                    height: `${100 + backgroundMotion.overscanPercent}%`,
                    left: `-${backgroundMotion.overscanPercent / 2}%`,
                    top: `-${backgroundMotion.overscanPercent / 2}%`,
                    position: "absolute",
                    objectPosition: "center center",
                    opacity: layoutConfig.opacity,
                    filter: `blur(${layoutConfig.blurPx}px) saturate(${layoutConfig.saturation}) brightness(${layoutConfig.brightness})`,
                    transform: `translate(${layoutConfig.translateX}%, ${layoutConfig.translateY}%) scale(${layoutConfig.scale})`,
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
                  modules={manifest.modules}
                />
              </div>
            ) : null}
            <div className="slide-top">
              {primaryNodes.map((node, index) => {
                const state = getTextMotionState({
                  frame: previewFrame,
                  durationInFrames: activeScene.durationInFrames,
                  delayFrames: index === 0 ? 0 : textMotion.bodyDelayFrames + (index - 1) * textMotion.bulletsStaggerFrames,
                  config: textMotion,
                });

                return (
                  <div
                    key={`preview-primary-${index}`}
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
          </div>
        </div>
      </main>
    </div>
  );
};

export const App: React.FC = () => {
  const [currentPath, setCurrentPath] = useState(() => window.location.pathname);

  useEffect(() => {
    const onPopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener("popstate", onPopState);
    return () => {
      window.removeEventListener("popstate", onPopState);
    };
  }, []);

  const navigate = (href: string) => {
    if (href === currentPath) {
      return;
    }

    window.history.pushState({}, "", href);
    setCurrentPath(href);
  };

  const route = findPreviewRoute(currentPath);
  if (!route) {
    return <AppIndex currentPath={currentPath} navigate={navigate} />;
  }

  return <PreviewPage navigate={navigate} route={route} />;
};
