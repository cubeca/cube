const axios = require("axios");
const fs = require("fs");

const cfAPI = process.env.cfToken;
const cfAccountID = process.env["CF-ACCOUNT-ID"];
const cfR2ID = process.env["CF-R2-ID"];
const cfR2Secret = process.env["CF-R2-SECRET"];

//s3 import
const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");

const downloadCloudflareStream = async (id) => {
  const url = `https://api.cloudflare.com/client/v4/accounts/${cfAccountID}/stream/${id}/downloads`;
  console.log({ url });
  const response = await axios({
    method: "post",
    url,
    headers: {
      Authorization: `Bearer ${cfAPI}`,
    },
  });
  const data = response.data;
  const result = data.result;
  const downloadURL = result.default.url;
  let percentComplete = result.default.percentComplete;
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
    percentComplete = data.result.default.percentComplete;
    console.log({ percentComplete });
  }
  return downloadURL;
};
const downloadR2 = async (filePathInBucket, outputPath, fileName) => {
  const s3Client = new S3Client({
    region: "auto",
    credentials: {
      accessKeyId: cfR2ID,
      secretAccessKey: cfR2Secret,
    },
    endpoint: `https://${cfAccountID}.r2.cloudflarestorage.com`,
  });
  const downloadParams = {
    Bucket: cfBucketName,
    Key: filePathInBucket,
  };
  const command = new GetObjectCommand(downloadParams);
  try {
    const data = await s3Client.send(command);
    console.log("Success. File downloaded from bucket.");
    console.log(`Writing to ${outputPath}/${fileName}`);
    const stream = data.Body.pipe(
      fs.createWriteStream(`${outputPath}/${fileName}`)
    );
    await new Promise((resolve, reject) => {
      stream.on("finish", () => {
        console.log("File Downloaded");
        resolve();
      });
      stream.on("error", (error) => {
        console.log({ error });
        //not rejecting because we want crash
        throw new Error(error);
      });
    });
  } catch (err) {
    console.log("Error", err);
    throw err;
  }
  //list contents of tmp
  const contents = fs.readdirSync(outputPath);
  console.log(contents);
};
const uploadFile = async (id, path) => {
  //Upload to folder with id and name is vtt.vtt
  const s3Client = new S3Client({
    region: "auto",
    credentials: {
      accessKeyId: cfR2ID,
      secretAccessKey: cfR2Secret,
    },
    endpoint: `https://${cfAccountID}.r2.cloudflarestorage.com`,
  });
  const uploadParams = {
    Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
    Key: `${id}/vtt.vtt`,
    Body: path,
  };
  const command = new PutObjectCommand(uploadParams);
  try {
    const data = await s3Client.send(command);
    console.log("Success. File uploaded to bucket.");
    return data;
  } catch (err) {
    console.log("Error", err);
    throw err;
  }
};

module.exports = {
  downloadCloudflareStream,
  uploadFile,
  downloadR2,
};
