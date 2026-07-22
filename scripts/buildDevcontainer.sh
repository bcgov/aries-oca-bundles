#!/bin/bash

set -euo pipefail

SUDO=""
if command -v sudo >/dev/null 2>&1; then
    SUDO="sudo"
fi

# Install build prerequisites.
${SUDO} apt-get update
${SUDO} apt-get install -y clang lld

# Build parser in a temp dir so the script is idempotent and leaves no repo noise.
tmpdir="$(mktemp -d)"
trap 'rm -rf "$tmpdir"' EXIT

git clone --depth 1 https://github.com/bcgov/oca-parser-xls.git "$tmpdir/oca-parser-xls"
cd "$tmpdir/oca-parser-xls"
RUSTFLAGS="-C link-arg=-fuse-ld=lld" cargo build

# Install to common user bin locations.
mkdir -p "$HOME/bin" "$HOME/.local/bin"
cp ./target/debug/parser "$HOME/bin/parser"
cp ./target/debug/parser "$HOME/.local/bin/parser"
chmod +x "$HOME/bin/parser" "$HOME/.local/bin/parser"

# Ensure bin folders are on PATH for future interactive shells.
if ! grep -q '\$HOME/bin' "$HOME/.bashrc" 2>/dev/null; then
    echo 'export PATH="$PATH:$HOME/bin:$HOME/.local/bin"' >> "$HOME/.bashrc"
fi

echo "Installed parser to: $HOME/bin/parser and $HOME/.local/bin/parser"
"$HOME/bin/parser" --version