import { Route, Routes, useNavigate } from "react-router-dom";
import "./App.less";
import Home from "./views/index";
import Authorize from "./views/authorize";
import Extension from "./views/extension";
import Bucket from "./views/bucket";
import Space from "./views/space";
import File from "./views/file";
import Keyring from "./views/keyring";
import Util from "./views/util";

const { InitAPI, Common, defaultConfig } = require("cess-js-sdk-frontend");
import { sleep } from "./utils/common";


import React, { useState, useEffect } from "react";
import { HomeOutlined, ChromeOutlined, UserSwitchOutlined, FolderOutlined, DatabaseOutlined, ToolOutlined, KeyOutlined, UploadOutlined } from "@ant-design/icons";
import { Layout, Menu, Button, theme } from "antd";
const { Header, Sider, Content } = Layout;

let lastCurr = '';

function App() {
	const navigate = useNavigate();
	const [collapsed, setCollapsed] = useState(false);
	const [connectStatus, setConnectStatus] = useState('--');
	const [current, setCurrent] = useState("/");
	const onClick = e => {
		setCurrent(e.key);
		navigate(e.key);
	};
	useEffect(() => {
		setInterval(function () {
			let p = window.location.pathname;
			if (p == lastCurr) return;
			lastCurr = p;
			// setCurrent(p);
		}, 300);
	}, []);

	const init = async () => {
		setConnectStatus('connecting...');
		try {
			const { api, keyring } = await InitAPI(defaultConfig);
			window.api = api;
			window.keyring = keyring;
			setConnectStatus('connect success');
			return { api, keyring };
		} catch (e) {
			setConnectStatus(e.message);
			console.log('has error');
			console.log(e);
		}
	};
	const connectWallet = async () => {
		while (!window.api || !window.keyring) {
			await sleep(500);
		}
		let cess = new Common(window.api, window.keyring);
		let accounts = await cess.getAccountsFromWallet();
		console.log(accounts);
		if (accounts && Array.isArray(accounts)) {
			accounts.forEach(t => {
				t.key = t.address;
				t.name = t.meta.name;
			});
			window.accounts = accounts;
		}
		return accounts;
	};
	useEffect(() => {
		init();
		window.cessInit = init;
		window.connectWallet = connectWallet;
	}, []);

	return (
		<div className="App">
			<Layout>
				<Sider
					trigger={null}
					collapsible
					collapsed={collapsed}
					style={{
						overflow: "auto",
						height: "100vh",
						position: "fixed",
						left: 0,
						top: 0,
						bottom: 0
					}}>
					<div className="sider-logo-box">
						<span>CESS-JS-SDK</span>
						<label>Example</label>
					</div>
					<Menu
						theme="dark"
						mode="inline"
						onClick={onClick}
						selectedKeys={[current]}
						defaultSelectedKeys={["/"]}
						items={[
							{
								key: "/",
								icon: <HomeOutlined />,
								label: "Home"
							},
							{
								key: "/extension",
								icon: <ChromeOutlined />,
								label: "Extension-dapp"
							},
							{
								key: "/authorize",
								icon: <UserSwitchOutlined />,
								label: "Authorize"
							},
							{
								key: "/bucket",
								icon: <FolderOutlined />,
								label: "Bucket"
							},
							{
								key: "/space",
								icon: <DatabaseOutlined />,
								label: "Space"
							},
							{
								key: "/file",
								icon: <UploadOutlined />,
								label: "File"
							},
							{
								key: "/keyring",
								icon: <KeyOutlined />,
								label: "Keyring"
							},
							{
								key: "/util",
								icon: <ToolOutlined />,
								label: "Util"
							}
						]}
					/>
					<div className="connect-status">
						{connectStatus}
					</div>
				</Sider>
				<Layout
					style={{
						marginLeft: 200
					}}>
					<Content
						style={{
							padding: 20,
							minHeight: collapsed ? 0 : 280,
							// background: colorBgContainer
						}}>
						<div className="containner222">
							<Routes>
								{/* <Route path="/" element={<Home />} /> */}
								<Route path="/" element={<Home />} />
								<Route path="/authorize" element={<Authorize />} />
								<Route path="/extension" element={<Extension />} />
								<Route path="/bucket" element={<Bucket />} />
								<Route path="/space" element={<Space />} />
								<Route path="/file" element={<File />} />
								<Route path="/keyring" element={<Keyring />} />
								<Route path="/util" element={<Util />} />

								{/* <Route path="/users" element={<Users />} />
									<Route path="/operation" element={<Operation />} />
									<Route path="/setting" element={<Setting />} /> */}
								{/* <Route path="/block/:q" element={<BlockDetail />} />
									<Route path="/transfer/:q" element={<TransferDetail />} />
									<Route path="/miner/" element={<MinerList />} />
									<Route path="/miner/:q" element={<MinerDetail />} />
									<Route path="/account/" element={<AccountList />} />
									<Route path="/account/:q" element={<AccountDetail />} />
									<Route path="/statistics" element={<Statistics />} />
									<Route path="/demo" element={<Demo />} /> */}
							</Routes>
						</div>
					</Content>
				</Layout>
			</Layout>
		</div>
	);
}

export default App;
