# Helper: README additions for building video

To generate the slides-only walkthrough video locally (automated):

Prereqs
- Node.js and npm
- ffmpeg installed and in PATH
- OS: macOS/Linux (build script is bash; on Windows use WSL or adapt commands)

Commands
1. Install dependencies (adds puppeteer and google-tts-api already in package.json):
   npm install

2. Start the server (serve slides at /slides.html):
   npm start

3. In a separate terminal, run the build script (this will generate voice.mp3, render slides, and build the MP4):
   chmod +x scripts/build_video.sh
   ./scripts/build_video.sh

Outputs
- docshare_walkthrough.mp4
- clip60.mp4
- clip30.mp4
- slide_*.png
- voice.mp3

Troubleshooting
- If puppeteer fails to launch due to missing dependencies (chrome), install chrome or use apt packages. On Linux you may need additional libs: libnss3, libatk1.0-0, libxss1, libasound2, libgtk-3-0.
