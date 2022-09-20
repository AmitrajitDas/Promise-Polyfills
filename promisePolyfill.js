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

const samplePromise = new promisePolyfill((resolve, reject) => {
  setTimeout(() => {
    resolve(1);
  }, 2000);
  //   resolve(2);
});

samplePromise
  .then((res) => console.log(res))
  .catch((err) => console.error(err));

promisePolyfill.resolve = (val) => {
  return new promisePolyfill((resolve, reject) => {
    resolve(val);
  });
};

promisePolyfill.reject = (val) => {
  return new promisePolyfill((resolve, reject) => {
    reject(val);
  });
};
