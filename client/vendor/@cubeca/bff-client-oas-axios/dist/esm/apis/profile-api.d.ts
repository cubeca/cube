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
import { RequestArgs, BaseAPI } from '../base';
import { ProfileDetails } from '../models';
import { UpdateProfileAudioDescriptionRequest } from '../models';
import { UpdateProfileLogoRequest } from '../models';
import { UpdateProfileSectionRequest } from '../models';
import { UpdatedProfileAudioDescriptionResponse } from '../models';
import { UpdatedProfileResponse } from '../models';
/**
 * ProfileApi - axios parameter creator
 * @export
 */
export declare const ProfileApiAxiosParamCreator: (configuration?: Configuration) => {
    /**
     * Update Profile audio description.
     * @summary Update Profile audio description
     * @param {string} profileId Profile ID
     * @param {UpdateProfileAudioDescriptionRequest} updateProfileAudioDescriptionRequest Profile audio description Update
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    profileAudioDescriptionUpdate: (profileId: string, updateProfileAudioDescriptionRequest: UpdateProfileAudioDescriptionRequest, options?: AxiosRequestConfig) => Promise<RequestArgs>;
    /**
     * Get profile details.
     * @summary Get profile details
     * @param {string} profileId Profile ID
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    profileDetails: (profileId: string, options?: AxiosRequestConfig) => Promise<RequestArgs>;
    /**
     * Update Profile logo.
     * @summary Update Profile logo
     * @param {string} profileId Profile ID
     * @param {UpdateProfileLogoRequest} updateProfileLogoRequest Profile Logo Update
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    profileLogoUpdate: (profileId: string, updateProfileLogoRequest: UpdateProfileLogoRequest, options?: AxiosRequestConfig) => Promise<RequestArgs>;
    /**
     * Update Profile section.
     * @summary Update Profile section
     * @param {string} profileId Profile ID
     * @param {UpdateProfileSectionRequest} updateProfileSectionRequest Profile Section Update
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    profileSectionUpdate: (profileId: string, updateProfileSectionRequest: UpdateProfileSectionRequest, options?: AxiosRequestConfig) => Promise<RequestArgs>;
};
/**
 * ProfileApi - functional programming interface
 * @export
 */
export declare const ProfileApiFp: (configuration?: Configuration) => {
    /**
     * Update Profile audio description.
     * @summary Update Profile audio description
     * @param {string} profileId Profile ID
     * @param {UpdateProfileAudioDescriptionRequest} updateProfileAudioDescriptionRequest Profile audio description Update
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    profileAudioDescriptionUpdate(profileId: string, updateProfileAudioDescriptionRequest: UpdateProfileAudioDescriptionRequest, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<UpdatedProfileAudioDescriptionResponse>>;
    /**
     * Get profile details.
     * @summary Get profile details
     * @param {string} profileId Profile ID
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    profileDetails(profileId: string, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<ProfileDetails>>;
    /**
     * Update Profile logo.
     * @summary Update Profile logo
     * @param {string} profileId Profile ID
     * @param {UpdateProfileLogoRequest} updateProfileLogoRequest Profile Logo Update
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    profileLogoUpdate(profileId: string, updateProfileLogoRequest: UpdateProfileLogoRequest, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<UpdatedProfileResponse>>;
    /**
     * Update Profile section.
     * @summary Update Profile section
     * @param {string} profileId Profile ID
     * @param {UpdateProfileSectionRequest} updateProfileSectionRequest Profile Section Update
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    profileSectionUpdate(profileId: string, updateProfileSectionRequest: UpdateProfileSectionRequest, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<UpdatedProfileResponse>>;
};
/**
 * ProfileApi - factory interface
 * @export
 */
export declare const ProfileApiFactory: (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) => {
    /**
     * Update Profile audio description.
     * @summary Update Profile audio description
     * @param {string} profileId Profile ID
     * @param {UpdateProfileAudioDescriptionRequest} updateProfileAudioDescriptionRequest Profile audio description Update
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    profileAudioDescriptionUpdate(profileId: string, updateProfileAudioDescriptionRequest: UpdateProfileAudioDescriptionRequest, options?: any): AxiosPromise<UpdatedProfileAudioDescriptionResponse>;
    /**
     * Get profile details.
     * @summary Get profile details
     * @param {string} profileId Profile ID
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    profileDetails(profileId: string, options?: any): AxiosPromise<ProfileDetails>;
    /**
     * Update Profile logo.
     * @summary Update Profile logo
     * @param {string} profileId Profile ID
     * @param {UpdateProfileLogoRequest} updateProfileLogoRequest Profile Logo Update
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    profileLogoUpdate(profileId: string, updateProfileLogoRequest: UpdateProfileLogoRequest, options?: any): AxiosPromise<UpdatedProfileResponse>;
    /**
     * Update Profile section.
     * @summary Update Profile section
     * @param {string} profileId Profile ID
     * @param {UpdateProfileSectionRequest} updateProfileSectionRequest Profile Section Update
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    profileSectionUpdate(profileId: string, updateProfileSectionRequest: UpdateProfileSectionRequest, options?: any): AxiosPromise<UpdatedProfileResponse>;
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
export declare class ProfileApi extends BaseAPI implements ProfileApiInterface {
    /**
     * Update Profile audio description.
     * @summary Update Profile audio description
     * @param {string} profileId Profile ID
     * @param {UpdateProfileAudioDescriptionRequest} updateProfileAudioDescriptionRequest Profile audio description Update
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ProfileApi
     */
    profileAudioDescriptionUpdate(profileId: string, updateProfileAudioDescriptionRequest: UpdateProfileAudioDescriptionRequest, options?: AxiosRequestConfig): Promise<import("axios").AxiosResponse<UpdatedProfileAudioDescriptionResponse, any>>;
    /**
     * Get profile details.
     * @summary Get profile details
     * @param {string} profileId Profile ID
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ProfileApi
     */
    profileDetails(profileId: string, options?: AxiosRequestConfig): Promise<import("axios").AxiosResponse<ProfileDetails, any>>;
    /**
     * Update Profile logo.
     * @summary Update Profile logo
     * @param {string} profileId Profile ID
     * @param {UpdateProfileLogoRequest} updateProfileLogoRequest Profile Logo Update
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ProfileApi
     */
    profileLogoUpdate(profileId: string, updateProfileLogoRequest: UpdateProfileLogoRequest, options?: AxiosRequestConfig): Promise<import("axios").AxiosResponse<UpdatedProfileResponse, any>>;
    /**
     * Update Profile section.
     * @summary Update Profile section
     * @param {string} profileId Profile ID
     * @param {UpdateProfileSectionRequest} updateProfileSectionRequest Profile Section Update
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ProfileApi
     */
    profileSectionUpdate(profileId: string, updateProfileSectionRequest: UpdateProfileSectionRequest, options?: AxiosRequestConfig): Promise<import("axios").AxiosResponse<UpdatedProfileResponse, any>>;
}
