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
exports.UserApi = exports.UserApiFactory = exports.UserApiFp = exports.UserApiAxiosParamCreator = void 0;
const axios_1 = require("axios");
// Some imports not used depending on template conditions
// @ts-ignore
const common_1 = require("../common");
// @ts-ignore
const base_1 = require("../base");
/**
 * UserApi - axios parameter creator
 * @export
 */
const UserApiAxiosParamCreator = function (configuration) {
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
            (0, common_1.assertParamExists)('echo', 'echoRequest', echoRequest);
            const localVarPath = `/echo`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = Object.assign(Object.assign({ method: 'POST' }, baseOptions), options);
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            localVarHeaderParameter['Content-Type'] = 'application/json';
            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
            localVarRequestOptions.data = (0, common_1.serializeDataIfNeeded)(echoRequest, localVarRequestOptions, configuration);
            return {
                url: (0, common_1.toPathString)(localVarUrlObj),
                options: localVarRequestOptions,
            };
        }),
    };
};
exports.UserApiAxiosParamCreator = UserApiAxiosParamCreator;
/**
 * UserApi - functional programming interface
 * @export
 */
const UserApiFp = function (configuration) {
    const localVarAxiosParamCreator = (0, exports.UserApiAxiosParamCreator)(configuration);
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
                return (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
            });
        },
    };
};
exports.UserApiFp = UserApiFp;
/**
 * UserApi - factory interface
 * @export
 */
const UserApiFactory = function (configuration, basePath, axios) {
    const localVarFp = (0, exports.UserApiFp)(configuration);
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
exports.UserApiFactory = UserApiFactory;
/**
 * UserApi - object-oriented interface
 * @export
 * @class UserApi
 * @extends {BaseAPI}
 */
class UserApi extends base_1.BaseAPI {
    /**
     * Simple echo request.
     * @summary Simple echo request
     * @param {EchoRequest} echoRequest Simple echo request
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UserApi
     */
    echo(echoRequest, options) {
        return (0, exports.UserApiFp)(this.configuration).echo(echoRequest, options).then((request) => request(this.axios, this.basePath));
    }
}
exports.UserApi = UserApi;
