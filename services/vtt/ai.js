const OpenAI = require("openai");
const fs = require("fs");

const maxNoSpeechConfidence = 0.6;
const openaiKey = process.env.OPENAI;

const transcribe = async (audioPath) => {
  const openai = new OpenAI({
    apiKey: openaiKey,
  });
  const readStream = fs.createReadStream(audioPath);
  const response = await openai.audio.transcriptions.create({
    file: readStream,
    model: "whisper-1",
    response_format: "verbose_json",
  });
  const segments = response.segments;
  const finalResponse = {};
  for (const seg of segments) {
    if (seg.no_speech_prob < maxNoSpeechConfidence) {
      const { text, start, end } = seg;
      finalResponse[start] = {
        text,
        start,
        end,
      };
    }
  }
  return finalResponse;
};

module.exports = {
  transcribe,
};
