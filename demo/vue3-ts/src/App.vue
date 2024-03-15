<script setup lang="ts">
import { InitAPI, Authorize, defaultConfig } from "cess-js-sdk-frontend";
import { ref } from 'vue'


let api: ApiPromise | null = null;
let keyring: Keyring | null = null;
let cess: any | null = null;
let accounts = [];

const loading = ref(false);
const items = ref([]);
const codeStr = ref('');

function setLoading(isLoading) {
  loading.value = isLoading;
}
function setCodeStr(msg) {
  codeStr.value = msg;
}
const accountColumns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: 'Type',
    dataIndex: 'type',
    key: 'type',
  }
];
function sleep(minisec: number) {
  return new Promise((resolve: any, reject: any) => {
    setTimeout(function () {
      resolve();
    }, minisec);
  });
}
const init = async () => {
  console.log('run init');
  try {
    const ret = await InitAPI(defaultConfig);
    api = ret.api;
    keyring = ret.keyring;
    return ret;
  } catch (e) {
    console.log('has error');
    console.log(e);
  }
};
const onConnectWallet = async () => {
  setLoading(true);
  while (!api || !keyring) {
    await sleep(500);
  }
  cess = new Authorize(api, keyring);
  let list = await cess.getAccountsFromWallet();
  if (list && Array.isArray(list)) {
    list.forEach(t => {
      t.key = t.address;
      t.name = t.meta.name;
    });
    items.value = list;
    accounts = list;
  }
  setLoading(false);
  return accounts;
};
const subState = (msg: any) => {
  console.log('subState', msg);
  setCodeStr(JSON.stringify(msg, null, 2));
}
const handleEvent = async (e: any) => {
  try {
    if (!api || !keyring) {
      return setTimeout(function () {
        handleEvent(e);
      }, 500);
    }
    if (!accounts || accounts.length == 0) {
      await onConnectWallet();
    }
    console.log('run handleEvent', e);
    setLoading(true);
    let ret: any = '';
    if (e == 'authorityList') {
      console.log('========', e, accounts[0].address);
      ret = await cess.authorityList(accounts[0].address);
      console.log(ret);
    } else if (e == 'authorize') {
      ret = await cess.authorize(accounts[0].address, defaultConfig.gatewayAddr, subState);
    } else if (e == 'cancelAuthorize') {
      ret = await cess.cancelAuthorize(accounts[0].address, defaultConfig.gatewayAddr, subState);
    }
    setCodeStr(JSON.stringify(ret, null, 2));
    setLoading(false);
  } catch (e) {
    setLoading(false);
  }
};
init();
</script>

<template>
  <a-spin :spinning="loading">
    <a-card title="Extension-dapp">
      <a-button type="primary" @click="onConnectWallet">Connect Wallet</a-button>
      <div class="hold"></div>
      <a-table :dataSource="items" :columns="accountColumns" />
    </a-card>
    <div class="hold"> </div>
    <a-card title="Authorize">
      <a-space>
        <a-button type="primary" @click="handleEvent('authorityList')">AuthorityList</a-button>
        <a-button type="primary" @click="handleEvent('authorize')">Authorize</a-button>
        <a-button type="primary" @click="handleEvent('cancelAuthorize')">CancelAuthorize</a-button>
      </a-space>
    </a-card>
    <div class="hold"></div>
    <a-card title="Result">
      <code><pre>{{ codeStr }}</pre></code>
    </a-card>
  </a-spin>
</template>
