const axios = require("axios");
const fs = require("fs");
const ffmpeg = require("ffmpeg");
const OpenAI = require("openai");
const functions = require("@google-cloud/functions-framework");
const { Sequelize } = require("sequelize");

const maxNoSpeechConfidence = 0.6;
const openaiKey = process.env.OPENAI;
const dbHost = process.env.PGHOST;
const dbUser = process.env.PGUSER;
const dbPassword = process.env.PGPASSWORD;
const dbName = process.env.PGDATABASE;
const dbPort = process.env.PGPORT;
const contentService = process.env.CONTENTSVC;

console.log({ dbHost, dbUser, dbPassword, dbName, dbPort });

//init sequelize -- GCP function to cloudsql postgres
const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  port: dbPort,
  dialect: "postgres",
  define: {
    timestamps: false,
  },
});
const vtt = sequelize.define(
  "vtt",
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    transcript: {
      type: Sequelize.JSONB,
      defaultValue: {},
    },
  },
  {
    freezeTableName: true,
  }
);

const content = sequelize.define(
  "content",
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    data: {
      type: Sequelize.JSONB,
      defaultValue: {},
    },
    created_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
    updated_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
  },
  {
    freezeTableName: true,
  }
);

const transcribe = async (audioPath) => {
  const openai = new OpenAI({
    apiKey: openaiKey,
  });
  const readStream = fs.createReadStream(audioPath);
  const response = await openai.audio.transcriptions.create({
    file: readStream,
    model: "whisper-1",
    response_format: "verbose_json",
    language: "en",
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
        end,
      };
    }
  }
  return finalResponse;
};

const generateVTT = (transcript) => {
  let vtt = "WEBVTT\n\n";
  for (const key in transcript) {
    const { text, start, end } = transcript[key];
    //convert start and end (which are in seconds from media start) to HH:MM:SS.MS
    //H,M,S, are all 2 digits

    const formatTime = (time) => {
      const hours = String(Math.floor(time / 3600)).padStart(2, "0");
      const minutes = String(Math.floor((time % 3600) / 60)).padStart(2, "0");
      const seconds = String(Math.floor((time % 3600) % 60)).padStart(2, "0");
      const milliseconds = String(Math.floor((time % 1) * 1000)).padStart(
        3,
        "0"
      );
      return `${hours}:${minutes}:${seconds}.${milliseconds}`;
    };
    const startFormatted = formatTime(start);
    const endFormatted = formatTime(end);
    vtt += `${startFormatted} --> ${endFormatted}\n`;
    vtt += `${text}\n\n`;
  }
  return vtt;
};

//Begin invocation
functions.cloudEvent("vtt_gen", async (event) => {
  const contentID = Buffer.from(event.data.message.data, "base64").toString();
  console.log({ contentID });
  const contentData = await content.findOne({
    where: {
      id: contentID,
    },
  });
  console.log({ contentData });
  const mediaData = contentData.data;
  console.log({ mediaData });
  if (!mediaData) throw new Error("No media data provided");
  if (!mediaData.type in ["video", "audio"]) {
    throw new Error("Invalid media type");
  }
  const mediaFileId = mediaData.fileId;

  try {
    const mediaURL = await axios.get(`${contentService}/files/${mediaFileId}`);
    console.log({ mediaURL });
    if (!mediaURL) throw new Error("No media URL provided");
    const id = Date.now().toString();
    const outputPath = "./tmp";
    const response = await axios.get(mediaURL, { responseType: "stream" });
    const stream = response.data.pipe(
      fs.createWriteStream(`${outputPath}/${id}-video`)
    );
    await new Promise((resolve, reject) => {
      stream.on("finish", () => {
        console.log("File Downloaded");
        resolve();
      });
      stream.on("error", (error) => {
        console.log({ error });
        reject(error);
      });
    });

    //strip audio from video
    const video = await new ffmpeg(`${outputPath}/${id}-video`);
    await new Promise((resolve, reject) => {
      video.fnExtractSoundToMP3(`${outputPath}/${id}-audio`, (error) => {
        if (error) {
          console.log({ error });
          reject(error);
        }
        console.log("Audio Extracted");
        resolve();
      });
    });
    const transcript = await transcribe(`${outputPath}/${id}-audio.mp3`);
    console.log("Transcript Generated");
    const vtt = generateVTT(transcript);
    fs.writeFileSync(`${outputPath}/${id}.vtt`, vtt);
    console.log("VTT Generated");
  } catch (processingError) {
    console.log({ processingError });
  } finally {
    try {
      fs.unlinkSync(`${outputPath}/${id}-video`);
      console.log("Video Removed");
    } catch (videoCleanupError) {
      console.log({ videoCleanupError });
    }
    try {
      fs.unlinkSync(`${outputPath}/${id}-audio.mp3`);
      console.log("Audio Removed");
    } catch (audioCleanupError) {
      console.log({ audioCleanupError });
    }
  }
});
