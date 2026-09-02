Instructions to generate narration audio (voice.mp3) and final MP4

1) Generate TTS audio (gTTS Python example)

- Install gTTS: pip install gTTS
- From the repo root, run:

  python - <<'PY'
from gtts import gTTS
text = open('narration.txt','r',encoding='utf-8').read()
# Adjust slow=False for normal speed
tts = gTTS(text, lang='en', slow=False)
tts.save('voice.mp3')
print('Saved voice.mp3')
PY

2) Record the screen demo using OBS (follow RECORDING_INSTRUCTIONS.md). Export to screen.mp4.

3) Mix the TTS audio with the screen recording using ffmpeg:

  ffmpeg -i screen.mp4 -i voice.mp3 -c:v copy -c:a aac -b:a 192k -shortest docshare_walkthrough.mp4

4) (Optional) Add background music (bg.mp3) at low volume:

  ffmpeg -i screen.mp4 -i voice.mp3 -i bg.mp3 -filter_complex "[1:a]volume=1[a1];[2:a]volume=0.15[a2];[a1][a2]amix=inputs=2:duration=shortest" -c:v copy -c:a aac -b:a 192k final.mp4

5) Export social clips:

  # 60s clip from 00:30 to 01:30
  ffmpeg -ss 00:00:30 -i docshare_walkthrough.mp4 -t 00:01:00 -c copy clip60.mp4

  # 30s clip from 00:50 to 01:20
  ffmpeg -ss 00:00:50 -i docshare_walkthrough.mp4 -t 00:00:30 -c copy clip30.mp4

Notes
- If you prefer a different TTS engine (Azure, Google Cloud TTS, ElevenLabs), the narration.txt can be used as the input.
- The repo already includes public/slides.html, walkthrough.srt, RECORDING_PACKAGE.md and RECORDING_INSTRUCTIONS.md for guidance.
