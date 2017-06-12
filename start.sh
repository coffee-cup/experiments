#!/bin/sh

set -e

echo "Pulling..."
git pull

echo "Installing dependencies..."
npm install

echo "Building..."
npm run build

echo "Done. 🚀"
