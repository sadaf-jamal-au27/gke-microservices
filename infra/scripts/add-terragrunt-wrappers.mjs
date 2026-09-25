#!/usr/bin/env node
/** Adds terragrunt.hcl wrapper in each stack dir (Terragrunt 1.x requires terragrunt.hcl). */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const envRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "terragrunt", "environments");
const stacks = [
  "project_services",
  "cloud_storage",
  "github_wif",
  "network",
  "gke",
  "cloudsql",
  "pubsub",
  "cloudrun",
];

for (const env of fs.readdirSync(envRoot)) {
  const envDir = path.join(envRoot, env);
  if (!fs.statSync(envDir).isDirectory()) continue;
  for (const stack of stacks) {
    const dir = path.join(envDir, stack);
    const moduleHcl = path.join(dir, `${stack}.hcl`);
    if (!fs.existsSync(moduleHcl)) continue;
    fs.writeFileSync(
      path.join(dir, "terragrunt.hcl"),
      `include "stack" {
  path = "\${get_terragrunt_dir()}/${stack}.hcl"
}
`
    );
  }
}

console.log("terragrunt.hcl wrappers created for all stacks/environments.");
