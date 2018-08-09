#!/bin/bash

ssh -o "StrictHostKeyChecking no" travis@ashwinchat.com -t "curl -XDELETE 'localhost:9200/items' && docker pull ashwinath/poe-search-bot && docker stop poe-search-bot && docker rm poe-search-bot && docker run --name poe-search-bot -e ES_HOST='10.15.0.5:9200' -e DISCORD_TOKEN=${DISCORD_TOKEN} -d ashwinath/poe-search-bot && docker image prune -f"
