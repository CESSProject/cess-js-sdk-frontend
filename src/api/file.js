/*
 * @Description: js-sdk for cess storage
 * @Autor: cess lab
 */
import ControlBase from "../control-base";
import * as fileHelper from "../util/file-helper";
import bs58 from "bs58";
import { hexToString } from "@polkadot/util";
import { formatterSize } from "../util/formatter";

export default class File extends ControlBase {
  constructor(api, keyring, gatewayURL, isDebug = false) {
    super(api, keyring, isDebug);
    if (!gatewayURL) {
      gatewayURL = "http://deoss-pub-gateway.cess.cloud/";
    }
    this.gatewayURL = gatewayURL;
    // this.gatewayURL="http://172.16.2.191:8080/";
  }

  async queryFileListFull(accountId32) {
    try {
      let ret = await this.queryFileList(accountId32);
      if (ret.msg !== "ok") {
        return ret;
      }
      for (let file of ret.data) {
        let tmp = await this.queryFileMetadata(file.fileHash);
        if (tmp.msg === "ok") {
          let owe = tmp.data.owner.find((t) => t.user == accountId32);
          if (owe) {
            file.fileName = owe.fileName;
            file.bucketName = owe.bucketName;
          }
          file.fileSize = tmp.data.fileSize;
          file.fileSizeStr = formatterSize(tmp.data.fileSize);
          file.stat = tmp.data.stat;
        }
      }
      return ret;
    } catch (error) {
      console.error(error);
      return {
        msg: "ok",
        errMsg: error.message,
        error: JSON.stringify(error),
      };
    }
  }

  async queryFileList(accountId32) {
    try {
      let ret = await this.api.query.fileBank.userHoldFileList(accountId32);
      let data2 = ret.toHuman();
      let data = ret.toJSON();
      data.forEach((t, i) => {
        t.fileHash = data2[i].fileHash;
        t.fileConsumeSpace = t.fileSize;
        t.fileConsumeSpaceStr = formatterSize(t.fileSize);
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

  async queryFileMetadata(fileHash) {
    try {
      let ret = await this.api.query.fileBank.file(fileHash);
      let hu = ret.toHuman();
      let data = ret.toJSON();
      if (data && data.owner && data.owner.length > 0) {
        for (let i = 0; i < data.owner.length; i++) {
          let n = hu.owner[i].fileName;
          if (n.indexOf("0x") == 0) {
            try {
              n = hexToString(n);
            } catch (e) {
              console.error(e);
            }
          }
          data.owner[i].fileName = n;
          data.owner[i].bucketName = hu.owner[i].bucketName;
        }
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

  async uploadFile(accountId32, fileObj, bucketName, progressCb) {
    try {
      const message = "<Bytes>cess-js-sdk-frontend-" + new Date().valueOf() + "</Bytes>";
      const { signU8A } = await this.authSign(accountId32, message);
      if (!signU8A) {
        return {
          msg: "sign error",
        };
      }
      const sign = bs58.encode(signU8A);

      if (!sign) {
        console.log("sign error");
        return {
          msg: "sign error",
        };
      }

      const headers = {
        BucketName: bucketName,
        Account: accountId32,
        Message: message,
        Signature: sign,
      };
      const ret = await fileHelper.upload(
        this.gatewayURL,
        fileObj,
        headers,
        this.log,
        progressCb,
      );
      return ret;
    } catch (e) {
      console.log(e);
      return { msg: "error", error: e };
    }
  }

  async downloadFile(fileHash, saveName) {
    let url = this.gatewayURL + fileHash;
    let ret = await fileHelper.download(url, saveName, this.log);
    return ret;
  }

  async deleteFile(accountId32, fileHash, subState = null) {
    const extrinsic = this.api.tx.fileBank.deleteFile(accountId32, fileHash);
    return await this.signAndSend(accountId32, extrinsic, subState);
  }
};
