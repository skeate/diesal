const IntervalTree = require('./lib/ds/IntervalTree.js').default;

const intervalTree = new IntervalTree();
for (let i = 0; i < 50000; i++) {
  intervalTree.insert(i, i + i, i);
}

console.log(intervalTree.size);
