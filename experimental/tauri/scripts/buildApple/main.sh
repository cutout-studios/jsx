#!/bin/bash
set -e

BLUE='\033[0;34m'
X='\033[0m'
clear

echo ""
echo -e "$BLUE===================================================================="
echo -e " REQUIRED DEPENDENCIES"
echo -e "====================================================================$X"
echo -e ""
echo -e "Make sure you have the following:"
echo -e ""
echo -e "1. An Apple Silicon Mac with FULL Xcode (Not just Command Line Tools):"
echo -e "   $ sudo xcode-select -s /Applications/Xcode.app/Contents/Developer"
echo -e "   $ sudo xcodebuild -license accept"
echo -e ""
echo -e "2. Rust & Friends (Recommended via Homebrew)"
echo -e "   $ brew install rustup # (Also installs the correct Rust + Python version.)"
echo -e "   $ rustup target add aarch64-apple-ios-sim"
echo -e ""
echo -e "$BLUE===================================================================="
echo -e " LIMITATIONS"
echo -e "====================================================================$X"
echo -e ""
echo -e "In order to satisfy iOS' restrictions, we must disable..."
echo -e ""
echo -e "- V8 JIT compilation (and by extension, WASM). This has runtime performance penalties."
echo -e "- Compressed pointers. This roughly doubles the size of the Javascript Heap."
echo -e ""
echo -e "Lite mode has also been enabled, to reduce memory pressure."
echo -e ""
echo -e "Starting in 10..."
echo -e ""
echo -e "$BLUE====================================================================$X"
sleep 10

scripts/buildApple/buildRustyV8.sh

echo -e ""
echo -e "$BLUE Building Deno Core in 5..."
echo -e "====================================================================$X"
echo -e ""
sleep 5

scripts/buildApple/buildDenoCore.sh
