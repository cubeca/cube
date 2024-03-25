const functions = require("@google-cloud/functions-framework");
const { PubSub } = require("@google-cloud/pubsub");

const axios = require("axios");
const fs = require("fs");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffmpeg = require("fluent-ffmpeg");
const uuid = require("uuid").v4;
const pubSubClient = new PubSub();
ffmpeg.setFfmpegPath(ffmpegPath);

const { content, files, vtt } = require("./db.js");
const { downloadCloudflareStream, uploadFile, downloadR2 } = require("./cf.js");
const { transcribe } = require("./ai.js");
const { generateVTT } = require("./vtt.js");

const maxTries = 50;
const outputPath = "/tmp";

const supportedVideoTypes = ["mp4", "mkv", "mov", "avi", "flv", "mpeg-2 ts", "mpeg-2 ps", "mxf", "3gp", "webm", "mpg"];
const supportedAudioTypes = ["mp3", "wav", "ogg", "aac"];

async function getFileTypeFromStream() {
    const { fileTypeFromStream } = await import("file-type");
    return fileTypeFromStream;
}

const retry = async (contentID, currentTries) => {
    if (typeof currentTries !== "number" || currentTries >= maxTries) {
        console.error("Max tries reached");
        return;
    }
    let tries = currentTries + 1;
    const dataBuffer = Buffer.from(JSON.stringify({ contentID, tries: tries + 1 }));
    const sleepTime = 10;
    console.log(`Sleeping for ${sleepTime} seconds`);
    await new Promise((resolve) => setTimeout(resolve, sleepTime * 1000));
    await pubSubClient.topic("vtt_transcribe").publishMessage({ data: dataBuffer });
    console.log(`Requeud Message ID ${contentID}`);
};

functions.cloudEvent("vtt_transcribe", async (event) => {
    const id = Date.now().toString(); //Process ID -- Used for IO Operations
    const { contentID, tries } = JSON.parse(Buffer.from(event.data.message.data, "base64").toString()); //Decode event message
    try {
        if (!contentID) throw new Error("No content ID provided");
        console.log({ contentID, tries });

        const contentData = await content.findOne({
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
        try {
            if (mediaData.type === "video") {
                console.log("Video File Detected");
                const cfFileData = cfData.data;
                const cloudflareStreamUid = cfFileData.cloudflareStreamUid;
                if (!cloudflareStreamUid) {
                    console.log("No Cloudflare Stream UID provided");
                    return;
                }

                const mediaURL = await downloadCloudflareStream(cloudflareStreamUid);
                if (!mediaURL) throw new Error("No media URL provided");

                const response = await axios.get(mediaURL, { responseType: "stream" });
                const stream = response.data.pipe(fs.createWriteStream(`${outputPath}/${id}-video`));

                await new Promise((resolve, reject) => {
                    stream.on("finish", async () => {
                        console.log("File downloaded and checking the file validity");

                        const fileTypeFromStream = await getFileTypeFromStream();
                        const stream = fs.createReadStream(`${outputPath}/${id}-video`);

                        const { ext } = await fileTypeFromStream(stream);
                        if (!supportedVideoTypes.includes(ext)) {
                            throw new Error("unsupported file type");
                        }

                        resolve();
                    });

                    stream.on("error", (error) => {
                        console.log("This is a steam error", { error });
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
                await new Promise(async (resolve, reject) => {
                    console.log("File downloaded and checking the file validity");

                    const fileTypeFromStream = await getFileTypeFromStream();
                    const stream = fs.createReadStream(`${outputPath}/${id}-audio`);

                    const { ext } = await fileTypeFromStream(stream);
                    if (!supportedAudioTypes.includes(ext)) {
                        throw new Error("unsupported file type");
                    }

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
            } else {
                console.error("Invalid media type");
                return;
            }
        } catch (error) {
            if (error.includes("unsupported file type")) {
                console.error("We found an unsupported file type and need to end this process");
                return;
            }

            await retry(contentID, tries);
        }

        try {
            const mp3Stats = fs.statSync(`${outputPath}/${id}-audio.mp3`);
            const mp3Size = Math.round((mp3Stats.size / 1024 / 1024) * 100) / 100; //size in megabytes, rounded to 2 decimal places
            console.log({ mp3Size }); //For debugging, whisper has a 25MB limit

            let transcript;
            if (mp3Size > 25) {
                const transcripts = [];
                const chunkCount = Math.ceil(mp3Size / 25);
                console.log({ chunkCount });
                const audioDuration = await new Promise((resolve, reject) => {
                    ffmpeg.ffprobe(`${outputPath}/${id}-audio.mp3`, (err, metadata) => {
                        if (err) {
                            console.log({ err });
                            reject(err);
                        }
                        resolve(metadata.format.duration);
                    });
                });
                const chunkSize = Math.ceil(audioDuration / chunkCount);
                //Split audio into chunks
                for (let i = 0; i < chunkCount; i++) {
                    const startTime = i * chunkSize;
                    const endTime = startTime + chunkSize;
                    console.log({ startTime, endTime });
                    await new Promise((resolve, reject) => {
                        ffmpeg(`${outputPath}/${id}-audio.mp3`)
                            .setStartTime(startTime)
                            .setDuration(chunkSize)
                            .output(`${outputPath}/${id}-audio-${i}.mp3`)
                            .on("end", () => {
                                console.log(`Chunk ${i} Created`);
                                resolve();
                            })
                            .on("error", (error) => {
                                console.error({ error });
                                reject(error);
                            })
                            .run();
                    });
                    transcripts.push({
                        transcript: await transcribe(`${outputPath}/${id}-audio-${i}.mp3`),
                        startTime,
                        endTime,
                    });
                }

                console.log("Transcripts Generated");
                transcript = {};
                for (const set of transcripts) {
                    const offset = set.startTime;
                    const t = set.transcript;
                    for (const timestamp in t) {
                        const offsetTimestamp = parseFloat(timestamp) + offset;
                        const s = t[timestamp];
                        s.start += offset;
                        s.end += offset;
                        transcript[offsetTimestamp] = s;
                    }
                }
            } else {
                transcript = await transcribe(`${outputPath}/${id}-audio.mp3`);
                console.log("Transcript Generated");
            }

            for (const key in transcript) {
                const segment = transcript[key];
                let start = parseFloat(parseFloat(key) + 0.01).toFixed(3);
                segment.start = start;
                segment.end = parseFloat(segment.end).toFixed(3);
                transcript[start] = segment;
                delete transcript[key];
            }

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
            const dataBuffer = Buffer.from(contentID);
            const messageId = await pubSubClient.topic("vtt_upload").publishMessage({ data: dataBuffer });
            console.log(`Message ${messageId} published.`);
        } catch (processingError) {
            console.error({ processingError });
            await retry(contentID, tries);
        } finally {
            //purge all mp3, mp4, and vtt files
            //get list
            const files = fs.readdirSync(outputPath);
            //filter
            const purgeList = files.filter((file) => {
                if (file.includes(id)) {
                    return true;
                }
                return false;
            });
            //delete
            for (const file of purgeList) {
                fs.unlinkSync(`${outputPath}/${file}`);
            }
        }
    } catch (error) {
        console.error({ error });
        await retry(contentID, tries);
    }
});

functions.cloudEvent("vtt_upload", async (event) => {
    const contentID = Buffer.from(event.data.message.data, "base64").toString();
    if (!contentID) throw new Error("No content ID provided");

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
    const vttText = generateVTT(vttJSON);

    if (contentData.data.vttFileId) {
        await uploadFile(contentData.data.vttFileId, vttText);
        console.log("VTT File Updated");
    } else {
        const cloudflareRecordID = uuid(); //ID needs to be generated before the record is created to determine the file path

        await uploadFile(cloudflareRecordID, vttText);
        const contentData = await content.findOne({
            where: {
                id: contentID,
            },
        });

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

        await contentData.update({
            data: {
                ...contentData.data,
                vttFileId: cloudflareRecordID,
            },
        });
        console.log("Content Record Updated with VTT File ID");
    }
});
