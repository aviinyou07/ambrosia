#!/usr/bin/env python3
"""
Provision the Ambrosia stack on Coolify via its REST API.

Creates, in one project/environment:

  - a PostgreSQL 16 database (private, no public port)
  - api       -> api.ambrosiavastra.com     from backend/   (port 5000)
  - storefront-> ambrosiavastra.com + www   from frontend/  (port 3000)
  - admin     -> admin.ambrosiavastra.com   from admin/     (port 3001)

...each as a Dockerfile application with auto-deploy ON and watch paths scoped
to its own directory, plus all environment variables.

Idempotent: resources are matched by name and reused rather than duplicated.

Usage:
    export COOLIFY_URL=http://173.249.2.14:8000
    export COOLIFY_TOKEN=<api token with write scope>

    # optional; generated if absent
    export JWT_SECRET=...
    export DB_PASSWORD=...
    # optional; the API still deploys without these, but media uploads will fail
    export R2_ACCESS_KEY_ID=...
    export R2_SECRET_ACCESS_KEY=...

    python3 scripts/provision-coolify.py --dry-run   # show the plan, change nothing
    python3 scripts/provision-coolify.py             # apply
"""

from __future__ import annotations

import argparse
import json
import os
import secrets
import sys
import urllib.error
import urllib.request

GIT_REPO = "https://github.com/aviinyou07/ambrosia"
GIT_BRANCH = "main"
PROJECT_NAME = "ambrosia"
ENVIRONMENT = "production"
DB_NAME_IN_COOLIFY = "ambrosia-db"
POSTGRES_DB = "ambrosia_db"
POSTGRES_USER = "postgres"

R2_ACCOUNT_ID = "80cb977372f202bf141deb4906b650d6"
R2_BUCKET_NAME = "ambrosia"
R2_PUBLIC_URL = "https://pub-8204a887dc104db5bc9768e902671861.r2.dev"

API_DOMAIN = "https://api.ambrosiavastra.com"
STORE_DOMAINS = "https://ambrosiavastra.com,https://www.ambrosiavastra.com"
ADMIN_DOMAIN = "https://admin.ambrosiavastra.com"

PUBLIC_API_URL = "https://api.ambrosiavastra.com/api/v1"

ALLOWED_ORIGINS = (
    "https://ambrosiavastra.com,"
    "https://www.ambrosiavastra.com,"
    "https://admin.ambrosiavastra.com"
)


# ─────────────────────────────── plumbing ────────────────────────────────────

class ApiError(RuntimeError):
    def __init__(self, status: int, body: str, method: str, path: str):
        self.status = status
        self.body = body
        super().__init__(f"{method} {path} -> HTTP {status}\n{body}")


class Coolify:
    def __init__(self, base: str, token: str, dry_run: bool = False):
        self.base = base.rstrip("/")
        self.token = token
        self.dry_run = dry_run

    def _call(self, method: str, path: str, payload: dict | None = None):
        url = f"{self.base}/api/v1{path}"
        data = json.dumps(payload).encode() if payload is not None else None
        req = urllib.request.Request(url, data=data, method=method)
        req.add_header("Authorization", f"Bearer {self.token}")
        req.add_header("Accept", "application/json")
        if data:
            req.add_header("Content-Type", "application/json")
        try:
            with urllib.request.urlopen(req, timeout=60) as resp:
                raw = resp.read().decode()
        except urllib.error.HTTPError as exc:
            raise ApiError(exc.code, exc.read().decode(), method, path) from None
        except urllib.error.URLError as exc:
            raise RuntimeError(f"Cannot reach {url}: {exc.reason}") from None
        if not raw.strip():
            return {}
        try:
            return json.loads(raw)
        except json.JSONDecodeError:
            return {"raw": raw}

    def get(self, path: str):
        return self._call("GET", path)

    def post(self, path: str, payload: dict):
        if self.dry_run:
            print(f"    [dry-run] POST {path}")
            for k, v in payload.items():
                shown = "***" if any(s in k for s in ("password", "secret", "SECRET")) else v
                print(f"        {k} = {shown}")
            return {"uuid": f"DRY-RUN-{secrets.token_hex(4)}"}
        return self._call("POST", path, payload)


def step(msg: str) -> None:
    print(f"\n\033[1m==> {msg}\033[0m")


def ok(msg: str) -> None:
    print(f"    \033[32m✔\033[0m {msg}")


def info(msg: str) -> None:
    print(f"    · {msg}")


def warn(msg: str) -> None:
    print(f"    \033[33m!\033[0m {msg}")


# ──────────────────────────── application specs ──────────────────────────────

def app_specs(db_url: str, jwt_secret: str) -> list[dict]:
    """Each app: Coolify creation payload + the env vars it needs."""
    web_envs = [
        # NEXT_PUBLIC_* must exist at BUILD time: they are inlined into the
        # client bundle. is_buildtime is the real field name (the public API
        # docs omit it); Coolify defaults it to true, but we are explicit.
        {"key": "NEXT_PUBLIC_API_URL", "value": PUBLIC_API_URL,
         "is_buildtime": True, "is_runtime": True},
        {"key": "NEXT_PUBLIC_R2_PUBLIC_URL", "value": R2_PUBLIC_URL,
         "is_buildtime": True, "is_runtime": True},
    ]

    return [
        {
            "label": "api",
            "create": {
                "name": "ambrosia-api",
                "description": "Ambrosia Express API (api.ambrosiavastra.com)",
                "git_repository": GIT_REPO,
                "git_branch": GIT_BRANCH,
                "build_pack": "dockerfile",
                "base_directory": "/backend",
                "dockerfile_location": "/Dockerfile",
                "ports_exposes": "5000",
                "domains": API_DOMAIN,
                "watch_paths": "backend/*",
                "is_auto_deploy_enabled": True,
                "is_force_https_enabled": True,
                "health_check_enabled": True,
                "health_check_path": "/api/health",
                "health_check_port": "5000",
                "health_check_method": "GET",
                "health_check_return_code": 200,
                "health_check_scheme": "http",
                "health_check_interval": 30,
                "health_check_timeout": 5,
                "health_check_retries": 3,
                "health_check_start_period": 30,
            },
            "envs": [
                {"key": "NODE_ENV", "value": "production"},
                {"key": "PORT", "value": "5000"},
                {"key": "DATABASE_URL", "value": db_url},
                # Empty on purpose: Coolify's Postgres is reached over the
                # private Docker network and serves no TLS.
                {"key": "DB_SSL", "value": ""},
                {"key": "JWT_SECRET", "value": jwt_secret},
                {"key": "R2_ACCOUNT_ID", "value": R2_ACCOUNT_ID},
                {"key": "R2_BUCKET_NAME", "value": R2_BUCKET_NAME},
                {"key": "R2_PUBLIC_URL", "value": R2_PUBLIC_URL},
                {"key": "R2_ACCESS_KEY_ID",
                 "value": os.environ.get("R2_ACCESS_KEY_ID", "")},
                {"key": "R2_SECRET_ACCESS_KEY",
                 "value": os.environ.get("R2_SECRET_ACCESS_KEY", "")},
                {"key": "ALLOWED_ORIGINS", "value": ALLOWED_ORIGINS},
            ],
        },
        {
            "label": "storefront",
            "create": {
                "name": "ambrosia-storefront",
                "description": "Ambrosia storefront (ambrosiavastra.com)",
                "git_repository": GIT_REPO,
                "git_branch": GIT_BRANCH,
                "build_pack": "dockerfile",
                "base_directory": "/frontend",
                "dockerfile_location": "/Dockerfile",
                "ports_exposes": "3000",
                "domains": STORE_DOMAINS,
                "watch_paths": "frontend/*",
                "is_auto_deploy_enabled": True,
                "is_force_https_enabled": True,
            },
            "envs": web_envs,
        },
        {
            "label": "admin",
            "create": {
                "name": "ambrosia-admin",
                "description": "Ambrosia admin portal (admin.ambrosiavastra.com)",
                "git_repository": GIT_REPO,
                "git_branch": GIT_BRANCH,
                "build_pack": "dockerfile",
                "base_directory": "/admin",
                "dockerfile_location": "/Dockerfile",
                "ports_exposes": "3001",
                "domains": ADMIN_DOMAIN,
                "watch_paths": "admin/*",
                "is_auto_deploy_enabled": True,
                "is_force_https_enabled": True,
            },
            "envs": web_envs,
        },
    ]


# ──────────────────────────────── main flow ──────────────────────────────────

def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true",
                    help="print the plan without creating anything")
    args = ap.parse_args()

    base = os.environ.get("COOLIFY_URL", "").strip()
    token = os.environ.get("COOLIFY_TOKEN", "").strip()
    if not base or not token:
        print("COOLIFY_URL and COOLIFY_TOKEN must both be set.", file=sys.stderr)
        return 2

    cf = Coolify(base, token, dry_run=args.dry_run)

    if args.dry_run:
        print("\033[33mDRY RUN — no resources will be created.\033[0m")

    # 1. token + reachability
    step("Checking Coolify API")
    try:
        version = cf.get("/version")
    except ApiError as exc:
        if exc.status in (400, 401):
            print("    Token rejected. Create one at "
                  "Keys & Tokens -> API tokens (needs write scope).",
                  file=sys.stderr)
        raise
    ok(f"Coolify {version.get('raw', version) if isinstance(version, dict) else version}")

    # 2. server
    step("Locating target server")
    servers = cf.get("/servers")
    if not servers:
        print("    No servers found on this Coolify instance.", file=sys.stderr)
        return 1
    reachable = [s for s in servers if (s.get("settings") or {}).get("is_reachable", True)]
    server = (reachable or servers)[0]
    server_uuid = server["uuid"]
    ok(f"server '{server.get('name')}' ({server_uuid})")
    if len(servers) > 1:
        warn(f"{len(servers)} servers present; using the first reachable one")

    # 3. project
    step(f"Project '{PROJECT_NAME}'")
    projects = cf.get("/projects")
    project = next((p for p in projects if p.get("name") == PROJECT_NAME), None)
    if project:
        ok(f"reusing existing project ({project['uuid']})")
    else:
        project = cf.post("/projects", {
            "name": PROJECT_NAME,
            "description": "Ambrosia e-commerce platform",
        })
        ok(f"created project ({project['uuid']})")
    project_uuid = project["uuid"]

    # Environment name: reuse whatever the project already has.
    env_name = ENVIRONMENT
    if not args.dry_run:
        try:
            detail = cf.get(f"/projects/{project_uuid}")
            existing = [e.get("name") for e in (detail.get("environments") or [])]
            if existing and env_name not in existing:
                env_name = existing[0]
                warn(f"'{ENVIRONMENT}' not present; using '{env_name}'")
        except ApiError:
            pass
    info(f"environment: {env_name}")

    # 4. database
    step(f"PostgreSQL '{DB_NAME_IN_COOLIFY}'")
    db_password = os.environ.get("DB_PASSWORD") or secrets.token_urlsafe(24)
    databases = [] if args.dry_run else cf.get("/databases")
    db = next((d for d in databases if d.get("name") == DB_NAME_IN_COOLIFY), None)

    if db:
        ok(f"reusing existing database ({db['uuid']})")
        internal = db.get("internal_db_url") or ""
        if internal:
            db_url = internal
            info("using Coolify's reported internal_db_url")
        else:
            db_url = (f"postgres://{POSTGRES_USER}:{db_password}"
                      f"@{db['uuid']}:5432/{POSTGRES_DB}")
            warn("internal_db_url not reported; DATABASE_URL may need a manual fix")
    else:
        db = cf.post("/databases/postgresql", {
            "server_uuid": server_uuid,
            "project_uuid": project_uuid,
            "environment_name": env_name,
            "name": DB_NAME_IN_COOLIFY,
            "description": "Ambrosia Postgres (private network only)",
            "image": "postgres:16-alpine",
            "postgres_user": POSTGRES_USER,
            "postgres_password": db_password,
            "postgres_db": POSTGRES_DB,
            "is_public": False,
            "instant_deploy": True,
        })
        ok(f"created database ({db['uuid']})")
        internal = ""
        if not args.dry_run:
            try:
                internal = cf.get(f"/databases/{db['uuid']}").get("internal_db_url") or ""
            except ApiError:
                pass
        db_url = internal or (f"postgres://{POSTGRES_USER}:{db_password}"
                              f"@{db['uuid']}:5432/{POSTGRES_DB}")

    info(f"DATABASE_URL host resolves via Coolify's private network")

    # 5. applications
    jwt_secret = os.environ.get("JWT_SECRET") or secrets.token_urlsafe(48)
    applications = [] if args.dry_run else cf.get("/applications")
    created: list[tuple[str, str, str]] = []

    for spec in app_specs(db_url, jwt_secret):
        name = spec["create"]["name"]
        step(f"Application '{name}'")

        existing = next((a for a in applications if a.get("name") == name), None)
        if existing:
            ok(f"already exists ({existing['uuid']}) — skipping creation")
            app_uuid = existing["uuid"]
            info("re-run after deleting it in Coolify if you want it rebuilt from scratch")
        else:
            payload = {
                "project_uuid": project_uuid,
                "server_uuid": server_uuid,
                "environment_name": env_name,
                **spec["create"],
            }
            app = cf.post("/applications/public", payload)
            app_uuid = app.get("uuid", "?")
            ok(f"created ({app_uuid})")
            info(f"base_directory={spec['create']['base_directory']}  "
                 f"watch_paths={spec['create']['watch_paths']}  "
                 f"port={spec['create']['ports_exposes']}")

            for env in spec["envs"]:
                try:
                    cf.post(f"/applications/{app_uuid}/envs", env)
                    flags = []
                    if env.get("is_buildtime"):
                        flags.append("build-time")
                    if env.get("is_shown_once"):
                        flags.append("secret")
                    suffix = f"  ({', '.join(flags)})" if flags else ""
                    print(f"        env {env['key']}{suffix}")
                except ApiError as exc:
                    warn(f"env {env['key']} failed: HTTP {exc.status} {exc.body[:160]}")

        created.append((spec["label"], name, app_uuid))

    # 6. summary
    step("Done")
    print(f"""
    Coolify UI : {cf.base}
    Project    : {PROJECT_NAME} / {env_name}

    Applications created:""")
    for label, name, uuid in created:
        print(f"      {label:<11} {name:<22} {uuid}")

    print(f"""
    NEXT STEPS (in order):

    1. DNS — point all four names at this server, or SSL cannot be issued:
          A  ambrosiavastra.com        173.249.2.14
          A  www.ambrosiavastra.com    173.249.2.14
          A  admin.ambrosiavastra.com  173.249.2.14
          A  api.ambrosiavastra.com    173.249.2.14
       If Cloudflare fronts this, set these to DNS-only (grey cloud) first.

    2. Deploy the API first, then the storefront and admin.

    3. Create the tables once, in the API container's terminal:
          npm run db:schema
          npm run db:seed      # optional demo data
       schema.sql DROPs every table — never run it again once orders exist.

    4. Add the R2 keys if you skipped them: R2_ACCESS_KEY_ID /
       R2_SECRET_ACCESS_KEY on ambrosia-api, then redeploy.

    5. Auto-deploy: Coolify registered a webhook URL per app. Because the repo
       is public, add it under GitHub -> Settings -> Webhooks if pushes do not
       trigger builds on their own. Each app's URL is on its Coolify page.

    Secrets generated by this run are stored in Coolify. If you did not supply
    JWT_SECRET or DB_PASSWORD yourself, read them back from the Coolify UI.""")
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except (ApiError, RuntimeError) as exc:
        print(f"\n\033[31m✖ {exc}\033[0m", file=sys.stderr)
        sys.exit(1)
