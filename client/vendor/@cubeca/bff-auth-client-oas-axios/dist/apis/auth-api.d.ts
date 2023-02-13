/**
 * BFF-Auth - CUBE DAO Canada
 * # BFF-Auth (Authentication for Backend-for-Frontend)  The BFF-Auth API encapsulates authentication for the BFF. It\'s kept separate for modularity.
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
import { AnonymousJWTRequest } from '../models';
import { CreateUserRequest } from '../models';
import { JWTResponse } from '../models';
import { UpdateEmailRequest } from '../models';
import { UpdatePasswordRequest } from '../models';
import { UsernameAndPasswordJWTRequest } from '../models';
/**
 * AuthApi - axios parameter creator
 * @export
 */
export declare const AuthApiAxiosParamCreator: (configuration?: Configuration) => {
    /**
     * Acquire a JWT as an anonymous user.
     * @summary Acquire a JWT as an anonymous user.
     * @param {AnonymousJWTRequest} anonymousJWTRequest Anonymous JWT request
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    anonymousJWT: (anonymousJWTRequest: AnonymousJWTRequest, options?: AxiosRequestConfig) => Promise<RequestArgs>;
    /**
     * Trigger forgot password flow.
     * @summary Trigger forgot password flow.
     * @param {string} [email] The email of the user resetting their password
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    forgotPassword: (email?: string, options?: AxiosRequestConfig) => Promise<RequestArgs>;
    /**
     * Log user in with username and password.
     * @summary Login with username and password
     * @param {UsernameAndPasswordJWTRequest} usernameAndPasswordJWTRequest Logged-in JWT request
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    login: (usernameAndPasswordJWTRequest: UsernameAndPasswordJWTRequest, options?: AxiosRequestConfig) => Promise<RequestArgs>;
    /**
     * Update user email.
     * @summary Update user email.
     * @param {UpdateEmailRequest} updateEmailRequest Update Email
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    updateEmail: (updateEmailRequest: UpdateEmailRequest, options?: AxiosRequestConfig) => Promise<RequestArgs>;
    /**
     * Update user password.
     * @summary Update user password.
     * @param {UpdatePasswordRequest} updatePasswordRequest Update Password
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    updatePassword: (updatePasswordRequest: UpdatePasswordRequest, options?: AxiosRequestConfig) => Promise<RequestArgs>;
    /**
     * Creates a new user.
     * @summary Create a new user
     * @param {CreateUserRequest} createUserRequest Creating a new user
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    user: (createUserRequest: CreateUserRequest, options?: AxiosRequestConfig) => Promise<RequestArgs>;
    /**
     * Verify user email.
     * @summary Verify user email.
     * @param {string} [uuid] The uuid of the user verifying their email
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    verifyEmail: (uuid?: string, options?: AxiosRequestConfig) => Promise<RequestArgs>;
};
/**
 * AuthApi - functional programming interface
 * @export
 */
export declare const AuthApiFp: (configuration?: Configuration) => {
    /**
     * Acquire a JWT as an anonymous user.
     * @summary Acquire a JWT as an anonymous user.
     * @param {AnonymousJWTRequest} anonymousJWTRequest Anonymous JWT request
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    anonymousJWT(anonymousJWTRequest: AnonymousJWTRequest, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<JWTResponse>>;
    /**
     * Trigger forgot password flow.
     * @summary Trigger forgot password flow.
     * @param {string} [email] The email of the user resetting their password
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    forgotPassword(email?: string, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<string>>;
    /**
     * Log user in with username and password.
     * @summary Login with username and password
     * @param {UsernameAndPasswordJWTRequest} usernameAndPasswordJWTRequest Logged-in JWT request
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    login(usernameAndPasswordJWTRequest: UsernameAndPasswordJWTRequest, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<JWTResponse>>;
    /**
     * Update user email.
     * @summary Update user email.
     * @param {UpdateEmailRequest} updateEmailRequest Update Email
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    updateEmail(updateEmailRequest: UpdateEmailRequest, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<string>>;
    /**
     * Update user password.
     * @summary Update user password.
     * @param {UpdatePasswordRequest} updatePasswordRequest Update Password
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    updatePassword(updatePasswordRequest: UpdatePasswordRequest, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<string>>;
    /**
     * Creates a new user.
     * @summary Create a new user
     * @param {CreateUserRequest} createUserRequest Creating a new user
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    user(createUserRequest: CreateUserRequest, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<string>>;
    /**
     * Verify user email.
     * @summary Verify user email.
     * @param {string} [uuid] The uuid of the user verifying their email
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    verifyEmail(uuid?: string, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<string>>;
};
/**
 * AuthApi - factory interface
 * @export
 */
export declare const AuthApiFactory: (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) => {
    /**
     * Acquire a JWT as an anonymous user.
     * @summary Acquire a JWT as an anonymous user.
     * @param {AnonymousJWTRequest} anonymousJWTRequest Anonymous JWT request
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    anonymousJWT(anonymousJWTRequest: AnonymousJWTRequest, options?: any): AxiosPromise<JWTResponse>;
    /**
     * Trigger forgot password flow.
     * @summary Trigger forgot password flow.
     * @param {string} [email] The email of the user resetting their password
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    forgotPassword(email?: string, options?: any): AxiosPromise<string>;
    /**
     * Log user in with username and password.
     * @summary Login with username and password
     * @param {UsernameAndPasswordJWTRequest} usernameAndPasswordJWTRequest Logged-in JWT request
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    login(usernameAndPasswordJWTRequest: UsernameAndPasswordJWTRequest, options?: any): AxiosPromise<JWTResponse>;
    /**
     * Update user email.
     * @summary Update user email.
     * @param {UpdateEmailRequest} updateEmailRequest Update Email
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    updateEmail(updateEmailRequest: UpdateEmailRequest, options?: any): AxiosPromise<string>;
    /**
     * Update user password.
     * @summary Update user password.
     * @param {UpdatePasswordRequest} updatePasswordRequest Update Password
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    updatePassword(updatePasswordRequest: UpdatePasswordRequest, options?: any): AxiosPromise<string>;
    /**
     * Creates a new user.
     * @summary Create a new user
     * @param {CreateUserRequest} createUserRequest Creating a new user
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    user(createUserRequest: CreateUserRequest, options?: any): AxiosPromise<string>;
    /**
     * Verify user email.
     * @summary Verify user email.
     * @param {string} [uuid] The uuid of the user verifying their email
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    verifyEmail(uuid?: string, options?: any): AxiosPromise<string>;
};
/**
 * AuthApi - interface
 * @export
 * @interface AuthApi
 */
export interface AuthApiInterface {
    /**
     * Acquire a JWT as an anonymous user.
     * @summary Acquire a JWT as an anonymous user.
     * @param {AnonymousJWTRequest} anonymousJWTRequest Anonymous JWT request
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof AuthApiInterface
     */
    anonymousJWT(anonymousJWTRequest: AnonymousJWTRequest, options?: AxiosRequestConfig): AxiosPromise<JWTResponse>;
    /**
     * Trigger forgot password flow.
     * @summary Trigger forgot password flow.
     * @param {string} [email] The email of the user resetting their password
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof AuthApiInterface
     */
    forgotPassword(email?: string, options?: AxiosRequestConfig): AxiosPromise<string>;
    /**
     * Log user in with username and password.
     * @summary Login with username and password
     * @param {UsernameAndPasswordJWTRequest} usernameAndPasswordJWTRequest Logged-in JWT request
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof AuthApiInterface
     */
    login(usernameAndPasswordJWTRequest: UsernameAndPasswordJWTRequest, options?: AxiosRequestConfig): AxiosPromise<JWTResponse>;
    /**
     * Update user email.
     * @summary Update user email.
     * @param {UpdateEmailRequest} updateEmailRequest Update Email
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof AuthApiInterface
     */
    updateEmail(updateEmailRequest: UpdateEmailRequest, options?: AxiosRequestConfig): AxiosPromise<string>;
    /**
     * Update user password.
     * @summary Update user password.
     * @param {UpdatePasswordRequest} updatePasswordRequest Update Password
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof AuthApiInterface
     */
    updatePassword(updatePasswordRequest: UpdatePasswordRequest, options?: AxiosRequestConfig): AxiosPromise<string>;
    /**
     * Creates a new user.
     * @summary Create a new user
     * @param {CreateUserRequest} createUserRequest Creating a new user
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof AuthApiInterface
     */
    user(createUserRequest: CreateUserRequest, options?: AxiosRequestConfig): AxiosPromise<string>;
    /**
     * Verify user email.
     * @summary Verify user email.
     * @param {string} [uuid] The uuid of the user verifying their email
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof AuthApiInterface
     */
    verifyEmail(uuid?: string, options?: AxiosRequestConfig): AxiosPromise<string>;
}
/**
 * AuthApi - object-oriented interface
 * @export
 * @class AuthApi
 * @extends {BaseAPI}
 */
export declare class AuthApi extends BaseAPI implements AuthApiInterface {
    /**
     * Acquire a JWT as an anonymous user.
     * @summary Acquire a JWT as an anonymous user.
     * @param {AnonymousJWTRequest} anonymousJWTRequest Anonymous JWT request
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof AuthApi
     */
    anonymousJWT(anonymousJWTRequest: AnonymousJWTRequest, options?: AxiosRequestConfig): Promise<import("axios").AxiosResponse<JWTResponse, any>>;
    /**
     * Trigger forgot password flow.
     * @summary Trigger forgot password flow.
     * @param {string} [email] The email of the user resetting their password
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof AuthApi
     */
    forgotPassword(email?: string, options?: AxiosRequestConfig): Promise<import("axios").AxiosResponse<string, any>>;
    /**
     * Log user in with username and password.
     * @summary Login with username and password
     * @param {UsernameAndPasswordJWTRequest} usernameAndPasswordJWTRequest Logged-in JWT request
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof AuthApi
     */
    login(usernameAndPasswordJWTRequest: UsernameAndPasswordJWTRequest, options?: AxiosRequestConfig): Promise<import("axios").AxiosResponse<JWTResponse, any>>;
    /**
     * Update user email.
     * @summary Update user email.
     * @param {UpdateEmailRequest} updateEmailRequest Update Email
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof AuthApi
     */
    updateEmail(updateEmailRequest: UpdateEmailRequest, options?: AxiosRequestConfig): Promise<import("axios").AxiosResponse<string, any>>;
    /**
     * Update user password.
     * @summary Update user password.
     * @param {UpdatePasswordRequest} updatePasswordRequest Update Password
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof AuthApi
     */
    updatePassword(updatePasswordRequest: UpdatePasswordRequest, options?: AxiosRequestConfig): Promise<import("axios").AxiosResponse<string, any>>;
    /**
     * Creates a new user.
     * @summary Create a new user
     * @param {CreateUserRequest} createUserRequest Creating a new user
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof AuthApi
     */
    user(createUserRequest: CreateUserRequest, options?: AxiosRequestConfig): Promise<import("axios").AxiosResponse<string, any>>;
    /**
     * Verify user email.
     * @summary Verify user email.
     * @param {string} [uuid] The uuid of the user verifying their email
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof AuthApi
     */
    verifyEmail(uuid?: string, options?: AxiosRequestConfig): Promise<import("axios").AxiosResponse<string, any>>;
}