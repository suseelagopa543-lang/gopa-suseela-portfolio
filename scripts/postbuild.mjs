#!/usr/bin/env node
// Post-build: flatten dist/client → dist/ and rename _shell.html → index.html
// so the output is deployable as a standard static site on GitHub Pages,
// Vercel, Netlify, etc. The dist/server bundle is not needed for static
// hosting and is removed.
import { existsSync, rmSync, renameSync, readdirSync, cpSync } from "node:fs";
import { join } from "node:path";

const dist = "dist";
const client = join(dist, "client");
const server = join(dist, "server");

if (!existsSync(client)) {
  console.error(`[postbuild] ${client} not found — did the build run?`);
  process.exit(1);
}

// Move every file/dir from dist/client/* into dist/
for (const entry of readdirSync(client)) {
  const from = join(client, entry);
  const to = join(dist, entry);
  if (existsSync(to)) rmSync(to, { recursive: true, force: true });
  renameSync(from, to);
}
rmSync(client, { recursive: true, force: true });

// Rename SPA shell to index.html (the prerendered fallback that hydrates
// the TanStack client router on any route).
const shell = join(dist, "_shell.html");
const index = join(dist, "index.html");
if (existsSync(shell)) {
  if (existsSync(index)) rmSync(index);
  renameSync(shell, index);
}

// Static hosts don't need the SSR bundle.
if (existsSync(server)) rmSync(server, { recursive: true, force: true });

// SPA fallback for hosts that look for 404.html (GitHub Pages).
cpSync(index, join(dist, "404.html"));

console.log("[postbuild] dist/index.html ready for static deploy.");
