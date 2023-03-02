// Source: https://github.com/tus/tus-js-client/blob/main/demos/nodejs/index.js

import * as fs from 'node:fs';
import * as path from 'node:path';

import { Upload, HttpRequest, HttpResponse } from 'tus-js-client';

// TODO Replace with https://www.npmjs.com/package/file-type
import mime from 'mime';

export type ProgressHandler = (bytesUploaded: number, bytesTotal: number) => void;

const defaultProgressHandler: ProgressHandler = (bytesUploaded: number, bytesTotal: number) => {
    const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
    console.log(`${bytesUploaded}/${bytesTotal} = ${percentage}%`);
}

export const uploadViaTus = async (endpoint: string, headers: any, filePath: string, meta: any, progressHandler: ProgressHandler = defaultProgressHandler) => {
    return await new Promise((resolve, reject) => {
        const file = fs.createReadStream(filePath);
        const fileName = path.basename(filePath);
        const mimeType = mime.getType(filePath) || 'application/octet-stream';

        let fileId: string | undefined = undefined;

        const options = {
            endpoint,
            headers,
            metadata: {
                fileName,
                mimeType,
                ...meta
            },
            onAfterResponse(req: HttpRequest, res: HttpResponse) {
                if (req.getURL() === endpoint) {
                    fileId = res.getHeader("Cube-File-Id");
                }
            },
            onError(error: any) {
                reject(error);
            },
            onProgress: progressHandler,
            onSuccess() {
                resolve(fileId);
            },
        }

        const upload = new Upload(file, options);
        upload.start();
    });
};
