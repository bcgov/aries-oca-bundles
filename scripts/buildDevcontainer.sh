#!/bin/bash

sudo apt-get update
sudo apt-get install -y clang

git clone https://github.com/THCLab/oca-parser-xls.git
cd ./oca-parser-xls && cargo build
# Should check if ~/bin already exists
mkdir ~/bin
cp ./target/debug/parser ~/bin
cd .. && rm -rf ./oca-parser-xls

exit 0