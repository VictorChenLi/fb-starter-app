export function executeSequentially(promiseArray) {
  promiseArray.forEach((promiseEle) => {
    promiseEle().then();
  });
}
