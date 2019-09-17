#!/bin/sh
docker run --rm -itd \
--name nest-app \
-p 3001:3001 \
-v $(pwd):/opt/workspace \
-w /opt/workspace \
socket-ito:latest bash

docker run --rm -itd \
--name nuxt-app \
-p 8000:3000 \
-v $(pwd):/opt/workspace \
-w /opt/workspace \
socket-ito:latest bash