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
        nodeURL: string | string[];
        gatewayURL: string;
        gatewayAddr: string;
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
        submitTransaction(transaction: object): Promise<string>;
        signAndSend(
            accountId32: string,
            extrinsic: object,
            subStateFun?: (status: any) => void,
        ): Promise<any>;
        getAccountsFromWallet(): Promise<any>;
        authSign(accountId32: string, msg: string): Promise<any>;
        formatAccountId(accountId32: string | undefined): string | undefined;
    }

    class Common extends ControlBase {
        constructor(api: ApiPromise, keyring: Keyring, isDebug?: boolean);
        queryBlockHeight(): Promise<number>;
        formatSpaceInfo(spaceInfo: SpaceInfo | undefined, blockHeight: number): SpaceInfoFormatted;
        subscribeBalance(accountId32: string, subFun: Function): Promise<Function>;
    }

    class Territory extends ControlBase {
        constructor(api: ApiPromise, keyring: Keyring, isDebug?: boolean);
        queryMyTerritorys(accountId32: string): Promise<APIReturnedData>;
        queryTerritoryInfo(accountId32: string, territoryName: string): Promise<APIReturnedData>;
        createTerritory(accountId32: string, territoryName: string, gibCount: number, days: number, subState?: (status: any) => void): Promise<any>;
        expandingTerritory(
            accountId32: string,
            territoryName: string,
            gibCount: number,
            subState?: (status: any) => void,
        ): Promise<any>;
        renewalTerritory(accountId32: string, territoryName: string, days: number, subState?: (status: any) => void): Promise<any>;
        renameTerritory(accountId32: string, oldName: string, newName: string, subState?: (status: any) => void): Promise<any>;
        reactivateTerritory(accountId32: string, territoryName: string, days: number, subState?: (status: any) => void): Promise<any>;
    }

    class Authorize extends ControlBase {
        constructor(api: ApiPromise, keyring: Keyring, isDebug?: boolean);
        authorityList(accountId32: string): Promise<APIReturnedData>;
        authorize(accountId32: string, operator: string, subState?: (status: any) => void): Promise<any>;
        cancelAuthorize(
            accountId32: string,
            operator: string,
            subState?: (status: any) => void,
        ): Promise<any>;
    }

    class File extends ControlBase {
        constructor(api: ApiPromise, keyring: Keyring, gatewayURL?: string, isDebug?: boolean);
        queryFileListFull(accountId32: string): Promise<APIReturnedData>;
        queryFileList(accountId32: string): Promise<APIReturnedData>;
        queryFileMetadata(fileHash: string): Promise<APIReturnedData>;
        uploadFile(
            accountId32: string,
            fileObj: any,
            territoryName: string,
            progressCb?: (status: any) => void
        ): Promise<any>;
        downloadFile(fileHash: string, saveName: string): Promise<any>;
        deleteFile(
            accountId32: string,
            fileHash: string,
            subState?: (status: any) => void,
        ): Promise<any>;
    }

    const defaultConfig: CESSConfig;
}