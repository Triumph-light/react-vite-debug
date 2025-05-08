# Vite 搭建 React19.x 源码调试环境

> 目前浏览器已支持 ES 模块，React19.x 后续不再提供 UMDs 文件

相关讨论

- [React remove UMDs](https://github.com/facebook/react/pull/28735)
- [Moving Vite's Node API as ESM only](https://github.com/vitejs/vite/discussions/13928)

## 初始化项目

### 手动搭建

```shell
# 创建项目
mkdir 项目名
cd 项目名

# 初始 pnpm
pnpm init
pnpm add -D vite
```

### 添加脚本

推荐使用 Node 高版本，支持 `{type: module}`

- package.json 中添加以下脚本

```json
{
  "type": "module",
  "scripts": {
    "dev": "vite dev"
    // "build": "vite build"
  }
}
```

### 入口文件

- 在根目录下创建 index.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>React Vite Debug</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

- src/main.jsx

```jsx
import * as React from "react";
import { createRoot } from "react-dom/client";
const root = createRoot(document.getElementById("root"));
const App = () => <>Hello World</>;
root.render(<App />);
```

## 运行调试

以上代码如何成功编译并能成功运行，以下为两种调试方法

### 第一种

- 根目录下创建 vite.config.js

```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  // server 可有可无，走默认配置
  server: {
    port: 1111,
  },
});
```

- 安装 @vitejs/plugin-react 或 @vitejs/plugin-react-swc
  - pnpm add -D @vitejs/plugin-react
  - pnpm add -D @vitejs/plugin-react-swc
- 直接安装 react 相关的依赖
  - pnpm add react
  - pnpm add react-dom

#### 运行

```shell
pnpm dev
```

利用 vite 编译的 react 代码在浏览器直接进行调试

![调试 1](./assets/images/react-debug1.png)

#### 总结

自行打断点，调试方法可行，但是 `react react-dom` 代码集中在同一个文件里面，对 `react` 的原理、源码分析不友好

### 第二种

#### 前提

[React Git 克隆地址](https://github.com/facebook/react)

需要用到以下文件夹

- packages/
  - react
  - react-dom
  - react-dom-bindings
  - react-client
  - react-reconciler
  - scheduler
  - shared

React 采用的是 flow 类型定义，因此需要想办法把 flow type 去除，得到 ESM 文件，可在浏览器支持引入

- 采用 flow-remove-types 对 react 源码进行 flow type 去除类型处理
  - npm i -g flow-remove-types

```shell
# 输出目录 输入目录
# --pretty 格式输出（空格替换）
flow-remove-types --pretty --out-dir packages/_react packages/react
flow-remove-types --pretty --out-dir packages/_react-dom packages/react-dom
flow-remove-types --pretty --out-dir packages/_react-dom-bindings packages/react-dom-bindings
flow-remove-types --pretty --out-dir packages/_react-client packages/react-client
flow-remove-types --pretty --out-dir packages/_react-reconciler packages/react-reconciler
flow-remove-types --pretty --out-dir packages/_react-shared packages/react-shared
flow-remove-types --pretty --out-dir packages/_react-scheduler packages/react-scheduler
```

处理完之后，自行复制相应的文件到自定义的 Vite 项目中

**注意**

`React` 源码 `build` 构建过程中做了不同环境的支持（server client react-native）

> 含有 forks 的文件夹，React 定义脚本 `yarn build` 中有做不同环境的编译处理，因此需要自行简单处理下

- packages/react-reconciler/ReactFiberConfig.js

```js
// 使用以下代码进行覆盖
// packages/react-reconciler/src/forks/ReactFiberConfig.dom.js
export * from "react-dom-bindings/src/client/ReactFiberConfigDOM";
export * from "react-client/src/ReactClientConsoleConfigBrowser";
```

#### 配置

- 创建配置文件 vite.config.js
- 安装 @vitejs/plugin-react-swc
  - pnpm add -D @vitejs/plugin-react-swc
  - 为什么不用 @vitejs/plugin-react(该插件使用 esbuild 编译，不能用 react 作为 external，看后续)

```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

const NODE_ENV = process.env.NODE_ENV;
const __DEV__ = NODE_ENV === "development";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 4321,
  },
  resolve: {
    // import react from 'react' 引用地址指向本地
    alias: [
      {
        find: /^react$/,
        replacement: path.resolve(__dirname, "./packages/_react"),
      },
      {
        find: /^react\/(.*)$/,
        replacement: path.resolve(__dirname, "./packages/_react/$1"),
      },
      {
        find: /^shared\/(.*)$/,
        replacement: path.resolve(__dirname, "./packages/_shared/$1"),
      },
      {
        find: /^react-dom$/,
        replacement: path.resolve(__dirname, "./packages/_react-dom"),
      },
      {
        find: /^react-dom\/(.*)$/,
        replacement: path.resolve(__dirname, "./packages/_react-dom/$1"),
      },
      {
        find: /^react-dom-bindings\/(.*)$/,
        replacement: path.resolve(
          __dirname,
          "./packages/_react-dom-bindings/$1"
        ),
      },
      {
        find: /^react-reconciler\/(.*)$/,
        replacement: path.resolve(__dirname, "./packages/_react-reconciler/$1"),
      },
      {
        find: /^react-client\/(.*)$/,
        replacement: path.resolve(__dirname, "./packages/_react-client/$1"),
      },
      {
        find: /^scheduler$/,
        replacement: path.resolve(__dirname, "./packages/_scheduler"),
      },
    ],
    preserveSymlinks: true,
  },
  optimizeDeps: {
    // 这里是为了 vite 提前编译，运行需要 ReactSharedInternal 变量对象（提前声明）
    include: ["shared/ReactSharedInternals"],
    // react 不需要编译
    // 使用 @vitejs/plugin-react，此处配置不支持，报错
    exclude: ["react"],
  },
  // React 源码当中有很多提前定义的环境变量
  define: {
    __DEV__,
    __EXPERIMENTAL__: true,
    __EXTENSION__: false,
    __PROFILE__: false,
    __TEST__: NODE_ENV === "test",
    __IS_CHROME__: false,
    __IS_FIREFOX__: false,
    __IS_EDGE__: false,
    __IS_NATIVE__: false,
  },
});
```

#### 运行

```shell
pnpm dev
```

![调试 2](./assets/images/react-debug2.png)

#### 总结

- 可直接对 React 仓库源码进行调试，原理分析明确
  - fiber
  - scheduler 优先级调度
  - reconciler 协调
  - dom
  - ...

## 参考

- [遇到运行调试问题，可直接参考使用此项目](https://github.com/LIUeng/react-vite-debug)
- [React19 详细解读](https://github.com/LIUeng/react-parse/tree/main/src/docs19)

## 附

### 使用 VScode 运行检查 React 源码项目

React 使用 flow 语言定义类型

#### 前置

- 禁用内置的 vscode 插件
  - @builtin TypeScript and JavaScript Language Features
- 下载支持 Flow 类型检查插件
  - [Flow Language Support](https://marketplace.visualstudio.com/items/?itemName=flowtype.flow-for-vscode)

#### 运行

Flow 类型检查插件需要在根目录下定义 .flowconfig 配置文件，而 React 源码中提供了 flow 相关的脚本

```json
{
  "scripts": {
    "flow": "node ./scripts/tasks/flow.js",
    "flow-ci": "node ./scripts/tasks/flow-ci.js"
  }
}
```

```shell
yarn install

# yarn flow 命令列表
# yarn flow dom 生成 .flowconfig 配置文件
yarn flow dom
```

至此可以使用 vscode flow 插件进行文件检查，类型定义跳转
