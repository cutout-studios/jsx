#!/bin/bash
set -e

BLUE='\033[0;34m'
X='\033[0m'

ROOT_DIR="$PWD"

clear
echo ""
echo "<buildDenoCore.sh>"
echo -e "$BLUE======================================================================="
echo -e " 1. Cloning deno..."
echo -e "=======================================================================$X"
echo ""

rm -rf .output/deno
git clone https://github.com/denoland/deno.git .output/deno
cd .output/deno
git reset --hard eea9126 # deno v2.7.13
rustup target add aarch64-apple-ios-sim

clear
echo ""
echo "<buildDenoCore.sh>"
echo -e "$BLUE======================================================================="
echo -e " 2. Applying patches..."
echo -e "=======================================================================$X"
echo ""

git apply ../../scripts/buildApple/patches/denoCore.patch

clear
echo ""
echo "<buildDenoCore.sh>"
echo -e "$BLUE======================================================================="
echo -e " 3. Building..."
echo -e "=======================================================================$X"
echo ""

cd libs/core

export RUSTY_V8_ARCHIVE="$ROOT_DIR/.output/rusty_v8/target/aarch64-apple-ios-sim/debug/gn_out/obj/librusty_v8.a"
export RUSTY_V8_SRC_BINDING_PATH="$ROOT_DIR/.output/rusty_v8/target/aarch64-apple-ios-sim/debug/gn_out/src_binding.rs"

cargo build -vv --target aarch64-apple-ios-sim

echo ""
echo -e "$BLUE Build complete."
echo "    - $ROOT_DIR/.output/deno/target/aarch64-apple-ios-sim/debug/libdeno_core.rlib"
echo ""
