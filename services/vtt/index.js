const functions = require("@google-cloud/functions-framework");
const { PubSub } = require("@google-cloud/pubsub");

const axios = require("axios");
const fs = require("fs");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffmpeg = require("fluent-ffmpeg");
const uuid = require("uuid").v4;
ffmpeg.setFfmpegPath(ffmpegPath);

const { content, files, vtt } = require("./db.js");
const { downloadCloudflareStream, uploadFile, downloadR2 } = require("./cf.js");
const { transcribe } = require("./ai.js");
const { generateVTT } = require("./vtt.js");

const outputPath = "/tmp";

functions.cloudEvent("vtt_transcribe", async (event) => {
  const id = Date.now().toString(); //Process ID -- Used for IO Operations
  const contentID = Buffer.from(event.data.message.data, "base64").toString(); //Decode event message
  if (!contentID) throw new Error("No content ID provided");
  console.log({ contentID });

  const contentData = await content.findOne({
    //Fetch content data
    where: {
      id: contentID,
    },
  });

  if (!contentData) throw new Error("No content data found");
  const mediaData = contentData.data;
  if (!mediaData) throw new Error("No media data provided");
  if (!mediaData.type in ["video", "audio"]) {
    throw new Error("Invalid media type");
  }

  const mediaFileId = mediaData.mediaFileId;
  if (!mediaFileId) throw new Error("No media file ID provided");
  const cfData = await files.findOne({
    where: {
      id: mediaFileId,
    },
  });

  if (!cfData) throw new Error("No CF data found");
  if (mediaData.type === "video") {
    console.log("Video File Detected");
    const cfFileData = cfData.data;
    const cloudflareStreamUid = cfFileData.cloudflareStreamUid;
    console.log({ cloudflareStreamUid });
    const mediaURL = await downloadCloudflareStream(cloudflareStreamUid);
    console.log({ mediaURL });
    if (!mediaURL) throw new Error("No media URL provided");

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
        throw new Error(error);
      });
    });

    await new Promise((resolve, reject) => {
      ffmpeg(`${outputPath}/${id}-video`)
        .noVideo()
        .format("mp3")
        .audioCodec("libmp3lame")
        .audioBitrate(64)
        .audioChannels(1)
        .audioFrequency(8000)
        .output(`${outputPath}/${id}-audio.mp3`)
        .on("end", () => {
          console.log("Audio Stripped");
          resolve();
        })
        .on("error", (error) => {
          console.log({ error });
          throw new Error(error);
        })
        .run();
    });
  } else if (mediaData.type === "audio") {
    console.log("Audio File Detected");
    await downloadR2(cfData.data.filePathInBucket, outputPath, `${id}-audio`);
    await new Promise((resolve, reject) => {
      ffmpeg(`${outputPath}/${id}-audio`)
        .format("mp3")
        .audioCodec("libmp3lame")
        .audioBitrate(64)
        .audioChannels(1)
        .audioFrequency(8000)
        .output(`${outputPath}/${id}-audio.mp3`)
        .on("end", () => {
          console.log("Audio Transcoded");
          resolve();
        })
        .on("error", (error) => {
          console.log({ error });
          throw new Error(error);
        })
        .run();
    });
  }

  try {
    const mp3Stats = fs.statSync(`${outputPath}/${id}-audio.mp3`);
    const mp3Size = Math.round((mp3Stats.size / 1024 / 1024) * 100) / 100; //size in megabytes, rounded to 2 decimal places
    console.log({ mp3Size }); //For debugging, whisper has a 25MB limit

    if (mp3Size > 25) {
      throw new Error("MP3 Size too large"); //place holder until audio splitting
    }

    const transcript = await transcribe(`${outputPath}/${id}-audio.mp3`);
    console.log("Transcript Generated");

    const vttText = generateVTT(transcript);
    fs.writeFileSync(`${outputPath}/${id}.vtt`, vttText);
    console.log("vttText Generated");
    //try to fetch existing vtt, if not create
    const existingVTT = await vtt.findOne({
      where: {
        id: contentID,
      },
    });
    if (existingVTT) {
      await existingVTT.update({
        transcript,
      });
    } else {
      await vtt.create({
        id: contentID,
        transcript,
      });
    }
    console.log("VTT JSON Saved");
    //publish message to vtt_upload
    const pubSubClient = new PubSub();

    try {
      const dataBuffer = Buffer.from(contentID);
      const messageId = await pubSubClient
        .topic("vtt_upload")
        .publishMessage({ data: dataBuffer });
      console.log(`Message ${messageId} published.`);
    } catch (error) {
      console.error(`Received error while publishing: ${error.message}`);
      throw new Error(error);
    }
  } catch (processingError) {
    console.error({ processingError });
  } finally {
    if (mediaData.type === "video") {
      try {
        fs.unlinkSync(`${outputPath}/${id}-video`);
        console.log("Cleanup - Video Removed");
      } catch (videoCleanupError) {
        console.log("Unable to remove video");
      }
    }
    if (mediaData.type === "audio") {
      try {
        fs.unlinkSync(`${outputPath}/${id}-audio`);
        console.log("Cleanup - Audio Removed");
      } catch (audioCleanupError) {
        console.log("Unable to remove raw audio");
      }
    }
    //Always remove processed audio
    try {
      fs.unlinkSync(`${outputPath}/${id}-audio.mp3`);
      console.log("Cleanup - Audio Removed");
    } catch (audioCleanupError) {
      console.log("Unable to remove processed audio");
    }
  }
});

functions.cloudEvent("vtt_upload", async (event) => {
  const id = Date.now().toString(); //Process ID -- Used for IO Operations

  const contentID = Buffer.from(event.data.message.data, "base64").toString();
  if (!contentID) throw new Error("No content ID provided");
  console.log({ contentID });

  const contentData = await content.findOne({
    where: {
      id: contentID,
    },
  });
  if (!contentData) throw new Error("No content data found");
  const vttData = await vtt.findOne({
    where: {
      id: contentID,
    },
  });
  if (!vttData) throw new Error("No VTT data found");
  const vttJSON = vttData.transcript;
  console.log({ vttJSON });
  const vttText = generateVTT(vttJSON);
  console.log({ vttText });
  if (contentData.data.vttFileId) {
    await uploadFile(contentData.data.vttFileId, vttText);
    console.log("VTT File Updated");
  } else {
    const cloudflareRecordID = uuid(); //ID needs to be generated before the record is created to determine the file path
    console.log({ cloudflareRecordID });
    await uploadFile(cloudflareRecordID, vttText);
    const contentData = await content.findOne({
      where: {
        id: contentID,
      },
    });
    console.log({ contentData });
    await files.create({
      id: cloudflareRecordID,
      storage_type: "cloudflareR2",
      data: {
        status: "uploaded",
        upload: {
          fileName: "vtt.vtt",
          fileSizeBytes: vttText.length,
          mimeType: "text/vtt",
          userId: contentData.data.userId,
        },
        profileId: contentData.profileId,
        filePathInBucket: `${cloudflareRecordID}/vtt.vtt`,
      },
    });

    console.log({ data: contentData.data });
    await contentData.update({
      data: {
        ...contentData.data,
        vttFileId: cloudflareRecordID,
      },
    });
    console.log("Content Record Updated with VTT File ID");
  }
});
