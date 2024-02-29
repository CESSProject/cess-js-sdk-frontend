import { Modal, message, notification } from "antd";
import copy from "copy-to-clipboard";

export function alert(title) {
  return new Promise((resolve, reject) => {
    let modal = Modal.info({
      title,
      onOk: () => {
        // modal.destroy();
        resolve();
      },
    });
  });
}

export function shareFile(url) {
  return new Promise((resolve, reject) => {
    let modal = Modal.info({
      title: null,
      footer: null,
      width: 800,
      icon: null,
      content: (
        <div className="mypopu">
          <div className="title">Copy the link to share</div>
          <div className="con">
            <div className="show-txt">{url}</div>
          </div>
          <div className="footer">
            <span
              className="btn btn-primary"
              onClick={() => {
                copy(url);
                notiOK("Copy successful");
              }}
            >
              Copy
            </span>
            <span onClick={() => modal.destroy()} className="btn btn-default">
              Cancel
            </span>
          </div>
        </div>
      ),
      onOk: () => {
        // modal.destroy();
        resolve();
      },
    });
  });
}
window.loadingTipsIsShow = false;
export function loading(content) {
  if (window.loadingTipsIsShow || !content) {
    window.loadingTipsIsShow = false;
    message.destroy();
    return;
  }
  window.loadingTipsIsShow = true;
  message.loading({
    content,
    duration: 0,
  });
}
export function confirm(title) {
  return new Promise((resolve, reject) => {
    Modal.confirm({
      title,
      onOk: () => {
        resolve(true);
      },
      onCancel: () => {
        resolve(false);
      },
    });
  });
}
notification.config({
  placement: "topRight",
  top: 70,
  duration: 5,
  rtl: true,
});
export function noti(message) {
  notification.open({ message });
}
export function notiOK(message) {
  notification.success({ message });
}
export function notiError(message) {
  notification.error({ message });
}
export function msgOK(msg) {
  message.success(msg);
}
export function msgError(msg) {
  message.error(msg);
}
export function alertOk(title) {
  Modal.success({
    title,
  });
}
export function alertError(title) {
  Modal.error({
    title,
  });
}
