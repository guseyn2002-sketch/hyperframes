#!/usr/bin/env bash
# Build one episode of the series:  ./build.sh 10-sun-haircut [render]
# Needs: python3 + numpy, node, ffmpeg, and `npx hyperframes` (see repo CLAUDE.md).
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"; D="$HERE/$1"
GSAP="$(find "$HERE/../../node_modules" -path '*gsap/dist/gsap.min.js' 2>/dev/null | head -1)"
[ -n "$GSAP" ] || { echo "gsap.min.js not found: run 'bun install' at the repo root"; exit 1; }
cp "$HERE/_lib/lumo-lib.js" "$GSAP" "$D/"
python3 - "$D" <<'PY'
import sys
d=sys.argv[1]
t=open(d+"/title.txt").read().strip(); js=open(d+"/episode.js").read(); tpl=open(d+"/../_lib/template.html").read()
open(d+"/index.html","w").write(tpl.replace("__TITLE__",t).replace("__JS__",js))
PY
python3 "$D/audio.py" "$D/sound.wav"
cd "$D" && npx hyperframes lint
[ "${2:-}" = "render" ] && npx hyperframes render -f 30 -q delivery -o "renders/$1.mp4"
