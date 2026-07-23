#!/bin/bash

set -euo pipefail

MKDOCS_MATERIAL_VERSION="${MKDOCS_MATERIAL_VERSION:-9.7.7}"
AJV_CLI_VERSION="${AJV_CLI_VERSION:-5.0.0}"

SUDO=""
if command -v sudo >/dev/null 2>&1; then
    SUDO="sudo"
fi

# Install build and runtime prerequisites used by repo scripts.
${SUDO} apt-get update
${SUDO} apt-get install -y clang lld rsync

# Install docs and schema validation tooling used in CI/workflows.
python3 -m pip install --user --upgrade "mkdocs-material==${MKDOCS_MATERIAL_VERSION}"
npm install -g "ajv-cli@${AJV_CLI_VERSION}"

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

# Verify that all required commands are available for local workflows.
required_cmds=(
    parser
    jq
    shasum
    rsync
    mkdocs
    ajv
    cargo
    clang
    lld
)

for cmd in "${required_cmds[@]}"; do
    if ! command -v "$cmd" >/dev/null 2>&1; then
        echo "ERROR: Required command not found after setup: $cmd"
        exit 1
    fi
done

echo "mkdocs version: $(mkdocs --version)"
echo "ajv version: $(ajv --version)"