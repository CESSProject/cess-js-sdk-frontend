import React, { useState, useEffect } from "react";
import { Card, Spin, Input, Button } from "antd";
import { DollarOutlined, CheckCircleOutlined, CloudServerOutlined, AreaChartOutlined, StockOutlined, UsergroupAddOutlined } from "@ant-design/icons";
import styled from "styled-components";
import _ from "lodash";
import { useNavigate } from "react-router-dom";
import { Common } from "cess-js-sdk-frontend";
import * as antdHelper from "../utils/antd-helper";
import JSONView from "../components/JSONView";
import CodeView from "../components/CodeView";

function Main({ className }) {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState();
    const [result, setResult] = useState();
    const [codeStr, setCodeStr] = useState();
    const onTabChange = (e) => {
        if (e == '1') {
            setCodeStr(`
const { InitAPI,Common, Authorize, Bucket, File, defaultConfig } = require("cess-js-sdk-frontend");

const { api, keyring } = await InitAPI(defaultConfig);
const common = new Common(api, keyring);
try {
    setResult(common.formatAccountId(data));
} catch (e) {
    setResult(e.message);
}
            `);
        }
    }

    const loadData = async () => {
        if (!data) {
            return antdHelper.alertError('Please enter a address.');
        }
        setLoading(true);
        if (!window.api || !window.keyring) {
            return setTimeout(function () {
                loadData();
            }, 1000);
        }
        const common = new Common(api, keyring);
        try {
            setResult(common.formatAccountId(data));
        } catch (e) {
            setResult(e.message);
        }
        setLoading(false);
    };
    useEffect(() => {
        onTabChange("1");
    }, []);

    return (
        <div className={className}>
            <Card title="Keyring" className="card" bordered={true}>
                <div>
                    <div>
                        <div>Convert to CESS address:</div>
                        <Input type="text" placeholder="address" value={data} onChange={(e) => setData(e.target.value)} ></Input><br /><br />
                    </div>
                    <Button disabled={loading} loading={loading} type="primary" onClick={loadData}>Convert</Button>
                    <JSONView json={result} />
                    <CodeView json={codeStr} />
                </div>
            </Card>
        </div>
    );
}

export default styled(Main)`
	display: block;
	overflow: hidden;
`;
