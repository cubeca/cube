/**
 * BFF-Auth - CUBE DAO Canada
 * # BFF-Auth (Authentication for Backend-for-Frontend)  The BFF-Auth API encapsulates authentication for the BFF. It\'s kept separate for modularity.
 *
 * The version of the OpenAPI document: 0.5.0
 * Contact: raphaelhuefner@gmail.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
/**
 * Update email flow request
 * @export
 * @interface UpdateEmailRequest
 */
export interface UpdateEmailRequest {
    /**
     * Id of the user that is changing email
     * @type {string}
     * @memberof UpdateEmailRequest
     */
    'uuid': string;
    /**
     * New email
     * @type {string}
     * @memberof UpdateEmailRequest
     */
    'email': string;
}
