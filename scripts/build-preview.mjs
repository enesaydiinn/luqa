// Build a static, explicitly disconnected catalog preview. Vercel uses `npm run build`.
import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";
const dir = resolve(".preview");
await rm(dir, { recursive: true, force: true });
await mkdir(dir, { recursive: true });
for (const path of [
  "src",
  "public",
  "package.json",
  "tsconfig.json",
  "next.config.ts",
  "postcss.config.mjs",
])
  await cp(resolve(path), resolve(dir, path), { recursive: true });
await rm(resolve(dir, "src/app/api"), { recursive: true, force: true });
await writeFile(
  resolve(dir, "next-env.d.ts"),
  '/// <reference types="next" />\n/// <reference types="next/image-types/global" />\n',
);
const result = spawnSync(
  process.execPath,
  [resolve("node_modules/next/dist/bin/next"), "build", dir, "--webpack"],
  {
    stdio: "inherit",
    env: {
      ...process.env,
      LUQA_STATIC_PREVIEW: "1",
      NEXT_PUBLIC_LEGAL_READY: "false",
      NEXT_PUBLIC_SUPABASE_URL: "",
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "",
      NEXT_PUBLIC_GA4_ID: "",
      NEXT_PUBLIC_TURNSTILE_SITE_KEY: "",
    },
  },
);
if (result.status !== 0) process.exit(result.status || 1);
await rm(resolve("out"), { recursive: true, force: true });
await cp(resolve(dir, "out"), resolve("out"), { recursive: true });
console.log(
  "Static catalog preview generated. API writes and admin services remain disconnected.",
);
