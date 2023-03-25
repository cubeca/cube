/* tslint:disable */
/* eslint-disable */
/**
 * BFF - CUBE DAO Canada
 * # BFF (Backend-for-Frontend)  The BFF API caters to each and every whim of the Frontend, i.e. it receives, bundles, packages and formats data exactly as the Frontend needs it.  The actual implementation of the BFF will then in turn translate the Frontend traffic into whatever the specialized and semantically modular \"real\" backend services understand. 
 *
 * The version of the OpenAPI document: 0.5.0
 * Contact: raphaelhuefner@gmail.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import type { Configuration } from '../configuration';
import type { AxiosPromise, AxiosInstance, AxiosRequestConfig } from 'axios';
import globalAxios from 'axios';
// Some imports not used depending on template conditions
// @ts-ignore
import { DUMMY_BASE_URL, assertParamExists, setApiKeyToObject, setBasicAuthToObject, setBearerAuthToObject, setOAuthToObject, setSearchParams, serializeDataIfNeeded, toPathString, createRequestFunction } from '../common';
// @ts-ignore
import { BASE_PATH, COLLECTION_FORMATS, RequestArgs, BaseAPI, RequiredError } from '../base';
// @ts-ignore
import { ErrorResponse } from '../models';
// @ts-ignore
import { FilesDetailsResponse } from '../models';
/**
 * FilesApi - axios parameter creator
 * @export
 */
export const FilesApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * Get file details.
         * @summary Get file details
         * @param {string} fileId File ID
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        fileDetails: async (fileId: string, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'fileId' is not null or undefined
            assertParamExists('fileDetails', 'fileId', fileId)
            const localVarPath = `/files/{fileId}`
                .replace(`{${"fileId"}}`, encodeURIComponent(String(fileId)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication jwt_logged_in required
            // http bearer authentication required
            await setBearerAuthToObject(localVarHeaderParameter, configuration)


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * FilesApi - functional programming interface
 * @export
 */
export const FilesApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = FilesApiAxiosParamCreator(configuration)
    return {
        /**
         * Get file details.
         * @summary Get file details
         * @param {string} fileId File ID
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async fileDetails(fileId: string, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<FilesDetailsResponse>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.fileDetails(fileId, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
    }
};

/**
 * FilesApi - factory interface
 * @export
 */
export const FilesApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    const localVarFp = FilesApiFp(configuration)
    return {
        /**
         * Get file details.
         * @summary Get file details
         * @param {string} fileId File ID
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        fileDetails(fileId: string, options?: any): AxiosPromise<FilesDetailsResponse> {
            return localVarFp.fileDetails(fileId, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * FilesApi - interface
 * @export
 * @interface FilesApi
 */
export interface FilesApiInterface {
    /**
     * Get file details.
     * @summary Get file details
     * @param {string} fileId File ID
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof FilesApiInterface
     */
    fileDetails(fileId: string, options?: AxiosRequestConfig): AxiosPromise<FilesDetailsResponse>;

}

/**
 * FilesApi - object-oriented interface
 * @export
 * @class FilesApi
 * @extends {BaseAPI}
 */
export class FilesApi extends BaseAPI implements FilesApiInterface {
    /**
     * Get file details.
     * @summary Get file details
     * @param {string} fileId File ID
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof FilesApi
     */
    public fileDetails(fileId: string, options?: AxiosRequestConfig) {
        return FilesApiFp(this.configuration).fileDetails(fileId, options).then((request) => request(this.axios, this.basePath));
    }
}
