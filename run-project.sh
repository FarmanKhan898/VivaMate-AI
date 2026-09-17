#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"
if ! command -v npm >/dev/null 2>&1; then
  echo "Node.js and npm are required but were not found in PATH."
  echo "Please install Node.js from https://nodejs.org/"
  exit 1
fi

echo "Starting VivaMate-AI..."
npm install
npm run dev -- --host 0.0.0.0
