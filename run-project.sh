#!/usr/bin/env bash
cd "$(dirname "$0")"
if ! command -v npm >/dev/null 2>&1; then
  echo "Node.js and npm are required but were not found in PATH."
  echo "Please install Node.js from https://nodejs.org/"
  exit 1
fi

echo "Starting the complete VivaMate AI project..."
npm start
