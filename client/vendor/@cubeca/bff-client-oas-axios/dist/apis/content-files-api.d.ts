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
import type { Configuration } from '../configuration';
import type { AxiosPromise, AxiosInstance, AxiosRequestConfig } from 'axios';
import { RequestArgs, BaseAPI } from '../base';
import { AddContent } from '../models';
import { AddContentResponse } from '../models';
/**
 * ContentFilesApi - axios parameter creator
 * @export
 */
export declare const ContentFilesApiAxiosParamCreator: (configuration?: Configuration) => {
    /**
     * Add content.
     * @summary Add content
     * @param {AddContent} addContent Add content
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    addContent: (addContent: AddContent, options?: AxiosRequestConfig) => Promise<RequestArgs>;
    /**
     * Get tus upload url from cloudflare.
     * @summary Get tus upload url from cloudflare
     * @param {string} uploadLength Upload length
     * @param {string} [uploadMetadata] Upload Metadata
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    contentUploadUrl: (uploadLength: string, uploadMetadata?: string, options?: AxiosRequestConfig) => Promise<RequestArgs>;
};
/**
 * ContentFilesApi - functional programming interface
 * @export
 */
export declare const ContentFilesApiFp: (configuration?: Configuration) => {
    /**
     * Add content.
     * @summary Add content
     * @param {AddContent} addContent Add content
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    addContent(addContent: AddContent, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<AddContentResponse>>;
    /**
     * Get tus upload url from cloudflare.
     * @summary Get tus upload url from cloudflare
     * @param {string} uploadLength Upload length
     * @param {string} [uploadMetadata] Upload Metadata
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    contentUploadUrl(uploadLength: string, uploadMetadata?: string, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<void>>;
};
/**
 * ContentFilesApi - factory interface
 * @export
 */
export declare const ContentFilesApiFactory: (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) => {
    /**
     * Add content.
     * @summary Add content
     * @param {AddContent} addContent Add content
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    addContent(addContent: AddContent, options?: any): AxiosPromise<AddContentResponse>;
    /**
     * Get tus upload url from cloudflare.
     * @summary Get tus upload url from cloudflare
     * @param {string} uploadLength Upload length
     * @param {string} [uploadMetadata] Upload Metadata
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    contentUploadUrl(uploadLength: string, uploadMetadata?: string, options?: any): AxiosPromise<void>;
};
/**
 * ContentFilesApi - interface
 * @export
 * @interface ContentFilesApi
 */
export interface ContentFilesApiInterface {
    /**
     * Add content.
     * @summary Add content
     * @param {AddContent} addContent Add content
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ContentFilesApiInterface
     */
    addContent(addContent: AddContent, options?: AxiosRequestConfig): AxiosPromise<AddContentResponse>;
    /**
     * Get tus upload url from cloudflare.
     * @summary Get tus upload url from cloudflare
     * @param {string} uploadLength Upload length
     * @param {string} [uploadMetadata] Upload Metadata
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ContentFilesApiInterface
     */
    contentUploadUrl(uploadLength: string, uploadMetadata?: string, options?: AxiosRequestConfig): AxiosPromise<void>;
}
/**
 * ContentFilesApi - object-oriented interface
 * @export
 * @class ContentFilesApi
 * @extends {BaseAPI}
 */
export declare class ContentFilesApi extends BaseAPI implements ContentFilesApiInterface {
    /**
     * Add content.
     * @summary Add content
     * @param {AddContent} addContent Add content
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ContentFilesApi
     */
    addContent(addContent: AddContent, options?: AxiosRequestConfig): Promise<import("axios").AxiosResponse<AddContentResponse, any>>;
    /**
     * Get tus upload url from cloudflare.
     * @summary Get tus upload url from cloudflare
     * @param {string} uploadLength Upload length
     * @param {string} [uploadMetadata] Upload Metadata
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ContentFilesApi
     */
    contentUploadUrl(uploadLength: string, uploadMetadata?: string, options?: AxiosRequestConfig): Promise<import("axios").AxiosResponse<void, any>>;
}
