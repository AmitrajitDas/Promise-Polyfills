function promisePolyfill(exec) {
  let isFulfilled = false,
    isRejected = false,
    isCalled = false,
    value,
    onResolve,
    onReject;

  const resolve = (val) => {
    isFulfilled = true;
    value = val;

    if (typeof onResolve === "function") {
      isCalled = true;
      onResolve(val);
    }
  };

  const reject = (val) => {
    isRejected = true;
    value = val;

    if (typeof onReject === "function") {
      isCalled = true;
      onReject(val);
    }
  };

  this.then = (cb) => {
    onResolve = cb;
    if (isFulfilled && !isCalled) {
      isCalled = true;
      onResolve(value);
    }
    return this;
  };

  this.catch = (cb) => {
    onReject = cb;
    if (isRejected && !isCalled) {
      isCalled = true;
      onReject(value);
    }
    return this;
  };

  try {
    exec(resolve, reject);
  } catch (error) {
    console.log(error);
  }
}

function allSettled(promises) {
  let mappedPromises = promises.map((p) => {
    return p
      .then((value) => {
        return {
          status: "fulfilled",
          value,
        };
      })
      .catch((reason) => {
        return {
          status: "rejected",
          reason,
        };
      });
  });
  return promisePolyfill.all(mappedPromises);
}
