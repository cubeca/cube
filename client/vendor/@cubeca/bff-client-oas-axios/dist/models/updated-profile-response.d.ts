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
import { ProfileMainSchema } from './profile-main-schema';
/**
 * Updated Profile Response
 * @export
 * @interface UpdatedProfileResponse
 */
export interface UpdatedProfileResponse {
    /**
     *
     * @type {ProfileMainSchema}
     * @memberof UpdatedProfileResponse
     */
    'data': ProfileMainSchema;
}
