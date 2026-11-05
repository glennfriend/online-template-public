## 結構

- 單一 html 檔 (`index.html`), 分成兩區, 用註解標出邊界
    - 資料區: `<script type="application/json" id="screen-flow-data">`. 純 JSON, 沒有函式. 換主題只改這一段
    - 結構區: `<style>`, 空的 HTML 容器, 最後的 render `<script>`. 通用, 不含任何主題內容
- 頁面上的文字全部來自資料區; 引擎裡只有通用的 UI 字串 (`看得到`, `如果`, `回到故事` 等), 集中在 `UI_DEFAULT` 物件, 資料區可以用 `ui` 覆寫
- 載入時 `JSON.parse` 資料區, 依序畫出: 頁首與圖例, 故事, 流程索引, 參考資料, 網址索引, 接著掛上點擊事件, 最後跑自檢

## 錯誤與外部相依

- 外部相依只有 Google Fonts 的 `<link>` (Noto Sans TC, JetBrains Mono)
    - 離線或載不到時, 退回 `PingFang TC`, `Microsoft JhengHei`, `system-ui` 等系統字型, 頁面照常
    - 沒有 CDN script, 沒有其他檔案, `file://` 直接開可用
- 資料區不是合法 JSON, 或畫圖途中出錯: 頁面最上方顯示紅框錯誤訊息 (同時 `console.error`), 不留半張圖
- 自檢 (`console.warn`, 頁面照畫)
    - `網址索引缺少: [...]`: 有畫面的網址對不到任何網址索引列; 那個網址點了不會跳
    - `流程索引指到不存在的故事: [...]`: `index` 裡寫了不存在的故事 id; 那個連結不畫
    - 參考資料表格某一列的格數和 `columns` 不一樣
- 資料裡有些欄位可以寫 HTML (見下方欄位說明). 這是給作者自己用的範本, 不做 HTML 消毒; 其他欄位一律跳脫, 標籤照字面顯示
- 資料區是 html 的 `<script>`: 字串裡不能出現 `</script` 與 `<!--`. 真的要寫, 把 `<` 換成 `<` (JSON 合法跳脫, 讀進來會還原)

## 資料區欄位

```jsonc
{
  "page": {
    "title": "Cozy Mart 畫面流程地圖",    // 必, 瀏覽器分頁標題 (document.title)
    "h1": "Cozy Mart 畫面流程地圖",       // 必, 頁面大標
    "subtitle": "一句話說這張圖在畫什麼"   // 選, 大標下方的灰字; 沒寫就不顯示
  },
  "baseUrl": "www.cozymart.example",     // 必, 自己網站的主機名, 不含 https:// 與結尾 /
  "legend": [                            // 必, 圖例; 建議 5 個都寫
    { "kind": "ext",   "title": "外部網站", "text": "虛線框. ..." },
    { "kind": "ours",  "title": "我們的網站", "text": "..." },
    { "kind": "modal", "title": "彈出視窗", "text": "..." },
    { "kind": "sys",   "title": "系統自己做的事", "text": "..." },
    { "kind": "gate",  "title": "例外", "text": "..." }
  ],
  "sections": {                          // 必, 區段標題
    "index": "流程索引", "indexByEntry": "依入口", "indexByGoal": "依功能",
    "reference": "參考資料", "referenceIntro": "故事背後的規則. 需要時再展開.",  // referenceIntro 選填
    "urlIndex": "網址索引"
  },
  "ui": { "back": "↩ Back to story {id}" },   // 選, 覆寫引擎的 UI 字串, 見下方 "UI 字串"
  "groups": [ ... ],                     // 必, 故事分組, 見下方
  "index": { "byEntry": [ ... ], "byGoal": [ ... ] },   // 必, 流程索引
  "routes": [ ... ],                     // 必, 網址索引
  "reference": [ ... ]                   // 選, 參考資料; 空陣列或不寫就整區隱藏
}
```

- `legend[].kind` 決定圖示樣式, 只有這 5 種: `ext` (虛線), `ours` (實線), `modal` (雙線), `sys` (紫底), `gate` (左邊橘線)

### `groups`: 故事

```jsonc
{
  "title": "購買",                        // 必, 組名 (h2)
  "intro": "從看到商品到付完錢. ...",       // 選, 組的簡介 (依句號斷行)
  "stories": [
    {
      "id": "A",                         // 必, 不能重複; 也是錨點 #s-A
      "title": "從 Instagram 廣告進商品頁, 加入購物車並結帳",  // 必
      "short": "IG 廣告買東西",           // 選, 索引連結上的文字; 沒寫就取 title 第一個 , 或 : 前面的字
      "lane": [ 畫面, 箭頭, 分岔, ... ],   // 必, 由左到右, 自動換行
      "cond": "出現條件 (可含 HTML)",      // 下方 4 欄, 都選填; 空的那欄不畫
      "done": "完成 (純文字)",
      "next": "接著 (純文字)",
      "note": "<b>小標</b>補充 (可含 HTML)"
    }
  ]
}
```

`lane` 裡的三種東西, 用欄位區分:

```jsonc
// 畫面: 有 s
{ "s": "page",                          // 必, page (我們的網站) | modal (彈出視窗) | ext (外部網站)
  "cap": "商品頁",                       // 必, 畫面名稱
  "sub": "所有分享連結都落在這裡",          // 選, 名稱下方的灰字
  "url": "www.cozymart.example/products/{商品 id}?ref=ig",  // 必, 完整網址 (不含 https://)
  "who": "外部網站",                      // 選, 網址列右邊的標籤; 預設依 s 是 我們的網站 / 彈出視窗 / 外部網站
  "see": ["看得到的東西"],                 // 選
  "can": ["可以做的事"],                   // 選
  "pick": "加入購物車",                    // 選, 必須和 can 裡某一項完全相同, 那一項會加 ▶ 標記
  "side": [["未登入", "先跳登入視窗"]]      // 選, 例外: [如果什麼, 會怎樣]
}
// 箭頭: 有 by
{ "by": "按加入購物車", "sys": "把商品放進購物車" }   // sys 選填, 顯示成 "系統: ..."
// 分岔: 有 fork
{ "fork": "商品頁依庫存決定按鈕",
  "items": [["有庫存", "顯示 加入購物車"], ["全部缺貨", "按鈕變成 到貨通知", "bad"]] }  // 第 3 格寫 "bad" 標紅
```

- 畫面網址列顯示的是去掉 `baseUrl` 後的路徑; 外部網站顯示完整網址. 滑過去顯示完整網址
- 網址裡的 `{...}` 是佔位, 例如 `{商品 id}`, 照字面顯示

### `index`: 流程索引

```jsonc
"index": {
  "byEntry": [["搜尋引擎", ["B"]], ["Email", ["N", "H"]]],   // [列標題, [故事 id...]]
  "byGoal":  [["買東西", ["A", "A2", "E", "F"]]]
}
```

### `routes`: 網址索引

```jsonc
"routes": [
  { "title": "商品與購物車",
    "items": [
      { "path": "/products/{商品 id}",                    // 必, 自己網站的路徑 (不含 baseUrl 與 ?query)
        "desc": "商品頁. 所有分享連結都落在這裡.",           // 必, 純文字, 依句號斷行
        "params": [["ref", "從哪裡來"], ["utm_source", "廣告來源"]],   // 選, 參數清單
        "admin": true },                                  // 選, 路徑旁加 admin 標記
      { "path": "instagram.com", "match": "instagram.com", "desc": "外部網站" }   // 外部網站: 寫 match
    ] }
]
```

畫面網址怎麼對到索引列 (引擎的 `routeOf`):

- 網址以 `baseUrl` 開頭: 去掉 `baseUrl`, 去掉 `?` 與 `#` 後面, 得到路徑 (空的當成 `/`)
    - 先找 `path` 完全相同的列
    - 找不到再比對佔位: `path` 裡的 `{...}` 可以對到任何一段 (不含 `/`). 例: `/products/{商品 id}` 對得到 `/products/{id}` 和 `/products/123`
- 其他網址: 找第一個 `match` 字串出現在網址裡的列
- 都找不到: `console.warn('網址索引缺少: ...')`
- 網址索引列下方會列出用到這個網址的故事 (自動算, 不用寫)

### `reference`: 參考資料

陣列, 每一項是一個可收合的區塊 (`<details>`), 依順序畫出. `type` 決定內容:

```jsonc
[
  { "type": "issues", "summary": "發現的問題與沒確認的事", "open": true,   // open 選填, true 預設展開
    "items": [
      { "status": "confirmed", "title": "標題", "text": "說明 (可含 HTML)" },   // 紅色左線
      { "status": "open", "title": "標題", "text": "..." }                      // 橘色左線, 標題前加 "沒確認: "
    ] },
  { "type": "cards", "summary": "四種購買方式怎麼分",
    "cards": [{ "title": "立即購買", "text": "說明 (可含 HTML)" }],
    "note": "卡片下方的灰字 (選填, 可含 HTML)" },
  { "type": "table", "summary": "三種店型的差異",
    "columns": ["店型", "網址", "誰能買"],                  // 欄數自訂
    "rows": [["一般商店", "www.cozymart.example", "任何人"]] }   // 每列格數要等於欄數; 格子可含 HTML; 第一欄粗體
]
```

### 哪些欄位可以寫 HTML

- 可以: `cond`, `note`, `reference` 的 `items[].text`, `cards[].text`, `note`, `rows` 的格子. 常用 `<b>` `<code>`
- 其他欄位一律純文字 (會跳脫)
- `cond` / `note` / `items[].text` / `cards[].text` 開頭的 `<b>...</b>` 會當成小標, 放在第一行

### UI 字串

引擎內建的通用文字 (`UI_DEFAULT`), 可在資料區 `ui` 覆寫任一項, 例如做英文版:

| key | 預設 | 用在哪 |
|---|---|---|
| `whoPage` / `whoModal` / `whoExt` | 我們的網站 / 彈出視窗 / 外部網站 | 網址列右邊的預設標籤 |
| `see` / `can` | 看得到 / 可以做 | 畫面框內的小標 |
| `sideIf` / `forkIf` / `forkThen` | 如果 / 如果 / → | 例外與分岔 |
| `sys` | 系統: | 箭頭下方的系統動作 |
| `factCond` / `factDone` / `factNext` / `factNote` | 出現條件 / 完成 / 接著 / 補充 | 故事下方 4 欄 |
| `params` / `admin` | 參數 / admin | 網址索引 |
| `openIssue` | 沒確認: | 問題清單裡 `status: open` 的標題前綴 |
| `urlAria` | 完整網址 {url}, 點一下看網址索引 | 網址按鈕的 aria-label |
| `back` | ↩ 回到故事 {id} | 浮動返回按鈕 |
| `missingRoute` / `missingStory` / `loadError` | ... | 自檢與錯誤訊息 |

## 斷行規則 (`splitLines`)

說明文字依 "一行一個訊息" 顯示, 套用在: 故事下方 4 欄, 組的簡介, 參考資料的簡介, 問題清單, 比較卡片與它的 note, 網址說明

- 在 `. ` (句號加空白) 或 `; ` (分號加空白) 斷行
- 每行去掉結尾的 `.` 與 `;`, 也去掉行首殘留的 `,` `;`
- HTML 實體 (例如 `&quot;` `&amp;`) 結尾的分號不算斷句
- 開頭的 `<b>...</b>` 保留在最前面當小標
- 所以寫資料時用半形標點加空白: `第一句. 第二句; 第三句.`

## 互動

- 滑過畫面的網址列: 浮出完整網址 (CSS `:hover`; 鍵盤 focus 時也會出現)
- 點網址列: 捲到網址索引對應的那一列, 那一列閃一下 (2.4 秒); 右上角出現 `↩ 回到故事 X`
- 按 `回到故事`: 捲回剛才點的畫面框, 框閃一下, 按鈕消失
- 流程索引與網址索引的故事連結: 一般錨點 `#s-<id>`
- 系統設定 "減少動態效果" 時, 捲動不用平滑動畫
- 深色模式: 跟著 `prefers-color-scheme`; `<html data-theme="dark">` 強制深色, `data-theme="light"` 強制淺色
- 響應式: 故事裡的畫面框自動換行; 640px 以下網址索引改成單欄; 手機寬度沒有水平捲動

## 換成自己的主題

1. 複製 `index.html`
2. 改 `page`, `baseUrl`, `legend` 的文字 (例如外部網站換成你的入口)
3. 先列網址: 每個會出現在故事裡的網址, 在 `routes` 裡寫一列 (外部網站用 `match`)
4. 寫故事: 一個故事 = 一位使用者從進站到完成一件事. 畫面, 箭頭交替排; 有多種結果時用分岔
5. 寫 `index`: 依入口 (從哪裡來) 與依功能 (要做什麼) 各一組
6. 參考資料不需要可以整個拿掉
7. 雙擊打開, 開瀏覽器 console 看有沒有 `網址索引缺少` 之類的 warn

寫故事的建議:

- 畫面框只寫使用者真的看得到的東西; 系統在背後做的事寫在箭頭的 `sys`
- 每個畫面只標一個 `pick` (這個故事裡使用者按的那一個)
- 不確定的事不要畫進故事, 寫進參考資料的 `status: open`

## 範例資料

- 虛構的居家選物網站 "Cozy Mart" (`www.cozymart.example`), 所有內容都是虛構的
- 16 個故事分 5 組: 購買 (A, A2, B, C, D, E, F), 帳號 (G, H, I), 訂單 (J), 付費會員 (K, L), 廣告與其他入口 (M, N, O)
- 入口涵蓋搜尋引擎 (Google), 社群分享 (Instagram), 廣告 (Facebook), Email, 合作網站嵌入 (部落格)
- 63 個畫面框, 52 個箭頭, 6 個分岔 (2 條標紅), 35 個網址分 8 組 (3 個 admin)
- 參考資料: 5 個問題 (3 個已確認, 2 個沒確認), 4 種購買方式卡片, 3 種店型差異表

## 來歷

- 版型出自 aquarium 內部一份網站畫面流程圖 (2026-11-05), 引擎改成全部文字由資料驅動後搬到這裡, 範例換成虛構商店
