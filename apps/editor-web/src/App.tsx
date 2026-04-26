import React, {useMemo, useState} from "react";
import {getSceneBody, getSceneBullets, getSceneTitle, getThemePalette} from "@paper-to-video/content-pipeline";
import type {RenderManifest} from "@paper-to-video/shared-types";
import renderManifest from "../../../data/generated-meta/demo-paper-001.render.json";

const manifest = renderManifest as RenderManifest;

const formatSeconds = (frames: number, fps: number) => `${(frames / fps).toFixed(1)}s`;
const coverImageSrc = manifest.coverImage?.path ? `/${manifest.coverImage.path}` : null;

export const App: React.FC = () => {
  const [activeSceneId, setActiveSceneId] = useState(manifest.scenes[0]?.id ?? "");

  const activeScene = useMemo(
    () => manifest.scenes.find((scene) => scene.id === activeSceneId) ?? manifest.scenes[0],
    [activeSceneId],
  );

  const activeSubtitles = useMemo(
    () => manifest.subtitleSegments.filter((segment) => segment.sceneId === activeScene.id),
    [activeScene],
  );

  const palette = getThemePalette(manifest.theme.id);
  const bullets = getSceneBullets(activeScene);
  const isHero = activeScene.type === "hero";
  const isCoverDerived = activeScene.backgroundPresetId.startsWith("cover-");
  const isCellular = activeScene.backgroundPresetId === "cover-cellular-mask";

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
              background: `radial-gradient(circle at 20% 20%, ${palette.accent}33, transparent 28%), linear-gradient(135deg, ${palette.bg}, #10253a 48%, #081018)`,
            }}
          >
            {coverImageSrc ? (
              <div className="preview-cover-layer">
                <img
                  alt={manifest.coverImage?.alt ?? "cover"}
                  className={
                    isHero
                      ? "preview-cover-layer__img preview-cover-layer__img--hero"
                      : isCellular
                        ? "preview-cover-layer__img preview-cover-layer__img--cellular"
                      : isCoverDerived
                        ? "preview-cover-layer__img preview-cover-layer__img--blur"
                        : "preview-cover-layer__img preview-cover-layer__img--soft"
                  }
                  src={coverImageSrc}
                />
                <div className={isHero ? "preview-cover-layer__shade preview-cover-layer__shade--hero" : "preview-cover-layer__shade"} />
                {isCellular ? <div className="preview-cover-layer__cellular" /> : null}
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
