import React, { useState, useEffect } from "react";
import { Card, Input, Spin, Space, Button, Table, Tabs, Select } from "antd";
const { Search, TextArea } = Input;
import { DollarOutlined, CheckCircleOutlined, CloudServerOutlined, AreaChartOutlined, StockOutlined, UsergroupAddOutlined } from "@ant-design/icons";
import styled from "styled-components";
import _ from "lodash";
import { useNavigate } from "react-router-dom";

import { formatBalanceStr } from "../utils/formatter";
import * as antdHelper from "../utils/antd-helper";
import { Common, Authorize, File, defaultConfig, Bucket } from "cess-js-sdk-frontend";
import JSONView from "../components/JSONView";
import CodeView from "../components/CodeView";

let cess = null;
let fileObj = null;

function Main({ className }) {
    const [loading, setLoading] = useState(false);
    const [accounts, setAccounts] = useState([]);
    const [currAddress, setCurrAddress] = useState();
    const [result, setResult] = useState();
    const [buckets, setBuckets] = useState([]);
    const [fileList, setFileList] = useState([]);
    const [currFile, setCurrFile] = useState();
    const [currBucketName, setCurrBucketName] = useState();

    const [spaceInfo, setSpaceInfo] = useState();
    const [buyGB, setBuyGB] = useState();

    const [codeStr, setCodeStr] = useState();
    const onTabChange = (e) => {
        if (e == '0') {
            setCodeStr(`
import  { InitAPI,Common, Authorize, Bucket, File, defaultConfig } from "cess-js-sdk-frontend";

const { api, keyring } = await InitAPI(defaultConfig);
let cess = new File(api, keyring);
let ret = await cess.queryFileList(currAddress || accounts[0].address);
console.log(ret);
            `);
        }else if (e == '1') {
            setCodeStr(`
import  { InitAPI,Common, Authorize, Bucket, File, defaultConfig } from "cess-js-sdk-frontend";

const { api, keyring } = await InitAPI(defaultConfig);
let cess = new File(api, keyring);
let ret = await cess.queryFileListFull(currAddress || accounts[0].address);
console.log(ret);
            `);
        }else if (e == '2') {
            setCodeStr(`
import  { InitAPI,Common, Authorize, Bucket, File, defaultConfig } from "cess-js-sdk-frontend";

const { api, keyring } = await InitAPI(defaultConfig);
let cess = new File(api, keyring);
let ret = await cess.queryFileMetadata(currFile || fileList[0].fileHash);
console.log(ret);
            `);
        }else if (e == '3') {
            setCodeStr(`
import  { InitAPI,Common, Authorize, Bucket, File, defaultConfig } from "cess-js-sdk-frontend";

const { api, keyring } = await InitAPI(defaultConfig);
let cess = new File(api, keyring);
let ret = await cess.uploadFile(currAddress || accounts[0].address, fileObj, currBucketName, subState);
console.log(ret);
            `);
        }else if (e == '4') {
            setCodeStr(`
import  { InitAPI,Common, Authorize, Bucket, File, defaultConfig } from "cess-js-sdk-frontend";

const { api, keyring } = await InitAPI(defaultConfig);
let cess = new File(api, keyring);
ret = await cess.downloadFile(hash, fileName);
console.log(ret);
            `);
        }else if (e == '5') {
            setCodeStr(`
import  { InitAPI,Common, Authorize, Bucket, File, defaultConfig } from "cess-js-sdk-frontend";

const { api, keyring } = await InitAPI(defaultConfig);
let cess = new File(api, keyring);
ret = await cess.deleteFile(currAddress || accounts[0].address, currFile || fileList[0].fileHash, subState);
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
            console.log(currAddress || accounts[0].address);
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
            cess = new File(window.api, window.keyring);
            const common = new Common(api, keyring);
            let ret;
            if (e == 'queryFileList') {
                ret = await cess.queryFileList(currAddress || accounts[0].address);
                if (ret.msg == 'ok' && ret.data) {
                    ret.data.forEach(t => {
                        t.label = t.fileHash;
                        t.value = t.fileHash;
                    });
                    setFileList(ret.data);
                } else {
                    setFileList([]);
                }
            } else if (e == 'queryFileListFull') {
                ret = await cess.queryFileListFull(currAddress || accounts[0].address);
                if (ret.msg == 'ok' && ret.data) {
                    ret.data.forEach(t => {
                        t.label = t.fileName + '(' + t.fileSizeStr + ')';
                        t.value = t.fileHash;
                    });
                    setFileList(ret.data);
                } else {
                    setFileList([]);
                }
            } else if (e == 'queryFileMetadata') {
                console.log('queryFileMetadata', currFile);
                ret = await cess.queryFileMetadata(currFile || fileList[0].fileHash);
            } else if (e == 'uploadFile') {
                ret = await cess.uploadFile(currAddress || accounts[0].address, fileObj, currBucketName, subState);
            } else if (e == 'downloadFile') {
                let hash = currFile || fileList[0].fileHash;
                let tmp = fileList.find(t => t.fileHash == hash);
                let fileName = 'a.jpg';
                if (tmp && tmp.fileName) {
                    fileName = tmp.fileName;
                }
                ret = await cess.downloadFile(hash, fileName);
            } else if (e == 'deleteFile') {
                ret = await cess.deleteFile(currAddress || accounts[0].address, currFile || fileList[0].fileHash, subState);
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
    const onSelectFile = async (e) => {
        fileObj = e.target.files[0];
        console.log(fileObj);
    }
    const queryBucket = async (e) => {
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
            let ret = await cess.queryBucketList(currAddress || accounts[0].address);
            if (ret.msg == 'ok' && ret.data && ret.data.length) {
                let arr = ret.data.map(t => {
                    return { label: t.key, value: t.key }
                });
                setBuckets(arr);
            } else {
                setBuckets([])
            }
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
    const onSelectFileInfo = async (value) => {
        console.log(value);
        setCurrFile(value);
    }


    useEffect(() => {
        connect();
        onTabChange("1");
    }, []);

    return (
        <div className={className}>
            <Card title="File" className="card" bordered={true}>
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
                                    key: '0',
                                    label: 'queryFileList',
                                    children: <div className="tab-content">
                                        <Button type="primary" onClick={() => handleEvent('queryFileList')}>queryFileList</Button>
                                    </div>,
                                },
                                {
                                    key: '1',
                                    label: 'queryFileListFull',
                                    children: <div className="tab-content">
                                        <Button type="primary" onClick={() => handleEvent('queryFileListFull')}>queryFileListFull</Button>
                                    </div>,
                                },
                                {
                                    key: '2',
                                    label: 'queryFileMetadata',
                                    children: <div className="tab-content">
                                        <div>
                                            <div>
                                                <div>Select a file:</div>
                                                <Select
                                                    defaultValue={fileList[0]?.value}
                                                    style={{
                                                        width: "100%",
                                                    }}
                                                    onChange={onSelectFileInfo}
                                                    options={fileList}
                                                />
                                                <br /><br />
                                            </div>
                                            <Button disabled={fileList.length > 0 ? false : true} type="primary" onClick={() => handleEvent('queryFileMetadata')}>queryFileMetadata</Button>
                                        </div>
                                    </div>,
                                },
                                {
                                    key: '3',
                                    label: 'uploadFile',
                                    children: <div>
                                        <div>
                                            Select a file
                                        </div>
                                        <div>
                                            <input type="file" onChange={onSelectFile} ></input>
                                        </div>
                                        <div>
                                            <div>Select a bucket</div>
                                            <Select
                                                defaultValue={buckets[0]?.value}
                                                style={{
                                                    width: "100%",
                                                }}
                                                onChange={onSelectBucket}
                                                options={buckets}
                                            /><br ></br><br ></br>
                                            <Button type="default" onClick={queryBucket}>Query Bucket List</Button>
                                            <br ></br><br ></br>
                                        </div>
                                        <div className="top20">
                                            <Button type="primary" onClick={() => handleEvent('uploadFile')}>uploadFile</Button>
                                        </div>
                                    </div>,
                                },
                                {
                                    key: '4',
                                    label: 'downloadFile',
                                    children: <div>
                                        <div>
                                            <div>
                                                <div>Select a file:</div>
                                                <Select
                                                    defaultValue={fileList[0]?.value}
                                                    style={{
                                                        width: "100%",
                                                    }}
                                                    onChange={onSelectFileInfo}
                                                    options={fileList}
                                                />
                                                <br /><br />
                                            </div>
                                            <Button disabled={fileList.length > 0 ? false : true} type="primary" onClick={() => handleEvent('downloadFile')}>downloadFile</Button>
                                        </div>
                                    </div>,
                                },
                                {
                                    key: '5',
                                    label: 'deleteFile',
                                    children: <div>
                                        <div>
                                            <div>Select a file:</div>
                                            <Select
                                                defaultValue={fileList[0]?.value}
                                                style={{
                                                    width: "100%",
                                                }}
                                                onChange={onSelectFileInfo}
                                                options={fileList}
                                            />
                                            <br /><br />
                                        </div>
                                        <div>
                                            <Button disabled={spaceInfo ? true : false} type="primary" onClick={() => handleEvent('deleteFile')}>deleteFile</Button>
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
