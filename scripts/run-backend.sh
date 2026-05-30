#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/../backend"
echo "Starting backend on http://localhost:8080 (requires MongoDB on localhost:27017)"
mvn spring-boot:run
