# Lumo Loops — series kit (12 Shorts, 12 s, 9:16, seamless loops)

`_lib/lumo-lib.js` — world (sky, planet, lamp, tree), the real Lumo, Wisp, helpers. Everything is a pure function of time.
`_lib/lumo_audio.py` — synthesized lullaby bed + SFX helpers (numpy only, loop-safe).
Each `NN-name/` has `episode.js`, `audio.py`, `title.txt`, and `meta.json` (title / description / tags for the Make webhook).
Build: `./build.sh 10-sun-haircut render` -> `renders/*.mp4`. Renders are not committed (Git LFS is not pushable from the cloud sandbox).

Publishing: see ../README.md (Make scenario, 6 daily slots in UTC, upload.sh pattern).
