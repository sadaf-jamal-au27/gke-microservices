# Branching: feature → develop → main (PR-only automation)

**Guide:** [`docs/PLATFORM_GUIDE.md`](PLATFORM_GUIDE.md)

Org: **`sadaf-jamal-au27`**. Same flow on every repo.

## Branches

| Branch | Role |
|--------|------|
| **`develop`** | Integration. Feature PRs merge here first. |
| **`main`** | Release gate. Only **`develop` → `main`** PRs. |
| **`feature/<name>`** | Short-lived. Open **PR → `develop`** only (no direct push to develop/main for infra). |

```text
feature/* ──PR──► develop ──PR──► main
              │              │
              │              └─ merge → infra-apply (push, env prod)
              └─ merge → infra-apply (push, env dev)

Every PR → infra-plan (static + GCP plan)
Merge to develop/main (infra paths) → infra-apply auto
```

## CI — PR plan, apply on merge

| Step | How | Workflow |
|------|-----|----------|
| **Plan** | Open/update **Pull Request** → `develop` or `main` | **infra-plan** |
| **Merge** | Approve PR on GitHub | — |
| **Apply** | **Automatic** on push to `develop` / `main` (when `infra/**` changed) | **infra-apply** |
| **Apply (manual)** | Actions → **Infra Terraform Apply** → Run workflow | **infra-apply** |

| Merge target | Apply trigger | GitHub env | `tf_env` |
|--------------|---------------|------------|----------|
| **`develop`** | push to `develop` | `dev` | `dev` |
| **`main`** | push to `main` | `prod` | `prod` |

Optional: Environments **`dev`** / **`prod`** → **Required reviewers** (approve before apply job runs).

**No** push-triggered plan — sirf **PR** se plan.

## Daily workflow

```bash
git checkout develop && git pull
git checkout -b feature/my-change
# edit infra/ or fast/
git push -u origin feature/my-change
# GitHub: Open PR → develop → wait for infra-plan checks → merge
# merge triggers infra-apply on develop automatically (if infra/ changed)

# Or re-run: Actions → Infra Terraform Apply → branch develop, env dev
```

Setup:

```bash
cd ~/Projects/gke-retail-infra
./scripts/git-sync-develop.sh
./scripts/github-setup-branch-protection.sh
```

WIF: **`docs/WIF_AND_GITHUB.md`**.

## Protected branches (no direct push)

**`develop`** and **`main`** must stay protected on GitHub:

- **No direct `git push`** to `develop` or `main` — changes only via **Pull Request**
- **Admins included** (`enforce_admins`) — same rule for everyone
- Required checks on PR: `Terraform static checks`, `Terraform plan (GCP)`
- **`main`**: at least **1 PR approval** before merge
- **`develop`**: PR required (0 approvals by default in script — change in script if you want 1)

Apply protection (both infra repos):

```bash
cd ~/Projects/gke-retail-infra
./scripts/github-setup-branch-protection.sh
# or: ./scripts/github-setup-branch-protection.sh gke-retail-infra gke-microservices
```

Correct flow only:

```text
feature/*  ──PR──►  develop  ──PR──►  main
           (never push directly to develop or main)
```
