"use strict";
/* tslint:disable */
/* eslint-disable */
/**
 * BFF - CUBE DAO Canada
 * # BFF (Backend-for-Frontend)  The BFF API caters to each and every whim of the Frontend, i.e. it receives, bundles, packages and formats data exactly as the Frontend needs it.  The actual implementation of the BFF will then in turn translate the Frontend traffic into whatever the specialized and semantically modular \"real\" backend services understand.
 *
 * The version of the OpenAPI document: 0.0.1
 * Contact: raphaelhuefner@gmail.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadApi = exports.UploadApiFactory = exports.UploadApiFp = exports.UploadApiAxiosParamCreator = void 0;
const axios_1 = require("axios");
// Some imports not used depending on template conditions
// @ts-ignore
const common_1 = require("../common");
// @ts-ignore
const base_1 = require("../base");
/**
 * UploadApi - axios parameter creator
 * @export
 */
const UploadApiAxiosParamCreator = function (configuration) {
    return {
        /**
         * Get S3 / R2 presigned url from Cloudflare
         * @summary Get S3 / R2 presigned url from Cloudflare
         * @param {S3PresignedURLRequest} s3PresignedURLRequest Add content
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        uploadFilesViaPresignedUrl: (s3PresignedURLRequest, options = {}) => __awaiter(this, void 0, void 0, function* () {
            // verify required parameter 's3PresignedURLRequest' is not null or undefined
            (0, common_1.assertParamExists)('uploadFilesViaPresignedUrl', 's3PresignedURLRequest', s3PresignedURLRequest);
            const localVarPath = `/upload/s3-presigned-url`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = Object.assign(Object.assign({ method: 'POST' }, baseOptions), options);
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            // authentication jwt_logged_in required
            // http bearer authentication required
            yield (0, common_1.setBearerAuthToObject)(localVarHeaderParameter, configuration);
            localVarHeaderParameter['Content-Type'] = 'application/json';
            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
            localVarRequestOptions.data = (0, common_1.serializeDataIfNeeded)(s3PresignedURLRequest, localVarRequestOptions, configuration);
            return {
                url: (0, common_1.toPathString)(localVarUrlObj),
                options: localVarRequestOptions,
            };
        }),
        /**
         * This (and not it\'s return value!) has to be given directly to the TUS client as it\'s `endpoint` parameter.
         * @summary TUS \"endpoint\" to upload URL from Cloudflare
         * @param {string} uploadLength Upload Length
         * @param {string} [uploadMetadata] Upload Metadata
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        uploadVideoTusEndpoint: (uploadLength, uploadMetadata, options = {}) => __awaiter(this, void 0, void 0, function* () {
            // verify required parameter 'uploadLength' is not null or undefined
            (0, common_1.assertParamExists)('uploadVideoTusEndpoint', 'uploadLength', uploadLength);
            const localVarPath = `/upload/video-tus-reservation`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = Object.assign(Object.assign({ method: 'POST' }, baseOptions), options);
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            // authentication jwt_logged_in required
            // http bearer authentication required
            yield (0, common_1.setBearerAuthToObject)(localVarHeaderParameter, configuration);
            if (uploadLength != null) {
                localVarHeaderParameter['upload-length'] = String(uploadLength);
            }
            if (uploadMetadata != null) {
                localVarHeaderParameter['upload-metadata'] = String(uploadMetadata);
            }
            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
            return {
                url: (0, common_1.toPathString)(localVarUrlObj),
                options: localVarRequestOptions,
            };
        }),
    };
};
exports.UploadApiAxiosParamCreator = UploadApiAxiosParamCreator;
/**
 * UploadApi - functional programming interface
 * @export
 */
const UploadApiFp = function (configuration) {
    const localVarAxiosParamCreator = (0, exports.UploadApiAxiosParamCreator)(configuration);
    return {
        /**
         * Get S3 / R2 presigned url from Cloudflare
         * @summary Get S3 / R2 presigned url from Cloudflare
         * @param {S3PresignedURLRequest} s3PresignedURLRequest Add content
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        uploadFilesViaPresignedUrl(s3PresignedURLRequest, options) {
            return __awaiter(this, void 0, void 0, function* () {
                const localVarAxiosArgs = yield localVarAxiosParamCreator.uploadFilesViaPresignedUrl(s3PresignedURLRequest, options);
                return (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
            });
        },
        /**
         * This (and not it\'s return value!) has to be given directly to the TUS client as it\'s `endpoint` parameter.
         * @summary TUS \"endpoint\" to upload URL from Cloudflare
         * @param {string} uploadLength Upload Length
         * @param {string} [uploadMetadata] Upload Metadata
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        uploadVideoTusEndpoint(uploadLength, uploadMetadata, options) {
            return __awaiter(this, void 0, void 0, function* () {
                const localVarAxiosArgs = yield localVarAxiosParamCreator.uploadVideoTusEndpoint(uploadLength, uploadMetadata, options);
                return (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
            });
        },
    };
};
exports.UploadApiFp = UploadApiFp;
/**
 * UploadApi - factory interface
 * @export
 */
const UploadApiFactory = function (configuration, basePath, axios) {
    const localVarFp = (0, exports.UploadApiFp)(configuration);
    return {
        /**
         * Get S3 / R2 presigned url from Cloudflare
         * @summary Get S3 / R2 presigned url from Cloudflare
         * @param {S3PresignedURLRequest} s3PresignedURLRequest Add content
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        uploadFilesViaPresignedUrl(s3PresignedURLRequest, options) {
            return localVarFp.uploadFilesViaPresignedUrl(s3PresignedURLRequest, options).then((request) => request(axios, basePath));
        },
        /**
         * This (and not it\'s return value!) has to be given directly to the TUS client as it\'s `endpoint` parameter.
         * @summary TUS \"endpoint\" to upload URL from Cloudflare
         * @param {string} uploadLength Upload Length
         * @param {string} [uploadMetadata] Upload Metadata
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        uploadVideoTusEndpoint(uploadLength, uploadMetadata, options) {
            return localVarFp.uploadVideoTusEndpoint(uploadLength, uploadMetadata, options).then((request) => request(axios, basePath));
        },
    };
};
exports.UploadApiFactory = UploadApiFactory;
/**
 * UploadApi - object-oriented interface
 * @export
 * @class UploadApi
 * @extends {BaseAPI}
 */
class UploadApi extends base_1.BaseAPI {
    /**
     * Get S3 / R2 presigned url from Cloudflare
     * @summary Get S3 / R2 presigned url from Cloudflare
     * @param {S3PresignedURLRequest} s3PresignedURLRequest Add content
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UploadApi
     */
    uploadFilesViaPresignedUrl(s3PresignedURLRequest, options) {
        return (0, exports.UploadApiFp)(this.configuration).uploadFilesViaPresignedUrl(s3PresignedURLRequest, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * This (and not it\'s return value!) has to be given directly to the TUS client as it\'s `endpoint` parameter.
     * @summary TUS \"endpoint\" to upload URL from Cloudflare
     * @param {string} uploadLength Upload Length
     * @param {string} [uploadMetadata] Upload Metadata
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UploadApi
     */
    uploadVideoTusEndpoint(uploadLength, uploadMetadata, options) {
        return (0, exports.UploadApiFp)(this.configuration).uploadVideoTusEndpoint(uploadLength, uploadMetadata, options).then((request) => request(this.axios, this.basePath));
    }
}
exports.UploadApi = UploadApi;
