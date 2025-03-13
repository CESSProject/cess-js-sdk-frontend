# cess-js-sdk-frontend

## About

JS-SDK for CESS Project with file storage.

Please install the [Polkadot.js extension](https://polkadot.js.org/extension/) in the browser.

> When used in next.js, it will prompt: ReferenceError: window is not defined,This is due to the Polkadot.js extension, detailed issues can be found at: https://github.com/polkadot-js/extension/issues/1207

<a href="https://cessproject.github.io/cess-js-sdk-frontend/">Online Demo</a>

## Installation

```bash
# npm
npm i cess-js-sdk-frontend --save
# yarn
yarn add cess-js-sdk-frontend -S
# pnpm
pnpm add cess-js-sdk-frontend
```

### Use with static CDN
```javascript
import { InitAPI, Common, Territory, Authorize, File, defaultConfig } from "https://cdn.jsdelivr.net/npm/cess-js-sdk-frontend@0.2.4/dist/index.min.js";
```
More info please read demo/static-cdn-js/index.html

## Example

```ts

import { Space, InitAPI, Common, Authorize, File, defaultConfig } from "cess-js-sdk-frontend";

async function main() {
	const { api, keyring } = await InitAPI(defaultConfig);
	let addr="";
	let mnemonicOrAccountId32="";

	const space = new Space(api, keyring);
	const common = new Common(api, keyring);

	console.log("query userOwnedSpace:");
	let result = await space.userOwnedSpace(addr);
	const blockHeight = await common.queryBlockHeight();

	result = common.formatSpaceInfo(result.data, blockHeight);
	console.log(result);

	function getDataIfOk(result) {
		return result.msg === "ok" ? result.data : result;
	}

	if (result.totalSpace) {
		console.log("expansionSpace:");
		result = await space.expansionSpace(mnemonicOrAccountId32, 1);
		console.log(getDataIfOk(result), "\n");

		console.log("renewalSpace:");
		result = await space.renewalSpace(mnemonicOrAccountId32, 1);
		console.log(getDataIfOk(result), "\n");
	} else {
		console.log("buySpace:");
		result = await space.buySpace(mnemonicOrAccountId32, 1);
		console.log(getDataIfOk(result), "\n");
	}

	console.log("query userOwnedSpace:");
	result = await space.userOwnedSpace(addr);
	result = common.formatSpaceInfo(result.data, blockHeight);
	console.log(result);
}

main()
	.catch(console.error)
	.finally(() => process.exit());
```


All examples connect to the Testnet and use the account `cXgaee2N8E77JJv9gdsGAckv1Qsf3hqWYf7NL4q6ZuQzuAUtB` as default with the following mnemonicOrAccountId32:

```
bottom drive obey lake curtain smoke basket hold race lonely fit walk
```

This is the [well-known development account](https://github.com/substrate-developer-hub/substrate-developer-hub.github.io/issues/613) in Substrate. If you don't have the token needed, please fetch it from the [Testnet faucet](https://cess.cloud/faucet.html).

### CESS Testnet RPC Endpoints

```
wss://testnet-rpc.cess.cloud/ws/
wss://testnet-rpc.cess.network/ws/
```

### CESS Testnet Faucet

```
https://testnet-faucet.cess.cloud/
```

### CESS Testnet Public Gateway

```
Address: https://deoss-pub-gateway.cess.cloud/
Account: cXhwBytXqrZLr1qM5NHJhCzEMckSTzNKw17ci2aHft6ETSQm9
```

## APIs

### CESS Config

The config object of `CESSConfig` type is:

```ts
const testnetConfig = {
  nodeURL: "wss://testnet-rpc0.cess.cloud/ws/",
  keyringOption: { type: "sr25519", ss58Format: 42 },
  gatewayURL: "http://deoss-pub-gateway.cess.cloud/",
};

function buildConfig(nodeURL, gatewayURL, keyringOption) {
  return {
    nodeURL,
    gatewayURL,
    // default value for keyring option
    keyringOption: keyringOption || {
      type: "sr25519",
      ss58Format: 42,
    },
  };
}
```

### Space

- `userOwnedSpace(accountId32: string): Promise<APIReturnedData>`
- `buySpace(mnemonicOrAccountId32: string, gibCount: number): Promise<any>`
- `expansionSpace(mnemonicOrAccountId32OrAccountId32: string, gibCount: number): Promise<any>`
- `renewalSpace(mnemonicOrAccountId32: string, days: number): Promise<any>`

### Authorize

- `authorityList(accountId32: string): Promise<APIReturnedData>`
- `authorize(mnemonicOrAccountId32: string, operator: string): Promise<any>`
- `cancelAuthorize(mnemonicOrAccountId32: string, operator: string): Promise<any>`

### File

- `queryFileListFull(accountId32: string): Promise<APIReturnedData>`
- `queryFileList(accountId32: string): Promise<APIReturnedData>`
- `queryFileMetadata(fileHash: string): Promise<APIReturnedData>`
- `uploadFile(mnemonicOrAccountId32: string, accountId32: string, filePath: string): Promise<any>`
- `downloadFile(fileHash: string, savePath: string): Promise<any>`
- `deleteFile(mnemonicOrAccountId32: string, accountId32: string, fileHashArray: string[]): Promise<any>`
