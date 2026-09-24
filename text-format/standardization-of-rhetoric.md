
# 文字優美 簡單易懂

## 檢查
- [ ] 每行不超過 80 個字
- [ ] 任一行刪掉後訊息就不完整, 才值得留下

## 表格

對齊, 邊界清晰

| ATS             | hosts | 狀態                                |
| ---             | ---   | ---                                 |
| workday         | 1,899 | 排除要建候選人帳號, 多步驟 wizard   |
| greenhouse      | 4     | none                                |
| ashby           | 1     | merged, feature flag off            |
| lever           | 2     | 候選                                |

## 文字只留重點

- 表達言簡意賅, 使用繁體中文, 技術語保持原文, 符號常用半形
- 每行不超過 80 個繁體中文
- 每行說只清楚一件事, 不用括號塞進同一行, 從屬關係用縮排
- 一件事允許用多行講清楚
- 記錄 知識入口索引, 不要重覆犯的錯誤方式, 正確觀念, 未知的專有名詞

## 格式
- 時區 Asia/Taipei +8
- 日期 YYYY-mm-dd

## 排版

- 用 標題階層 + 條列 + 縮排 撐出結構, 不寫成整段散文

## domain 領域專有詞彙
- CTR
  - click-through rates
  - 點擊率
- ETA
  - Estimated time of arrival
  - 預計到達時間
- bypass
  - 遶道, 避開, 如果行不通, 就想其它方法

### 對照關系

對照關係改用 條列 + 縮排 兩層表示, 不用 markdown table (終端機會斷行)

<bed>
| 環境 | DB  | 狀態 |
| ---  | --- | ---- |
| prod | cl1 | 正常 |
| stg  | cl0 | 502  |
</bed>
<good>
- prod
  - DB cl1
  - 正常
- stg
  - DB cl0
  - 502, upstream 沒起來
</good>
