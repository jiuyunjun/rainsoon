// Firebase Web SDK 配置（雨临 · Rainsoon）
//
// 这些值不是密钥，本来就会出现在浏览器源码里。
// measurementId 需要在 Firebase Console 打开 Analytics 后才会生成：
//   Console → 项目设置 → 集成 → Google Analytics → 启用
//   然后在「项目设置 → 常规 → 你的应用」里复制 measurementId 填到下面。
// 留空时页面照常工作，只是不上报统计。
window.FIREBASE_CONFIG = {
  apiKey: "AIzaSyBpcljsmuPd_mWbBFVdlHNFIAqnIXkKMFg",
  authDomain: "rainsoon.firebaseapp.com",
  projectId: "rainsoon",
  storageBucket: "rainsoon.firebasestorage.app",
  messagingSenderId: "777400320052",
  appId: "1:777400320052:web:a383b220b70b935b8bca61",
  measurementId: ""
};

// 埋点缓冲：analytics.js 是 ES module，加载晚于页面主脚本。
// 先把事件排进队列，SDK 就绪后再一次性冲刷，避免丢掉早期事件。
window.__analyticsQueue = [];
window.track = function track(name, params) {
  window.__analyticsQueue.push([name, params || {}]);
};
