#!/bin/bash

cd frontend
rm -rf build/
yarn
yarn build
cp -r build ../build/public
cd ..
