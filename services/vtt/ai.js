const OpenAI = require("openai");
const fs = require("fs");

const maxNoSpeechConfidence = 0.6;
const openaiKey = process.env.OPENAI;

const transcribe = async (audioPath, language) => {
    const openai = new OpenAI({
        apiKey: openaiKey,
    });
    const readStream = fs.createReadStream(audioPath);
    console.log("Transcribing audio file... with language: ", language);

    try {
        const response = await openai.audio.transcriptions.create({
            file: readStream,
            model: "whisper-1",
            response_format: "verbose_json",
            language: language,
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
    } catch (error) {
        console.log("Error in transcribe: ", error);
        if (error.message.includes("unsupported")) {
            return;
        }
    }
};

module.exports = {
    transcribe,
};
