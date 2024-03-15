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

function Main({ className }) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [accounts, setAccounts] = useState([]);
    const [currAddress, setCurrAddress] = useState();
    const [result, setResult] = useState();
    const [buckets, setBuckets] = useState([]);
    const [currBucketName, setCurrBucketName] = useState();
    const [newBcketName, setNewBcketName] = useState();

    const [codeStr, setCodeStr] = useState();
    const onTabChange = (e) => {
        if (e == '1') {
            setCodeStr(`
import  { InitAPI,Common, Authorize, Bucket, File, defaultConfig } from "cess-js-sdk-frontend";

const { api, keyring } = await InitAPI(defaultConfig);
let cess = new Bucket(api, keyring);
let ret = await cess.queryBucketList(accounts[0].address);
console.log(ret);
            `);
        }else if (e == '2') {
            setCodeStr(`
import  { InitAPI,Common, Authorize, Bucket, File, defaultConfig } from "cess-js-sdk-frontend";

const { api, keyring } = await InitAPI(defaultConfig);
let cess = new Bucket(api, keyring);
let ret = await cess.queryBucketInfo(currAddress || accounts[0].address, currBucketName || buckets[0]?.value);
console.log(ret);
            `);
        }else if (e == '3') {
            setCodeStr(`
import  { InitAPI,Common, Authorize, Bucket, File, defaultConfig } from "cess-js-sdk-frontend";

const { api, keyring } = await InitAPI(defaultConfig);
let cess = new Bucket(api, keyring);
let ret = await cess.createBucket(currAddress || accounts[0].address, newBcketName, subState);
console.log(ret);
            `);
        }else if (e == '4') {
            setCodeStr(`
import  { InitAPI,Common, Authorize, Bucket, File, defaultConfig } from "cess-js-sdk-frontend";

const { api, keyring } = await InitAPI(defaultConfig);
let cess = new Bucket(api, keyring);
ret = await cess.deleteBucket(currAddress || accounts[0].address, currBucketName || buckets[0]?.value, subState);
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
        if (typeof msg == 'object') {
            msg = JSON.stringify(msg, null, 2);
        }
        setResult(msg);
    }
    const handleEvent = async (e) => {
        try {
            // console.log('newBcketName',newBcketName);
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
            cess = new Bucket(window.api, window.keyring);
            let ret;
            if (e == 'queryBucketList') {
                ret = await cess.queryBucketList(currAddress || accounts[0].address);
                if (ret.msg == 'ok' && ret.data && ret.data.length) {
                    let arr = ret.data.map(t => {
                        return { label: t.key, value: t.key }
                    });
                    setBuckets(arr);
                } else {
                    setBuckets([])
                }
            } else if (e == 'queryBucketInfo') {
                console.log('currBucketName', currBucketName);
                ret = await cess.queryBucketInfo(currAddress || accounts[0].address, currBucketName || buckets[0]?.value);
            } else if (e == 'createBucket') {
                ret = await cess.createBucket(currAddress || accounts[0].address, newBcketName, subState);
            } else if (e == 'deleteBucket') {
                ret = await cess.deleteBucket(currAddress || accounts[0].address, currBucketName || buckets[0]?.value, subState);
            }
            console.log(ret);
            setResult(JSON.stringify(ret, null, 2));
            setLoading(false);
        } catch (e) {
            setResult(JSON.stringify(e, null, 2));
            setLoading(false);
        }
    };
    const onSelectBucket = async (value) => {
        console.log(value);
        setCurrBucketName(value);
    }
    const onSelectAccount = async (value) => {
        console.log(value);
        setCurrAddress(value);
    }
    useEffect(() => {
        connect();
        onTabChange("1");
    }, []);

    return (
        <div className={className}>
            <Card title="Bucket" className="card" bordered={true}>
                <Spin spinning={loading}>
                    {
                        !accounts || accounts.length == 0 ? (<Button type="primary" onClick={connect}>Connect Wallet</Button>) : (
                            <div>
                                <div>Select a account:</div>
                                <Select
                                    defaultValue={accounts[0]?.address}
                                    style={{
                                        width: "100%",
                                    }}
                                    onChange={onSelectAccount}
                                    fieldNames={{ label: 'fullname', value: 'address' }}
                                    options={accounts}
                                />
                                <br ></br><br ></br>
                            </div>)
                    }
                    {
                        accounts && accounts.length > 0 && <Tabs
                            defaultActiveKey="1"
                            items={[
                                {
                                    key: '1',
                                    label: 'queryBucketList',
                                    children: <div className="tab-content">
                                        <Button type="primary" onClick={() => handleEvent('queryBucketList')}>QueryBucketList</Button>
                                    </div>,
                                },
                                {
                                    key: '2',
                                    label: 'queryBucketInfo',
                                    children: <div className="tab-content">
                                        <div>
                                            <div>
                                                <div>Select a bucket:</div>
                                                <Select
                                                    defaultValue={buckets[0]?.value}
                                                    style={{
                                                        width: "100%",
                                                    }}
                                                    onChange={onSelectBucket}
                                                    options={buckets}
                                                /><br /><br />
                                            </div>
                                            <Button type="primary" onClick={() => handleEvent('queryBucketInfo')}>QueryBucketInfo</Button>
                                        </div>
                                    </div>,
                                },
                                {
                                    key: '3',
                                    label: 'createBucket',
                                    children: <div>
                                        <div>
                                            New Bucket Name
                                        </div>
                                        <div>
                                            <Input type="text" onChange={(e) => setNewBcketName(e.target.value)} ></Input>
                                        </div>
                                        <div className="top20">
                                            <Button type="primary" onClick={() => handleEvent('createBucket')}>CreateBucket</Button>
                                        </div>
                                    </div>,
                                },
                                {
                                    key: '4',
                                    label: 'deleteBucket',
                                    children: <div>
                                        <div>
                                            <div>Select a bucket:</div>
                                            <Select
                                                defaultValue={buckets[0]?.value}
                                                style={{
                                                    width: "100%",
                                                }}
                                                onChange={onSelectBucket}
                                                options={buckets}
                                            />
                                            <br ></br><br ></br>
                                        </div>
                                        <div>
                                            <Button type="primary" onClick={() => handleEvent('deleteBucket')}>DeleteBucket</Button>
                                        </div>
                                    </div>,
                                },
                            ]}
                            onChange={onTabChange}
                            type="card"
                        />}
                </Spin>
                <JSONView json={result} />
                <CodeView json={codeStr} />
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
