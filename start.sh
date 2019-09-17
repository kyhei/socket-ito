#!/bin/sh
docker run --rm -itd \
-p 3000:3000 \
-p 3001:3001 \
-v $(pwd):/opt/workspace \
-w /opt/workspace \
socket-ito:latest bash
