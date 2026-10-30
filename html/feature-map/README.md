# 功能地圖 (Feature Map)

- 把一個專案的主要功能, 對到它的目錄與檔案
- 左欄是目錄樹, 右欄是功能清單; 選一個功能, 中間每個相關目錄一個說明框, 用連線接回目錄
- 左欄預設 `部分`: 只列功能用得到的目錄 (根目錄、target 與它們的上層目錄); "目錄" 標題旁切到 `全部` 會列出每個目錄並全部展開
- 說明框裡的檔名與目錄名是連結, 開 GitHub 上固定 commit 的版本; 頁底有這個 commit (短 sha, 連到 GitHub)
- 選填的 git 變動 (變更地圖): 資料加上 base..commit 的檔案變動與每個功能的 commit 後
    - 左欄每個目錄右邊標 `+N ~N -N │ +行 −行` (該目錄自己的新增、修改、刪除檔案數與行數)
    - 游標停在數字上看符號的意思
    - 說明框的檔案前面有狀態符號 (`+` `~` `-` `·`) 與行數
    - 頁底有比較範圍、檔案數與行數的統計卡, 以及每個功能一行的 commit (有 PR 時連到 PR)
- 鍵盤操作: 1~9 選功能, ↑↓ 切換, Esc 取消, PageUp / PageDown / Home / End 捲中間的說明
- 單一 html 檔: 資料和引擎在同一個檔案, 可以直接當附件寄出
- 範例資料: 開源專案 [laravel/framework](https://github.com/laravel/framework) 的 `src/Illuminate`, 6 個功能 (路由、service container、Eloquent、佇列、驗證、HTTP middleware), 加上 `v13.0.0` 之後的變動

## 技術細節

[TECHNICAL.md](TECHNICAL.md)
