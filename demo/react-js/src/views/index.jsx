import React, { useState, useEffect } from "react";
import { Card, Spin } from "antd";
import { DollarOutlined, CheckCircleOutlined, CloudServerOutlined, AreaChartOutlined, StockOutlined, UsergroupAddOutlined } from "@ant-design/icons";
import styled from "styled-components";
import _ from "lodash";
import { useNavigate } from "react-router-dom";

import { formatBalanceStr } from "../utils/formatter";
import CodeView from "../components/CodeView";


function Main({ className }) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({});

    const loadData = async () => {
        setLoading(true);
        
        setLoading(false);
    };
    useEffect(() => {
        loadData();
    }, []);

    return (
        <div className={className}>
            <Card title="About CESS JS SDK Example" className="card" bordered={true}>
                <h2>About</h2>
                <div>
                This is an example for cess-js-sdk-frontend,you can git clone and run it.
                </div>
                <h2>Install</h2>
                <div>
                    First install
                </div>
                <CodeView json={`cd ./demo/react/ && npm i`} title="Install" />
                <h2>Run</h2>
                <div>
                    Run this demo.
                </div>
                <CodeView json={`npm start`} title="start" />
                <h2>Init Code</h2>
                <CodeView json={`
import  { InitAPI,Common, Authorize, Bucket, File, defaultConfig } from "cess-js-sdk-frontend";
const { api, keyring } = await InitAPI(defaultConfig);
                `} title="Init" />
                <div>The api is "@polkadot/api" ApiPromise ,More document is <a href="https://polkadot.js.org/docs/api/start/create" target="_blank">here</a></div>
                <div>The keyring is "@polkadot/api" keyring ,More document is <a href="https://polkadot.js.org/docs/api/start/keyring" target="_blank">here</a></div>
                <h2>Config</h2>
                <div>
                The cess-js-sdk-frontend has a default config,like this:
                </div>
                <CodeView json={`
{
    nodeURL: "wss://testnet-rpc1.cess.cloud/ws/", //Rpc url
    keyringOption: { type: "sr25519", ss58Format: 11330 }, //for keyring 
    gatewayURL: "http://deoss-pub-gateway.cess.cloud/", //the default gateway url
    gatewayAddr: "cXhwBytXqrZLr1qM5NHJhCzEMckSTzNKw17ci2aHft6ETSQm9", //the gateway accountId
}
                `} title="Config" />
            </Card>
        </div>
    );
}

export default styled(Main)`
	display: block;
	overflow: hidden;
	
`;
