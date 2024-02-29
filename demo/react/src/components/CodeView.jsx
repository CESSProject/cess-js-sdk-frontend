import React, { useState, useEffect } from "react";
import styled from "styled-components";
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { dark, a11yDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const SearchBar = ({ className, json,title='Code' }) => {
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
    if(!data){
        return "";
    }
    return (
        <div className={className}>
            <div className="code-title">{title}<label className="btn" onClick={() => setOpen(!open)}>{open ? '-' : '+'}</label></div>
            <div className={open ?"code-box open":"code-box close"}><SyntaxHighlighter language="javascript" style={docco}>{data}</SyntaxHighlighter></div>
        </div>
    );
};

export default React.memo(styled(SearchBar)`
	display: block;
	overflow: hidden;
	margin-top:20px;	
    background-color: rgb(248 248 255);
	.code-title{
		color: #fff;
		background-color: rgb(167 167 167);
		height: 40px;
		line-height: 40px;
		text-indent: 10px;
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
