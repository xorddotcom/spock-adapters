#!/bin/bash

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