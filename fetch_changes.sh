#!/bin/bash

REPO_DIR="/home/tuxedo/Desktop/Dashboard"
VENV_ACTIVATE="$REPO_DIR/.venv/bin/activate"
PORT=9001
BRANCH="main"

cd "$REPO_DIR" || { echo "Cannot cd to $REPO_DIR"; exit 1; }

git fetch origin

LOCAL=$(git rev-parse $BRANCH)
REMOTE=$(git rev-parse origin/$BRANCH)

if [ "$LOCAL" = "$REMOTE" ]; then
    echo "No new commits on $BRANCH branch. Nothing to do."
    exit 0
else
    echo "New commits detected on $BRANCH branch."

    PID=$(lsof -ti tcp:$PORT)
    if [ -n "$PID" ]; then
        echo "Stopping process on port $PORT with PID: $PID"
        kill -9 $PID
    else
        echo "No process running on port $PORT."
    fi

    source "$VENV_ACTIVATE"

    git pull origin $BRANCH

    make run
fi
