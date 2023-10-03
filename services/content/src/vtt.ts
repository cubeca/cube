import axios from 'axios';
import fs from 'fs';
const ffmpeg = require('ffmpeg');
import OpenAI from 'openai';

const openaiKey = '';
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

const generateVTT = (transcript: any) => {
  let vtt = 'WEBVTT\n\n';
  for (const key in transcript) {
    const { text, start, end } = transcript[key];
    //convert start and end (which are in seconds from media start) to HH:MM:SS.MS
    //H,M,S, are all 2 digits

    const formatTime = (time: number) => {
      const hours = String(Math.floor(time / 3600)).padStart(2, '0');
      const minutes = String(Math.floor((time % 3600) / 60)).padStart(2, '0');
      const seconds = String(Math.floor((time % 3600) % 60)).padStart(2, '0');
      const milliseconds = String(Math.floor((time % 1) * 1000)).padStart(3, '0');
      return `${hours}:${minutes}:${seconds}.${milliseconds}`;
    };
    const startFormatted = formatTime(start);
    const endFormatted = formatTime(end);
    vtt += `${startFormatted} --> ${endFormatted}\n`;
    vtt += `${text}\n\n`;
  }
  return vtt;
};

const transcribeVideo = async (mediaURL: string) => {
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
    console.log('Transcript Generated');
    const vtt = generateVTT(transcript);
    fs.writeFileSync(`${outputPath}/${id}.vtt`, vtt);
    console.log('VTT Generated');
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

transcribeVideo('https://static.scencdn.com/test_video.mp4');
