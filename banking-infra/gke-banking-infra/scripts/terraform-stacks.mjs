#!/usr/bin/env node
/**
 * Banking landing zone — ordered stacks with environment-specific GCS state.
 *
 *   node scripts/terraform-stacks.mjs fmt
 *   node scripts/terraform-stacks.mjs validate dev
 *   TF_VAR_database_password=... node scripts/terraform-stacks.mjs plan dev
 */
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(__dirname, "..");

const STACKS = [
  "00-foundation",
  "01-iam",
  "02-network",
  "03-vpcsc",
  "04-security",
  "05-platform",
  "06-data",
];

function liveDir(env) {
  return path.join(REPO, "terraform/live", env);
}

function stackDir(env, stack) {
  return path.join(liveDir(env), stack);
}

function sharedTfvars(env) {
  return path.join(liveDir(env), "shared.tfvars");
}

function readStateBucket(env) {
  const tfvars = existsSync(sharedTfvars(env))
    ? sharedTfvars(env)
    : path.join(liveDir(env), "shared.tfvars.example");
  if (!existsSync(tfvars)) {
    console.error(`Missing ${tfvars}`);
    process.exit(1);
  }
  const m = readFileSync(tfvars, "utf-8").match(/state_bucket_name\s*=\s*"([^"]+)"/);
  return m?.[1];
}

function run(cmd, args, cwd) {
  const res = spawnSync(cmd, args, { stdio: "inherit", cwd, env: process.env });
  if (res.status !== 0) process.exit(res.status ?? 1);
}

function extraVarFiles(env) {
  const shared = sharedTfvars(env);
  const example = path.join(liveDir(env), "shared.tfvars.example");
  if (existsSync(shared)) return ["-var-file", shared];
  if (existsSync(example)) return ["-var-file", example];
  return [];
}

function ensureStateBucket(env) {
  const bucket = readStateBucket(env);
  if (!bucket || bucket.includes("your-gcp")) return;
  const check = spawnSync(
    "gcloud",
    ["storage", "buckets", "describe", `gs://${bucket}`, "--format=value(name)"],
    { encoding: "utf-8" }
  );
  if (check.status === 0) return;
  const loc = process.env.TF_STATE_BUCKET_LOCATION ?? "asia-south1";
  console.log(`Creating state bucket gs://${bucket}`);
  run("gcloud", [
    "storage",
    "buckets",
    "create",
    `gs://${bucket}`,
    `--location=${loc}`,
    "--uniform-bucket-level-access",
    "--public-access-prevention",
  ]);
}

const [command, env = "dev"] = process.argv.slice(2);

if (command === "fmt") {
  run("terraform", ["fmt", "-recursive", path.join(REPO, "terraform")]);
  process.exit(0);
}

if (!["init", "validate", "plan", "apply"].includes(command)) {
  console.error("Usage: node scripts/terraform-stacks.mjs <init|fmt|validate|plan|apply> [dev]");
  process.exit(1);
}

if (command === "validate") {
  for (const stack of STACKS) {
    const dir = stackDir(env, stack);
    console.log(`\n=== validate ${stack} ===`);
    run("terraform", ["init", "-backend=false", "-input=false"], dir);
    run("terraform", ["validate"], dir);
  }
  process.exit(0);
}

if (command === "init") {
  ensureStateBucket(env);
  for (const stack of STACKS) {
    const dir = stackDir(env, stack);
    const backend = path.join(dir, "backend.hcl");
    console.log(`\n=== init ${stack} ===`);
    run("terraform", ["init", "-reconfigure", "-backend-config", backend], dir);
  }
  process.exit(0);
}

if (command === "plan" || command === "apply") {
  ensureStateBucket(env);
  const planRoot = process.env.TF_PLAN_DIR ?? path.join(REPO, ".terraform-plan", env);
  mkdirSync(planRoot, { recursive: true });
  const vars = extraVarFiles(env);

  for (const stack of STACKS) {
    if (stack === "06-data" && !process.env.TF_VAR_database_password) {
      if (command === "plan") {
        process.env.TF_VAR_database_password = "ci-plan-placeholder";
        console.warn("TF_VAR_database_password unset — using placeholder for plan only.");
      } else {
        console.error("Set TF_VAR_database_password for stack 06-data (Cloud SQL user banking_app).");
        process.exit(1);
      }
    }
    const dir = stackDir(env, stack);
    const backend = path.join(dir, "backend.hcl");
    const planFile = path.join(planRoot, `${stack}.tfplan`);
    console.log(`\n=== ${command} ${stack} ===`);
    run("terraform", ["init", "-reconfigure", "-backend-config", backend], dir);

    if (command === "plan") {
      run("terraform", ["plan", "-input=false", "-out", planFile, ...vars], dir);
      continue;
    }

    if (!existsSync(planFile)) {
      run("terraform", ["plan", "-input=false", "-out", planFile, ...vars], dir);
    }
    run("terraform", ["apply", "-input=false", planFile], dir);
  }
}
