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

const task1 = () => {
  return new promisePolyfill((resolve, reject) => {
    setTimeout(() => {
      resolve("Task 1 resolved");
    }, 1000);
  });
};

const task2 = () => {
  return new promisePolyfill((resolve, reject) => {
    setTimeout(() => {
      resolve("Task 2 resolved");
    }, 1000);
  });
};

const task3 = () => {
  return new promisePolyfill((resolve, reject) => {
    setTimeout(() => {
      resolve("Task 3 resolved");
    }, 1000);
  });
};

promisePolyfill.allPolyfill = (promises) => {
  return new Promise((resolve, reject) => {
    const results = [];

    if (!promises.length) {
      resolve(results);
      return;
    }

    let pending = promises.length;

    promises.forEach((promise, index) => {
      Promise.resolve(promise).then((res) => {
        results[index] = res;
        pending--;

        if (pending === 0) {
          resolve(results);
        }
      }, reject);
    });
  });
};

promisePolyfill
  .allPolyfill([task1(), task2(), task3()])
  .then((res) => console.log(res))
  .catch((err) => console.error("Failed:", err));
