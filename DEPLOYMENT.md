# Ambrosia — Coolify Deployment & CI/CD Runbook

Three applications, one monorepo, one push to deploy.

| App        | Directory   | Domain                       | Container port |
|------------|-------------|------------------------------|----------------|
| Storefront | `frontend/` | `ambrosiavastra.com`         | 3000           |
| Admin      | `admin/`    | `admin.ambrosiavastra.com`   | 3001           |
| API        | `backend/`  | `api.ambrosiavastra.com`     | 5000           |
| Postgres   | —           | internal only                | 5432           |

**Pipeline:** `git push origin main` → GitHub webhook → Coolify pulls, builds the
app's Dockerfile, deploys, swaps traffic over. No registry, no GitHub Actions.

---

## 0. One-time: DNS

At your DNS provider, point all three names at the Coolify server's public IP:

```
A     ambrosiavastra.com        <SERVER_IP>
A     www.ambrosiavastra.com    <SERVER_IP>
A     admin.ambrosiavastra.com  <SERVER_IP>
A     api.ambrosiavastra.com    <SERVER_IP>
```

If Cloudflare is in front, set these records to **DNS only (grey cloud)** until
Let's Encrypt has issued certificates, otherwise the HTTP-01 challenge fails.
You can switch to proxied afterwards, but then set Cloudflare SSL mode to
**Full (strict)**.

Verify before continuing — Coolify cannot issue SSL until DNS resolves:

```bash
dig +short ambrosiavastra.com admin.ambrosiavastra.com api.ambrosiavastra.com
```

---

## 1. Automated path (recommended)

Everything in sections 2 and 3 can be created in one command by
`scripts/provision-coolify.py`, which talks to the Coolify REST API. It is
idempotent — it matches resources by name and reuses them rather than
duplicating.

```bash
export COOLIFY_URL=http://173.249.2.14:8000
export COOLIFY_TOKEN=<API token with write scope>   # Keys & Tokens -> API tokens

# optional — generated and stored in Coolify if omitted
export JWT_SECRET=$(openssl rand -base64 48)
export DB_PASSWORD=$(openssl rand -base64 24)
# optional — without these the API deploys but media uploads fail
export R2_ACCESS_KEY_ID=...
export R2_SECRET_ACCESS_KEY=...

python3 scripts/provision-coolify.py --dry-run   # show the plan, change nothing
python3 scripts/provision-coolify.py             # apply
```

It creates the Postgres, all three applications with the correct base
directories, ports, domains, health check, **auto-deploy on**, **watch paths**,
and every environment variable — including the `NEXT_PUBLIC_*` values marked
build-time.

The repository is **public**, so no GitHub App install is required.

Sections 2–3 below document the equivalent manual UI steps; do those only if
you would rather click through it.

---

## 1b. Git source

The three applications use the **`aviinyou` GitHub App** source that was already
installed on this Coolify instance (the same one the `sgarf` project uses).

That matters for CI/CD: Coolify never polls GitHub, so something has to tell it a
push happened. With a GitHub App source the App itself delivers push events, so
**no repository webhook is needed and none should be added** — a manual webhook
alongside the App would deliver the same push twice and deploy everything twice.

Only if an app is created as a *public repository* source does Coolify lack the
credentials to register a webhook, in which case you add one manually pointing at
`/webhooks/source/github/events/manual` with the app's secret.

## 1c. Connect a new GitHub App (only if one is not installed)

In Coolify: **Sources → + Add → GitHub App**, install it on
`aviinyou07/ambrosia`, and grant it read access to the repo.

Using a GitHub **App** (not a deploy key) is what makes push-to-deploy work
automatically — Coolify registers the webhook for you.

---

## 2. Create the Postgres database

**+ New → Database → PostgreSQL 16.**

- Name: `ambrosia-db`
- Set a strong password
- **Do not** expose it publicly — leave "Public Port" empty

Once started, copy the **internal connection URL** from the database page. It
looks like:

```
postgres://postgres:<password>@<internal-service-name>:5432/postgres
```

Note the database name at the end. If it is `postgres`, either use that or
create `ambrosia_db` first:

```bash
# From Coolify's terminal on the database container
psql -U postgres -c "CREATE DATABASE ambrosia_db;"
```

> The backend reaches Postgres over Coolify's private Docker network. That
> network serves **no TLS**, which is why `DB_SSL` must be left empty (see
> §3.3). All four apps must be in the **same Coolify project/environment** for
> the internal hostname to resolve.

---

## 3. Create the three applications

For each one: **+ New → Application → Public/Private Repository → `aviinyou07/ambrosia`**.

Common settings for all three:

| Setting            | Value                         |
|--------------------|-------------------------------|
| Branch             | `main`                        |
| Build Pack         | **Dockerfile**                |
| Base Directory     | the app's folder (below)      |
| Dockerfile Location| `Dockerfile`                  |
| Auto Deploy        | **On**                        |

### 3.1 Storefront — `ambrosiavastra.com`

- Base Directory: `/frontend`
- Ports Exposes: `3000`
- Domains: `https://ambrosiavastra.com`, `https://www.ambrosiavastra.com`

Environment variables — **tick "Build Variable" on both**:

```
NEXT_PUBLIC_API_URL=https://api.ambrosiavastra.com/api/v1
NEXT_PUBLIC_R2_PUBLIC_URL=https://pub-8204a887dc104db5bc9768e902671861.r2.dev
```

> ⚠️ **This is the single most common way this deploy goes wrong.**
> `NEXT_PUBLIC_*` values are compiled into the browser bundle at *build* time.
> If they are not available to the build, it bakes in `undefined` and every API
> call from the browser fails — while the container still starts and reports
> healthy. Verified locally: with the build args passed, the API URL appears in
> `.next/static`; without them, it appears **zero** times.
>
> In Coolify's API the field is `is_buildtime` (the public API docs omit it) and
> it defaults to `true`, so variables are usually available to the build. The UI
> still exposes it as a per-variable toggle, so confirm it is on for both keys.
> `scripts/provision-coolify.py` sets it explicitly.

### 3.2 Admin — `admin.ambrosiavastra.com`

- Base Directory: `/admin`
- Ports Exposes: `3001`
- Domains: `https://admin.ambrosiavastra.com`
- Same two env vars as above, **also as Build Variables**

### 3.3 API — `api.ambrosiavastra.com`

- Base Directory: `/backend`
- Ports Exposes: `5000`
- Domains: `https://api.ambrosiavastra.com`
- Health Check Path: `/api/health`

Environment variables (runtime only — no build variables needed):

```
NODE_ENV=production
PORT=5000

# Internal URL from §2, with the correct database name
DATABASE_URL=postgres://postgres:<password>@<internal-service-name>:5432/ambrosia_db

# MUST stay empty for Coolify's internal Postgres — it serves no TLS.
# Set to `require` only for a hosted DB such as Neon/Supabase/RDS.
DB_SSL=

# Generate with: openssl rand -base64 48
JWT_SECRET=<long-random-secret>

R2_ACCOUNT_ID=80cb977372f202bf141deb4906b650d6
R2_BUCKET_NAME=ambrosia
R2_PUBLIC_URL=https://pub-8204a887dc104db5bc9768e902671861.r2.dev
R2_ACCESS_KEY_ID=<from Cloudflare R2>
R2_SECRET_ACCESS_KEY=<from Cloudflare R2>

ALLOWED_ORIGINS=https://ambrosiavastra.com,https://www.ambrosiavastra.com,https://admin.ambrosiavastra.com
```

Deploy the API **first**, then the two frontends.

---

## 4. One-time: create the database tables

The API container ships the SQL files and a guarded runner. Open the API
container's terminal in Coolify and run:

```bash
npm run db:schema   # creates all 9 tables
npm run db:seed     # optional: demo catalogue data
```

> 🛑 `src/database/schema.sql` starts with `DROP TABLE ... CASCADE` — it wipes
> every table. That is why it is **never** run automatically on deploy, and why
> `db:schema` carries an explicit `--i-know-this-drops-tables` acknowledgement.
> **Never run it again** once you have real orders. Future schema changes should
> be new, additive `ALTER TABLE` migration files.

---

## 5. Verify

```bash
curl -s https://api.ambrosiavastra.com/api/health      # {"status":"healthy","database":"connected"}
curl -s https://api.ambrosiavastra.com/api/v1/products # seeded catalogue
curl -I https://ambrosiavastra.com                     # 200, valid cert
curl -I https://admin.ambrosiavastra.com               # 200, valid cert
```

Then open the storefront in a browser and check the **Network** tab: XHR calls
must go to `https://api.ambrosiavastra.com/api/v1/...`. If they go to
`localhost:5000` or `undefined`, the build variables from §3.1 were not applied
— fix them and **redeploy** (a restart is not enough; the value is baked in at
build time).

---

## 6. The CI/CD loop

```bash
git add .
git commit -m "feat: whatever you changed"
git push origin main
```

GitHub fires the webhook; Coolify rebuilds and redeploys **only the apps whose
base directory changed** if you enable per-app path filters:

> In each application → **Advanced → Watch Paths**, set
> `frontend/**` / `admin/**` / `backend/**` respectively. Without this, every
> push rebuilds all three apps — correct, just slower.
>
> ⚠️ Use `**`, not `*`. Coolify compiles `*` to `[^/]*`, which cannot cross a
> `/`, so `frontend/*` matches only files directly inside `frontend/` and
> ignores every nested change — which is almost every real commit. The symptom
> is silent: GitHub reports the webhook delivered `200 OK` while Coolify replies
> `"Changed files do not match watch paths. Ignoring deployment."` You can read
> that reply under GitHub → Settings → Webhooks → Recent Deliveries.

Rollback: **Deployments** tab → pick a previous successful deployment → **Rollback**.

---

## 7. Local full-stack run

```bash
docker compose up --build
# storefront http://localhost:3000 · admin http://localhost:3001 · api http://localhost:5000
```

`docker-compose.yml` is for local development only — Coolify does not read it.

---

## Troubleshooting

| Symptom | Cause / fix |
|---|---|
| `The server does not support SSL connections` | `DB_SSL` is set against Coolify's internal Postgres. Clear it. |
| `database: "degraded"` on `/api/health` | Wrong `DATABASE_URL`, wrong database name, or DB not in the same Coolify project. |
| Browser calls `undefined/api/v1/...` | `NEXT_PUBLIC_*` not set as **Build Variables**. Fix and redeploy. |
| CORS error in console | Domain missing from `ALLOWED_ORIGINS`. Note `*.ambrosiavastra.com` is already allowed by `backend/src/server.ts`. |
| SSL certificate won't issue | DNS not resolving to the server yet, or Cloudflare proxy is on. Grey-cloud it, retry. |
| Build OOM on a small VPS | Next builds are memory-hungry. Add swap: `fallocate -l 4G /swapfile && chmod 600 /swapfile && mkswap /swapfile && swapon /swapfile`. |
| Uploaded files vanish after redeploy | Expected — the container is ephemeral. R2 is the real store; `/app/uploads` is only a fallback. Add a Coolify persistent volume on `/app/uploads` if you rely on it. |
