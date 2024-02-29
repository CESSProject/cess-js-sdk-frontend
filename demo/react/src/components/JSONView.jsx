import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { JsonView, allExpanded, darkStyles, defaultStyles } from 'react-json-view-lite';
import 'react-json-view-lite/dist/index.css';

const SearchBar = ({ className, json }) => {
	const [data, setData] = useState();
	const [open, setOpen] = useState(true);
	useEffect(() => {
		let d = json;
		if (typeof json == 'string') {
			try { d = JSON.parse(json); }
			catch (e) { }
		}
		setData(d);
	}, [json]);
	if (!data) {
		return "";
	}
	return (
		<div className={className}>
			<div className="code-title">Respone<label className="btn" onClick={() => setOpen(!open)}>{open ? '-' : '+'}</label></div>
			<div className={open ?"code-box open":"code-box close"}>
				<JsonView data={data} shouldExpandNode={allExpanded} style={darkStyles} />
			</div>
		</div>
	);
};

export default React.memo(styled(SearchBar)`
	display: block;
	overflow: hidden;
	margin-top:20px;	
	background-color: rgb(0, 43, 54);
	.code-title{
		color: #fff;
		background-color: rgb(0 71 64);
		height: 40px;
		line-height: 40px;
		text-indent: 10px;
		position: relative;
		top:0;
		.btn{
			width: 56px;
			height: 40px;
			display: block;
			overflow: hidden;
			line-height: 36px;
			color: #fff;
			font-size: 27px;
			float: right;
			text-align: center;
			cursor: pointer;
		}
	}
	.code-box{
		transition:all 0.5s;
		display: block;
		overflow: auto;
    }
	.open{
		max-height: 1000px;
	}
	.close{
		max-height: 0px;
	}
`);
