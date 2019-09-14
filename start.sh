#!/bin/sh
docker run --rm -itd \
-p 3000:3000 \
-v $(pwd):/opt/workspace \
-w /opt/workspace \
socket-ito:latest bash
