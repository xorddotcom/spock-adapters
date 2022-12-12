#!/bin/bash
set -e

# read -p "project: " PROJECT
PROJECT=$1
cd ./src/projects/$PROJECT

if [ -d "./abis" ]
then
    if  [ -d "./types" ] 
    then
        rm -rf ./types
    fi
    typechain --target ethers-v5 --out-dir ./types ./abis/*.json
else
    echo "No abis dir found in $PROJECT"
fi