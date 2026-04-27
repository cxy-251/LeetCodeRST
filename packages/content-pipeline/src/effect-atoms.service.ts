import {getCellularLaunchOrigin} from "./visual-system";

export const getLaunchButtonState = (frame: number) => {
  const buttonOrigin = getCellularLaunchOrigin();
  const pulse = 1 + Math.sin(frame / 7) * 0.04;

  return {
    buttonOrigin,
    pulse,
  };
};

export const getGridDriftBackground = (frame: number) => ({
  backgroundImage: `
    linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px),
    linear-gradient(90deg, rgba(87,216,196,0.14) 0%, transparent 40%, rgba(255,255,255,0.08) 100%)
  `,
  backgroundPosition: `${(frame * 0.8) % 44}px ${(frame * 0.3) % 44}px, ${(frame * 0.8) % 44}px ${(frame * 0.3) % 44}px, 0 0`,
  backgroundSize: "44px 44px, 44px 44px, 100% 100%",
});

export const getNoiseBloomBackground = (frame: number) => ({
  background: `
    radial-gradient(circle at ${22 + (frame % 24)}% 24%, rgba(87,216,196,0.18) 0%, transparent 24%),
    radial-gradient(circle at 80% ${68 + (frame % 16) * 0.4}%, rgba(255,255,255,0.12) 0%, transparent 18%)
  `,
});

export const getAuroraBackground = () => ({
  background:
    "radial-gradient(circle at 18% 22%, rgba(87,216,196,0.14) 0%, transparent 22%), radial-gradient(circle at 82% 76%, rgba(255,255,255,0.1) 0%, transparent 18%)",
});
