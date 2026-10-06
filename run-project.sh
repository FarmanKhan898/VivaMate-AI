#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"

NPM_CMD="$(command -v npm || true)"
TEMP_DIR=""

if [[ -z "$NPM_CMD" ]]; then
  OS_NAME="$(uname -s)"
  MACHINE="$(uname -m)"

  case "$OS_NAME" in
    Linux) NODE_OS="linux" ;;
    Darwin) NODE_OS="osx" ;;
    *) echo "Automatic Node.js setup is not supported on $OS_NAME."; exit 1 ;;
  esac

  case "$MACHINE" in
    x86_64|amd64) NODE_ARCH="x64" ;;
    arm64|aarch64) NODE_ARCH="arm64" ;;
    *) echo "Automatic Node.js setup is not supported on $MACHINE."; exit 1 ;;
  esac

  if ! command -v curl >/dev/null 2>&1 || ! command -v tar >/dev/null 2>&1; then
    echo "curl and tar are needed to download the portable Node.js runtime."
    exit 1
  fi

  if [[ "$OS_NAME" == "Darwin" ]]; then
    RUNTIME_ROOT="$HOME/Library/Application Support/VivaMateAI"
  else
    RUNTIME_ROOT="${XDG_DATA_HOME:-$HOME/.local/share}/vivamate-ai"
  fi

  echo "Node.js is missing. Finding the latest official LTS runtime..."
  NODE_VERSION="$(curl -fsSL https://nodejs.org/dist/index.json | sed -n 's/.*"version":"\(v[0-9.]*\)".*"lts":"[^"]*".*/\1/p' | sed -n '1p')"
  if [[ -z "$NODE_VERSION" ]]; then
    echo "Could not find a Node.js LTS release. Check your internet connection."
    exit 1
  fi

  RUNTIME_DIR="$RUNTIME_ROOT/node-$NODE_VERSION-$NODE_OS-$NODE_ARCH"
  if [[ ! -x "$RUNTIME_DIR/bin/npm" ]]; then
    ARCHIVE="node-$NODE_VERSION-$NODE_OS-$NODE_ARCH.tar.xz"
    TEMP_DIR="$(mktemp -d)"
    trap 'rm -rf "$TEMP_DIR"' EXIT
    mkdir -p "$RUNTIME_ROOT"
    echo "Downloading Node.js $NODE_VERSION for $NODE_OS/$NODE_ARCH..."
    curl -fL "https://nodejs.org/dist/$NODE_VERSION/$ARCHIVE" -o "$TEMP_DIR/$ARCHIVE"
    tar -xJf "$TEMP_DIR/$ARCHIVE" -C "$TEMP_DIR"
    mv "$TEMP_DIR/node-$NODE_VERSION-$NODE_OS-$NODE_ARCH" "$RUNTIME_DIR"
  fi

  export PATH="$RUNTIME_DIR/bin:$PATH"
  NPM_CMD="$RUNTIME_DIR/bin/npm"
fi

if [[ ! -d backend/node_modules/express ]]; then
  echo "Installing backend requirements..."
  "$NPM_CMD" --prefix "$PWD/backend" ci
fi
if [[ ! -d client/node_modules/vite ]]; then
  echo "Installing frontend requirements..."
  "$NPM_CMD" --prefix "$PWD/client" ci
fi

echo "Starting VivaMate-AI backend..."
(cd backend && "$NPM_CMD" run dev) &
BACKEND_PID=$!

echo "Starting VivaMate-AI frontend..."
(cd client && "$NPM_CMD" run dev -- --host 0.0.0.0) &
FRONTEND_PID=$!

trap 'kill "$BACKEND_PID" "$FRONTEND_PID" 2>/dev/null || true; if [[ -n "${TEMP_DIR:-}" ]]; then rm -rf "$TEMP_DIR"; fi' INT TERM EXIT
sleep 4
URL="http://localhost:5173/"
echo "VivaMate is starting at $URL"
if command -v open >/dev/null 2>&1; then
  open "$URL" >/dev/null 2>&1 || true
elif command -v xdg-open >/dev/null 2>&1; then
  xdg-open "$URL" >/dev/null 2>&1 || true
fi

wait "$BACKEND_PID" "$FRONTEND_PID"
