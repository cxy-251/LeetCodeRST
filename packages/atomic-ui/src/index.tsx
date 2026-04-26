import React from "react";

export const CoverAvatarAtom: React.FC<{
  src: string;
  size?: number;
}> = ({src, size = 148}) => {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 999,
        overflow: "hidden",
        border: "3px solid rgba(255,255,255,0.18)",
        boxShadow: "0 24px 64px rgba(0,0,0,0.28)",
      }}
    >
      <img
        src={src}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
        }}
      />
    </div>
  );
};

export const SceneKickerAtom: React.FC<{
  text: string;
  color: string;
}> = ({text, color}) => {
  return (
    <div style={{fontSize: 26, letterSpacing: 4, color}}>
      {text}
    </div>
  );
};

export const SceneTitleAtom: React.FC<{
  text: string;
}> = ({text}) => {
  return (
    <div style={{fontSize: 78, lineHeight: 1.08, fontWeight: 700, maxWidth: 860}}>
      {text}
    </div>
  );
};

export const SceneBodyAtom: React.FC<{
  text: string;
}> = ({text}) => {
  return (
    <div style={{fontSize: 34, lineHeight: 1.5, maxWidth: 860, color: "#dbe7f5"}}>
      {text}
    </div>
  );
};

export const SceneBulletsAtom: React.FC<{
  bullets: string[];
}> = ({bullets}) => {
  return (
    <div style={{display: "flex", flexDirection: "column", gap: 18, maxWidth: 860}}>
      {bullets.map((bullet) => (
        <div key={bullet} style={{fontSize: 30, lineHeight: 1.5, color: "#ecf6ff"}}>
          {"• "}{bullet}
        </div>
      ))}
    </div>
  );
};

export const SubtitlePanelAtom: React.FC<{
  text: string;
  panelColor: string;
  foreground: string;
}> = ({text, panelColor, foreground}) => {
  return (
    <div
      style={{
        fontSize: 28,
        lineHeight: 1.45,
        color: foreground,
        padding: "24px 28px",
        borderRadius: 28,
        backgroundColor: panelColor,
        border: "1px solid rgba(255,255,255,0.08)",
        minHeight: 120,
        opacity: 0.98,
      }}
    >
      {text}
    </div>
  );
};
