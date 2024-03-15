/*
 * @Description: js-sdk for cess storage
 * @Autor: cess lab
 */
import ControlBase from "../control-base.js";
import { formatEntries } from "../util/formatter.js";

export default class Bucket extends ControlBase {
  constructor(api, keyring, isDebug = false) {
    super(api, keyring, isDebug);
  }

  async queryBucketNames(accountId32) {
    try {
      await this.api.isReady;
      let ret = await this.api.query.fileBank.userBucketList(accountId32);
      let data = ret.toHuman();
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

  async queryBucketList(accountId32) {
    try {
      await this.api.isReady;
      let ret = await this.api.query.fileBank.bucket.entries(accountId32);
      let data = formatEntries(ret, false, false);
      data.forEach((t) => {
        t.key = t.ids[1];
        delete t.ids;
        delete t.authority;
      });
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

  async queryBucketInfo(accountId32, name) {
    try {
      await this.api.isReady;
      let ret = await this.api.query.fileBank.bucket(accountId32, name);
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

  async createBucket(accountId32, name, subState = null) {
    await this.api.isReady;
    const extrinsic = this.api.tx.fileBank.createBucket(accountId32, name);
    return await this.signAndSend(accountId32, extrinsic, subState);
  }

  async deleteBucket(accountId32, name, subState = null) {
    await this.api.isReady;
    const extrinsic = this.api.tx.fileBank.deleteBucket(accountId32, name);
    return await this.signAndSend(accountId32, extrinsic, subState);
  }
};
