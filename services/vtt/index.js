const axios = require("axios");
const fs = require("fs");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffmpeg = require("fluent-ffmpeg");
ffmpeg.setFfmpegPath(ffmpegPath);
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
const outputPath = "/tmp";

const cfAPI = process.env.cfToken;
const cfR2ID = process.env["CF-R2-ID"];
const cfR2Secret = process.env["CF-R2-SECRET"];
const cfBucketName = "cubecommons-dev";
const cfBucketURL = "https://pub-3ced16ee967249a58b58e7c1ec6ca05e.r2.dev";
const cfAccountID = "812b8374abe5aa28e1ff4b96f82e1340";

console.log({ dbHost, dbUser, dbPassword, dbName, dbPort });

//init sequelize -- GCP function to cloudsql postgres
const sequelizeContent = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  port: dbPort,
  dialect: "postgres",
  define: {
    timestamps: false,
  },
});
const sequelizeCF = new Sequelize("cube_cloudflare", dbUser, dbPassword, {
  host: dbHost,
  port: dbPort,
  dialect: "postgres",
  define: {
    timestamps: false,
  },
});
const vtt = sequelizeContent.define(
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

const content = sequelizeContent.define(
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
const files = sequelizeCF.define(
  "files",
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    storage_type: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    created_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
    updated_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
    data: {
      type: Sequelize.JSONB,
      defaultValue: {},
    },
  },
  {
    freezeTableName: true,
  }
);

const downloadCloudflareStream = async (id) => {
  const url = `https://api.cloudflare.com/client/v4/accounts/${cfAccountID}/stream/${id}/downloads`;
  console.log({ url });
  console.log({ cfAPI });
  // const response = await axios.post(url, {
  //   headers: {
  //     Authorization: `Bearer ${cfAPI}`,
  //   },
  // });
  const response = await axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${cfAPI}`,
    },
  });
  const data = response.data;
  const result = data.result;

  console.log({ result });
  const downloadURL = result.default.url;
  let percentComplete = result.default.percentComplete;
  console.log({ percentComplete });
  console.log({ downloadURL });
  while (percentComplete < 100) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const response = await axios({
      method: "get",
      url,
      headers: {
        Authorization: `Bearer ${cfAPI}`,
      },
    });
    const data = response.data;
    console.log({ data });
    percentComplete = data.result.default.percentComplete;
    console.log({ percentComplete });
  }
  return downloadURL;
};

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
  const id = Date.now().toString(); //Process ID -- Used for IO Operations
  const contentID = Buffer.from(event.data.message.data, "base64").toString();
  if (!contentID) throw new Error("No content ID provided");
  console.log({ contentID });

  const contentData = await content.findOne({
    where: {
      id: contentID,
    },
  });
  console.log({ contentData });
  if (!contentData) throw new Error("No content data found");
  const mediaData = contentData.data;
  console.log({ mediaData });
  if (!mediaData) throw new Error("No media data provided");
  if (!mediaData.type in ["video", "audio"]) {
    throw new Error("Invalid media type");
  }
  const mediaFileId = mediaData.mediaFileId;
  console.log({ mediaFileId });
  if (!mediaFileId) throw new Error("No media file ID provided");
  const cfData = await files.findOne({
    where: {
      id: mediaFileId,
    },
  });
  console.log({ cfData });
  if (!cfData) throw new Error("No CF data found");
  const cfFileData = cfData.data;
  console.log({ cfFileData });
  if (!cfFileData) throw new Error("No CF file data provided");
  const cloudflareStreamUid = cfFileData.cloudflareStreamUid;
  console.log({ cloudflareStreamUid });
  if (!cloudflareStreamUid) throw new Error("No CF stream UID provided");
  const mediaURL = await downloadCloudflareStream(cloudflareStreamUid);
  console.log({ mediaURL });
  if (!mediaURL) throw new Error("No media URL provided");

  try {
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
    await new Promise((resolve, reject) => {
      ffmpeg(`${outputPath}/${id}-video`)
        .noVideo()
        .format("mp3")
        .audioCodec("libmp3lame")
        .audioBitrate(128)
        .audioChannels(1)
        .audioFrequency(16000)
        .output(`${outputPath}/${id}-audio.mp3`)
        .on("end", () => {
          console.log("Audio Stripped");
          resolve();
        })
        .on("error", (error) => {
          console.log({ error });
          reject(error);
        })
        .run();
    });
    const transcript = await transcribe(`${outputPath}/${id}-audio.mp3`);
    console.log("Transcript Generated");
    const vtt = generateVTT(transcript);
    fs.writeFileSync(`${outputPath}/${id}.vtt`, vtt);
    console.log("VTT Generated");
    console.log({ vtt, transcript });
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
