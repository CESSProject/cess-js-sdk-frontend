import React, { useState, useEffect } from "react";
import { Card, Input, Spin, Space, Button, Table, Tabs, Select } from "antd";
const { Search, TextArea } = Input;
import { DollarOutlined, CheckCircleOutlined, CloudServerOutlined, AreaChartOutlined, StockOutlined, UsergroupAddOutlined } from "@ant-design/icons";
import styled from "styled-components";
import _ from "lodash";
import { useNavigate } from "react-router-dom";

import { formatBalanceStr } from "../utils/formatter";
import * as antdHelper from "../utils/antd-helper";
import { Common, Authorize, Bucket, File } from "cess-js-sdk-frontend";
import CodeView from "../components/CodeView";

let cess = null;

function Main({ className }) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [signResultStr, setSignResultStr] = useState();
    const [currAddress, setCurrAddress] = useState();
    const [codeStr, setCodeStr] = useState();
    const onTabChange = (e) => {
        if (e == '1') {
            setCodeStr(`
const { InitAPI,Common, Authorize, Bucket, File, defaultConfig } = require("cess-js-sdk-frontend");

const { api, keyring } = await InitAPI(defaultConfig);
let cess = new Common(api,keyring);
let accounts = await cess.getAccountsFromWallet();
console.log(accounts);
            `);
        }else if (e == '2') {
            setCodeStr(`
const { InitAPI,Common, Authorize, Bucket, File, defaultConfig } = require("cess-js-sdk-frontend");

const { api, keyring } = await InitAPI(defaultConfig);
let cess = new Bucket(api, keyring);
let result = await cess.authSign(currAddress || data[0].address, value || 'hello cess');
console.log(result);
            `);
        }
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
    const connect = async () => {
        if (window.accounts) {
            return setData(window.accounts);
        }
        setLoading(true);
        if (!window.api || !window.keyring) {
            return setTimeout(function () {
                connect();
            }, 1000);
        }
        let accounts = await window.connectWallet();
        setData(accounts);
        setLoading(false);
    };
    const onSign = async (value, _e, info) => {
        console.log(value);
        if (!window.api || !window.keyring) {
            return setTimeout(function () {
                onSign();
            }, 1000);
        }
        if (data.length == 0) {
            return antdHelper.alertError('select a account please.')
        }
        setLoading(true);
        cess = new Authorize(window.api, window.keyring);
        let result = await cess.authSign(currAddress || data[0].address, value || 'hello cess');
        setSignResultStr(result.signStr);
        console.log(result);
        setLoading(false);
    }
    const onSelectAccount = async (value) => {
        console.log(value);
        setCurrAddress(value);
    }
    useEffect(() => {
        onTabChange("1");
    }, []);

    return (
        <div className={className}>
            <Card title="Extension-dapp" className="card" bordered={true}>
                <Spin spinning={loading}>
                    <Tabs
                        defaultActiveKey="1"
                        items={[
                            {
                                key: '1',
                                label: 'Get Account',
                                children: <div className="tab-content">
                                    <div>
                                        <Button type="primary" onClick={connect}>Connect Wallet</Button>
                                    </div>
                                    <div className="top20">
                                        <Table dataSource={data} columns={accountColumns} />
                                    </div>
                                </div>,
                            },
                            {
                                key: '2',
                                label: 'Sign Message',
                                children: <div>
                                    <div className="top20">
                                        <Space>
                                            {
                                                !data || data.length == 0 ? (<Button type="primary" onClick={connect}>Connect Wallet</Button>) : (
                                                    <div>
                                                        <div>
                                                            Select a account:</div><Select
                                                            defaultValue={data[0]?.address}
                                                            style={{
                                                                width: "100%",
                                                            }}
                                                            onChange={onSelectAccount}
                                                            fieldNames={{ label: 'fullname', value: 'address' }}
                                                            options={data}
                                                        />
                                                    </div>)
                                            }
                                        </Space>
                                    </div>
                                    <div className="top20">
                                        <div>Message</div>
                                        <Search
                                            placeholder="input a message,'hello cess' for default"
                                            allowClear
                                            enterButton="Sign"
                                            size="large"
                                            onSearch={onSign}
                                        />
                                    </div>
                                    <div className="top20">
                                        <div>Sign result</div>
                                        <TextArea
                                            value={signResultStr}
                                            readOnly
                                            placeholder="Sign message result"
                                            autoSize={{
                                                minRows: 3,
                                                maxRows: 5,
                                            }}
                                        />
                                    </div>
                                </div>,
                            },
                        ]}
                        type="card"
                        onChange={onTabChange}
                    />
                </Spin>
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
    .tab-content{
       
    }
	
`;
