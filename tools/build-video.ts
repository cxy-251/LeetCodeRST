import path from "node:path";
import {spawn} from "node:child_process";

const DEFAULT_RENDER_MANIFEST = path.resolve("data/generated-meta/demo-paper-001.render.json");
const DEFAULT_OUTPUT = path.resolve("output/videos/demo-paper-001.mp4");

const run = (command: string, args: string[]) =>
  new Promise<void>((resolve, reject) => {
    const child = spawn(command, args, {stdio: "inherit"});
    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`${command} exited with code ${code ?? "unknown"}`));
    });
    child.on("error", reject);
  });

const main = async () => {
  const renderManifest = process.argv[2] ? path.resolve(process.argv[2]) : DEFAULT_RENDER_MANIFEST;
  const output = process.argv[3] ? path.resolve(process.argv[3]) : DEFAULT_OUTPUT;

  await run("npx", [
    "remotion",
    "render",
    "apps/video-renderer/src/index.tsx",
    "PaperToVideo",
    output,
    "--props",
    JSON.stringify({
      manifestPath: renderManifest,
    }),
  ]);
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
