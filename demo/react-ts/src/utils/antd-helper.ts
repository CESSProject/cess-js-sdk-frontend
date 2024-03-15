import { Modal, message, notification } from "antd";
import copy from "copy-to-clipboard";

export function alert(title: string) {
  return new Promise((resolve: any, reject: any) => {
    let modal = Modal.info({
      title,
      onOk: () => {
        resolve();
      },
    });
  });
}

export function loading(content: string) {
  message.loading({
    content,
    duration: 0,
  });
}
export function confirm(title: string) {
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
export function noti(message: string) {
  notification.open({ message });
}
export function notiOK(message: string) {
  notification.success({ message });
}
export function notiError(message: string) {
  notification.error({ message });
}
export function msgOK(msg: string) {
  message.success(msg);
}
export function msgError(msg: string) {
  message.error(msg);
}
export function alertOk(title: string) {
  Modal.success({
    title,
  });
}
export function alertError(title: string) {
  Modal.error({
    title,
  });
}
