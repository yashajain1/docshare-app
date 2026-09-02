#!/usr/bin/env bash
set -euo pipefail

# build_video.sh
# Usage: ./scripts/build_video.sh
# Requires: ffmpeg, node, npm, puppeteer installed, and the app running (http://localhost:3000)

ROOT=$(pwd)
SCRIPTS_DIR="$ROOT/scripts"

# 1) Generate voice.mp3 (if missing)
if [ ! -f voice.mp3 ]; then
  echo "Generating voice.mp3 via node script"
  node scripts/generateVoice.js
else
  echo "voice.mp3 already exists; skipping generation"
fi

# 2) Render slides to PNGs
echo "Rendering slides to PNGs"
node scripts/renderSlides.js

# 3) Build list.txt for ffmpeg concat
echo "Creating list.txt"
rm -f list.txt
for f in slide_*.png; do
  echo "file '$PWD/$f'" >> list.txt
  echo "duration 5" >> list.txt
done
# append last file again for ffmpeg duration correctness
last=$(ls slide_*.png | sort -V | tail -n1)
echo "file '$PWD/$last'" >> list.txt

# 4) Create slides_video.mp4
echo "Stitching slides into slides_video.mp4"
ffmpeg -y -f concat -safe 0 -i list.txt -vsync vfr -pix_fmt yuv420p slides_video.mp4

# 5) Combine with voice.mp3
echo "Combining slides video with voice.mp3 into docshare_walkthrough.mp4"
ffmpeg -y -i slides_video.mp4 -i voice.mp3 -c:v copy -c:a aac -b:a 192k -shortest docshare_walkthrough.mp4

# 6) Create social clips
echo "Creating social clips"
ffmpeg -y -ss 00:00:30 -i docshare_walkthrough.mp4 -t 00:01:00 -c copy clip60.mp4 || true
ffmpeg -y -ss 00:00:50 -i docshare_walkthrough.mp4 -t 00:00:30 -c copy clip30.mp4 || true

echo "Done. Outputs: docshare_walkthrough.mp4, clip60.mp4, clip30.mp4"
