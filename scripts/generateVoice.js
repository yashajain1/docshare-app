const gTTS = require('google-tts-api');
const fs = require('fs');
const https = require('https');

(async () => {
  try {
    const text = fs.readFileSync('narration.txt', 'utf8');
    if (!text || text.trim().length === 0) {
      console.error('narration.txt is empty or missing');
      process.exit(1);
    }

    // google-tts-api returns a URL we can download
    const url = gTTS.getAudioUrl(text, {
      lang: 'en',
      slow: false,
      host: 'https://translate.google.com'
    });

    console.log('Downloading TTS from', url);
    const file = fs.createWriteStream('voice.mp3');
    https.get(url, (res) => {
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log('voice.mp3 saved');
      });
    }).on('error', (err) => {
      fs.unlinkSync('voice.mp3');
      console.error('Error downloading TTS audio', err);
      process.exit(1);
    });
  } catch (err) {
    console.error('generateVoice error', err);
    process.exit(1);
  }
})();
