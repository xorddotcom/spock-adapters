#!/bin/bash

echo 'Common'
typechain --target ethers-v5 --out-dir ./src/contracts/types ./src/contracts/abis/*.json

GENERATE_PATH_SCRIPT=./src/scripts/generate.sh
PROJECTS=$(ls ./src/projects)

for PROJECT in $PROJECTS ;
    do
        if [ $PROJECT = 'index.ts' ]
        then 
            continue
        else
            echo $PROJECT
            bash $GENERATE_PATH_SCRIPT $PROJECT
        fi
    done