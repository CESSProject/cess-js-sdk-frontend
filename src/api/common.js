/*
 * @Description: js-sdk for cess storage
 * @Autor: cess lab
 */
import ControlBase from "../control-base";
import { formatterSize } from "../util/formatter";
import moment from "moment";

const GB = 1024 * 1024 * 1024;
const SECS_IN_DAY = 60 * 60 * 24;
const BLOCK_TIME = 6; // in seconds

export default class Common extends ControlBase {
  constructor(api, keyring, isDebug = false) {
    super(api, keyring, isDebug);
  }

  async queryBlockHeight() {
    let ret = await this.api.query.system.number();
    let blockHeight = ret.toJSON();
    return blockHeight;
  }

  formatSpaceInfo(obj, blockHeight) {
    const result = { ...obj };
    result.totalSpaceGib = 0;
    result.totalSpaceStr = "0 GB";

    result.usedSpaceGib = 0;
    result.usedSpaceStr = "0 GB";

    result.lockedSpaceGib = 0;
    result.lockedSpaceStr = "0 GB";

    result.remainingSpaceGib = 0;
    result.remainingSpaceStr = "0 GB";

    result.deadlineTime = "--";
    result.remainingDays = 0;

    if (result.totalSpace) {
      result.totalSpaceGib = result.totalSpace / GB;
      result.totalSpaceStr = formatterSize(result.totalSpace);
    }
    if (result.usedSpace) {
      result.usedSpaceGib = result.usedSpace / GB;
      result.usedSpaceStr = formatterSize(result.usedSpace);
    }
    if (result.lockedSpace) {
      result.lockedSpaceGib = result.lockedSpace / GB;
      result.lockedSpaceStr = formatterSize(result.lockedSpace);
    }
    if (result.remainingSpace) {
      result.remainingSpaceGib = result.remainingSpace / GB;
      result.remainingSpaceStr = formatterSize(result.remainingSpace);
    }
    if (result.deadline && blockHeight) {
      let s = (result.deadline - blockHeight) * BLOCK_TIME;
      let time = moment().add(s, "s");
      result.deadlineTime = time.format("YYYY-MM-DD HH:mm:ss");
      result.remainingDays = parseInt(s / SECS_IN_DAY);
    }

    return result;
  }
};
