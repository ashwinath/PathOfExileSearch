#!/bin/bash

ssh -o "StrictHostKeyChecking no" travis@ashwinchat.com -t "docker pull ashwinath/poe-search-bot && docker stop poe-search-bot && docker rm poe-search-bot && docker run --name poe-search-bot -e ES_HOST='10.15.0.5:9200' -e DISCORD_TOKEN=${DISCORD_TOKEN} -e ENV='PROD' -v /var/log/poe-search:/var/log/poe-search -p 7000:7000 -d ashwinath/poe-search-bot && docker image prune -f"
