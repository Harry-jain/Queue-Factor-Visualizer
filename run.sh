#!/usr/bin/env bash
set -euo pipefail

force_reinstall=false
for arg in "$@"; do
  case "$arg" in
    -f|--force|--force-reinstall)
      force_reinstall=true
      shift
      ;;
  esac
done

info() { printf "\033[36m[INFO]\033[0m %s\n" "$*"; }
ok() { printf "\033[32m[ OK ]\033[0m %s\n" "$*"; }
warn() { printf "\033[33m[WARN]\033[0m %s\n" "$*"; }
err() { printf "\033[31m[ERR ]\033[0m %s\n" "$*"; }

# cd to script directory
cd "$(dirname "$0")"

if ! command -v node >/dev/null 2>&1; then
  err "Node.js is required. Install from https://nodejs.org and retry."
  exit 1
fi
if ! command -v npm >/dev/null 2>&1; then
  err "npm is required. It comes with Node.js."
  exit 1
fi

ok "Node $(node -v), npm $(npm -v) detected"

# Install deps if needed
if $force_reinstall || [ ! -d node_modules ]; then
  info "Installing dependencies (npm ci if lockfile exists, else npm install)..."
  if [ -f package-lock.json ]; then
    npm ci --no-fund --no-audit
  else
    npm install --no-fund --no-audit
  fi
  ok "Dependencies installed"
else
  info "Dependencies already present (use --force to reinstall)"
fi

info "Starting dev server (Vite) on http://localhost:3000 ..."
LOG_FILE="dev-server.log"
rm -f "$LOG_FILE"

# Start server in background and redirect logs
(
  npm run dev --silent
) >"$LOG_FILE" 2>&1 &
SERVER_PID=$!

# Wait for readiness
URL="http://localhost:3000"
deadline=$(( $(date +%s) + 120 ))
while [ $(date +%s) -lt $deadline ]; do
  if command -v curl >/dev/null 2>&1; then
    if curl -sSf "$URL" >/dev/null 2>&1; then break; fi
  elif command -v wget >/dev/null 2>&1; then
    if wget -qO- "$URL" >/dev/null 2>&1; then break; fi
  fi
  sleep 0.5
done

if command -v curl >/dev/null 2>&1; then
  if ! curl -sSf "$URL" >/dev/null 2>&1; then
    warn "Server did not respond in time. Check $LOG_FILE."
  else
    ok "Server is up at $URL"
  fi
elif command -v wget >/dev/null 2>&1; then
  if ! wget -qO- "$URL" >/dev/null 2>&1; then
    warn "Server did not respond in time. Check $LOG_FILE."
  else
    ok "Server is up at $URL"
  fi
else
  warn "Neither curl nor wget found; skipping readiness check."
fi

# Open default browser
open_url() {
  if command -v xdg-open >/dev/null 2>&1; then xdg-open "$1" >/dev/null 2>&1 || true; return; fi
  if command -v gnome-open >/dev/null 2>&1; then gnome-open "$1" >/dev/null 2>&1 || true; return; fi
  if command -v kde-open >/dev/null 2>&1; then kde-open "$1" >/dev/null 2>&1 || true; return; fi
  if command -v open >/dev/null 2>&1; then open "$1" >/dev/null 2>&1 || true; return; fi # macOS
}

open_url "$URL" || warn "Could not open browser automatically."

info "Server pid: $SERVER_PID (logs: $LOG_FILE). Press Ctrl+C to stop."

# Keep foreground attached to background process
wait $SERVER_PID

