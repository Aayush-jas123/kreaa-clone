import { defineConfig } from "@trigger.dev/sdk/v3";

export default defineConfig({
  project: "proj_krea_clone",
  runtime: "node",
  logLevel: "log",
  // The max compute seconds a task is allowed to run.
  maxDuration: 120, 
  dirs: ["src/trigger"],
});
