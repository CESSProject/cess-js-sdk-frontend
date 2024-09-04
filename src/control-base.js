/*
 * @Description: js-sdk for cess storage
 * @Autor: cess lab
 */
import { web3Accounts, web3Enable, web3FromAddress, web3FromSource } from '@polkadot/extension-dapp';
import { stringToHex, hexToU8a } from "@polkadot/util";
import { encodeAddress } from '@polkadot/util-crypto';
import bs58 from "bs58";

export default class ControlBase {
  constructor(api, keyring, isDebug = false) {
    this.api = api;
    this.keyring = keyring;
    this.debug = isDebug;
  }

  log = (...msg) => {
    if (this.debug) {
      console.log(...msg);
    }
  };

  error = (...msg) => {
    if (this.debug) {
      console.error(...msg);
    }
  };

  async submitTransaction(transaction) {
    /* eslint-disable-next-line no-async-promise-executor */
    return new Promise(async (resolve, reject) => {
      const api = this.api;
      let tx;
      try {
        tx = api.tx(transaction);
      } catch (err) {
        reject(err);
      }
      try {
        const hash = await api.rpc.author.submitExtrinsic(tx);
        resolve(hash.toHex());
      } catch (err) {
        reject(err);
      }
    });
  }

  async signAndSend(accountId32, extrinsic, subStateFun = null) {
    return new Promise(async (resolve, reject) => {
      try {
        const extensions = await web3Enable("CESS dApp");
        if (extensions.length === 0) {
          return reject("no extension installed, or the user did not accept the authorization");
        }
        const injector = await web3FromAddress(accountId32);
        extrinsic.signAndSend(
          accountId32,
          { signer: injector.signer },
          (status) => {
            try {
              if (subStateFun && typeof subStateFun == "function") {
                subStateFun(status);
              }
              console.log("status.status.toJSON()", status.status.toJSON());
              console.log("isFinalized", status.isFinalized);
              if (status.isFinalized) {
                const extrinsicHash = extrinsic.hash.toHex();
                resolve({ msg: "ok", data: extrinsicHash });
              } else {
                console.log(status);
              }
            } catch (e) {
              console.log(e);
              reject(e.message);
            }
          }
        ).catch(ee => {
          reject(ee.message);
        });
      } catch (e) {
        console.log(e);
        reject(e.message);
      }
    });
  }
  async getAccountsFromWallet() {
    let tmp = await web3Enable("cess");
    const allAccounts = await web3Accounts();
    allAccounts.forEach((t) => {
      // t.setSS58Format(11330);
      t.sourAddress = t.address;
      t.address = this.formatAccountId(t.address);
    });
    return allAccounts;
  }

  async authSign(accountId32, msg) {
    await web3Enable("cess");
    const allAccounts = await web3Accounts();
    let ret = {
      signU8A: null,
      signStr: null,
      bs58Str: null
    };

    allAccounts.forEach((t) => {
      // t.setSS58Format(11330);
      t.address = this.formatAccountId(t.address);
    });
    let account = allAccounts.find((t) => t.address == accountId32);
    if (!account) {
      account = allAccounts[0];
      console.log("account not found:", allAccounts);
      // return { msg: "account not found!" };
      return ret;
    }
    const injector = await web3FromSource(account.meta.source);
    const signRaw = injector?.signer?.signRaw;
    if (!signRaw) {
      return ret;
    }
    // after making sure that signRaw is defined
    // we can use it to sign our message
    const { signature } = await signRaw({
      address: account.address,
      data: stringToHex(msg),
      type: "bytes",
    });
    ret.signStr = signature;
    // console.log({ signature });
    ret.signU8A = signature ? hexToU8a(signature) : "";
    ret.bs58Str = ret.signU8A ? bs58.encode(ret.signU8A) : "";
    return ret;
  }

  formatAccountId(accountId32) {
    if (!accountId32 || accountId32.length == 64) {
      return accountId32;
    }
    return encodeAddress(accountId32, 11330);
    // this.keyring.setSS58Format(11330);
    // const pair = this.keyring.addFromAddress(accountId32);
    // return pair.address;

  }
  async queryBlockHeight() {
    let ret = await this.api.query.system.number();
    let blockHeight = ret.toJSON();
    return blockHeight;
  }
};
