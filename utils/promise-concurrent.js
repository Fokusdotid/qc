function promiseAllStepN(n, list) {
    let processed = 0;
    const resolved = [];

    const tail = list.splice(n);
    const head = list;

    return new Promise(resolve => {
        head.forEach(x => {
            const res = x();
            resolved.push(res);
            res.then(y => {
                runNext();
                return y;
            });
        });

        function runNext() {
            /* eslint-disable eqeqeq */
            if (processed == tail.length) {
                resolve(Promise.all(resolved));
            } else {
                resolved.push(tail[processed]().then(x => {
                    runNext();
                    return x;
                }));

                processed++;
            }
        }
    });
};

export default n => list => promiseAllStepN(n, list);
