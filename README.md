# 雨临 · Rainsoon

看一眼云的来路，知一场雨离你还有多远。

基于日本气象厅（JMA）高解像度降水临近预报（hrpns）瓦片，直接在浏览器里采样你所在位置的像素，
估算未来 0–60 分钟的降水强度，并给出雨起、雨歇、雨最盛的时刻，以及雷、疾风、长雨带的风险提示。

线上地址：https://rainsoon.lazydoglab.com

## 结构

| 文件 | 说明 |
| --- | --- |
| `index.html` | 主界面与预报逻辑，无构建步骤 |
| `cloud-view.js` / `cloud-view.css` | 高分辨率云层质感、经纬度轴、比例尺与越框显示 |
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

## 数据来源与瓦片层级

点击预报时次可查看云图：默认将降水覆盖渲染为 1024×1024 的柔和云层，边缘适度延伸至装饰框外。
横轴为经度，纵轴为纬度，公里比例尺按瓦片中心纬度计算，并随界面宽度调整。
底图采用[国土地理院白地图](https://maps.gsi.go.jp/development/ichiran.html)，以深蓝底、低对比岸线和行政边界呈现，与降水瓦片使用相同的 XYZ / Web Mercator 范围。
手机使用同级瓦片，宽屏拼接四张下一级瓦片；底图独立加载，失败不影响云图。云层浓度滑杆可调至 0% 查看地图。
「查看原始降水图」可对照原始彩色瓦片。云层纹理是程序化的视觉表达，不增加气象数据精度；降雨判断仍采样原始瓦片。
云团厚度和不透明度随降水强度增加：弱雨呈薄雾，强雨形成隆起云团。固定种子的圆润云团、左上方受光与邻近云团遮阴提供体积感，地理位置不偏移；厚度不表示实际云高。滑杆仅控制整层可见度。
云上叠加两层随降水覆盖生成的轻雾，以 14 / 21 秒不同周期缓慢飘散和淡入淡出；仅动画变换与透明度，不逐帧重绘云团。雾气为装饰动效，不代表预报风向；切换原图或隐藏页面时暂停，系统减少动态效果时静止显示。

雨云、雷、龙卷都没有「给经纬度返回数值」的接口，只发布为 Web Mercator 瓦片（EPSG:3857，
与 OSM 同一套网格）。`tileFor()` 把经纬度换算成瓦片编号与瓦片内像素，再读像素颜色反推雨量，
颜色对照表 `RAIN_PALETTE` 取自官方图例 `/bosai/nowc/images/legend_en_normal_hrpns.svg`。

各图层的瓦片层级不同，取自官方配置 `/bosai/nowc/table/nowc.properties__*.xml`：

| 图层 | 官方 maxNativeZoom | 本项目实际使用 | 说明 |
| --- | --- | --- | --- |
| `hrpns` 降水 | 10 | `ZOOM = 10` | z=10 之上（z≤14）由客户端拉伸，无新信息 |
| `thns` 雷 | 9 | `HAZARD_ZOOM = 8` | 实测 z=9 一律空图，z=8 才有数据 |
| `trns` 龙卷 | 9 | `HAZARD_ZOOM = 8` | 同上 |
| `slmcs` 线状降水带 | — | — | GeoJSON 多边形，非瓦片 |

z=10 时一个像素约 125 m（北纬 35 度），一张瓦片约 32 km 见方；源数据本身是 250 m 网格。

## 数据来源

日本气象厅公开雨云图层。雨势为像素估算，适合看趋势与来去，不替代正式气象警报。
