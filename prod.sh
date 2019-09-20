#!/bin/sh
docker run --rm -d \
--name nest-app \
-p 3001:3001 \
-v $(pwd)/server:/opt/workspace \
-w /opt/workspace \
socket-ito:latest yarn start

docker run --rm -d \
--name nuxt-app \
-p 80:3000 \
-v $(pwd)/client:/opt/workspace \
-w /opt/workspace \
socket-ito:latest yarn start