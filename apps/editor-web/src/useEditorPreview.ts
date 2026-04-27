import {useEffect, useMemo, useState} from "react";
import type {RenderManifest} from "@paper-to-video/shared-types";
import {
  findEffectScene,
  findRoutes,
  loadDefaultManifest,
  legacyRedirects,
  loadLatestManifest,
  resolveInitialPath,
} from "./App.service";
import type {AppRouteState, EffectPreviewState, EffectRoute, TemplatePreviewState, TemplateRoute} from "./App.types";

const useManifestLoader = (loadManifest: (() => Promise<RenderManifest>) | null) => {
  const [manifest, setManifest] = useState<RenderManifest | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    if (!loadManifest) {
      setManifest(null);
      setErrorMessage(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    loadManifest()
      .then((nextManifest) => {
        if (cancelled) {
          return;
        }

        setManifest(nextManifest);
        setErrorMessage(null);
        setLoading(false);
      })
      .catch((error: unknown) => {
        if (cancelled) {
          return;
        }

        console.error(error);
        setManifest(null);
        setErrorMessage(error instanceof Error ? error.message : "Failed to load manifest");
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [loadManifest]);

  return {errorMessage, loading, manifest};
};

export const usePreviewRouter = (): AppRouteState => {
  const [currentPath, setCurrentPath] = useState(() => resolveInitialPath(window.location.pathname));

  useEffect(() => {
    if (legacyRedirects[window.location.pathname]) {
      const nextPath = legacyRedirects[window.location.pathname];
      window.history.replaceState({}, "", nextPath);
      setCurrentPath(nextPath);
    }

    const onPopState = () => {
      setCurrentPath(resolveInitialPath(window.location.pathname));
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

  const routes = findRoutes(currentPath);

  return {
    currentPath,
    navigate,
    templateRoute: routes.templateRoute,
    effectRoute: routes.effectRoute,
  };
};

export const useTemplatePreview = (route: TemplateRoute | null): TemplatePreviewState => {
  const {errorMessage, loading, manifest} = useManifestLoader(route?.loadManifest ?? null);
  const [activeSceneId, setActiveSceneId] = useState("");
  const [previewFrame, setPreviewFrame] = useState(0);

  useEffect(() => {
    if (!manifest) {
      setActiveSceneId("");
      return;
    }

    setActiveSceneId(manifest.scenes[0]?.id ?? "");
  }, [manifest]);

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

  return {
    activeScene,
    activeSceneId,
    activeSubtitles,
    errorMessage,
    loading,
    manifest,
    previewFrame,
    setActiveSceneId,
  };
};

export const useEffectPreview = (route: EffectRoute | null): EffectPreviewState => {
  const loadManifest = route ? (route.source === "latest" ? loadLatestManifest : loadDefaultManifest) : null;
  const {errorMessage, loading, manifest} = useManifestLoader(loadManifest);
  const [isRunning, setIsRunning] = useState(false);
  const [simulationFrame, setSimulationFrame] = useState(0);

  useEffect(() => {
    /**
     * We reset the sandbox when the route changes so one effect page never
     * leaks runtime state into another experimental page.
     */
    setSimulationFrame(0);
    setIsRunning(false);
  }, [route?.effectId]);

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

  const scene = useMemo(() => {
    if (!manifest || !route) {
      return null;
    }

    return findEffectScene(manifest, route.effectId);
  }, [manifest, route]);

  const resetSimulation = () => {
    setIsRunning(false);
    setSimulationFrame(0);
  };

  return {
    errorMessage,
    isRunning,
    loading,
    manifest,
    resetSimulation,
    scene,
    setIsRunning,
    simulationFrame,
  };
};

export const useTemplateActivationFrame = (_manifest: RenderManifest | null) => 0;
