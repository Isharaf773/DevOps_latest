#!/bin/sh
# Runs automatically at container start (nginx image runs /docker-entrypoint.d/*.sh).
# Writes the public API URL into env-config.js so the SAME image works on any host.
set -eu
API_URL="${API_URL:-}"
ESCAPED=$(printf '%s' "$API_URL" | sed 's/\\/\\\\/g; s/"/\\"/g')
printf 'window.__ENV__ = { API_URL: "%s" };\n' "$ESCAPED" > /usr/share/nginx/html/env-config.js
echo "env-config.js written (API_URL=${API_URL:-<default>})"
