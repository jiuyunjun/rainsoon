# 雨临 · Rainsoon

看一眼云的来路，知一场雨离你还有多远。

基于日本气象厅（JMA）高解像度降水临近预报（hrpns）瓦片，直接在浏览器里采样你所在位置的像素，
估算未来 0–60 分钟的降水强度，并给出雨起、雨歇、雨最盛的时刻，以及雷、疾风、长雨带的风险提示。

线上地址：https://rainsoon.lazydoglab.com

## 结构

| 文件 | 说明 |
| --- | --- |
| `index.html` | 全部界面与逻辑，无构建步骤 |
| `i18n.js` | 中日英三语字典与 `t()`，首次进入按浏览器语言，之后记住手动选择 |
| `firebase-config.js` | Firebase Web SDK 配置 + 埋点队列 shim |
| `analytics.js` | Firebase Analytics 初始化（ES module，失败不影响主功能） |
| `firebase.json` / `.firebaserc` | Firebase Hosting 配置，项目 ID `rainsoon` |
| `.github/workflows/` | push 到 main 部署 live，PR 部署 7 天预览 |

## 本地运行

定位需要 HTTPS 或 localhost，直接双击 HTML 浏览器会拒绝定位：

```bash
python -m http.server 5173
# 打开 http://localhost:5173
```

## 部署

```bash
firebase deploy --only hosting
```

或直接 push 到 `main`，由 GitHub Actions 部署（需在仓库配好 `FIREBASE_SERVICE_ACCOUNT` secret）。

## Analytics

Firebase Analytics 只在 `firebase-config.js` 里的 `measurementId` 填好（形如 `G-XXXXXXXXXX`）时才启用，
留空时页面照常工作，只是不上报。自定义事件：

| 事件 | 触发时机 |
| --- | --- |
| `locate_click` | 点击「听雨」（`method: gps`）或「从这里听雨」（`method: manual`） |
| `locate_success` / `locate_error` | 浏览器定位成功 / 失败 |
| `refresh_click` | 点击「再看一眼云」 |
| `nowcast_result` | 一次预报读取成功，带雨是否将至、几分钟后起雨、峰值强度 |
| `nowcast_error` | 预报读取失败 |
| `frame_view` | 点开某一时次的云图 |
| `lang_switch` | 右上角切换语言 |

## 多语言

中文 / 日本語 / English 三语。文案集中在 `i18n.js`，静态节点标 `data-i18n="key"`（另有
`data-i18n-alt` / `data-i18n-aria`），动态文案在各自的 render 里调 `t('key', {vars})`。

首次进入按 `navigator.languages` 选择（zh / ja / en，其余回落英文），手动切换后写入
`localStorage.rainsoon_lang` 并优先。切换语言不重新请求 JMA：`lastResults`、`lastLongRows`、
`lastHazards` 保存的是事实而非成句的文案，重跑 render 即可换语言。

加新语言：在 `window.I18N` 里加一份同名键的字典即可，右上角切换器按字典的键自动生成。

## 数据来源

日本气象厅公开雨云图层。雨势为像素估算，适合看趋势与来去，不替代正式气象警报。
