import React, {useEffect, useMemo, useState} from "react";
import {
  getEffectAtomDefinition,
  EffectRuntimeAdapter,
  getCoverLayoutConfig,
  getInterpolatedCoverLayoutConfig,
  getSceneTitle,
  getSceneVisualIds,
  getThemePalette,
  getTextMotionState,
  resolveBackgroundMotionConfig,
  resolveTextMotionConfig,
  type EffectAtomId,
} from "@paper-to-video/content-pipeline";
import {renderTemplateZone} from "@paper-to-video/timeline-engine";
import type {BackgroundEffectId, RenderManifest, RenderScene} from "@paper-to-video/shared-types";

const formatSeconds = (frames: number, fps: number) => `${(frames / fps).toFixed(1)}s`;

declare const __LATEST_RUN_FILE__: string;
declare const __DEFAULT_RENDER_MANIFEST__: string;
declare const __WORKSPACE_ROOT__: string;

type TemplateRoute = {
  description: string;
  href: string;
  id: string;
  loadManifest: () => Promise<RenderManifest>;
  title: string;
};

type EffectRoute = {
  description: string;
  effectId: EffectAtomId;
  href: string;
  id: string;
  source: "default" | "latest";
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

const templateRoutes: TemplateRoute[] = [
  {
    id: "latest-run",
    href: "/templates/latest",
    title: "Latest Run Template",
    description: "读取 output/latest-run.json 指向的最新产物，用来验证本地案例和最新模板编排。",
    loadManifest: loadLatestManifest,
  },
  {
    id: "repo-demo",
    href: "/templates/demo",
    title: "Repository Demo Template",
    description: "读取仓库内默认 render manifest，作为稳定基线模板案例。",
    loadManifest: loadDefaultManifest,
  },
];

const effectRoutes: EffectRoute[] = [
  {
    id: "effect-life-game",
    href: "/effects/life-game",
    title: "Life Game Effect",
    description: "单独查看可点击启动的生命游戏中间层原子，后续小游戏也沿这套接口扩展。",
    effectId: "cellular-life",
    source: "latest",
  },
];

const legacyRedirects: Record<string, string> = {
  "/effects/cellular-launch": "/effects/life-game",
  "/effects/cellular-life": "/effects/life-game",
  "/effects/aurora": "/effects/life-game",
  "/previews/demo": "/templates/demo",
  "/previews/latest": "/templates/latest",
};

const findTemplateRoute = (pathname: string) => templateRoutes.find((route) => route.href === pathname) ?? null;
const findEffectRoute = (pathname: string) => effectRoutes.find((route) => route.href === pathname) ?? null;

const AppIndex: React.FC<{
  navigate: (href: string) => void;
}> = ({navigate}) => {
  return (
    <div className="index-shell">
      <div className="index-hero">
        <div className="eyebrow">PaperToVideo</div>
        <h1>Preview Index</h1>
        <p>首页现在作为索引。模板组合页和 WebGL / effect 实验页已经拆成两个路径分区，后面继续加案例时可以按目录自然扩展。</p>
      </div>

      <section className="index-section">
        <div className="index-section__header">
          <span className="eyebrow">Templates</span>
          <h2>组合模板页</h2>
          <p>这里放完整的拼装结果，也就是背景、特效、文本和时间轴都已经组合好的版本。</p>
        </div>
        <div className="index-grid">
          {templateRoutes.map((route) => (
            <button key={route.id} className="index-card" onClick={() => navigate(route.href)} type="button">
              <span className="index-card__path">{route.href}</span>
              <strong>{route.title}</strong>
              <span>{route.description}</span>
              <span className="index-card__cta">Open template</span>
            </button>
          ))}
        </div>
      </section>

      <section className="index-section">
        <div className="index-section__header">
          <span className="eyebrow">Effects</span>
          <h2>单独特效实验页</h2>
          <p>这里单独看 WebGL / effect 层，避免每次都通过完整模板链路才能判断特效效果。</p>
        </div>
        <div className="index-grid">
          {effectRoutes.map((route) => (
            <button key={route.id} className="index-card" onClick={() => navigate(route.href)} type="button">
              <span className="index-card__path">{route.href}</span>
              <strong>{route.title}</strong>
              <span>{route.description}</span>
              <span className="index-card__cta">Open effect</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};

const LoadingState: React.FC<{
  errorMessage?: string | null;
  navigate: (href: string) => void;
}> = ({errorMessage, navigate}) => {
  if (!errorMessage) {
    return <div className="app-loading">Loading preview manifest...</div>;
  }

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
};

const PreviewStage: React.FC<{
  absolutePreviewFrame: number;
  activationFrame: number;
  children?: React.ReactNode;
  coverImageSrc: string | null;
  effectLayer?: React.ReactNode;
  effectId: BackgroundEffectId;
  layoutConfig: ReturnType<typeof getCoverLayoutConfig>;
  manifest: RenderManifest;
  palette: ReturnType<typeof getThemePalette>;
  previewFrame: number;
  stageBackground: string;
}> = ({
  absolutePreviewFrame,
  activationFrame,
  coverImageSrc,
  effectLayer,
  effectId,
  layoutConfig,
  manifest,
  palette,
  previewFrame,
  stageBackground,
  children,
}) => {
  const backgroundMotion = resolveBackgroundMotionConfig(manifest.modules);

  return (
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
          </div>
        ) : null}
        {effectLayer ?? (
          <EffectRuntimeAdapter
            effectId={effectId}
            absoluteFrame={absolutePreviewFrame}
            activationFrame={activationFrame}
            height={672}
            mode="render"
            modules={manifest.modules}
            seed={manifest.seed}
            width={378}
          />
        )}
        {children}
      </div>
    </div>
  );
};

const TemplatePreviewPage: React.FC<{
  navigate: (href: string) => void;
  route: TemplateRoute;
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

  if (errorMessage || !manifest || !activeScene) {
    return <LoadingState errorMessage={errorMessage} navigate={navigate} />;
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
  const activationFrame = launchScene?.fromFrame ?? 0;
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
          <div className="eyebrow">Templates</div>
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
        <PreviewStage
          absolutePreviewFrame={absolutePreviewFrame}
          activationFrame={activationFrame}
          coverImageSrc={coverImageSrc}
          effectId={backgroundEffectId}
          layoutConfig={layoutConfig}
          manifest={manifest}
          palette={palette}
          previewFrame={previewFrame}
          stageBackground={stageBackground}
        >
          <div className="slide-top slide-top--template">
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
        </PreviewStage>
      </main>
    </div>
  );
};

const findEffectScene = (manifest: RenderManifest, effectId: BackgroundEffectId): RenderScene => {
  const matched = manifest.scenes.find((scene) => getSceneVisualIds(scene).backgroundEffectId === effectId);
  return matched ?? manifest.scenes[0];
};

const EffectLabPage: React.FC<{
  navigate: (href: string) => void;
  route: EffectRoute;
}> = ({navigate, route}) => {
  const [manifest, setManifest] = useState<RenderManifest | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(route.effectId === "aurora");
  const [simulationFrame, setSimulationFrame] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const loader = route.source === "latest" ? loadLatestManifest : loadDefaultManifest;

    loader()
      .then((nextManifest) => {
        if (!cancelled) {
          setManifest(nextManifest);
          setErrorMessage(null);
        }
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
    if (!isRunning) {
      return;
    }

    const timer = window.setInterval(() => {
      setSimulationFrame((frame) => frame + 1);
    }, 1000 / 24);

    return () => {
      window.clearInterval(timer);
    };
  }, [isRunning]);

  useEffect(() => {
    setSimulationFrame(0);
    setIsRunning(route.effectId === "aurora");
  }, [route.effectId]);

  if (errorMessage || !manifest) {
    return <LoadingState errorMessage={errorMessage} navigate={navigate} />;
  }

  const scene = findEffectScene(manifest, route.effectId);
  const effectDefinition = getEffectAtomDefinition(route.effectId);
  const palette = getThemePalette(manifest.theme.id);
  const backgroundMotion = resolveBackgroundMotionConfig(manifest.modules);
  const layoutConfig = getCoverLayoutConfig("cover-full", backgroundMotion.panTravelPercent);
  const coverImageSrc =
    manifest.coverImage?.source === "remote"
      ? manifest.coverImage.path
      : buildLocalAssetSrc(manifest.coverImage?.path);
  const activationFrame = 0;
  const absolutePreviewFrame = simulationFrame;
  const controlLabel =
    route.effectId === "aurora" ? "Ambient Overlay" : isRunning ? "Running" : "Idle";
  const effectLayer = (
    <>
      {route.effectId === "aurora" || isRunning ? (
        <EffectRuntimeAdapter
          absoluteFrame={absolutePreviewFrame}
          activationFrame={activationFrame}
          effectId={route.effectId}
          height={672}
          isRunning={isRunning}
          mode="interactive"
          modules={manifest.modules}
          onPrimaryAction={() => setIsRunning(true)}
          seed={manifest.seed}
          simulationFrame={simulationFrame}
          width={378}
        />
      ) : null}
      {!isRunning ? (
        <button
          className="effect-stage-button"
          onClick={() => setIsRunning(true)}
          type="button"
        >
          Start Life Simulation
        </button>
      ) : null}
    </>
  );

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar__header">
          <button className="back-link" onClick={() => navigate("/")} type="button">
            Back to index
          </button>
          <div className="eyebrow">Effects</div>
          <h1>{route.title}</h1>
          <p>{route.description}</p>
        </div>

        <div className="meta-grid">
          <div>
            <span>Route</span>
            <strong>{route.href}</strong>
          </div>
          <div>
            <span>Effect ID</span>
            <strong>{route.effectId}</strong>
          </div>
          <div>
            <span>Source</span>
            <strong>{route.source}</strong>
          </div>
          <div>
            <span>Status</span>
            <strong>{controlLabel}</strong>
          </div>
        </div>

        <div className="effect-controls">
          <button className="effect-control-button" onClick={() => setIsRunning(true)} type="button">
            Start
          </button>
          <button className="effect-control-button" onClick={() => setIsRunning(false)} type="button">
            Pause
          </button>
          <button
            className="effect-control-button effect-control-button--ghost"
            onClick={() => {
              setIsRunning(false);
              setSimulationFrame(0);
            }}
            type="button"
          >
            Reset
          </button>
        </div>

        <div className="effect-notes">
          <div className="effect-note">
            <strong>用途</strong>
            <span>单独检查中间层 effect atom，不和背景模板、文本模板耦合。</span>
          </div>
          <div className="effect-note">
            <strong>当前原子</strong>
            <span>{effectDefinition.title}</span>
          </div>
          <div className="effect-note">
            <strong>组合关系</strong>
            <span>短视频最终由 背景 + WebGL 小游戏特效 + 文本 + 朗读 组合而成，这里只验证中间层特效。</span>
          </div>
          <div className="effect-note">
            <strong>扩展方式</strong>
            <span>后续贪吃蛇、扫雷、吃豆人都可以按同一 effect atom 接口挂到 `/effects/*` 下。</span>
          </div>
        </div>
      </aside>

      <main className="stage">
        <PreviewStage
          absolutePreviewFrame={absolutePreviewFrame}
          activationFrame={activationFrame}
          coverImageSrc={coverImageSrc}
          effectLayer={effectLayer}
          effectId={route.effectId}
          layoutConfig={layoutConfig}
          manifest={manifest}
          palette={palette}
          previewFrame={simulationFrame}
          stageBackground={`linear-gradient(180deg, ${palette.bg} 0%, #071019 100%)`}
        >
          <div className="effect-stage-caption">
            <span>Effect Atom</span>
            <strong>{effectDefinition.id}</strong>
            <small>{effectDefinition.description}</small>
          </div>
        </PreviewStage>
      </main>
    </div>
  );
};

export const App: React.FC = () => {
  const [currentPath, setCurrentPath] = useState(() => legacyRedirects[window.location.pathname] ?? window.location.pathname);

  useEffect(() => {
    if (legacyRedirects[window.location.pathname]) {
      const nextPath = legacyRedirects[window.location.pathname];
      window.history.replaceState({}, "", nextPath);
      setCurrentPath(nextPath);
    }

    const onPopState = () => {
      setCurrentPath(legacyRedirects[window.location.pathname] ?? window.location.pathname);
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

  const templateRoute = findTemplateRoute(currentPath);
  if (templateRoute) {
    return <TemplatePreviewPage navigate={navigate} route={templateRoute} />;
  }

  const effectRoute = findEffectRoute(currentPath);
  if (effectRoute) {
    return <EffectLabPage navigate={navigate} route={effectRoute} />;
  }

  return <AppIndex navigate={navigate} />;
};
