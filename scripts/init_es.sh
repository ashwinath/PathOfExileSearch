#!/bin/bash

docker run -d -p 9200:9200 -p 9300:9300 -e "discovery.type=single-node" -e ES_JAVA_OPTS="-Xms800M -Xmx800M" docker.elastic.co/elasticsearch/elasticsearch:6.3.2
