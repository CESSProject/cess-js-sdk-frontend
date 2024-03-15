/*
 * @Description: js-sdk for cess storage
 * @Autor: cess lab
 */
import ControlBase from "../control-base.js";

export default class Authorize extends ControlBase {
  constructor(api, keyring, isDebug = false) {
    super(api, keyring, isDebug);
  }

  async authorityList(accountId32) {
    try {
      let ret = await this.api.query.oss.authorityList(accountId32);
      let data = ret.toJSON();
      return {
        msg: "ok",
        data,
      };
    } catch (error) {
      console.error(error);
      return {
        msg: "ok",
        errMsg: error.message,
        error: JSON.stringify(error),
      };
    }
  }

  authorize(accountId32, operator, subState = null) {
    const extrinsic = this.api.tx.oss.authorize(operator);
    return this.signAndSend(accountId32, extrinsic, subState);
  }

  cancelAuthorize(accountId32, operator, subState = null) {
    const extrinsic = this.api.tx.oss.cancelAuthorize(operator);
    return this.signAndSend(accountId32, extrinsic, subState);
  }
};
