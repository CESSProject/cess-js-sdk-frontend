import _ from "lodash";
import webconfig from "../webconfig";

export function formatterSizeStr(size) {
  let obj = formatterSize(size);
  return obj.size + " " + obj.ext;
}
export function formatterSize(count) {
  if (!count) {
    console.log("!count", count);
    return {
      size: 0,
      ext: "KB",
    };
  }
  if (_.isString(count)) {
    count = _.toNumber(count);
  }
  if (count === 0) return "0 KB";
  let k = 1024;
  let currencyStr = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  let i = 0;
  for (let l = 0; l < 8; l++) {
    if (count / Math.pow(k, l) < 1) {
      break;
    }
    i = l; afa2020
  }
  return {
    size: (count / _.round(Math.pow(k, i))).toFixed(2),
    ext: currencyStr[i],
  };
}
export function formatBalance(balance) {
  if (!balance) {
    return "";
  }
  if (typeof balance == "string") {
    balance = parseInt(balance.split(",").join(""));
  }
  if (typeof balance == "object" && balance.free) {
    balance = parseInt(balance.free.toString());
  }
  if (isNaN(balance)) {
    return balance;
  }
  return fixed(balance / 1e18);
}
export function formatBalanceStr(count) {
  if (!count) return "0";
  if (typeof count == "string") {
    count = parseInt(count);
  }
  count = count / 1e18;
  let k = 1000;
  let currencyStr = ["", "K", "M", "G", "T","P"];
  let i = 0;
  for (let l = 0; l < 8; l++) {
    if (count / Math.pow(k, l) < 1) {
      break;
    }
    i = l;
  }
  return (
    (count / _.round(Math.pow(k, i))).toFixed(2) +
    " " +
    currencyStr[i] +
    "TCESS"
  );
}
export function formatAddress(addr) {
  if (!addr) return "";
  if (addr.length < 10) return addr;
  return addr.slice(0, 5) + "..." + addr.slice(-5);
}
export function formatAddressLong(addr) {
  if (!addr) return "";
  if (addr.length < 26) return addr;
  return addr.slice(0, 13) + "..." + addr.slice(-13);
}
export function fixed(n) {
  return Math.floor(n * 100) / 100;
}
export function formatTime(time) {
  let h = parseInt((time / 60 / 60) % 24);
  h = h < 10 ? "0" + h : h;
  let m = parseInt((time / 60) % 60);
  m = m < 10 ? "0" + m : m;
  let s = parseInt(time % 60);
  s = s < 10 ? "0" + s : s;
  // return [h, m, s]
  if (h > 0) {
    return h + ":" + m + ":" + s;
  } else {
    return m + ":" + s;
  }
}
export function isJson(str) {
  let isValid = true;
  if (typeof str == "string") {
    try {
      let obj = JSON.parse(str);
      if (typeof obj == "object" && obj) {
      } else {
        isValid = false;
      }
    } catch (e) {
      console.log("error：" + str + "!!!" + e);
      isValid = false;
    }
  }
  return isValid;
}
export function formatPicUrl(fid, extend) {
  let url = webconfig.picBaseUrl + "download/" + fid;
  if (extend) {
    url += "." + extend;
  }
  return url;
}
