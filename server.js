const next = require('next');
require('async-listener');

const app = next({ dev: true });

app.prepare();
