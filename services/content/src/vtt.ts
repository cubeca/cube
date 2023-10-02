import axios from 'axios';
import fs from 'fs';
const ffmpeg = require('ffmpeg');
import OpenAI from 'openai';

const maxNoSpeechConfidence = 0.6;

const transcribe = async (audioPath: string) => {
  const openai = new OpenAI({
    apiKey: openaiKey
  });
  const readStream = fs.createReadStream(audioPath);
  const response = await openai.audio.transcriptions.create({
    file: readStream,
    model: 'whisper-1',
    response_format: 'verbose_json',
    language: 'en'
  });
  // @ts-ignore
  const segments = response.segments;
  const finalResponse = {};
  for (const seg of segments) {
    if (seg.no_speech_prob < maxNoSpeechConfidence) {
      const { text, start, end } = seg;
      // @ts-ignore
      finalResponse[start] = {
        text,
        start,
        end
      };
    }
  }
  return finalResponse;
};

const generateVtt = async (mediaURL: string) => {
  const id = Date.now().toString();
  const outputPath = './tmp';

  try {
    const response = await axios.get(mediaURL, { responseType: 'stream' });
    const stream = response.data.pipe(fs.createWriteStream(`${outputPath}/${id}-video`));
    await new Promise<void>((resolve, reject) => {
      stream.on('finish', () => {
        console.log('File Downloaded');
        resolve();
      });
      stream.on('error', (error: any) => {
        console.log({ error });
        reject(error);
      });
    });

    //strip audio from video
    const video = await new ffmpeg(`${outputPath}/${id}-video`);
    await new Promise<void>((resolve, reject) => {
      video.fnExtractSoundToMP3(`${outputPath}/${id}-audio`, (error: any) => {
        if (error) {
          console.log({ error });
          reject(error);
        }
        console.log('Audio Extracted');
        resolve();
      });
    });
    const transcript = await transcribe(`${outputPath}/${id}-audio.mp3`);
    console.log({ transcript });
  } catch (processingError) {
    console.log({ processingError });
  } finally {
    try {
      fs.unlinkSync(`${outputPath}/${id}-video`);
      console.log('Video Removed');
    } catch (videoCleanupError) {
      console.log({ videoCleanupError });
    }
    try {
      fs.unlinkSync(`${outputPath}/${id}-audio.mp3`);
      console.log('Audio Removed');
    } catch (audioCleanupError) {
      console.log({ audioCleanupError });
    }
  }
};

generateVtt('https://static.scencdn.com/test_video.mp4');
