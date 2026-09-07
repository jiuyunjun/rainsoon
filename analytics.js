// Firebase Analytics 初始化。以 ES module 加载，失败不影响主功能。
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import { getAnalytics, logEvent, isSupported } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-analytics.js";

const config = window.FIREBASE_CONFIG || {};
const hasMeasurementId = /^G-[A-Z0-9]+$/i.test(config.measurementId || "");

if (!hasMeasurementId) {
  // Console 里还没启用 Analytics。保持 window.track 为无害的空队列。
  window.analyticsEnabled = false;
  window.track = function () {};
  window.__analyticsQueue = [];
} else {
  try {
    const supported = await isSupported();
    if (!supported) throw new Error("environment not supported");

    const analytics = getAnalytics(initializeApp(config));
    window.analyticsEnabled = true;

    const send = (name, params) => {
      try { logEvent(analytics, name, params); } catch (_) {}
    };

    const queued = window.__analyticsQueue || [];
    window.track = send;
    window.__analyticsQueue = [];
    for (const [name, params] of queued) send(name, params);
  } catch (e) {
    window.analyticsEnabled = false;
    window.track = function () {};
    window.__analyticsQueue = [];
  }
}
