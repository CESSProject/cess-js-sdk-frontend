import './App.css';
import { ApiPromise, Keyring } from "@polkadot/api";
import React, { useState, useEffect } from "react";
import { Card, Input, Spin, Space, Button, Table, Tabs, Select } from "antd";
import { Common, InitAPI, Authorize, Bucket, File, defaultConfig } from "cess-js-sdk-frontend";
import * as antdHelper from "./utils/antd-helper";

let api: ApiPromise | null = null;
let keyring: Keyring | null = null;
let cess: any | null = null;

function App() {
  const [loading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [codeStr, setCodeStr] = useState<any>();
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
      setAccounts(list);
    }
    setLoading(false);
    return accounts;
  };
  const subState = (msg: any) => {
    console.log('subState', msg);
    setCodeStr(JSON.stringify(msg));
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
      setLoading(true);
      let ret: any = '';
      if (e == 'authorityList') {
        ret = await cess.authorityList(accounts[0].address);
      } else if (e == 'authorize') {
        ret = await cess.authorize(accounts[0].address, defaultConfig.gatewayAddr, subState);
      } else if (e == 'cancelAuthorize') {
        ret = await cess.cancelAuthorize(accounts[0].address, defaultConfig.gatewayAddr, subState);
      }
      setCodeStr(JSON.stringify(ret));
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };
  useEffect(() => {
    init();
  }, []);
  return (
    <div className="App">
      <Spin spinning={loading}>
        <Card title="Extension-dapp" className="card" bordered={true}>
          <Button type="primary" onClick={onConnectWallet}>Connect Wallet</Button>
          <div className="top20">
            <Table dataSource={accounts} columns={accountColumns} />
          </div>
        </Card>
        <Card title="Authorize" className="top20" bordered={true}>
          <Space>
            <Button type="primary" onClick={() => handleEvent('authorityList')}>AuthorityList</Button>
            <Button type="primary" onClick={() => handleEvent('authorize')}>Authorize</Button>
            <Button type="primary" onClick={() => handleEvent('cancelAuthorize')}>CancelAuthorize</Button>
          </Space>
        </Card>
        <Card title="Result" className="top20" bordered={true}>
          <div className='code'>{codeStr}</div>
        </Card>
      </Spin>
    </div>
  );
}

export default App;
