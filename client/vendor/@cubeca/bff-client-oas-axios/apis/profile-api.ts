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
import { ProfileDetails } from '../models';
// @ts-ignore
import { UpdateProfileAudioDescriptionRequest } from '../models';
// @ts-ignore
import { UpdateProfileLogoRequest } from '../models';
// @ts-ignore
import { UpdateProfileSectionRequest } from '../models';
// @ts-ignore
import { UpdatedProfileAudioDescriptionResponse } from '../models';
// @ts-ignore
import { UpdatedProfileResponse } from '../models';
/**
 * ProfileApi - axios parameter creator
 * @export
 */
export const ProfileApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * Update Profile audio description.
         * @summary Update Profile audio description
         * @param {string} profileId Profile ID
         * @param {UpdateProfileAudioDescriptionRequest} updateProfileAudioDescriptionRequest Profile audio description Update
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        profileAudioDescriptionUpdate: async (profileId: string, updateProfileAudioDescriptionRequest: UpdateProfileAudioDescriptionRequest, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'profileId' is not null or undefined
            assertParamExists('profileAudioDescriptionUpdate', 'profileId', profileId)
            // verify required parameter 'updateProfileAudioDescriptionRequest' is not null or undefined
            assertParamExists('profileAudioDescriptionUpdate', 'updateProfileAudioDescriptionRequest', updateProfileAudioDescriptionRequest)
            const localVarPath = `/profiles/{profileId}/update-audio-description`
                .replace(`{${"profileId"}}`, encodeURIComponent(String(profileId)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication jwt_logged_in required
            // http bearer authentication required
            await setBearerAuthToObject(localVarHeaderParameter, configuration)


    
            localVarHeaderParameter['Content-Type'] = 'application/json';

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            localVarRequestOptions.data = serializeDataIfNeeded(updateProfileAudioDescriptionRequest, localVarRequestOptions, configuration)

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * Get profile details.
         * @summary Get profile details
         * @param {string} profileId Profile ID
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        profileDetails: async (profileId: string, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'profileId' is not null or undefined
            assertParamExists('profileDetails', 'profileId', profileId)
            const localVarPath = `/profiles/{profileId}`
                .replace(`{${"profileId"}}`, encodeURIComponent(String(profileId)));
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
        /**
         * Update Profile logo.
         * @summary Update Profile logo
         * @param {string} profileId Profile ID
         * @param {UpdateProfileLogoRequest} updateProfileLogoRequest Profile Logo Update
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        profileLogoUpdate: async (profileId: string, updateProfileLogoRequest: UpdateProfileLogoRequest, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'profileId' is not null or undefined
            assertParamExists('profileLogoUpdate', 'profileId', profileId)
            // verify required parameter 'updateProfileLogoRequest' is not null or undefined
            assertParamExists('profileLogoUpdate', 'updateProfileLogoRequest', updateProfileLogoRequest)
            const localVarPath = `/profiles/{profileId}/update-logo`
                .replace(`{${"profileId"}}`, encodeURIComponent(String(profileId)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication jwt_logged_in required
            // http bearer authentication required
            await setBearerAuthToObject(localVarHeaderParameter, configuration)


    
            localVarHeaderParameter['Content-Type'] = 'application/json';

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            localVarRequestOptions.data = serializeDataIfNeeded(updateProfileLogoRequest, localVarRequestOptions, configuration)

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * Update Profile section.
         * @summary Update Profile section
         * @param {string} profileId Profile ID
         * @param {UpdateProfileSectionRequest} updateProfileSectionRequest Profile Section Update
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        profileSectionUpdate: async (profileId: string, updateProfileSectionRequest: UpdateProfileSectionRequest, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'profileId' is not null or undefined
            assertParamExists('profileSectionUpdate', 'profileId', profileId)
            // verify required parameter 'updateProfileSectionRequest' is not null or undefined
            assertParamExists('profileSectionUpdate', 'updateProfileSectionRequest', updateProfileSectionRequest)
            const localVarPath = `/profiles/{profileId}`
                .replace(`{${"profileId"}}`, encodeURIComponent(String(profileId)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'PUT', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication jwt_logged_in required
            // http bearer authentication required
            await setBearerAuthToObject(localVarHeaderParameter, configuration)


    
            localVarHeaderParameter['Content-Type'] = 'application/json';

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            localVarRequestOptions.data = serializeDataIfNeeded(updateProfileSectionRequest, localVarRequestOptions, configuration)

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * ProfileApi - functional programming interface
 * @export
 */
export const ProfileApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = ProfileApiAxiosParamCreator(configuration)
    return {
        /**
         * Update Profile audio description.
         * @summary Update Profile audio description
         * @param {string} profileId Profile ID
         * @param {UpdateProfileAudioDescriptionRequest} updateProfileAudioDescriptionRequest Profile audio description Update
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async profileAudioDescriptionUpdate(profileId: string, updateProfileAudioDescriptionRequest: UpdateProfileAudioDescriptionRequest, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<UpdatedProfileAudioDescriptionResponse>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.profileAudioDescriptionUpdate(profileId, updateProfileAudioDescriptionRequest, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * Get profile details.
         * @summary Get profile details
         * @param {string} profileId Profile ID
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async profileDetails(profileId: string, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<ProfileDetails>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.profileDetails(profileId, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * Update Profile logo.
         * @summary Update Profile logo
         * @param {string} profileId Profile ID
         * @param {UpdateProfileLogoRequest} updateProfileLogoRequest Profile Logo Update
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async profileLogoUpdate(profileId: string, updateProfileLogoRequest: UpdateProfileLogoRequest, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<UpdatedProfileResponse>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.profileLogoUpdate(profileId, updateProfileLogoRequest, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * Update Profile section.
         * @summary Update Profile section
         * @param {string} profileId Profile ID
         * @param {UpdateProfileSectionRequest} updateProfileSectionRequest Profile Section Update
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async profileSectionUpdate(profileId: string, updateProfileSectionRequest: UpdateProfileSectionRequest, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<UpdatedProfileResponse>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.profileSectionUpdate(profileId, updateProfileSectionRequest, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
    }
};

/**
 * ProfileApi - factory interface
 * @export
 */
export const ProfileApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    const localVarFp = ProfileApiFp(configuration)
    return {
        /**
         * Update Profile audio description.
         * @summary Update Profile audio description
         * @param {string} profileId Profile ID
         * @param {UpdateProfileAudioDescriptionRequest} updateProfileAudioDescriptionRequest Profile audio description Update
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        profileAudioDescriptionUpdate(profileId: string, updateProfileAudioDescriptionRequest: UpdateProfileAudioDescriptionRequest, options?: any): AxiosPromise<UpdatedProfileAudioDescriptionResponse> {
            return localVarFp.profileAudioDescriptionUpdate(profileId, updateProfileAudioDescriptionRequest, options).then((request) => request(axios, basePath));
        },
        /**
         * Get profile details.
         * @summary Get profile details
         * @param {string} profileId Profile ID
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        profileDetails(profileId: string, options?: any): AxiosPromise<ProfileDetails> {
            return localVarFp.profileDetails(profileId, options).then((request) => request(axios, basePath));
        },
        /**
         * Update Profile logo.
         * @summary Update Profile logo
         * @param {string} profileId Profile ID
         * @param {UpdateProfileLogoRequest} updateProfileLogoRequest Profile Logo Update
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        profileLogoUpdate(profileId: string, updateProfileLogoRequest: UpdateProfileLogoRequest, options?: any): AxiosPromise<UpdatedProfileResponse> {
            return localVarFp.profileLogoUpdate(profileId, updateProfileLogoRequest, options).then((request) => request(axios, basePath));
        },
        /**
         * Update Profile section.
         * @summary Update Profile section
         * @param {string} profileId Profile ID
         * @param {UpdateProfileSectionRequest} updateProfileSectionRequest Profile Section Update
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        profileSectionUpdate(profileId: string, updateProfileSectionRequest: UpdateProfileSectionRequest, options?: any): AxiosPromise<UpdatedProfileResponse> {
            return localVarFp.profileSectionUpdate(profileId, updateProfileSectionRequest, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * ProfileApi - interface
 * @export
 * @interface ProfileApi
 */
export interface ProfileApiInterface {
    /**
     * Update Profile audio description.
     * @summary Update Profile audio description
     * @param {string} profileId Profile ID
     * @param {UpdateProfileAudioDescriptionRequest} updateProfileAudioDescriptionRequest Profile audio description Update
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ProfileApiInterface
     */
    profileAudioDescriptionUpdate(profileId: string, updateProfileAudioDescriptionRequest: UpdateProfileAudioDescriptionRequest, options?: AxiosRequestConfig): AxiosPromise<UpdatedProfileAudioDescriptionResponse>;

    /**
     * Get profile details.
     * @summary Get profile details
     * @param {string} profileId Profile ID
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ProfileApiInterface
     */
    profileDetails(profileId: string, options?: AxiosRequestConfig): AxiosPromise<ProfileDetails>;

    /**
     * Update Profile logo.
     * @summary Update Profile logo
     * @param {string} profileId Profile ID
     * @param {UpdateProfileLogoRequest} updateProfileLogoRequest Profile Logo Update
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ProfileApiInterface
     */
    profileLogoUpdate(profileId: string, updateProfileLogoRequest: UpdateProfileLogoRequest, options?: AxiosRequestConfig): AxiosPromise<UpdatedProfileResponse>;

    /**
     * Update Profile section.
     * @summary Update Profile section
     * @param {string} profileId Profile ID
     * @param {UpdateProfileSectionRequest} updateProfileSectionRequest Profile Section Update
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ProfileApiInterface
     */
    profileSectionUpdate(profileId: string, updateProfileSectionRequest: UpdateProfileSectionRequest, options?: AxiosRequestConfig): AxiosPromise<UpdatedProfileResponse>;

}

/**
 * ProfileApi - object-oriented interface
 * @export
 * @class ProfileApi
 * @extends {BaseAPI}
 */
export class ProfileApi extends BaseAPI implements ProfileApiInterface {
    /**
     * Update Profile audio description.
     * @summary Update Profile audio description
     * @param {string} profileId Profile ID
     * @param {UpdateProfileAudioDescriptionRequest} updateProfileAudioDescriptionRequest Profile audio description Update
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ProfileApi
     */
    public profileAudioDescriptionUpdate(profileId: string, updateProfileAudioDescriptionRequest: UpdateProfileAudioDescriptionRequest, options?: AxiosRequestConfig) {
        return ProfileApiFp(this.configuration).profileAudioDescriptionUpdate(profileId, updateProfileAudioDescriptionRequest, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * Get profile details.
     * @summary Get profile details
     * @param {string} profileId Profile ID
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ProfileApi
     */
    public profileDetails(profileId: string, options?: AxiosRequestConfig) {
        return ProfileApiFp(this.configuration).profileDetails(profileId, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * Update Profile logo.
     * @summary Update Profile logo
     * @param {string} profileId Profile ID
     * @param {UpdateProfileLogoRequest} updateProfileLogoRequest Profile Logo Update
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ProfileApi
     */
    public profileLogoUpdate(profileId: string, updateProfileLogoRequest: UpdateProfileLogoRequest, options?: AxiosRequestConfig) {
        return ProfileApiFp(this.configuration).profileLogoUpdate(profileId, updateProfileLogoRequest, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * Update Profile section.
     * @summary Update Profile section
     * @param {string} profileId Profile ID
     * @param {UpdateProfileSectionRequest} updateProfileSectionRequest Profile Section Update
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ProfileApi
     */
    public profileSectionUpdate(profileId: string, updateProfileSectionRequest: UpdateProfileSectionRequest, options?: AxiosRequestConfig) {
        return ProfileApiFp(this.configuration).profileSectionUpdate(profileId, updateProfileSectionRequest, options).then((request) => request(this.axios, this.basePath));
    }
}
