# Lumo Loops

Source for the @Lumo_Loops YouTube Shorts (HyperFrames compositions).

- `style/` — style sheet of the real Lumo: `sheet.html` (open in a browser at 2400x1800) + the reference frame. The PNG is generated, not committed.
- `episodes/shadow-escape/` — "Lumo's shadow tried to run away" (15 s, 9:16, seamless loop).
  - `index.html` + `gsap.min.js` — composition (render: `npx hyperframes render -f 30 -q delivery`).
  - audio: `python3 -I ../../scripts/audio_shadow.py shadow.wav` (the `<audio src="shadow.wav">` file is generated, not committed).
  - the final render `lumo-shadow-escape.mp4` is NOT committed (binary, not pushable here): `npx hyperframes render -f 30 -q delivery -o lumo-shadow-escape.mp4` after generating `shadow.wav`.
  - `upload-kit/` — description and `upload.sh` (needs `HOOK=<Make webhook URL>`; the URL is NOT stored here). `upload.sh` expects the render at `../lumo-shadow-escape.mp4`.

## Publishing (Make scenario "Tiny Lumo → YouTube", id 7739924)

Webhook actions: `upload`, `meta`, `list`, `stats`, `check`, `details`, `banner`, `delete`.
`upload` fields: `title`, `description`, `tags` (comma separated), `publishAt` (UTC, future), `file`.
Scenario forces: private + scheduled, Film & Animation, not made for kids, no synthetic media.

Six daily slots (MSK -> UTC): 01:00 22:00Z, 02:00 23:00Z, 03:00 00:00Z, 04:00 01:00Z, 16:00 13:00Z, 19:00 16:00Z.

Description: hook line + `New Lumo episode every day 🌙` + hashtags
`#animation #relaxing #sleep #cozy #lumoloops #satisfying #stars #tea #shorts #cute #cartoon` + 1-3 topic tags.
Tags: `animated shorts, bedtime, calm, cozy animation, cute animation, lumo loops, relaxing animation, satisfying video, sleep animation` + 3-5 topic tags.
