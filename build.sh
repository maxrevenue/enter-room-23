#!/usr/bin/env bash
set -euo pipefail

# ---------------------------------------------------------------------------
# Vercel build script — installs .NET SDK 10.0, restores Fable tooling,
# compiles F# → JS via Fable 5, then runs Vite production build → dist/
# ---------------------------------------------------------------------------

DOTNET_INSTALL_DIR="${DOTNET_INSTALL_DIR:-$HOME/.dotnet}"
DOTNET_CHANNEL="10.0"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Midnight Lounge · Vercel build"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 1) Install .NET SDK if not already cached
if ! command -v dotnet &> /dev/null; then
  echo "→ Installing .NET SDK ${DOTNET_CHANNEL} to ${DOTNET_INSTALL_DIR} ..."
  curl -sSL https://dot.net/v1/dotnet-install.sh | bash /dev/stdin \
    --channel "${DOTNET_CHANNEL}" \
    --install-dir "${DOTNET_INSTALL_DIR}"
  export PATH="${DOTNET_INSTALL_DIR}:$PATH"
  export DOTNET_ROOT="${DOTNET_INSTALL_DIR}"
  echo "  → dotnet $(dotnet --version) installed"
else
  echo "→ .NET SDK already installed: $(dotnet --version)"
fi

# 2) Restore .NET local tools (Fable compiler)
echo "→ Restoring .NET tools (fable ${DOTNET_CHANNEL}) ..."
dotnet tool restore

# 3) Compile F# to JavaScript via Fable
echo "→ Compiling F# to JS (Fable 5) ..."
dotnet fable src/App.fsproj -o build

# 4) Bundle with Vite
echo "→ Bundling with Vite ..."
npx vite build

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Build complete → dist/"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"