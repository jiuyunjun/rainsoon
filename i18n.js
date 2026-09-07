// i18n.js — 雨临 Rainsoon 中日英三语字典
//
// 品牌名「雨临 / RAINSOON」三语一致，不作翻译。
// 译文求禅意与诗意，不逐字对译：中文重「云与雨的往来」，
// 日文取俳句式的留白，英文用短句与具体意象，避免播报腔。
window.I18N = {
  zh: {
    lang_name: "中文",
    lang_short: "中",
    html_lang: "zh-CN",
    doc_title: "雨临 · Rainsoon — 雨还有多久到你这里",
    doc_desc: "雨临 Rainsoon：基于日本气象厅高解像度降水临近预报，看未来一小时雨云的来路与去向，知道一场雨离你还有多远。",

    brand_sub: "看一眼云的来路，知一场雨离你还有多远。",
    byline: "by lazydoglab",

    btn_locate: "听雨",
    btn_locate_note: "寻你此刻所在",
    btn_refresh: "再看一眼云",
    btn_refresh_note: "留在原地，只换新云图",
    btn_manual: "从这里听雨",
    btn_manual_note: "改用上面填的坐标",
    label_lat: "纬度 latitude",
    label_lon: "经度 longitude",

    pill_location_unknown: "此刻所在：未知",
    pill_location_gps: "此刻所在：±{m}m",
    pill_location_manual: "此刻所在：手动坐标",
    pill_basetime_unread: "云图时刻：未读",
    pill_basetime: "云图时刻：{time}",

    headline_idle: "云还未说话",
    detail_idle: "让位置与云相遇，答案自然会来。",
    headline_listening: "正在听云…",
    detail_listening: "云在远处，也在靠近。",
    headline_locating: "获取定位中…",
    headline_no_geo: "浏览器不支持定位",
    headline_locate_failed: "定位失败",
    detail_locate_failed: "{msg}。也可以手动填入经纬度。",
    headline_error: "读取失败",
    detail_error_hint: "若细节里出现 CORS / Failed to fetch，是 JMA 当前端点不允许浏览器直接读取像素。",
    alert_bad_coords: "请输入有效经纬度",

    headline_rain_stops_in: "雨正落着，约 {mins} 分钟后歇",
    detail_rain_stops_in: "此刻雨势约 {mm} mm/h，{time} 前后，云会松手。",
    headline_rain_lingers: "雨落着，一时未歇",
    detail_rain_ends_rough: "此刻雨势约 {mm} mm/h。一小时内不见停歇，远处云图约在 {time} 前后转晴——远处看得粗，只作参照。",
    detail_rain_no_end: "此刻雨势约 {mm} mm/h。往后六小时的云图里，还望不见雨歇。",
    headline_raining_now: "雨已在身边",
    detail_raining_unknown_end: "此刻雨势约 {mm} mm/h，雨歇之时，还在望云。",
    headline_rain_in: "雨，约 {mins} 分钟后到",
    detail_rain_in: "大约在 {time}，第一阵雨意会落到这里。",
    headline_dry: "一小时内，雨还不会来",
    detail_dry: "此刻云路平静，可以慢一点。",
    headline_unknown: "云意未明",
    detail_unknown: "这一刻没能听清云的回答。",
    detail_frames_missing: " 有几段云图暂时失语。",

    tl_now: "此刻",
    tl_ahead: "+{mins} min",
    tl_no_rain: "— 无雨",
    tl_failed: "⚠️ 失败",
    tl_title_now: "此刻的实况云图",
    tl_title_forecast: "点击查看预测图",

    card_summary_title: "雨意将至",
    sum_k_start: "雨起",
    sum_k_end: "雨歇",
    sum_k_peak: "雨最盛",
    sum_k_peak_time: "最盛之时",
    sum_start_val: "{time}（约{mins}分后）",
    sum_start_now: "{time}（此刻已在下）",
    sum_no_rain_hour: "一小时内无雨",
    sum_rain_beyond: "一小时后仍有雨",

    risk_thunder: "远雷",
    risk_wind: "疾风",
    risk_band: "长雨带",
    risk_waiting: "静候",
    hz_unknown: "云意未明",
    hz_thunder_at: "雷声或在 {time} 靠近",
    hz_thunder_none: "一小时内无雷意",
    hz_wind_at: "疾风风险约在 {time}",
    hz_wind_none: "一小时内风势平静",
    hz_band_hit: "长雨带正覆过这里",
    hz_band_none: "此刻不在长雨带中",

    card_long_title: "再往后的雨",
    long_note: "眼前一小时看雨云，远处几小时看雨势。数据若暂不可得，这一栏会安静地留白。",
    long_pending: "远处的云，还在路上。",
    long_no_rain: "— 无雨",
    long_no_data: "暂无数据",

    card_chart_title: "雨势起伏",
    chart_note_default: "每五分钟取一眼雨云，再把零散的雨意连成一条缓缓起伏的线。",
    chart_note_peak: "把每五分钟的雨意轻轻连起来。最盛约 {mm} mm/h，落在 {time}。",
    chart_aria: "降水强度曲线",
    chart_empty: "暂无可绘制数据",
    chart_threshold: "雨意阈值 {mm} mm/h",
    chart_axis: "往后一小时",

    diag_title: "看不见的细节",

    modal_title_default: "这一刻的云",
    modal_title: "{time} 的云",
    modal_close: "关闭",
    modal_img_alt: "雨临 · 降水云图",
    modal_k_time: "时刻",
    modal_k_rain: "雨意",
    modal_k_loc: "位置",
    modal_k_layer: "云图",
    modal_k_tile: "Tile",
    modal_state_rain: "估算降水强度约 {mm} mm/h",
    modal_state_dry: "未检测到可判定降水",
    modal_state_fail: "该帧读取失败",
    modal_tile_val: "{x}/{y}，当前位置像素约 {px},{py}",

    footer: "云图取自日本气象厅（JMA）的高解像度降水临近预报。雨势由公开雨云图层估算而来，适合看趋势与来去，不替代正式气象警报。",
  },

  ja: {
    lang_name: "日本語",
    lang_short: "日",
    html_lang: "ja",
    doc_title: "雨临 · Rainsoon — 雨はあとどれくらいで届くか",
    doc_desc: "雨临 Rainsoon：気象庁の高解像度降水ナウキャストから、この先一時間の雨雲の来し方と行方を読み、雨がどれほど近いかを知る。",

    brand_sub: "雲の来し方を見て、雨がどれほど近いかを知る。",
    byline: "by lazydoglab",

    btn_locate: "雨を聴く",
    btn_locate_note: "いまいる場所を探す",
    btn_refresh: "もう一度雲を見る",
    btn_refresh_note: "その場のまま、雲だけ新しく",
    btn_manual: "ここから聴く",
    btn_manual_note: "上の座標を使う",
    label_lat: "緯度 latitude",
    label_lon: "経度 longitude",

    pill_location_unknown: "いまいる場所：不明",
    pill_location_gps: "いまいる場所：±{m}m",
    pill_location_manual: "いまいる場所：手入力の座標",
    pill_basetime_unread: "雲図の時刻：未取得",
    pill_basetime: "雲図の時刻：{time}",

    headline_idle: "雲はまだ語らない",
    detail_idle: "場所と雲が出会えば、答えはおのずと。",
    headline_listening: "雲に耳を澄ませています…",
    detail_listening: "雲は遠く、そして近づいて。",
    headline_locating: "現在地を取得中…",
    headline_no_geo: "このブラウザは位置情報に対応していません",
    headline_locate_failed: "位置を取得できません",
    detail_locate_failed: "{msg}。緯度・経度を手で入れることもできます。",
    headline_error: "読み取れません",
    detail_error_hint: "詳細に CORS / Failed to fetch が出る場合、気象庁の該当エンドポイントがブラウザからの画素読み取りを許していません。",
    alert_bad_coords: "有効な緯度・経度を入力してください",

    headline_rain_stops_in: "雨が降っています。あと {mins} 分ほどで止みます",
    detail_rain_stops_in: "いまの雨脚はおよそ {mm} mm/h。{time} のころ、雲は手をゆるめます。",
    headline_rain_lingers: "雨は、まだ止みません",
    detail_rain_ends_rough: "いまの雨脚はおよそ {mm} mm/h。一時間のうちに止み間はなく、遠くの雲図では {time} ごろに晴れていきます——遠くは粗く見えるもの、目安として。",
    detail_rain_no_end: "いまの雨脚はおよそ {mm} mm/h。この先六時間の雲図に、止み間は見えません。",
    headline_raining_now: "雨は、すぐそばに",
    detail_raining_unknown_end: "いまの雨脚はおよそ {mm} mm/h。止む時刻は、まだ雲を見ています。",
    headline_rain_in: "雨、あと {mins} 分ほどで届きます",
    detail_rain_in: "{time} のころ、最初のひと雨がここに落ちてきます。",
    headline_dry: "一時間のうちに、雨は来ません",
    detail_dry: "いま雲の道は静か。少しゆっくりでも。",
    headline_unknown: "雲の意は読めません",
    detail_unknown: "この一瞬、雲の返事は聴き取れませんでした。",
    detail_frames_missing: " いくつかの雲図が、いま黙っています。",

    tl_now: "いま",
    tl_ahead: "+{mins} 分",
    tl_no_rain: "— 雨なし",
    tl_failed: "⚠️ 失敗",
    tl_title_now: "いまの実況雲図",
    tl_title_forecast: "クリックで予測図を見る",

    card_summary_title: "雨の兆し",
    sum_k_start: "降り出し",
    sum_k_end: "止み間",
    sum_k_peak: "雨の盛り",
    sum_k_peak_time: "盛りの時刻",
    sum_start_val: "{time}（約{mins}分後）",
    sum_start_now: "{time}（いま降っています）",
    sum_no_rain_hour: "一時間のうちに雨なし",
    sum_rain_beyond: "一時間の先も雨",

    risk_thunder: "遠雷",
    risk_wind: "突風",
    risk_band: "長雨の帯",
    risk_waiting: "静かに待つ",
    hz_unknown: "雲の意は読めません",
    hz_thunder_at: "雷鳴は {time} ごろに近づくかも",
    hz_thunder_none: "一時間のうちに雷の気配なし",
    hz_wind_at: "突風のおそれは {time} ごろ",
    hz_wind_none: "一時間のうちに風は穏やか",
    hz_band_hit: "長雨の帯が、ここを覆っています",
    hz_band_none: "いま長雨の帯の中にはいません",

    card_long_title: "その先の雨",
    long_note: "手前の一時間は雨雲を、遠くの数時間は雨の勢いを。データが届かないときは、この欄は静かに空きます。",
    long_pending: "遠くの雲は、まだ道の途中。",
    long_no_rain: "— 雨なし",
    long_no_data: "データなし",

    card_chart_title: "雨脚の起伏",
    chart_note_default: "五分ごとに雨雲をひと目見て、散らばる雨の兆しを、ゆるやかな一本の線に。",
    chart_note_peak: "五分ごとの雨の兆しを、そっとつないで。盛りは約 {mm} mm/h、{time} のころ。",
    chart_aria: "降水強度の推移",
    chart_empty: "描けるデータがありません",
    chart_threshold: "雨の閾値 {mm} mm/h",
    chart_axis: "この先一時間",

    diag_title: "見えないところ",

    modal_title_default: "この一瞬の雲",
    modal_title: "{time} の雲",
    modal_close: "閉じる",
    modal_img_alt: "雨临 · 降水雲図",
    modal_k_time: "時刻",
    modal_k_rain: "雨の兆し",
    modal_k_loc: "位置",
    modal_k_layer: "雲図",
    modal_k_tile: "Tile",
    modal_state_rain: "推定降水強度 約 {mm} mm/h",
    modal_state_dry: "判定できる降水は見られません",
    modal_state_fail: "このコマは読み取れません",
    modal_tile_val: "{x}/{y}、現在地の画素は約 {px},{py}",

    footer: "雲図は気象庁（JMA）の高解像度降水ナウキャストによります。雨脚は公開雨雲レイヤーからの推定で、流れと来し方を見るためのもの。正式な気象警報に代わるものではありません。",
  },

  en: {
    lang_name: "English",
    lang_short: "EN",
    html_lang: "en",
    doc_title: "雨临 · Rainsoon — how far off the rain still is",
    doc_desc: "Rainsoon reads the Japan Meteorological Agency's high-resolution nowcast to show where the rain clouds come from over the next hour, and how far off the rain still is.",

    brand_sub: "Read where the clouds come from, and know how far the rain still is.",
    byline: "by lazydoglab",

    btn_locate: "Listen for rain",
    btn_locate_note: "find where you are now",
    btn_refresh: "Look at the clouds again",
    btn_refresh_note: "stay put, refresh the clouds only",
    btn_manual: "Listen from here",
    btn_manual_note: "use the coordinates above",
    label_lat: "Latitude",
    label_lon: "Longitude",

    pill_location_unknown: "Where you are: unknown",
    pill_location_gps: "Where you are: ±{m}m",
    pill_location_manual: "Where you are: entered by hand",
    pill_basetime_unread: "Cloud image: not yet read",
    pill_basetime: "Cloud image: {time}",

    headline_idle: "The clouds have not spoken",
    detail_idle: "Let a place meet the clouds, and the answer comes on its own.",
    headline_listening: "Listening to the clouds…",
    detail_listening: "The clouds are far, and drawing near.",
    headline_locating: "Finding where you are…",
    headline_no_geo: "This browser cannot share a location",
    headline_locate_failed: "Could not find you",
    detail_locate_failed: "{msg}. You can also type a latitude and longitude.",
    headline_error: "Could not read the sky",
    detail_error_hint: "If the details show CORS / Failed to fetch, the JMA endpoint is not letting the browser read its pixels directly.",
    alert_bad_coords: "Please enter a valid latitude and longitude",

    headline_rain_stops_in: "Rain is falling — easing in about {mins} min",
    detail_rain_stops_in: "About {mm} mm/h right now. Around {time}, the clouds loosen their hold.",
    headline_rain_lingers: "Rain is falling, and not yet done",
    detail_rain_ends_rough: "About {mm} mm/h right now. No break within the hour; the distant clouds clear around {time} — far things are seen coarsely, take it as a hint.",
    detail_rain_no_end: "About {mm} mm/h right now. In the next six hours of cloud, no break comes into view.",
    headline_raining_now: "The rain is already here",
    detail_raining_unknown_end: "About {mm} mm/h right now. When it eases, the clouds have yet to say.",
    headline_rain_in: "Rain, in about {mins} min",
    detail_rain_in: "Around {time}, the first of it reaches here.",
    headline_dry: "No rain within the hour",
    detail_dry: "The cloud paths are quiet. You can take your time.",
    headline_unknown: "The clouds are unclear",
    detail_unknown: "This moment, their answer did not come through.",
    detail_frames_missing: " A few cloud frames have gone quiet.",

    tl_now: "now",
    tl_ahead: "+{mins} min",
    tl_no_rain: "— no rain",
    tl_failed: "⚠️ failed",
    tl_title_now: "the sky as it is now",
    tl_title_forecast: "click to see the forecast frame",

    card_summary_title: "What the rain intends",
    sum_k_start: "Begins",
    sum_k_end: "Eases",
    sum_k_peak: "Heaviest",
    sum_k_peak_time: "At",
    sum_start_val: "{time} (in ~{mins} min)",
    sum_start_now: "{time} (falling now)",
    sum_no_rain_hour: "no rain within the hour",
    sum_rain_beyond: "still raining past the hour",

    risk_thunder: "Distant thunder",
    risk_wind: "Sudden wind",
    risk_band: "Long rain band",
    risk_waiting: "waiting quietly",
    hz_unknown: "the clouds are unclear",
    hz_thunder_at: "thunder may draw near around {time}",
    hz_thunder_none: "no thunder within the hour",
    hz_wind_at: "gust risk around {time}",
    hz_wind_none: "winds stay calm within the hour",
    hz_band_hit: "a long rain band is passing over",
    hz_band_none: "not under a rain band now",

    card_long_title: "The rain further out",
    long_note: "The hour ahead reads the rain clouds; the hours beyond read the rain's weight. When data does not arrive, this stays quietly empty.",
    long_pending: "The distant clouds are still on their way.",
    long_no_rain: "— no rain",
    long_no_data: "no data",

    card_chart_title: "How the rain rises and falls",
    chart_note_default: "A glance at the rain clouds every five minutes, drawn into one slowly rising and falling line.",
    chart_note_peak: "Every five minutes, gently joined. Heaviest about {mm} mm/h, around {time}.",
    chart_aria: "Rainfall intensity over time",
    chart_empty: "Nothing to draw yet",
    chart_threshold: "rain threshold {mm} mm/h",
    chart_axis: "the hour ahead",

    diag_title: "What goes unseen",

    modal_title_default: "The clouds, this moment",
    modal_title: "The clouds at {time}",
    modal_close: "Close",
    modal_img_alt: "Rainsoon · rainfall cloud image",
    modal_k_time: "Time",
    modal_k_rain: "Rain",
    modal_k_loc: "Where",
    modal_k_layer: "Layer",
    modal_k_tile: "Tile",
    modal_state_rain: "estimated about {mm} mm/h",
    modal_state_dry: "no measurable rain detected",
    modal_state_fail: "this frame could not be read",
    modal_tile_val: "{x}/{y}, your pixel about {px},{py}",

    footer: "Cloud images come from the Japan Meteorological Agency's high-resolution precipitation nowcast. Intensity is estimated from public rain-cloud layers — good for reading the drift and the timing, not a substitute for official warnings.",
  },
};

// 首次进入按浏览器语言（navigator.language）选择；之后记住手动切换的结果。
window.detectLang = function detectLang(){
  try{
    const saved = localStorage.getItem("rainsoon_lang");
    if(saved && window.I18N[saved]) return saved;
  }catch(_){}
  const langs = (navigator.languages && navigator.languages.length)
    ? navigator.languages
    : [navigator.language || "en"];
  for(const raw of langs){
    const l = String(raw).toLowerCase();
    if(l.startsWith("zh")) return "zh";
    if(l.startsWith("ja")) return "ja";
    if(l.startsWith("en")) return "en";
  }
  return "en";
};

window.LANG = window.detectLang();

// t('key', {mins: 5}) —— 缺失的键回落到英文，再回落到键名本身。
window.t = function t(key, vars){
  const dict = window.I18N[window.LANG] || window.I18N.en;
  let s = dict[key];
  if(s === undefined) s = window.I18N.en[key];
  if(s === undefined) return key;
  if(vars) for(const k in vars) s = s.split("{" + k + "}").join(vars[k]);
  return s;
};
