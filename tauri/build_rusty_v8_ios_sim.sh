#!/bin/bash
set -e

BLUE='\033[0;34m'
X='\033[0m' # No Color

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
echo -e "   $ brew install rust rustup # (Also installs the correct Python version.)"
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

clear
echo ""
echo -e "$BLUE======================================================================="
echo -e " 1. Gathering dependencies"
echo -e "======================================================================="
echo -e "   1.1. Cloning rusty_v8...$X"
echo ""

rm -rf rusty_v8
git clone https://github.com/denoland/rusty_v8.git
cd rusty_v8
git reset --hard 3480067 # v147.4.0
git submodule update --init --recursive

echo ""
echo -e "$BLUE   1.2. Fetching standard toolchain...$X"
echo ""

mkdir -p target/aarch64-apple-ios-sim/debug/clang
python3 tools/clang/scripts/update.py --output-dir target/aarch64-apple-ios-sim/debug/clang

clear
echo ""
echo -e "$BLUE======================================================================="
echo -e " 2. Modifying build"
echo -e "======================================================================="
echo -e "   2.1. Patch rusty_v8/build.rs$X"

git apply ../ios_build.patch

echo -e "$BLUE   2.2. Inject native Apple toolchain -"
echo -e "     2.2.1. - for linker_driver.py$X"

cd target/aarch64-apple-ios-sim/debug/clang/bin

ln -sf /usr/bin/otool llvm-otool
ln -sf /usr/bin/nm llvm-nm
ln -sf /usr/bin/strip llvm-strip
ln -sf /usr/bin/install_name_tool llvm-install-name-tool

cd ../../../../../

echo -e "$BLUE     2.2.2. - for Ninja$X"

mkdir -p target/aarch64-apple-ios-sim/debug/clang/lib/clang/23/lib/darwin
XCODE_RT_DIR=$(dirname $(find $(xcode-select -p)/Toolchains -name "libclang_rt.iossim.a" | head -n 1))
ln -sf "$XCODE_RT_DIR/"*.a target/aarch64-apple-ios-sim/debug/clang/lib/clang/23/lib/darwin/

echo ""
echo -e "$BLUE======================================================================="
echo -e " 3. Cross-compiling for iOS Simulator..."
echo -e "=======================================================================$X"
echo ""
rustup target add aarch64-apple-ios-sim
V8_FROM_SOURCE=1 cargo build -vv --target aarch64-apple-ios-sim --no-default-features

echo ""
echo -e "$BLUE Build complete."
echo "    - C++ V8 Library: $PWD/target/aarch64-apple-ios-sim/debug/gn_out/obj/librusty_v8.a"
echo "    - Rust Bindings:  $PWD/target/aarch64-apple-ios-sim/debug/libv8.rlib"
echo ""