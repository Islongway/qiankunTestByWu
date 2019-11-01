/**
 * @author Kuitos
 * @since 2019-05-16
 */

// import React from 'react';
// import ReactDOM from 'react-dom';
import fetch from 'isomorphic-fetch';
import Vue from 'vue';
import { registerMicroApps, runAfterFirstMounted, setDefaultMountApp, start } from '../../dist/index.esm';
// import Framework from './Framework';
import Framework from './Framework.vue';

let app = null;

function render({ appContent, loading }) {
  /*
  examples for vue
   */
  if (!app) {
    app = new Vue({
      el: '#container',
      data() {
        return {
          content: appContent,
          loading,
        };
      },
      render(h) {
        return h(Framework, {
          props: {
            content: this.content,
            loading: this.loading,
          },
        });
      },
    });
  } else {
    app.content = appContent;
    app.loading = loading;
  }

  // 渲染一个 React 元素到由 container 提供的 DOM 中，并且返回组件的一个 引用
  // const container = document.getElementById('container');
  // ReactDOM.render(<Framework loading={loading} content={appContent}/>, container);
}

function genActiveRule(routerPrefix) {
  return location => location.pathname.startsWith(routerPrefix);
}

render({ loading: true });

// 支持自定义获取请参阅: https://github.com/kuitos/import-html-entry/blob/91d542e936a74408c6c8cd1c9eebc5a9f83a8dc0/src/index.js#L163
const request = url =>
  fetch(url, {
    referrerPolicy: 'origin-when-cross-origin',
  });

registerMicroApps(
  [
    { name: 'react app', entry: '//localhost:7100', render, activeRule: genActiveRule('/main_vue') },
    { name: 'react15 app', entry: '//localhost:7102', render, activeRule: genActiveRule('/15react15') },
    { name: 'vue app', entry: '//localhost:7101', render, activeRule: genActiveRule('/vue') },
    { name: 'wu_vue app', entry: '//localhost:7103', render, activeRule: genActiveRule('/wu_vue') },
    { name: 'microvue app', entry: '//localhost:7104', render, activeRule: genActiveRule('/microvue') },
  ],
  {
    beforeLoad: [
      app => {
        console.log('before load', app);
      },
    ],
    beforeMount: [
      app => {
        console.log('before mount', app);
      },
    ],
    afterUnmount: [
      app => {
        console.log('after unload', app);
      },
    ],
  },
  {
    fetch: request,
  },
);

setDefaultMountApp('/main_vue');
runAfterFirstMounted(() => console.info('first app mounted'));

start({ prefetch: true, fetch: request });