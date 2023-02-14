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
import { EchoRequest } from '../models';
import { EchoResponse } from '../models';
/**
 * UserApi - axios parameter creator
 * @export
 */
export declare const UserApiAxiosParamCreator: (configuration?: Configuration) => {
    /**
     * Simple echo request.
     * @summary Simple echo request
     * @param {EchoRequest} echoRequest Simple echo request
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    echo: (echoRequest: EchoRequest, options?: AxiosRequestConfig) => Promise<RequestArgs>;
};
/**
 * UserApi - functional programming interface
 * @export
 */
export declare const UserApiFp: (configuration?: Configuration) => {
    /**
     * Simple echo request.
     * @summary Simple echo request
     * @param {EchoRequest} echoRequest Simple echo request
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    echo(echoRequest: EchoRequest, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<EchoResponse>>;
};
/**
 * UserApi - factory interface
 * @export
 */
export declare const UserApiFactory: (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) => {
    /**
     * Simple echo request.
     * @summary Simple echo request
     * @param {EchoRequest} echoRequest Simple echo request
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    echo(echoRequest: EchoRequest, options?: any): AxiosPromise<EchoResponse>;
};
/**
 * UserApi - interface
 * @export
 * @interface UserApi
 */
export interface UserApiInterface {
    /**
     * Simple echo request.
     * @summary Simple echo request
     * @param {EchoRequest} echoRequest Simple echo request
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UserApiInterface
     */
    echo(echoRequest: EchoRequest, options?: AxiosRequestConfig): AxiosPromise<EchoResponse>;
}
/**
 * UserApi - object-oriented interface
 * @export
 * @class UserApi
 * @extends {BaseAPI}
 */
export declare class UserApi extends BaseAPI implements UserApiInterface {
    /**
     * Simple echo request.
     * @summary Simple echo request
     * @param {EchoRequest} echoRequest Simple echo request
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UserApi
     */
    echo(echoRequest: EchoRequest, options?: AxiosRequestConfig): Promise<import("axios").AxiosResponse<EchoResponse, any>>;
}
