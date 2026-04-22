#!/bin/bash

sudo apt-get update
sudo apt-get install -y clang lld

git clone https://github.com/bcgov/oca-parser-xls.git
cd ./oca-parser-xls && RUSTFLAGS="-C link-arg=-fuse-ld=lld" cargo build
mkdir -p ~/bin
cp ./target/debug/parser ~/bin
cd .. && sudo rm -rf ./oca-parser-xls

# Ensure ~/bin is on PATH for future terminal sessions
if ! grep -q 'export PATH=.*\$HOME/bin' ~/.bashrc 2>/dev/null; then
    echo 'export PATH="$PATH:$HOME/bin"' >> ~/.bashrc
fi

exit 0