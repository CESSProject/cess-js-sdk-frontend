export function sleep(minisec) {
    return new Promise((resolve, reject) => {
        setTimeout(function () {
            resolve();
        }, minisec);
    });
}