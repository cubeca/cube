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



/**
 * Update password flow request
 * @export
 * @interface UpdatePasswordRequest
 */
export interface UpdatePasswordRequest {
    /**
     * Id of the user that is changing password
     * @type {string}
     * @memberof UpdatePasswordRequest
     */
    'uuid': string;
    /**
     * New password
     * @type {string}
     * @memberof UpdatePasswordRequest
     */
    'password': string;
}

