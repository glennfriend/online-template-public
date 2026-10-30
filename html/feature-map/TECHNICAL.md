## 結構

- 單一 html 檔, 分成兩塊, 各管一件事
    - 引擎: `<style>` + 第一個 `<script>`. 通用, 不含任何專案內容
    - 資料區塊: 檔案最後的 `<script type="application/json" id="feature-map-data">`. 換主題只改這個區塊
    - 兩塊之間有註解 `資料區塊: 換主題只改這個區塊` 標出邊界
- 兩種用法, 同一個引擎
    - 功能地圖: 功能對到目錄與檔案 (沒有 `changes`)
    - 變更地圖: 再加上 `changes` (base..commit 的檔案變動) 與每個功能的 `commits`, 左欄、說明框、頁底多出變動數字
    - 其他工具可以直接拿這個 `index.html` 當引擎: 讀進來, 把資料區塊換成自己的資料再寫出 (例: aquarium 的 change-map `bin/build`)
        - 這種工具要檢查: 資料區塊剛好一個、引擎裡的 `const SCHEMA=5;` 和自己寫的 schema 一樣; 不符就報錯, 不寫檔
- 引擎在 `DOMContentLoaded` 時用 `JSON.parse` 讀資料區塊, 依序是: 共用小工具、讀資料、資料檢查、畫圖 (目錄樹、功能清單、說明框排版、連線、鍵盤)
- 版面
    - 左欄: `path` 底下的目錄, 只列目錄不列檔案, 沒有逐一展開/收合的操作
        - "目錄" 標題旁有 `部分` / `全部` 兩顆按鈕 (`aria-pressed` 標出目前的模式), 切換左欄列哪些目錄; 預設 `部分`
        - `部分`: 只列跟功能有關的目錄: 根目錄、目錄 target、以及任何 target (檔案或目錄) 的上層目錄; 其他目錄完全不列, 也沒有代替它們的列
            - 例: 範例裡 `Contracts/` 只因為 `Contracts/Queue/` 是 target 才列出, 所以底下只列 `Queue/`; 沒有功能指到 `Auth/`, 所以不列 `Auth/`
        - `全部`: `path` 底下每個目錄都列出, 全部展開
        - 每個目錄列只算自己直接放的檔案 (不含子目錄); 有 `changes` 時, 數字欄寬依目前列出的列決定
        - 切換時重畫左欄並回到最上面; 選取的功能不變, 醒目框、說明框位置與連線跟著重畫
        - 由資料算出來, 不用另外寫; target 兩種模式都一定列出, 所以框和線不受影響
    - 右欄: 功能清單
    - 中欄: 選中功能後, 每個相關目錄一個說明框; 框內是目錄說明, 以及檔名加一句說明
    - 說明框裡的目錄名連到 `<repo_url>/tree/<commit>/<dir>`, 檔名連到 `<repo_url>/blob/<commit>/<file>`, 新分頁開 (`rel=noopener`)
    - 說明框盡量貼近對應的目錄, 互不重疊; 放不下時從上往下緊密排列, 中欄自己捲動
    - 連線只畫給中欄看得到的說明框; 整個框捲出中欄就不畫, 只露出一部分時線接到露出部分的中間
    - 頁底: repo (連結)、commit (短 sha, 連到 commit 頁)、path、產生時間與操作提示 (一行一個意思)
        - 提示只放操作: 1~9、↑↓、Esc、PageUp / PageDown / Home / End、`部分` / `全部` 切換; 有 `changes` 時多一行 `游標停在數字上看說明`
        - 欄位的說明放在欄位標題的 tooltip: `目錄` (列出哪些目錄)、`相關目錄與檔案` (只列寫到的檔案, 名稱連到 GitHub)
- 有 `changes` 時多出來的畫面 (變更地圖)
    - 左欄每個目錄右邊: `+N ~N -N │ +行 −行`
        - `+ ~ -` 是新增、修改、刪除的檔案數, 只有符號, 不加其他分隔字
        - 只算直接放在這個目錄的檔案, 不含子目錄; 根目錄那列算根目錄自己的檔案
        - 0 個的類別與 0 行留白, 不顯示 `+0`
        - 刪除行用 `−` (U+2212); 檔案數的刪除用 `-`
        - 數字欄靠右對齊, 每欄寬度 = 該欄 (有列出的目錄裡) 最多位數 + 1ch, 目錄名不會被擠成兩行
        - 游標停在目錄列上, 顯示完整統計, 例: `新增 1 個檔案, 修改 3 個檔案, 新增 106 行, 刪除 22 行`
        - 游標停在數字上, 除了完整統計, 再說明符號: `+ ~ -` 是新增、修改、刪除的檔案數 (只算這一層), `│` 右邊是行數
        - 刪除的檔案算進目錄; 只剩刪除檔案的目錄也會列出
        - binary 檔算檔案數, 不算行數, 該列另外註明
    - 說明框每個檔案一列: 狀態符號 (`+` 新增 `~` 修改 `-` 刪除 `·` 沒有變動)、檔名、`+行`、`−行`、說明
        - 行數分兩欄各自靠右, 同一框內對齊; 0 留白; binary 顯示 `binary`, 沒有變動顯示 `沒有變動`
        - 狀態符號與行數都有 tooltip 說明意思 (例: `~ 修改的檔案`, `+ 新增 44 行, − 刪除 4 行 (0 留白)`)
        - 刪除的檔案 (與只剩刪除檔案的目錄) 在 commit 那一版不存在, 連結改連 `base_commit` 那一版
    - 頁底
        - `範圍`: `base (短 sha) .. commit 短 sha`, 兩端都連到 GitHub commit 頁 (取代 `commit` 那一列)
        - 兩張等寬統計卡: 變動檔案 `+N ~N -N`、變動行數 `+N −N`, 和左欄同一套符號
            - tooltip 說明符號, 以及數字是 base 到 commit 的淨差異; 有 binary 檔時行數卡寫出幾個不計行數
        - `功能與 commit`: 一個功能一行, 功能名稱加上它的 commit 短 sha
            - commit 有 `pr` 就連到 PR, 沒有就連到 commit 頁; 沒有其他 issue / PR 欄位
            - 沒寫 `commits` 的功能顯示 `範圍內沒有列出 commit`
- 互動
    - 點功能或按 1~9 選取, 再按一次取消
    - ↑↓ 切換功能, Esc 取消
    - PageUp / PageDown / Home / End 只捲中間欄
    - 功能卡用 roving tabindex: Tab 只會停在一張卡上
    - 焦點在輸入框、選單或可編輯文字時不攔截按鍵
    - 寬度 1000px 以下改成上下排列, 不畫連線
- 淺色/深色跟著系統設定 (`prefers-color-scheme`)

## 為什麼是單一檔案

- 同資料夾的其他 template (code-flow、holiday-calendar 等) 是 `index.html` + `data.js` 兩個檔
- 功能地圖常被當成一份報告單獨寄出或貼到聊天室; 兩個檔案時收件人常只拿到 html, 頁面就壞了
- 所以資料直接放在 html 裡, 一個檔案就能開
- 代價: 引擎升級時要把舊檔案的資料區塊搬到新的 html 裡
    - 做法: 拿新版 html, 把 `<script type="application/json" id="feature-map-data">` 到它的 `</script>` 之間整段換成舊檔的內容
    - 資料欄位有變時 (例如 schema 版本), 頁面會直接列出要改哪些欄位

## 錯誤與外部相依

- 沒有外部相依: 沒有 CDN、沒有網頁字型、沒有其他檔案, 離線可用 (直接開 `file://` 也行)
- 頁面上的連結只在點擊時才連到 GitHub, 載入時不發出任何網路請求
- 文字一律用 `textContent` 放進頁面, 資料裡的 HTML 標籤會照字面顯示
- 讀資料區塊的錯誤, 一律顯示在頁面最上方, 地圖不畫
    - 找不到資料區塊
    - 不是合法的 JSON (同時附上 `<` 的寫法提示, 見下一節)
    - 原始文字含有 `<!--` 或 `<script`
- 資料整份檢查 (`validate()`), 有錯就整張地圖不畫, 並在頁面最上方一次列出全部錯誤
    - 為什麼不略過有錯的項目: target 指到不存在的目錄時, 框和線會接錯地方, 畫出來反而誤導
- 畫圖途中出錯 (引擎本身的 bug) 也會顯示在頁面最上方, 不留半張圖

## 資料裡的 `<` 一律寫成 `<`

- 資料區塊是 html 的 `<script>`. 字串裡出現 `</script` 時, 瀏覽器會在那裡結束區塊, 後半段變成頁面文字
- `<!--` 加上 `<script` 也會改變瀏覽器切分 script 的方式
- 規則: 資料裡所有 `<` 寫成 `<` (JSON 標準的跳脫寫法, `JSON.parse` 後還原成 `<`)
    - python: `json.dumps(data, ensure_ascii=False, indent=2).replace('<', '\\u003c')`
    - JavaScript: `JSON.stringify(data, null, 2).replace(/</g, '\\u003c')`
- 沒照規則寫時, 頁面會列出錯誤並提示這條規則, 不會默默畫出缺一半的資料
- 引擎自己也遵守同一條限制: 引擎原始碼裡要寫這些字樣時用 `\x3c` 代替 `<`

## 資料欄位

```jsonc
{
  "schema": 5,                                         // 必, 固定是 5
  "title": "Laravel framework 功能地圖",                // 必, 頁面標題
  "repo_url": "https://github.com/laravel/framework",  // 必, https://github.com/<owner>/<repo>, 結尾不加 / 與 .git
  "commit": "5a787ee008553a35206de2918d5242626ddeaed2", // 必, tree 對應的 commit, 40 碼小寫 hex
  "path": "src/Illuminate",                            // 必, tree 的起點: 整個 repo 寫 ".", 子目錄不加結尾 /
  "generated_at": "2026-10-30",                        // 必, 頁底顯示用, 照字面顯示 (沒有 build 步驟, 自己填)
  "features": [                                        // 必, 非空; 建議不超過 9 個 (1~9 鍵)
    {
      "id": "routing",                                 // 必, 不能重複
      "title": "路由 (Routing)",                        // 必, 功能卡標題
      "why": "一句話說這個功能做什麼",                    // 必, 功能卡說明
      "targets": [                                     // 必, 非空
        {"path": "src/Illuminate/Routing/", "note": "這個目錄的說明"},             // 目錄: 結尾帶 /
        {"path": "src/Illuminate/Routing/Router.php", "note": "這個檔案的一句說明"} // 檔案
      ]
    }
  ],
  "tree": [                                            // 必, path 底下的全部檔案 (不是目錄), 見下方 "產生 tree"
    "src/Illuminate/Routing/Router.php"
  ]
}
```

- 只認得上面這些欄位, 多寫的欄位會報錯 (避免打錯字卻沒發現)
- 所有字串不能是空白
- 路徑一律是 repo 內的相對路徑: 不以 `/` 開頭, 不含 `.` `..` 與空片段
- `tree`
    - 只放檔案, 不能重複, 都要在 `path` 底下 (`path` 是 `"."` 時不限)
    - 目錄樹由檔案路徑推出來, 所以空目錄不會出現
    - 放在最後, 讓 features 在檔案裡比較好找
- `targets[].path`
    - 是檔案, 或結尾帶 `/` 的目錄, 都必須存在於 tree; 目錄忘了加 `/` 時錯誤訊息會提醒
    - 同一個 feature 裡不能重複; 不同 feature 可以指到同一個檔案, 各寫各的 note
    - 檔案放進它直接所屬目錄的框
    - 目錄 target 只放目錄說明, 不會自動列出目錄內的檔案; 想在框內列檔案, 就把檔案也寫成 target
- schema 3 (舊的 `data.js` 格式) 會報錯並說明要改什麼: `repo` 改成 `repo_url`, 加上 `commit`, schema 改成 5
- schema 4 會報錯並說明: 欄位都一樣, 把 schema 改成 5 即可

### `changes` 與 `commits` (選填, 變更地圖)

```jsonc
{
  "schema": 5,
  "commit": "5a787ee008553a35206de2918d5242626ddeaed2",   // 比較的終點 (head); tree 與連結都是這一版
  "changes": {                                          // 選填; 沒有就是單純的功能地圖
    "base": "v13.0.0",                                  // 必, 比較起點的名稱 (tag、branch 或短 sha), 頁底照字面顯示
    "base_commit": "3e33f431a05365d008742ff8001b92641086d5f8", // 必, 起點的完整 sha, 不能等於 commit
    "files": [                                          // 必, base_commit..commit 之間 path 底下變動的檔案 (可以是空陣列)
      {"path": "src/Illuminate/Bus/Dispatcher.php", "status": "M", "adds": 44, "dels": 4},
      {"path": "src/Illuminate/Foundation/Cloud.php", "status": "D", "adds": 0, "dels": 140},
      {"path": "src/Illuminate/Example/logo.png", "status": "A", "adds": null, "dels": null}   // 示意: binary 檔兩個都是 null (範例資料裡沒有 binary)
    ]
  },
  "features": [
    {
      "id": "cache", "title": "...", "why": "...", "targets": [...],
      "commits": [                                      // 選填, 只能用在有 changes 的資料; 寫了就不能是空陣列
        {"sha": "be89dd7073a89ffa33866809be18060295a4db78", "pr": "https://github.com/laravel/framework/pull/61593"},
        {"sha": "0a1f8c376c8f45d8de8716a889e6e42506bee92a"}                                  // 沒有 PR: 連到 commit 頁
      ]
    }
  ]
}
```

- `status` 只有 `A` (新增)、`M` (修改)、`D` (刪除); 改名當成刪除加新增, 類型變更 (例如變成 symlink) 當成修改
- `A` / `M` 的檔案必須在 `tree`; `D` 的檔案不能在 `tree` (`tree` 是 commit 那一版的檔案)
- 刪除的檔案與它們的目錄仍算在目錄樹裡, target 可以指到它們
- `adds` / `dels` 是非負整數; binary 檔兩個都寫 `null`
- `commits[].sha` 是 40 碼完整 sha, 同一個功能裡不能重複
- `commits[].pr` 必須是 `<repo_url>/pull/<編號>`
- 引擎只檢查格式; "commit 真的在範圍內、真的動到這個功能的 target" 要由產生資料的工具用 git 檢查 (change-map 的 `bin/build` 有做)
- 多寫的欄位一樣會報錯 (例如 `changes.files[].lines`、`commits[].issue`)

產生 `changes.files` (repo 根目錄, zsh, 需要 python3; 把 `BASE`、`HEAD` 換成兩端的 commit):

```zsh
git diff --no-renames --name-status -z BASE HEAD -- src/Illuminate > /tmp/status.bin
git diff --no-renames --numstat -z BASE HEAD -- src/Illuminate > /tmp/numstat.bin
python3 - <<'EOF'
import json
s = open('/tmp/status.bin', 'rb').read().split(b'\0')
status = {s[i + 1].decode(): s[i].decode().replace('T', 'M') for i in range(0, len(s) - 1, 2)}
lines = {}
for row in open('/tmp/numstat.bin', 'rb').read().split(b'\0'):
    if row:
        a, d, p = row.split(b'\t', 2)
        lines[p.decode()] = (None, None) if a == b'-' else (int(a), int(d))
files = [dict(path=p, status=status[p], adds=lines[p][0], dels=lines[p][1]) for p in sorted(status, key=str.encode)]
print(json.dumps(files, ensure_ascii=False, indent=2).replace('<', '\\u003c'))
EOF
```

- `--no-renames`: 改名一律是刪除加新增, 不依相似度猜
- `tree` 要用 HEAD 那一版 (`git ls-tree -r --name-only HEAD -- src/Illuminate`), 不是工作區

## 產生 tree

tree 要和 `commit` 那一版的檔案一致, 用 git 產生, 不要手打.
在 repo 根目錄、checkout 到 `commit` 且工作區乾淨時執行 (zsh, 需要 python3):

```zsh
# 整個 repo 拿掉最後的 -- src/Illuminate
git ls-files -- src/Illuminate \
  | LC_ALL=C sort \
  | python3 -c 'import json,sys; print(json.dumps([l for l in sys.stdin.read().splitlines() if l], ensure_ascii=False, indent=2).replace("<", "\\u003c"))' > tree.json
git rev-parse HEAD   # 填進 "commit"
```

- 只用 tracked 檔案: 連結指到 GitHub 上的 commit, untracked 檔在 GitHub 上不存在
- `LC_ALL=C` 讓排序依位元組, 每台機器結果一樣
- 檔名含換行的極端情況不處理; 遇到就改用 `git ls-files -z`
- 把 `tree.json` 的內容貼進資料區塊的 `"tree"`

## 什麼時候用

- 新人接手專案, 想知道 "某個功能的程式在哪幾個目錄"
- 寫完一個功能, 要跟 reviewer / PM 交代改了哪些地方、各自負責什麼
- 一個功能散在很多目錄 (程式、介面、設定、測試) 時最有用; 只在一個檔案裡的功能不用做
- 這個 template 只負責呈現. note 要先讀過程式再寫, 不確定的不要寫

## 寫 note 的規則

- 一個 note 只講一件事, 短句; 關鍵字 (class、函式、設定名) 保留原文
- 目錄 note 講 "這個目錄是什麼", 檔案 note 講 "這個檔案在這個功能裡負責什麼"
- 同一個檔案在不同功能裡, note 寫它在該功能的角色

## 範例資料來歷

- 來源: [laravel/framework](https://github.com/laravel/framework), commit `5a787ee008553a35206de2918d5242626ddeaed2` (2026-10-29, 13.x 分支)
- 變動範圍: `v13.0.0` (第一個 13.x release tag, commit `3e33f431`) 到上面的 commit
    - `src/Illuminate` 底下 919 個檔案有變動: 新增 161、修改 757、刪除 1 (`Foundation/Cloud.php`); +30702 −5751 行
    - 範圍內有 1376 個 commit 動到 `src/Illuminate`
- 每個功能列 4~5 個 commit: 範圍內動到該功能 target 的 commit, 挑新功能與修正, 不挑 docblock、版本號之類
    - commit 標題結尾是 `(#12345)` 時, `pr` 寫 `https://github.com/laravel/framework/pull/12345`; 沒有就不寫, 頁底改連到 commit 頁
    - 每個 sha 與 PR 都用 GitHub API 對過: commit 存在, PR 已合併且 merge commit 就是這個 sha
- `git clone --filter=blob:none` 後用上面的指令產生 tree
- `path` 選 `src/Illuminate` (1992 個檔案, 345 個目錄; 左欄 `部分` 列其中 50 個, `全部` 列 345 個)
    - 整個 repo 有 3491 個檔案, 其中 `tests/` 1377 個, 左欄會變成 500 多個目錄, 功能目錄反而難找
    - `src/` 底下只有 `Illuminate`, 所以直接從它開始, 少一層
    - 仍然有多層巢狀目錄 (例如 `Database/Eloquent/Concerns/`), 也有大目錄 (`Validation/Rules/` 59 個檔案)
    - 每個功能都跨好幾個元件目錄 (例如佇列跨 `Queue/`、`Bus/`、`Foundation/Bus/`、`Contracts/Queue/`), 中欄說明框多到要捲動
    - 各元件底下的 `.github/workflows/` 也是 tracked 檔案, 照實算進目錄樹 (沒有 target, 所以只在 `全部` 列出)
- 每條 note 都對照過該 commit 的程式碼與 docblock (note 描述的是 commit 那一版, 不是 v13.0.0)

## 來歷

- 版型出自 aquarium 的 change-map 工具 (當時是 Python 產生單一 html), 2026-10-30 搬到這裡
- 驗證規則從 Python 搬進引擎的 `validate()`, 不再需要 build 步驟
- 2026-10-30 從 `index.html` + `data.js` 改成單一檔案, 範例換成 Laravel; 說明框的檔名與目錄名改成連到 GitHub; 左欄只展開含有 target 的目錄
- 2026-10-30 schema 5: 加回 change-map 原本的 git 變動畫面 (目錄的 `+N ~N -N │ +行 −行`、說明框的狀態與行數、頁底統計卡、範圍、功能與 commit), 改成選填的 `changes` 與 `commits`; 收起的目錄改標 `… N 個子目錄`; change-map 不再有自己的 html, 改用這個檔案當引擎
- 2026-10-30 左欄只列根目錄、target 與上層目錄, 其他子目錄合成一列 `… 其他 N 個目錄` 並加總變動 (取代每個目錄後面的 `… N 個子目錄`); 頁底提示只留操作, 符號的意思改放數字的 tooltip
- 2026-10-30 拿掉 `… 其他 N 個目錄` 合併列; 工具列右邊加 `部分` / `全部` 切換 (`部分` 只列根目錄、target 與上層目錄, `全部` 列出每個目錄並全部展開); 同日稍後移到 "目錄" 標題旁, 因為只影響左欄
