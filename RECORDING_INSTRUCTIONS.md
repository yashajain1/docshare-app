Recording & editing checklist (detailed)

1) Prep
- Run the app: `npm install && npm start`
- Open two browser profiles (normal + incognito) or two separate browsers for alice and bob flows
- Open OBS with scenes: Intro Slide, Browser, Terminal, Code Editor

2) Recording order
- Start with Intro Slide (5–8s)
- Switch to Browser scene and record the demo flow slowly
  - Login as alice
  - Create a new doc "Meeting Notes" and format text
  - Save and rename to "Team Meeting Notes"
  - Upload a sample.md file and show created doc
  - Share with bob
  - Switch to incognito, login as bob, open the shared doc and make a small edit
- Briefly switch to Terminal (show `npm start` or run `npm test`)
- Briefly switch to Code Editor and show server.js where tables are defined and upload handler
- End with closing slide and links

3) OBS settings
- Canvas: 1920x1080, Output: 1920x1080, FPS 30
- Encoder: x264, bitrate 6000 kbps (or use quality-based presets)
- Audio: microphone input (monitor off), sample rate 48kHz

4) Editing tips
- Cut long pauses; keep 1–2s gaps between actions for smooth cuts
- Add lower-thirds for "Login: alice" and "Login: bob"
- Add on-screen callouts when you click buttons (e.g., highlight share button)
- Add background music at low volume under voice

5) Upload
- Export H.264 MP4, 1080p, then upload as unlisted to YouTube or Loom
- Add video description with repo link and seeded accounts
