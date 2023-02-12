"use strict";
/* tslint:disable */
/* eslint-disable */
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
exports.AuthApi = exports.AuthApiFactory = exports.AuthApiFp = exports.AuthApiAxiosParamCreator = void 0;
const axios_1 = require("axios");
// Some imports not used depending on template conditions
// @ts-ignore
const common_1 = require("../common");
// @ts-ignore
const base_1 = require("../base");
/**
 * AuthApi - axios parameter creator
 * @export
 */
const AuthApiAxiosParamCreator = function (configuration) {
    return {
        /**
         * Acquire a JWT as an anonymous user.
         * @summary Acquire a JWT as an anonymous user.
         * @param {AnonymousJWTRequest} anonymousJWTRequest Anonymous JWT request
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        anonymousJWT: (anonymousJWTRequest, options = {}) => __awaiter(this, void 0, void 0, function* () {
            // verify required parameter 'anonymousJWTRequest' is not null or undefined
            (0, common_1.assertParamExists)('anonymousJWT', 'anonymousJWTRequest', anonymousJWTRequest);
            const localVarPath = `/auth/anonymous`;
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
            localVarRequestOptions.data = (0, common_1.serializeDataIfNeeded)(anonymousJWTRequest, localVarRequestOptions, configuration);
            return {
                url: (0, common_1.toPathString)(localVarUrlObj),
                options: localVarRequestOptions,
            };
        }),
        /**
         * Trigger forgot password flow.
         * @summary Trigger forgot password flow.
         * @param {string} [email] The email of the user resetting their password
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        forgotPassword: (email, options = {}) => __awaiter(this, void 0, void 0, function* () {
            const localVarPath = `/auth/forgot-password`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = Object.assign(Object.assign({ method: 'GET' }, baseOptions), options);
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            if (email !== undefined) {
                localVarQueryParameter['email'] = email;
            }
            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
            return {
                url: (0, common_1.toPathString)(localVarUrlObj),
                options: localVarRequestOptions,
            };
        }),
        /**
         * Log user in with username and password.
         * @summary Login with username and password
         * @param {UsernameAndPasswordJWTRequest} usernameAndPasswordJWTRequest Logged-in JWT request
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        login: (usernameAndPasswordJWTRequest, options = {}) => __awaiter(this, void 0, void 0, function* () {
            // verify required parameter 'usernameAndPasswordJWTRequest' is not null or undefined
            (0, common_1.assertParamExists)('login', 'usernameAndPasswordJWTRequest', usernameAndPasswordJWTRequest);
            const localVarPath = `/auth/login`;
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
            localVarRequestOptions.data = (0, common_1.serializeDataIfNeeded)(usernameAndPasswordJWTRequest, localVarRequestOptions, configuration);
            return {
                url: (0, common_1.toPathString)(localVarUrlObj),
                options: localVarRequestOptions,
            };
        }),
        /**
         * Update user email.
         * @summary Update user email.
         * @param {UpdateEmailRequest} updateEmailRequest Update Email
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        updateEmail: (updateEmailRequest, options = {}) => __awaiter(this, void 0, void 0, function* () {
            // verify required parameter 'updateEmailRequest' is not null or undefined
            (0, common_1.assertParamExists)('updateEmail', 'updateEmailRequest', updateEmailRequest);
            const localVarPath = `/auth/email`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = Object.assign(Object.assign({ method: 'PUT' }, baseOptions), options);
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            localVarHeaderParameter['Content-Type'] = 'application/json';
            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
            localVarRequestOptions.data = (0, common_1.serializeDataIfNeeded)(updateEmailRequest, localVarRequestOptions, configuration);
            return {
                url: (0, common_1.toPathString)(localVarUrlObj),
                options: localVarRequestOptions,
            };
        }),
        /**
         * Update user password.
         * @summary Update user password.
         * @param {UpdatePasswordRequest} updatePasswordRequest Update Password
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        updatePassword: (updatePasswordRequest, options = {}) => __awaiter(this, void 0, void 0, function* () {
            // verify required parameter 'updatePasswordRequest' is not null or undefined
            (0, common_1.assertParamExists)('updatePassword', 'updatePasswordRequest', updatePasswordRequest);
            const localVarPath = `/auth/password`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = Object.assign(Object.assign({ method: 'PUT' }, baseOptions), options);
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            localVarHeaderParameter['Content-Type'] = 'application/json';
            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
            localVarRequestOptions.data = (0, common_1.serializeDataIfNeeded)(updatePasswordRequest, localVarRequestOptions, configuration);
            return {
                url: (0, common_1.toPathString)(localVarUrlObj),
                options: localVarRequestOptions,
            };
        }),
        /**
         * Creates a new user.
         * @summary Create a new user
         * @param {CreateUserRequest} createUserRequest Creating a new user
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        user: (createUserRequest, options = {}) => __awaiter(this, void 0, void 0, function* () {
            // verify required parameter 'createUserRequest' is not null or undefined
            (0, common_1.assertParamExists)('user', 'createUserRequest', createUserRequest);
            const localVarPath = `/auth/user`;
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
            localVarRequestOptions.data = (0, common_1.serializeDataIfNeeded)(createUserRequest, localVarRequestOptions, configuration);
            return {
                url: (0, common_1.toPathString)(localVarUrlObj),
                options: localVarRequestOptions,
            };
        }),
        /**
         * Verify user email.
         * @summary Verify user email.
         * @param {string} [uuid] The uuid of the user verifying their email
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        verifyEmail: (uuid, options = {}) => __awaiter(this, void 0, void 0, function* () {
            const localVarPath = `/auth/verify`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = Object.assign(Object.assign({ method: 'GET' }, baseOptions), options);
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            if (uuid !== undefined) {
                localVarQueryParameter['uuid'] = uuid;
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
exports.AuthApiAxiosParamCreator = AuthApiAxiosParamCreator;
/**
 * AuthApi - functional programming interface
 * @export
 */
const AuthApiFp = function (configuration) {
    const localVarAxiosParamCreator = (0, exports.AuthApiAxiosParamCreator)(configuration);
    return {
        /**
         * Acquire a JWT as an anonymous user.
         * @summary Acquire a JWT as an anonymous user.
         * @param {AnonymousJWTRequest} anonymousJWTRequest Anonymous JWT request
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        anonymousJWT(anonymousJWTRequest, options) {
            return __awaiter(this, void 0, void 0, function* () {
                const localVarAxiosArgs = yield localVarAxiosParamCreator.anonymousJWT(anonymousJWTRequest, options);
                return (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
            });
        },
        /**
         * Trigger forgot password flow.
         * @summary Trigger forgot password flow.
         * @param {string} [email] The email of the user resetting their password
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        forgotPassword(email, options) {
            return __awaiter(this, void 0, void 0, function* () {
                const localVarAxiosArgs = yield localVarAxiosParamCreator.forgotPassword(email, options);
                return (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
            });
        },
        /**
         * Log user in with username and password.
         * @summary Login with username and password
         * @param {UsernameAndPasswordJWTRequest} usernameAndPasswordJWTRequest Logged-in JWT request
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        login(usernameAndPasswordJWTRequest, options) {
            return __awaiter(this, void 0, void 0, function* () {
                const localVarAxiosArgs = yield localVarAxiosParamCreator.login(usernameAndPasswordJWTRequest, options);
                return (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
            });
        },
        /**
         * Update user email.
         * @summary Update user email.
         * @param {UpdateEmailRequest} updateEmailRequest Update Email
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        updateEmail(updateEmailRequest, options) {
            return __awaiter(this, void 0, void 0, function* () {
                const localVarAxiosArgs = yield localVarAxiosParamCreator.updateEmail(updateEmailRequest, options);
                return (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
            });
        },
        /**
         * Update user password.
         * @summary Update user password.
         * @param {UpdatePasswordRequest} updatePasswordRequest Update Password
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        updatePassword(updatePasswordRequest, options) {
            return __awaiter(this, void 0, void 0, function* () {
                const localVarAxiosArgs = yield localVarAxiosParamCreator.updatePassword(updatePasswordRequest, options);
                return (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
            });
        },
        /**
         * Creates a new user.
         * @summary Create a new user
         * @param {CreateUserRequest} createUserRequest Creating a new user
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        user(createUserRequest, options) {
            return __awaiter(this, void 0, void 0, function* () {
                const localVarAxiosArgs = yield localVarAxiosParamCreator.user(createUserRequest, options);
                return (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
            });
        },
        /**
         * Verify user email.
         * @summary Verify user email.
         * @param {string} [uuid] The uuid of the user verifying their email
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        verifyEmail(uuid, options) {
            return __awaiter(this, void 0, void 0, function* () {
                const localVarAxiosArgs = yield localVarAxiosParamCreator.verifyEmail(uuid, options);
                return (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
            });
        },
    };
};
exports.AuthApiFp = AuthApiFp;
/**
 * AuthApi - factory interface
 * @export
 */
const AuthApiFactory = function (configuration, basePath, axios) {
    const localVarFp = (0, exports.AuthApiFp)(configuration);
    return {
        /**
         * Acquire a JWT as an anonymous user.
         * @summary Acquire a JWT as an anonymous user.
         * @param {AnonymousJWTRequest} anonymousJWTRequest Anonymous JWT request
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        anonymousJWT(anonymousJWTRequest, options) {
            return localVarFp.anonymousJWT(anonymousJWTRequest, options).then((request) => request(axios, basePath));
        },
        /**
         * Trigger forgot password flow.
         * @summary Trigger forgot password flow.
         * @param {string} [email] The email of the user resetting their password
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        forgotPassword(email, options) {
            return localVarFp.forgotPassword(email, options).then((request) => request(axios, basePath));
        },
        /**
         * Log user in with username and password.
         * @summary Login with username and password
         * @param {UsernameAndPasswordJWTRequest} usernameAndPasswordJWTRequest Logged-in JWT request
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        login(usernameAndPasswordJWTRequest, options) {
            return localVarFp.login(usernameAndPasswordJWTRequest, options).then((request) => request(axios, basePath));
        },
        /**
         * Update user email.
         * @summary Update user email.
         * @param {UpdateEmailRequest} updateEmailRequest Update Email
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        updateEmail(updateEmailRequest, options) {
            return localVarFp.updateEmail(updateEmailRequest, options).then((request) => request(axios, basePath));
        },
        /**
         * Update user password.
         * @summary Update user password.
         * @param {UpdatePasswordRequest} updatePasswordRequest Update Password
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        updatePassword(updatePasswordRequest, options) {
            return localVarFp.updatePassword(updatePasswordRequest, options).then((request) => request(axios, basePath));
        },
        /**
         * Creates a new user.
         * @summary Create a new user
         * @param {CreateUserRequest} createUserRequest Creating a new user
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        user(createUserRequest, options) {
            return localVarFp.user(createUserRequest, options).then((request) => request(axios, basePath));
        },
        /**
         * Verify user email.
         * @summary Verify user email.
         * @param {string} [uuid] The uuid of the user verifying their email
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        verifyEmail(uuid, options) {
            return localVarFp.verifyEmail(uuid, options).then((request) => request(axios, basePath));
        },
    };
};
exports.AuthApiFactory = AuthApiFactory;
/**
 * AuthApi - object-oriented interface
 * @export
 * @class AuthApi
 * @extends {BaseAPI}
 */
class AuthApi extends base_1.BaseAPI {
    /**
     * Acquire a JWT as an anonymous user.
     * @summary Acquire a JWT as an anonymous user.
     * @param {AnonymousJWTRequest} anonymousJWTRequest Anonymous JWT request
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof AuthApi
     */
    anonymousJWT(anonymousJWTRequest, options) {
        return (0, exports.AuthApiFp)(this.configuration).anonymousJWT(anonymousJWTRequest, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * Trigger forgot password flow.
     * @summary Trigger forgot password flow.
     * @param {string} [email] The email of the user resetting their password
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof AuthApi
     */
    forgotPassword(email, options) {
        return (0, exports.AuthApiFp)(this.configuration).forgotPassword(email, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * Log user in with username and password.
     * @summary Login with username and password
     * @param {UsernameAndPasswordJWTRequest} usernameAndPasswordJWTRequest Logged-in JWT request
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof AuthApi
     */
    login(usernameAndPasswordJWTRequest, options) {
        return (0, exports.AuthApiFp)(this.configuration).login(usernameAndPasswordJWTRequest, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * Update user email.
     * @summary Update user email.
     * @param {UpdateEmailRequest} updateEmailRequest Update Email
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof AuthApi
     */
    updateEmail(updateEmailRequest, options) {
        return (0, exports.AuthApiFp)(this.configuration).updateEmail(updateEmailRequest, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * Update user password.
     * @summary Update user password.
     * @param {UpdatePasswordRequest} updatePasswordRequest Update Password
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof AuthApi
     */
    updatePassword(updatePasswordRequest, options) {
        return (0, exports.AuthApiFp)(this.configuration).updatePassword(updatePasswordRequest, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * Creates a new user.
     * @summary Create a new user
     * @param {CreateUserRequest} createUserRequest Creating a new user
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof AuthApi
     */
    user(createUserRequest, options) {
        return (0, exports.AuthApiFp)(this.configuration).user(createUserRequest, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * Verify user email.
     * @summary Verify user email.
     * @param {string} [uuid] The uuid of the user verifying their email
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof AuthApi
     */
    verifyEmail(uuid, options) {
        return (0, exports.AuthApiFp)(this.configuration).verifyEmail(uuid, options).then((request) => request(this.axios, this.basePath));
    }
}
exports.AuthApi = AuthApi;
