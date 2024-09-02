/*
 * @Description: js-sdk for cess storage
 * @Autor: cess lab
 */
import ControlBase from "../control-base.js";
import { formatSpaceInfo } from "../util/formatter.js";

export default class Common extends ControlBase {
  constructor(api, keyring, isDebug = false) {
    super(api, keyring, isDebug);
  }

  async queryBlockHeight() {
    let ret = await this.api.query.system.number();
    let blockHeight = ret.toJSON();
    return blockHeight;
  }

  formatSpaceInfo(obj, blockHeight) {
    return formatSpaceInfo(obj, blockHeight);
  }

  async subscribeBalance(accountId32, subFun) {
    if (!accountId32) throw 'accountId32 is required';
    if (!subFun) throw 'subFun is required';
    if (typeof subFun != 'function') throw 'subFun must a function';
    const unsub = await this.api.query.system.account(accountId32, ({ nonce, data: balance }) => {
      subFun({
        nonce: nonce.toNumber(),
        free: balance.free / 1e18,
        reserved: balance.reserved / 1e18,
        frozen: balance.frozen / 1e18,
        flags: balance.flags / 1e18,
      });
    });
    return unsub;
  }
};
