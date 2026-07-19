#!/usr/bin/env node
/**
 * generate-poster.mjs
 *
 * Extracts the first meaningful frame of public/bowl.mp4 and writes it to
 * public/bowl-poster.jpg. Also re-encodes bowl.mp4 with +faststart so the
 * moov atom sits at the front — required for mid-download seeking on mobile.
 *
 * Run once with:   npm run poster
 *
 * Requires the `ffmpeg-static` devDependency (bundles a platform-specific
 * ffmpeg binary — no system ffmpeg needed).
 */

import { execFileSync } from 'node:child_process';
import { existsSync, renameSync, unlinkSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, '..');
const publicDir = join(repoRoot, 'public');
const videoPath = join(publicDir, 'bowl.mp4');
const posterPath = join(publicDir, 'bowl-poster.jpg');
const tempVideoPath = join(publicDir, 'bowl.tmp.mp4');

let ffmpegPath;
try {
  ({ default: ffmpegPath } = await import('ffmpeg-static'));
} catch (err) {
  console.error('ffmpeg-static is not installed. Run `npm install` first.');
  process.exit(1);
}

if (!existsSync(videoPath)) {
  console.error(`No video at ${videoPath}. Nothing to do.`);
  process.exit(1);
}

// ---------------------------------------------------------------------
// 1. Extract poster — grab a frame ~0.5s in (skips any black lead-in)
// ---------------------------------------------------------------------
console.log('→ Extracting poster frame…');
execFileSync(
  ffmpegPath,
  [
    '-y',
    '-ss', '0.5',
    '-i', videoPath,
    '-frames:v', '1',
    '-q:v', '3',
    posterPath,
  ],
  { stdio: 'inherit' },
);
console.log(`  ✓ ${posterPath}`);

// ---------------------------------------------------------------------
// 2. Re-encode with +faststart so mobile browsers can seek before the
//    file has fully downloaded. Also caps the max height at 720p — the
//    source is already 1280x720, so this is a no-op in size but forces a
//    clean encode with the moov atom at the front.
// ---------------------------------------------------------------------
console.log('→ Re-encoding video with +faststart…');
execFileSync(
  ffmpegPath,
  [
    '-y',
    '-i', videoPath,
    '-c:v', 'libx264',
    '-preset', 'medium',
    '-crf', '23',
    '-vf', "scale='min(1280,iw)':-2",
    '-movflags', '+faststart',
    '-an',
    tempVideoPath,
  ],
  { stdio: 'inherit' },
);

// Replace the original with the optimized version
unlinkSync(videoPath);
renameSync(tempVideoPath, videoPath);
console.log(`  ✓ ${videoPath} (optimized)`);

console.log('\nAll done. Commit public/bowl-poster.jpg and public/bowl.mp4.');
