# next.js-async-listener-reproduction

This is a minimal reproduction of an issue with Next.js, custom servers, Webpack 5, and `async-listener`. The corresponding issue is: https://github.com/vercel/next.js/issues/27792

## Issue

[Importing `aysnc-listener` in a custom Next.js server](https://github.com/danoc/next.js-async-listener-reproduction/blob/fe0ec92bdc64b1449257ff7c3410aa3327eeceec/server.js#L2) on a project that uses Webpack 5 will throw the following error:

```
info  - Using webpack 5. Reason: Enabled by default https://nextjs.org/docs/messages/webpack5
(node:6406) UnhandledPromiseRejectionWarning: Error: Unexpected lazy element in stream
    at readU8 (~/next-repro/node_modules/next/dist/compiled/webpack/bundle5.js:121549:11)
    at BinaryMiddleware._deserialize (~/next-repro/node_modules/next/dist/compiled/webpack/bundle5.js:121842:20)
    at BinaryMiddleware.deserialize (~/next-repro/node_modules/next/dist/compiled/webpack/bundle5.js:121454:15)
    at Serializer.deserialize (~/next-repro/node_modules/next/dist/compiled/webpack/bundle5.js:123401:26)
    at PackFileCacheStrategy._openPack (~/next-repro/node_modules/next/dist/compiled/webpack/bundle5.js:77661:5)
    at new PackFileCacheStrategy (~/next-repro/node_modules/next/dist/compiled/webpack/bundle5.js:77633:27)
    at WebpackOptionsApply.process (~/next-repro/node_modules/next/dist/compiled/webpack/bundle5.js:73976:9)
    at createCompiler (~/next-repro/node_modules/next/dist/compiled/webpack/bundle5.js:141356:28)
    at ~/next-repro/node_modules/next/dist/compiled/webpack/bundle5.js:141319:48
    at Array.map (<anonymous>)
(node:6406) UnhandledPromiseRejectionWarning: Unhandled promise rejection. This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was not handled with .catch(). To terminate the node process on unhandled promise rejection, use the CLI flag `--unhandled-rejections=strict` (see https://nodejs.org/api/cli.html#cli_unhandled_rejections_mode). (rejection id: 1)
(node:6406) [DEP0018] DeprecationWarning: Unhandled promise rejections are deprecated. In the future, promise rejections that are not handled will terminate the Node.js process with a non-zero exit code.
(node:6406) UnhandledPromiseRejectionWarning: Error: ENOENT: no such file or directory, stat '~/next-repro/.next/cache/webpack/client-development/index.pack'
(node:6406) UnhandledPromiseRejectionWarning: Unhandled promise rejection. This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was not handled with .catch(). To terminate the node process on unhandled promise rejection, use the CLI flag `--unhandled-rejections=strict` (see https://nodejs.org/api/cli.html#cli_unhandled_rejections_mode). (rejection id: 2)
```

I stumbled upon this when trying to integrate Next.js into a codebase that uses `zipkin-context-cls`. `zipkin-context-cls` depends on `continuation-local-storage` which itself depends on `async-listener`.

This fails with both Node 12 and 14.

## Reproduction

Clone this codebase then:

```bash
yarn install
node server.js
```

Notice that commenting out [the problematic line](https://github.com/danoc/next.js-async-listener-reproduction/blob/aa9adc171aa03c38acede2a2f69a73e9f5204ce5/server.js#L2) or [using Webpack 4](https://github.com/danoc/next.js-async-listener-reproduction/blob/1e318279dbf25a61822e1195a0728571ae7bf72b/next.config.js#L3) makes the error go away. Also, this error only appears when `next({ dev: true })`. The issue does not appear in production builds.
