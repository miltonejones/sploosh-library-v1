const write = (text, now) => {
  const diff = new Date().getTime() - now;
  console.log("%d: %s", Math.floor(diff / 1000), text);
};

function PromiseChain(promises) {
  const now = new Date().getTime();
  const results = [];
  return new Promise((callback) => {
    const run = () => {
      if (!promises.length) {
        write(`PROMISES COMPLETE!`, now);
        return callback(results);
      }
      write(`running promise ${promises.length}...`, now);
      promises.shift().then(send).catch(send);
    };
    const send = (result) => {
      results.push(result);
      write(`saving result ${results.length}...`, now);
      run();
    };
    run();
  });
}

export { PromiseChain };
