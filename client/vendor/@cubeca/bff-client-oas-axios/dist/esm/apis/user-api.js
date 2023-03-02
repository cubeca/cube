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
import globalAxios from 'axios';
// Some imports not used depending on template conditions
// @ts-ignore
import { DUMMY_BASE_URL, assertParamExists, setBearerAuthToObject, setSearchParams, serializeDataIfNeeded, toPathString, createRequestFunction } from '../common';
// @ts-ignore
import { BASE_PATH, BaseAPI } from '../base';
/**
 * UserApi - axios parameter creator
 * @export
 */
export const UserApiAxiosParamCreator = function (configuration) {
    return {
        /**
         * Simple echo request.
         * @summary Simple echo request
         * @param {EchoRequest} echoRequest Simple echo request
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        echo: (echoRequest, options = {}) => __awaiter(this, void 0, void 0, function* () {
            // verify required parameter 'echoRequest' is not null or undefined
            assertParamExists('echo', 'echoRequest', echoRequest);
            const localVarPath = `/echo`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = Object.assign(Object.assign({ method: 'POST' }, baseOptions), options);
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            // authentication jwt_logged_in required
            // http bearer authentication required
            yield setBearerAuthToObject(localVarHeaderParameter, configuration);
            localVarHeaderParameter['Content-Type'] = 'application/json';
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
            localVarRequestOptions.data = serializeDataIfNeeded(echoRequest, localVarRequestOptions, configuration);
            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        }),
    };
};
/**
 * UserApi - functional programming interface
 * @export
 */
export const UserApiFp = function (configuration) {
    const localVarAxiosParamCreator = UserApiAxiosParamCreator(configuration);
    return {
        /**
         * Simple echo request.
         * @summary Simple echo request
         * @param {EchoRequest} echoRequest Simple echo request
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        echo(echoRequest, options) {
            return __awaiter(this, void 0, void 0, function* () {
                const localVarAxiosArgs = yield localVarAxiosParamCreator.echo(echoRequest, options);
                return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
            });
        },
    };
};
/**
 * UserApi - factory interface
 * @export
 */
export const UserApiFactory = function (configuration, basePath, axios) {
    const localVarFp = UserApiFp(configuration);
    return {
        /**
         * Simple echo request.
         * @summary Simple echo request
         * @param {EchoRequest} echoRequest Simple echo request
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        echo(echoRequest, options) {
            return localVarFp.echo(echoRequest, options).then((request) => request(axios, basePath));
        },
    };
};
/**
 * UserApi - object-oriented interface
 * @export
 * @class UserApi
 * @extends {BaseAPI}
 */
export class UserApi extends BaseAPI {
    /**
     * Simple echo request.
     * @summary Simple echo request
     * @param {EchoRequest} echoRequest Simple echo request
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UserApi
     */
    echo(echoRequest, options) {
        return UserApiFp(this.configuration).echo(echoRequest, options).then((request) => request(this.axios, this.basePath));
    }
}
