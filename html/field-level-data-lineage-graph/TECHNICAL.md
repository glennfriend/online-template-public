
## 結構

- `index.html` 分三個區塊: 結構 + 主題 (`<style>`)、資料 (第一個 `<script>`)、引擎 (第二個 `<script>`)
- 換資料只改資料區塊 (`window.LINEAGE`)

## 注意事項

- 不用指定欄位: 引擎依「最長依賴路徑」自動決定節點在第幾欄
- `deps` 不能有迴圈: A 要 B、B 又要 A, 整張圖會畫不出來 (console 顯示 `Maximum call stack size exceeded`)
- 🫙 會往下游傳: `stable: 'inherit'` 的節點, 只要任一前提有 🫙, 自己也會標
- 加新模式要改兩個區塊: 結構區補 `--<key>` (淺色 + 深色) 和 `.p-<key>`; 資料區補 `modes`, 要出現在色塊區再加進 `legendModes`
- 加寬方塊要一起調 `STRIDE`: `STRIDE` 必須大於 `NODEW`, 且整張圖超過版面寬度 (1240px) 會被等比例縮小
