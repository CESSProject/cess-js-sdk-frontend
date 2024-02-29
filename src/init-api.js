/*
 * @Description: js-sdk for cess storage
 * @Autor: cess lab
 */

import { ApiPromise, WsProvider, Keyring } from "@polkadot/api";
import defaultConfig from "./default-config";

export default async function init(config = defaultConfig){
  const wsProvider = new WsProvider(config.nodeURL);
  const api = await ApiPromise.create({ provider: wsProvider });
  const keyring = new Keyring(config.keyringOption);
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