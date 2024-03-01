import { HashRouter } from "react-router-dom";
import "react-app-polyfill/ie9";
import "react-app-polyfill/stable";
import { ConfigProvider } from "antd";
import React from "react";
import ReactDOM from "react-dom";
import "./index.less";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import enGB from "antd/lib/locale/en_GB";

ReactDOM.render(
	<ConfigProvider locale={enGB}>
		<HashRouter basename="/cess-js-sdk-frontend">
			<App />
		</HashRouter>
	</ConfigProvider>,
	document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

