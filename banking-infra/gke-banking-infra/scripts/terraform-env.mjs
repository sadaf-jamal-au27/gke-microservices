#!/usr/bin/env node
/**
 * @deprecated Use scripts/terraform-stacks.mjs (banking-standard ordered stacks).
 */
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const stacks = path.join(__dirname, "terraform-stacks.mjs");

console.warn("terraform-env.mjs is deprecated — forwarding to terraform-stacks.mjs\n");
const res = spawnSync(process.execPath, [stacks, ...process.argv.slice(2)], { stdio: "inherit" });
process.exit(res.status ?? 1);
