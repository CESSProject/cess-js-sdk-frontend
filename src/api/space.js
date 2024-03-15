/*
 * @Description: js-sdk for cess storage
 * @Autor: cess lab
 */
import ControlBase from "../control-base.js";

export default class Space extends ControlBase {
  constructor(api, keyring, isDebug = false) {
    super(api, keyring, isDebug);
  }

  async userOwnedSpace(accountId32) {
    try {
      let ret = await this.api.query.storageHandler.userOwnedSpace(accountId32);
      let data = ret.toJSON();
      if (data) {
        let human = ret.toHuman();
        data.state = human.state;
      }
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

  async buySpace(accountId32, gibCount, subState = null) {
    const extrinsic = this.api.tx.storageHandler.buySpace(gibCount);
    return await this.signAndSend(accountId32, extrinsic, subState);
  }

  async expansionSpace(accountId32, gibCount, subState = null) {
    const extrinsic = this.api.tx.storageHandler.expansionSpace(gibCount);
    return await this.signAndSend(accountId32, extrinsic, subState);
  }

  async renewalSpace(accountId32, days, subState = null) {
    const extrinsic = this.api.tx.storageHandler.renewalSpace(days);
    return await this.signAndSend(accountId32, extrinsic, subState);
  }
};
