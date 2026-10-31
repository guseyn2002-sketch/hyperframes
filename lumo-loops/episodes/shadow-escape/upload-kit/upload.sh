#!/usr/bin/env bash
# Schedules "Lumo's shadow tried to run away" on @Lumo_Loops via the Make webhook.
# Usage:  ./upload.sh                      (default slot below)
#         PUBLISH_AT=2026-11-01T13:00:00Z ./upload.sh
# publishAt must be UTC and in the future. Scenario sets: private + scheduled,
# category Film & Animation, madeForKids=false, synthetic media=false.
set -euo pipefail
cd "$(dirname "$0")"
HOOK="${HOOK:?set HOOK to the Make webhook URL (Tiny Lumo -> YouTube)}"
PUBLISH_AT="${PUBLISH_AT:-2026-10-31T23:00:00Z}"   # 02:00 MSK
TAGS="animated shorts,bedtime,calm,cozy animation,cute animation,lumo loops,relaxing animation,satisfying video,sleep animation,shadow,funny,chase,tiny planet"

curl -sS --max-time 300 -X POST "$HOOK" \
  -F "action=upload" \
  -F "title=Lumo's shadow tried to run away 🌑🏃" \
  -F "description=<description.txt" \
  -F "tags=$TAGS" \
  -F "publishAt=$PUBLISH_AT" \
  -F "file=@../lumo-shadow-escape.mp4;type=video/mp4" \
  -w "\nHTTP %{http_code}\n"
# Expected reply: {"id":"...","privacy":"private","publishAt":"...","channel":"Lumo Loops","title":"..."}
