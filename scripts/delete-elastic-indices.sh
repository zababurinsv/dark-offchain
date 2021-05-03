#!/bin/bash

echo "Delete ElasticSearch indices created by Offchain"

curl "localhost:9200/_cat/indices?v"
curl -X DELETE "localhost:9200/darkdot_storefronts?pretty"
curl -X DELETE "localhost:9200/darkdot_products?pretty"
curl -X DELETE "localhost:9200/darkdot_profiles?pretty"
