# Umami.Kitchen

A single-page marketing site for a fictional healthy-bowl subscription. Built as a demo of a scroll-scrubbed video hero: the salad assembles itself as you scroll, five story beats fade in and out over the top, and the rest of the page (ingredients, nutrition, FAQ, order CTA) reads normally on a warm cream palette.

## Stack

- One HTML file, no build step
- Tailwind CSS via CDN (`cdn.tailwindcss.com`)
- GSAP 3.12 + ScrollTrigger for scroll-driven progress
- Fraunces + Inter from Google Fonts

## Run locally

```bash
# Any static file server will do
python -m http.server 8000
```

Then open <http://localhost:8000/>.

The video (`bowl.mp4`) needs to be served over HTTP, not `file://` — some browsers refuse to load or scrub `file://` videos.

## How the scroll-scrubbed video works

1. `<video>` element is `position: fixed`, `object-fit: cover`, full viewport, `z-index: 0`.
2. Once `loadeddata` fires, a single `play() → pause()` cycle warms the decoder so subsequent seeks render immediately (Chromium on Windows shows a black frame otherwise).
3. A ScrollTrigger with `scrub: true` on a track sized to roughly match the video's duration (`duration × 60vh`, clamped) maps scroll progress to `video.currentTime` on every frame.
4. Five story beats live over the video inside the pinned section, toggled by explicit progress thresholds.
5. Sections below the story (ingredients, nutrition, FAQ, CTA) have solid backgrounds and `z-10`, so they visually cover the fixed video as they scroll into view.

## If scrubbing feels choppy

The video encoded with standard mp4 keyframe intervals seeks slowly. For frame-accurate scrubbing under continuous wheel input, re-encode with a keyframe on every frame:

```bash
ffmpeg -i bowl.mp4 -c:v libx264 -crf 20 -g 1 -preset slow -movflags +faststart bowl-scrubbable.mp4
```

Then rename to `bowl.mp4`.

## Files

- `index.html` — the entire page
- `bowl.mp4` — the salad-assembly video (5 MB)
