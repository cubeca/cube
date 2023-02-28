// Source: https://github.com/tus/tus-js-client/blob/main/demos/nodejs/index.js

import * as fs from 'node:fs';
import * as path from 'node:path';

import { Upload, HttpRequest, HttpResponse } from 'tus-js-client';

// TODO Replace with https://www.npmjs.com/package/file-type
import mime from 'mime';

export type ProgressLogger = (bytesUploaded: number, bytesTotal: number) => void;

const defaultProgressLogger: ProgressLogger = (bytesUploaded: number, bytesTotal: number) => {
    const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
    console.log(bytesUploaded, bytesTotal, `${percentage}%`);
}

export const uploadViaTus = async (endpoint: string, headers: any, filePath: string, meta: any, progressLogger: ProgressLogger = defaultProgressLogger) => {
    return await new Promise((resolve, reject) => {
        const file = fs.createReadStream(filePath);
        const fileName = path.basename(filePath);
        const mimeType = mime.getType(filePath) || 'application/octet-stream';

        let fileId: string | undefined = undefined;

        const options = {
            endpoint,
            headers,
            // chunkSize: 5 * 1024 * 1024,
            metadata: {
                fileName,
                mimeType,
                ...meta
            },
            onAfterResponse(req: HttpRequest, res: HttpResponse) {
                const url = req.getURL();
                if (url === endpoint) {
                    fileId = res.getHeader("Cube-File-Id");
                }
            },
            onError(error: any) {
                reject(error);
            },
            onProgress(bytesUploaded: number, bytesTotal: number) {
                progressLogger(bytesUploaded, bytesTotal);
            },
            onSuccess() {
                resolve(fileId);
            },
        }

        const upload = new Upload(file, options);
        upload.start();
    });
};
