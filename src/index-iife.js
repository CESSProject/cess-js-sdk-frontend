/*
 * @Description: js-sdk for cess storage
 * @Autor: cess lab
 */
import InitAPI from "./init-api.js";
import Common from "./api/common.js";
import Authorize from "./api/authorize.js";
import Space from "./api/space.js";
import Bucket from "./api/bucket.js";
import File from "./api/file.js";
import defaultConfig from "./default-config.js";

window.cessSdk = { InitAPI, Common, Space, Authorize, Bucket, File, defaultConfig };
if (window.cessSdk.Space) {
    console.log('cess-js-sdk is ready.');
} else {
    console.log('cess-js-sdk error.');
}

