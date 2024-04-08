import React, { useState, useEffect } from "react";
import { Card, Input, Spin, Space, Button, Table, Tabs, Select } from "antd";
const { Search, TextArea } = Input;
import { DollarOutlined, CheckCircleOutlined, CloudServerOutlined, AreaChartOutlined, StockOutlined, UsergroupAddOutlined } from "@ant-design/icons";
import styled from "styled-components";
import _ from "lodash";
import { useNavigate } from "react-router-dom";

import { formatBalanceStr } from "../utils/formatter";
import * as antdHelper from "../utils/antd-helper";
import { Common, Authorize, Bucket, File, defaultConfig } from "cess-js-sdk-frontend";
import JSONView from "../components/JSONView";
import CodeView from "../components/CodeView";

let cess = null;
let unsub = null;

function Main({ className }) {
    const navigate = useNavigate();
    const [isSub, setIsSub] = useState(false);
    const [loading, setLoading] = useState(false);
    const [accounts, setAccounts] = useState([]);
    const [currAddress, setCurrAddress] = useState();
    const [result, setResult] = useState();

    const [codeStr, setCodeStr] = useState();
    const onTabChange = (e) => {
        if (e == '1') {
            setCodeStr(`
import  { InitAPI,Common, Authorize, Bucket, File, defaultConfig } from "cess-js-sdk-frontend";

const { api, keyring } = await InitAPI(defaultConfig);
let cess = new Authorize(api, keyring);
let ret = await cess.authorityList(currAddress || accounts[0].address);
console.log(ret);
            `);
        } else if (e == '2') {
            setCodeStr(`
import  { InitAPI,Common, Authorize, Bucket, File, defaultConfig } from "cess-js-sdk-frontend";

const { api, keyring } = await InitAPI(defaultConfig);
let cess = new Authorize(api, keyring);
let ret = await cess.authorize(currAddress || accounts[0].address, defaultConfig.gatewayAddr,subState);
console.log(ret);
            `);
        } else if (e == '3') {
            setCodeStr(`
import  { InitAPI,Common, Authorize, Bucket, File, defaultConfig } from "cess-js-sdk-frontend";

const { api, keyring } = await InitAPI(defaultConfig);
let cess = new Authorize(api, keyring);
let ret = await cess.cancelAuthorize(currAddress || accounts[0].address, defaultConfig.gatewayAddr,subState);
console.log(ret);
            `);
        }
    }

    const connect = async () => {
        if (window.accounts) {
            return setAccounts(window.accounts);
        }
        setLoading(true);
        if (!window.api || !window.keyring) {
            return setTimeout(function () {
                connect();
            }, 1000);
        }
        let accounts = await window.connectWallet();
        setAccounts(accounts);
        setLoading(false);
    };
    const subState = (msg) => {
        console.log('subState', msg);
    }
    const handleEvent = async (e) => {
        try {
            if (!window.api || !window.keyring) {
                return setTimeout(function () {
                    handleEvent(e);
                }, 1000);
            }
            if (!accounts || accounts.length == 0) {
                await connect();
            }
            setResult(e + ' loading...');
            setLoading(true);
            cess = new Authorize(window.api, window.keyring);
            let common = new Common(window.api, window.keyring);
            let ret;
            if (e == 'authorityList') {
                onTabChange("1");
                ret = await cess.authorityList(currAddress || accounts[0].address);
            } else if (e == 'authorize') {
                onTabChange("2");
                ret = await cess.authorize(currAddress || accounts[0].address, defaultConfig.gatewayAddr, subState);
            } else if (e == 'cancelAuthorize') {
                onTabChange("3");
                ret = await cess.cancelAuthorize(currAddress || accounts[0].address, defaultConfig.gatewayAddr, subState);
            } else if (e == 'subscribeBalance') {
                onTabChange("3");
                unsub = await common.subscribeBalance(currAddress || accounts[0].address, info => {
                    console.log('sub return', info);
                    setResult(JSON.stringify(info, null, 2));
                });
                setIsSub(true);
            } else if (e == 'unsubscribeBalance') {
                unsub();
                setIsSub(false);
            }
            console.log(ret);
            setResult(JSON.stringify(ret, null, 2));
            setLoading(false);
        } catch (e) {
            setResult(JSON.stringify(e, null, 2));
            setLoading(false);
        }
    };
    const onSelectAccount = async (value) => {
        console.log(value);
        setCurrAddress(value);
    }
    useEffect(() => {
        connect();
        onTabChange("1");
        if (unsub) unsub();
    }, []);

    return (
        <div className={className}>
            <Card title="Authorize" className="card" bordered={true}>
                <Spin spinning={loading}>
                    {
                        !accounts || accounts.length == 0 ? (<Button type="primary" onClick={connect}>Connect Wallet</Button>) : (
                            <div>
                                <div>
                                    Select a account:</div><Select
                                    defaultValue={accounts[0]?.address}
                                    style={{
                                        width: "100%",
                                    }}
                                    onChange={onSelectAccount}
                                    fieldNames={{ label: 'fullname', value: 'address' }}
                                    options={accounts}
                                /><br ></br><br ></br>
                            </div>)
                    }
                    {
                        !accounts || accounts.length == 0 ? ("") : (
                            <div><Space>
                                <Button type="primary" onClick={() => handleEvent('authorityList')}>AuthorityList</Button>
                                <Button type="primary" onClick={() => handleEvent('authorize')}>Authorize</Button>
                                <Button type="primary" onClick={() => handleEvent('cancelAuthorize')}>CancelAuthorize</Button>
                                <Button disabled={isSub} type="primary" onClick={() => handleEvent('subscribeBalance')}>SubscribeBalance</Button>
                                <Button disabled={!isSub} type="primary" onClick={() => handleEvent('unsubscribeBalance')}>Cancel SubscribeBalance</Button>
                            </Space>
                                <JSONView json={result} />
                                <CodeView json={codeStr} />
                            </div>)
                    }
                </Spin>
            </Card>
        </div>
    );
}

export default styled(Main)`
    .top20{
        margin-top:20px;
    }
    .card{
        margin-bottom:20px;        
    }
`;
