## 結構

- 單一 html 檔 (`index.html`), 分成兩區, 用註解標出邊界
    - 資料區: `<script type="application/json" id="holiday-data">`. 純 JSON, 所有內容. 換年份/換地區只改這一段
    - 結構區: 結構 + 主題 (`<style>`)、引擎 (最後的 `<script>`), 不含任何假期內容
- 引擎分 7 段, 依序是: 錯誤顯示、讀取資料區 (`JSON.parse`)、資料檢查與攤平、格式 (純計算)、狀態與動作、模組、啟動
- 模組: 標題、格式分頁、日期排序、格式內容、資料來源
    - 每個模組是 `{ name, el, update }`, `update` 只讀 `state`
    - 改變狀態一律呼叫 `actions` (`setTab` / `setSort`), 再由 `render()` 通知所有模組
    - 模組之間不直接互相呼叫

## 錯誤與外部相依

- 沒有其他檔案: 資料區缺失, 或不是合法 JSON, 就在頁面最上方顯示錯誤並指出 `#holiday-data`
- Google Fonts: 載不到時改用系統字型, 不影響功能
- 資料區載入時逐項檢查 (日期格式、`days`、`type`、`sources`); 有錯的項目略過, 並在頁面最上方逐條列出
- 每個模組都包在 `guard()` 裡: 某個模組出錯, 只有那一塊顯示錯誤, 其他模組照常
- 資料區是 html 的 `<script>`: 字串裡不能出現 `</script` 與 `<!--`. 真的要寫, 把 `<` 換成 `\u003c`

## 換資料 (資料區 `#holiday-data`)

- `regions`: 順序 = 顯示順序; 同一天有多筆時也照這個順序
    - `prefix`: 合併區塊加在說明前面 (假期 `{prefix}假期 `, 資訊日 `{prefix} `), 不寫就不加
- `events`
    - `date`: `"YYYY-MM-DD"`, 星期幾由引擎算
    - `name`: 假期名稱; `note`: 補充說明, 引擎包成 ` (note)`
    - `days`: 連假天數, 只寫第一天, 不逐日展開; 不寫 = 1
    - `type: "info"`: 非放假的資訊日 (例如夏令時間切換)
    - 補班日不放
- `sources`: `{ label, url }`, 列在頁面最後

## 格式規則

- TSV: `日期<tab>星期<tab>說明`, 連假逐日展開; 第一天寫完整說明 (`名稱 (note) 放假N天`), 第二天起只寫名稱
- 純文字 calendar: 一行一假期, `日期<tab>名稱 (note) 放假N天 起~訖`
- Markdown table: 一行一假期, 欄位 日期/星期/地區/說明/天數
- 符號一律半形; `(` 前、`)` 後各空一格 (由 `noted()` 統一組字)
- 新增格式: 在 `FORMATS` 加一個函式 (收 `events`, 排序方向), 再到 `TABS` 加一個分頁
