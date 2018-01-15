function wxPromise(fn) {
  return function (obj = {}) {
    return new Promise((resolve, reject) => {
      obj.success = function (res) {
        resolve(res);
      }
      obj.fail = function (res) {
        //reject(res);
        resolve(res);
      }
      fn(obj);
    })
  }
};
Promise.prototype.finally = function (callback) {
  let P = this.constructor;
  return this.then(
    value => P.resolve(callback()).then(() => value),
    reason => P.resolve(callback()).then(() => { throw reason; })
  );
};

module.exports = wxPromise;