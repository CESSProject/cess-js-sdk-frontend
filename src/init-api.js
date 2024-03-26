/*
 * @Description: js-sdk for cess storage
 * @Autor: cess lab
 */

import { ApiPromise, WsProvider, Keyring } from "@polkadot/api";
import defaultConfig from "./default-config.js";
import wsCheck from "./util/ws-check.js";


// export default async function init(config = defaultConfig) {
//   let rpcs = config.nodeURL;
//   if (!Array.isArray(config.nodeURL)) {
//     rpcs = [config.nodeURL];
//   }
//   let res = {};
//   for (let rpc of rpcs) {
//     try {
//       res = await connect(rpc);
//       if (res.msg == 'ok') {
//         break;
//       }
//     } catch (err) {
//       console.log(err);
//     }
//   }
//   const keyring = new Keyring(config.keyringOption);
//   return { api: res.api, keyring };
// }

// function connect(nodeURL) {
//   return new Promise(async (resolve, reject) => {
//     let hasReturn = false;
//     console.log('connecting', nodeURL);
//     let provider = new WsProvider(nodeURL);
//     const api = new ApiPromise({ provider });
//     api.on("connected", () => {
//       console.log("connect success ", nodeURL);
//       retFun('ok');
//       resolve({ msg: 'ok', api });
//     });
//     api.on("disconnected", () => {
//       // console.log('disconnected');
//       retFun('disconnected');
//     });
//     api.on("error", (err) => {
//       // console.log('error');
//       retFun(err.message);
//     });
//     function retFun(msg) {
//       if (hasReturn) return;
//       hasReturn = true;
//       if (msg != 'ok') {
//         provider.disconnect();
//       }
//       resolve({ msg, api });
//     }
//   });
// }


export default async function init(config = defaultConfig) {
  const keyring = new Keyring(config.keyringOption);
  let rpcs = config.nodeURL;
  if (!Array.isArray(config.nodeURL)) {
    rpcs = [config.nodeURL];
  }
  let rpc = await wsCheck(rpcs);
  if (!rpc) {
    return { api: null, keyring };
  }
  const wsProvider = new WsProvider(rpc);
  const api = await ApiPromise.create({ provider: wsProvider });
  return { api, keyring };
};

// export default function init(config = defaultConfig) {
//   return new Promise(async (resolve, reject) => {
//     const provider = new WsProvider(config.nodeURL);
//     const api = new ApiPromise({ provider });
//     const keyring = new Keyring(config.keyringOption);

//     api.on("connected", () => {
//       console.log("connect success ", config.nodeURL);
//       resolve({ api, keyring });
//     });
//     api.on("disconnected", (e) => {
//       console.error("ws disconnected", config.nodeURL);
//       reject(e);
//     });
//     api.on("error", (error) => {
//       console.error("error", error.message);
//       reject(error);
//     });
//   });
// };