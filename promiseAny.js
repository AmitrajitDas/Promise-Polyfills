function any(promises) {
  let results = [];
  var counter = 0;

  return new Promise((resolve, reject) => {
    promises.forEach((p, index) => {
      p.then((result) => {
        resolve(result);
      }).catch((err) => {
        results.push(err);
        ++counter;
        if (counter === promises.length) {
          reject(results);
        }
      });
    });
  });
}
