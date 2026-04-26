import path from "node:path";
import {spawn} from "node:child_process";

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
  const inputManifest = process.argv[2] ? path.resolve(process.argv[2]) : path.resolve("data/manifests/demo-paper.json");
  const mockMode = process.argv.includes("--mock");

  await run("node", ["--import", "tsx", "tools/compose-manifest.ts", inputManifest]);
  await run("node", [
    "--import",
    "tsx",
    "tools/generate-audio.ts",
    ...(mockMode ? ["--mock"] : []),
  ]);
  await run("node", ["--import", "tsx", "tools/build-video.ts"]);
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
