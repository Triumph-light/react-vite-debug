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
    include: ["shared/ReactSharedInternals"],
    exclude: ["react"],
  },
  // build: {
  // 生产模式不必要
  // production unnecessary
  // },
  define: {
    __DEV__,
    __EXPERIMENTAL__: true,
    __EXTENSION__: false,
    __PROFILE__: false,
    __TEST__: NODE_ENV === "test",
    // TODO: Should this be feature tested somehow?
    __IS_CHROME__: false,
    __IS_FIREFOX__: false,
    __IS_EDGE__: false,
    __IS_NATIVE__: false,
  },
});
