import React, { useState, useEffect } from "react";
import { Card, Spin, Input, Button, Space } from "antd";
import { DollarOutlined, CheckCircleOutlined, CloudServerOutlined, AreaChartOutlined, StockOutlined, UsergroupAddOutlined } from "@ant-design/icons";
import styled from "styled-components";
import _ from "lodash";
import { useNavigate } from "react-router-dom";
import { Common } from "cess-js-sdk-frontend";
import * as antdHelper from "../utils/antd-helper";
import JSONView from "../components/JSONView";
import CodeView from "../components/CodeView";

let unsub = null;

function Main({ className }) {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState();
    const [result, setResult] = useState();
    const [subing, setSubing] = useState(false);

    const [codeStr, setCodeStr] = useState();
    const onTabChange = (e) => {
        if (e == '1') {
            setCodeStr(`
const { InitAPI,Common, Authorize, Bucket, File, defaultConfig } = require("cess-js-sdk-frontend");

const { api, keyring } = await InitAPI(defaultConfig);
const common = new Common(api, keyring);
try {
    let ret = await common.queryBlockHeight(data);
    setResult(JSON.stringify(ret, null, 2));
} catch (e) {
    setResult(e.message);
}
            `);
        }else if (e == '2') {
            setCodeStr(`
const { InitAPI,Common, Authorize, Bucket, File, defaultConfig } = require("cess-js-sdk-frontend");

const { api, keyring } = await InitAPI(defaultConfig);
let unsub = await window.api.rpc.chain.subscribeNewHeads((lastHead) => {
    setResult(JSON.stringify(lastHead, null, 2));
});
            `);
        }else if (e == '3') {
            setCodeStr(`
unsub();
            `);
        }
    }

    const loadData = async () => {
        onTabChange("1");
        setLoading(true);
        if (!window.api || !window.keyring) {
            return setTimeout(function () {
                loadData();
            }, 1000);
        }
        const common = new Common(api, keyring);
        try {
            let ret = await common.queryBlockHeight(data);
            setResult(JSON.stringify(ret, null, 2));
        } catch (e) {
            setResult(e.message);
        }
        setLoading(false);
    };
    const subscribe = async () => {
        onTabChange("2");
        setLoading(true);
        if (!window.api || !window.keyring) {
            return setTimeout(function () {
                loadData();
            }, 1000);
        }
        try {
            unsub = await window.api.rpc.chain.subscribeNewHeads((lastHead) => {
                setResult(JSON.stringify(lastHead, null, 2));
            });
            setSubing(true);
        } catch (e) {
            setResult(e.message);
        }
        setLoading(false);
    };
    const unsubscribe = async () => {
        onTabChange("3");
        if (unsub) {
            unsub();
            setSubing(false);
        }
    }
    useEffect(() => {
        onTabChange("1");
    }, []);

    return (
        <div className={className}>
            <Card title="Util" className="card" bordered={true}>
                <Space>
                    <Button disabled={loading} loading={loading} type="primary" onClick={loadData}>QueryBlockHeight</Button>
                    <Button disabled={subing} loading={loading} type="primary" onClick={subscribe}>subscribeNewHeads</Button>
                    <Button disabled={!subing} loading={loading} type="primary" onClick={unsubscribe}>unsubscribeNewHeads</Button>
                </Space>
                <JSONView json={result} />
                <CodeView json={codeStr} />
            </Card>
        </div>
    );
}

export default styled(Main)`
	display: block;
	overflow: hidden;
`;
