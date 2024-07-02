import React, { useState, useEffect } from "react";
import { Card, Input, Spin, Space, Button, Table, Tabs, Select } from "antd";
const { Search, TextArea } = Input;
import { DollarOutlined, CheckCircleOutlined, CloudServerOutlined, AreaChartOutlined, StockOutlined, UsergroupAddOutlined } from "@ant-design/icons";
import styled from "styled-components";
import _ from "lodash";
import { useNavigate } from "react-router-dom";

import { formatBalanceStr } from "../utils/formatter";
import * as antdHelper from "../utils/antd-helper";
import { Common, Authorize, Territory, File, defaultConfig } from "cess-js-sdk-frontend";
import JSONView from "../components/JSONView";
import CodeView from "../components/CodeView";

let cess = null;
let unsub = null;

function Main({ className }) {
    const [isSub, setIsSub] = useState(false);
    const [loading, setLoading] = useState(false);
    const [accounts, setAccounts] = useState([]);
    const [currAddress, setCurrAddress] = useState();
    const [result, setResult] = useState();
    const [currTerritory, setCurrTerritory] = useState();

    const [spaceInfo, setSpaceInfo] = useState();
    const [buyGB, setBuyGB] = useState();

    const [territoryName, setTerritoryName] = useState();

    const [codeStr, setCodeStr] = useState();
    const onTabChange = (e) => {
        if (e == '1') {
            setCodeStr(`
import  { InitAPI,Common,Territory, Authorize, Bucket, File, defaultConfig } from "cess-js-sdk-frontend";

const { api, keyring } = await InitAPI(defaultConfig);
let cess = new Territory(api, keyring);
let ret = await cess.queryMyTerritorys(currAddress || accounts[0].address);
console.log(ret);
            `);
        } else if (e == '2') {
            setCodeStr(`
import  { InitAPI,Common, Territory,Authorize, Bucket, File, defaultConfig } from "cess-js-sdk-frontend";

const { api, keyring } = await InitAPI(defaultConfig);
let cess = new Territory(api, keyring);
let ret = await cess.expandingTerritory(currAddress || accounts[0].address,'territoryName', buyGB, subState);
console.log(ret);
            `);
        } else if (e == '3') {
            setCodeStr(`
import  { InitAPI,Common, Territory,Authorize, Bucket, File, defaultConfig } from "cess-js-sdk-frontend";

const { api, keyring } = await InitAPI(defaultConfig);
let cess = new Territory(api, keyring);
let ret = await cess.renewalTerritory(currAddress || accounts[0].address, 'territoryName',buyGB, subState);
console.log(ret);
            `);
        } else if (e == '4') {
            setCodeStr(`
import  { InitAPI,Common,Territory, Authorize, Bucket, File, defaultConfig } from "cess-js-sdk-frontend";

const { api, keyring } = await InitAPI(defaultConfig);
let cess = new Territory(api, keyring);
ret = await cess.createTerritory(currAddress || accounts[0].address,'territoryName', buyGB, subState);
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
            cess = new Territory(window.api, window.keyring);
            const common = new Common(api, keyring);
            let ret;
            if (e == 'userOwnedSpace') {
                ret = await cess.queryMyTerritorys(currAddress || accounts[0].address);
                if (ret.msg == 'ok' && ret.data && ret.data.length) {
                    console.log(ret.data);
                    setSpaceInfo(ret.data);
                    setCurrTerritory(ret.data[0].name);
                } else {
                    setSpaceInfo(null);
                }
            }  else if (e == 'expansionSpace') {
                // console.log('expansionSpace', currBucketName);
                ret = await cess.expandingTerritory(currAddress || accounts[0].address, currTerritory, buyGB, subState);
            } else if (e == 'renewalSpace') {
                ret = await cess.renewalTerritory(currAddress || accounts[0].address, currTerritory, buyGB, subState);
            } else if (e == 'buySpace') {
                ret = await cess.createTerritory(currAddress || accounts[0].address, territoryName, buyGB, subState);
            } else if (e == 'renameTerritory') {
                ret = await cess.renameTerritory(currAddress || accounts[0].address, currTerritory, territoryName, subState);
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
    const onSelectTerritory = (value) => {
        console.log(value);
        setCurrTerritory(value);
    }
    useEffect(() => {
        connect();
        onTabChange("1");
        return () => {
            if (unsub) {
                unsub();
            }
        }
    }, []);

    return (
        <div className={className}>
            <Card title="Space" className="card" bordered={true}>
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
                        spaceInfo && spaceInfo.length && (
                            <div>
                                <div>Select a territory:{currTerritory}</div>
                                <Select
                                    defaultValue={spaceInfo[0]?.name}
                                    style={{
                                        width: "100%",
                                    }}
                                    onChange={onSelectTerritory}
                                    fieldNames={{ label: 'name', value: 'name' }}
                                    options={spaceInfo}
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
                                    label: 'queryMyTerritorys',
                                    children: <div className="tab-content">
                                        <Button type="primary" onClick={() => handleEvent('userOwnedSpace')}>queryMyTerritorys</Button> &nbsp;&nbsp;
                                    </div>,
                                },
                                {
                                    key: '2',
                                    label: 'expandingTerritory',
                                    children: <div className="tab-content">
                                        <div>
                                            <div>
                                                <div>Expansion Amount(GB):</div>
                                                <Input type="number" value={buyGB} onChange={(e) => setBuyGB(e.target.value)} ></Input><br /><br />
                                            </div>
                                            <Button disabled={spaceInfo ? false : true} type="primary" onClick={() => handleEvent('expansionSpace')}>expandingTerritory</Button>
                                            <div><strong>Note:</strong> The ExpansionSpace button is enabled only if the account has previously purchased space.</div>
                                        </div>
                                    </div>,
                                },
                                {
                                    key: '3',
                                    label: 'renewalTerritory',
                                    children: <div>
                                        <div>
                                            Renewal days
                                        </div>
                                        <div>
                                            <Input type="number" value={buyGB} onChange={(e) => setBuyGB(e.target.value)} ></Input>
                                        </div>
                                        <div className="top20">
                                            <Button disabled={spaceInfo ? false : true} type="primary" onClick={() => handleEvent('renewalSpace')}>renewalTerritory</Button>
                                            <div><strong>Note:</strong> The renewalTerritory button is enabled only if the account has previously purchased territory.</div>
                                        </div>
                                    </div>,
                                },
                                {
                                    key: '4',
                                    label: 'createTerritory',
                                    children: <div>
                                        <div>
                                            <div>Buy amount(GB):</div>
                                            <Input type="number" value={buyGB} onChange={(e) => setBuyGB(e.target.value)} ></Input>
                                            <br ></br><br ></br>
                                        </div>
                                        <div>
                                            <div>Territory Name:</div>
                                            <Input type="text" value={territoryName} onChange={(e) => setTerritoryName(e.target.value)} ></Input>
                                            <br ></br><br ></br>
                                        </div>
                                        <div>
                                            <Button disabled={buyGB && territoryName ? false : true} type="primary" onClick={() => handleEvent('buySpace')}>createTerritory</Button>
                                        </div>
                                    </div>,
                                },
                                {
                                    key: '5',
                                    label: 'renameTerritory',
                                    children: <div>
                                        <div>
                                            <div>New Territory Name:</div>
                                            <Input type="text" value={territoryName} onChange={(e) => setTerritoryName(e.target.value)} ></Input>
                                            <br ></br><br ></br>
                                        </div>
                                        <div>
                                            <Button disabled={currTerritory && territoryName ? false : true} type="primary" onClick={() => handleEvent('renameTerritory')}>renameTerritory</Button>
                                        </div>
                                    </div>,
                                },
                            ]}
                            type="card"
                            onChange={onTabChange}
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
