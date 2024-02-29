/* eslint-disable @typescript-eslint/no-explicit-any */
// Note: There are a few types that I don't know the return types. So enable the use of
// `any` for now.

import { ApiPromise, Keyring } from "@polkadot/api";

export as namespace CESS;
export = CESS;

interface APIReturnedData {
  msg: string;
  data?: any;
  errMsg?: string;
  error?: string;
}

interface KeyringOption {
  type: string;
  ss58Format: number;
}

declare namespace CESS {
  interface CESSConfig {
    nodeURL: string;
    gatewayURL: string;
    keyringOption: KeyringOption;
  }

  interface SpaceInfo {
    totalSpace?: number;
    usedSpace?: number;
    lockedSpace?: number;
    remainingSpace?: number;
    deadline?: number;
  }

  interface SpaceInfoFormatted extends SpaceInfo {
    totalSpaceGib?: number;
    totalSpaceStr?: string;

    usedSpaceGib?: number;
    usedSpaceStr?: string;

    lockedSpaceGib?: number;
    lockedSpaceStr?: string;

    remainingSpaceGib?: number;
    remainingSpaceStr?: string;

    deadlineTime?: string;
    remainingDays?: number;
  }

  function InitAPI(config: CESSConfig): Promise<{
    api: ApiPromise;
    keyring: Keyring;
  }>;

  class ControlBase {
    constructor(api: ApiPromise, keyring: Keyring, isDebug?: boolean);
    log(...msgs: string[]): void;
    error(...msgs: string[]): void;
    sign(mnemonicOrAccountId32: string, tx: object): Promise<string>;
    submitTransaction(transaction: object): Promise<string>;
    signAndSend(
      mnemonicOrAccountId32: string,
      extrinsic: object,
      subState?: (status: any) => void,
    ): Promise<any>;
    signAndSendWeb3(
      accountId32: string,
      extrinsic: object,
      subState?: (status: any) => void,
    ): Promise<any>;
    authSign(mnemonicOrAccountId32: string, msg: string): Promise<any>;
    formatAccountId(accountId32: string | undefined): string | undefined;
  }

  class Common extends ControlBase {
    constructor(api: ApiPromise, keyring: Keyring, isDebug?: boolean);
    queryBlockHeight(): Promise<number>;
    formatSpaceInfo(spaceInfo: SpaceInfo | undefined, blockHeight: number): SpaceInfoFormatted;
  }

  class Space extends ControlBase {
    constructor(api: ApiPromise, keyring: Keyring, isDebug?: boolean);
    userOwnedSpace(accountId32: string): Promise<APIReturnedData>;
    buySpace(mnemonicOrAccountId32: string, gibCount: number, subState?: (status: any) => void): Promise<any>;
    expansionSpace(
      mnemonicOrAccountId32OrAccountId32: string,
      gibCount: number,
      subState?: (status: any) => void,
    ): Promise<any>;
    renewalSpace(mnemonicOrAccountId32: string, days: number, subState?: (status: any) => void): Promise<any>;
  }

  class Authorize extends ControlBase {
    constructor(api: ApiPromise, keyring: Keyring, isDebug?: boolean);
    authorityList(accountId32: string): Promise<APIReturnedData>;
    authorize(mnemonicOrAccountId32: string, operator: string, subState?: (status: any) => void): Promise<any>;
    cancelAuthorize(
      mnemonicOrAccountId32: string,
      operator: string,
      subState?: (status: any) => void,
    ): Promise<any>;
  }

  class Bucket extends ControlBase {
    constructor(api: ApiPromise, keyring: Keyring, isDebug?: boolean);
    queryBucketNames(accountId32: string): Promise<APIReturnedData>;
    queryBucketList(accountId32: string): Promise<APIReturnedData>;
    queryBucketInfo(accountId32: string, name: string): Promise<APIReturnedData>;
    createBucket(
      mnemonicOrAccountId32: string,
      accountId32: string,
      name: string,
      subState?: (status: any) => void,
    ): Promise<any>;
    deleteBucket(
      mnemonicOrAccountId32: string,
      accountId32: string,
      name: string,
      subState?: (status: any) => void,
    ): Promise<any>;
  }

  class File extends ControlBase {
    constructor(api: ApiPromise, keyring: Keyring, gatewayURL: string, isDebug?: boolean);
    queryFileListFull(accountId32: string): Promise<APIReturnedData>;
    queryFileList(accountId32: string): Promise<APIReturnedData>;
    queryFileMetadata(fileHash: string): Promise<APIReturnedData>;
    uploadFile(
      mnemonicOrAccountId32: string,
      accountId32: string,
      filePath: string,
      bucketName: string,
    ): Promise<any>;
    downloadFile(fileHash: string, savePath: string): Promise<any>;
    deleteFile(
      mnemonicOrAccountId32: string,
      accountId32: string,
      fileHash: string,
      subState?: (status: any) => void,
    ): Promise<any>;
  }

  function buildConfig(
    nodeURL: string,
    gatewayURL: string,
    keyringOption?: KeyringOption,
  ): CESSConfig;

  const testnetConfig: CESSConfig;

  const wellKnownAcct: {
    addr: string;
    mnemonicOrAccountId32: string;
    gatewayAddr: string;
  };
}
