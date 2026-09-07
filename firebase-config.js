// Firebase Web SDK 配置（雨临 · Rainsoon）
//
// 这些值不是密钥，本来就会出现在浏览器源码里。
// measurementId 由 Firebase Console 启用 Google Analytics 后生成。
// 若清空它，analytics.js 会跳过初始化，页面照常工作，只是不上报统计。
window.FIREBASE_CONFIG = {
  apiKey: "AIzaSyBpcljsmuPd_mWbBFVdlHNFIAqnIXkKMFg",
  authDomain: "rainsoon.firebaseapp.com",
  projectId: "rainsoon",
  storageBucket: "rainsoon.firebasestorage.app",
  messagingSenderId: "777400320052",
  appId: "1:777400320052:web:a383b220b70b935b8bca61",
  measurementId: "G-0QD50L4QHD"
};

// 埋点缓冲：analytics.js 是 ES module，加载晚于页面主脚本。
// 先把事件排进队列，SDK 就绪后再一次性冲刷，避免丢掉早期事件。
window.__analyticsQueue = [];
window.track = function track(name, params) {
  window.__analyticsQueue.push([name, params || {}]);
};
