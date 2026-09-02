RECORDING PACKAGE

What I created for you in the repo
- SLIDES.md (human-readable slide notes)
- public/slides.html (reveal.js slide deck you can open locally)
- walkthrough.srt (captions)
- THUMBNAIL.txt, SOCIAL_CLIPS.md, RECORDING_INSTRUCTIONS.md (recording assets)

What I will NOT do without explicit upload permission
- I cannot upload the video to YouTube/Loom on your behalf unless you provide credentials or permission to use an account I control.

How to produce the MP4 (recommended, using OBS + ffmpeg audio merge)

1) Prepare
- Start the app: npm install && npm start
- Open public/slides.html in your browser for slides
- Open two browser profiles (normal + incognito) for alice/bob demo, or two separate browsers

2) Generate narration audio using gTTS (optional automated TTS)
- Install gTTS: pip install gTTS
- Save the narration script to a file named narration.txt (use walkthrough.srt or the voice-over script in README/SLIDES.md)
- Run the short script to create voice.mp3:

  python - <<'PY'
from gtts import gTTS
text = open('narration.txt','r',encoding='utf-8').read()
tts = gTTS(text, lang='en')
tts.save('voice.mp3')
print('Saved voice.mp3')
PY

3) Record the video with OBS
- Scenes: Intro Slide (open slides.html), Browser (app demo), Terminal, Editor
- Record the full demo; keep pauses of ~1 sec between steps for easier editing
- Stop recording and export to screen.mp4

4) Mix audio and finalise with ffmpeg
- If you recorded with system audio and mic, skip to trimming in your editor
- To merge the TTS audio with your screen recording:

  ffmpeg -i screen.mp4 -i voice.mp3 -c:v copy -c:a aac -b:a 192k -shortest docshare_walkthrough.mp4

- To add background music (bg.mp3) underneath the narration (reduce bg volume):

  ffmpeg -i screen.mp4 -i voice.mp3 -i bg.mp3 -filter_complex "[1:a]volume=1[a1];[2:a]volume=0.15[a2];[a1][a2]amix=inputs=2:duration=shortest" -c:v copy -c:a aac -b:a 192k final.mp4

5) Export social clips
- Use your video editor to cut 60s and 30s clips as suggested in SOCIAL_CLIPS.md
- Or with ffmpeg timestamps (example for 60s clip from 00:30 to 01:30):

  ffmpeg -ss 00:00:30 -i final.mp4 -t 00:01:00 -c copy clip60.mp4

6) Upload
- Upload docshare_walkthrough.mp4 (or final.mp4) to YouTube as Unlisted. Add description, tags, and WALKTHROUGH_VIDEO.txt content.

If you want, I can:
- Produce the TTS audio (voice.mp3) from the script and add it to the repo (I can generate gTTS audio snippets and push them), or
- Provide a trimmed narration.txt assembled from the walkthrough.srt for you to record yourself.

Tell me which of the above you want me to do next: generate voice.mp3 in the repo, or produce the final MP4 locally and hand it to you, or help upload to YouTube if you provide upload access.
