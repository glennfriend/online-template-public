// 多視角流程圖的資料. 換主題只改這個檔.
// 欄位說明見 TECHNICAL.md. 同一批節點與位置不動, 切視角只換卡片內容與顏色.
// 沒查證的事一律放 openQuestions, 不寫進卡片; 某視角對某節點沒東西寫就寫 null.
window.CODEFLOW = {
  "meta": {
    "title": "結帳付款流程",
    "subtitle": "使用者從購物車按下付款到訂單完成, 每一步看到什麼、背後發生什麼",
    "meta_rows": [
      [
        "updated_at",
        "2026-08-18 (+8)"
      ],
      [
        "code_verified_at",
        "2026-08-18"
      ],
      [
        "scope",
        "checkout 前端 + payment 後端 + 金流 webhook"
      ]
    ]
  },
  "views": [
    {
      "id": "user",
      "label": "使用者",
      "cap": "要不要動手",
      "colorKey": "actK",
      "who": "畫面上實際出現什麼, 按鈕在哪",
      "labels": {
        "act": "使用者要動手",
        "wait": "只是等待",
        "bg": "背景發生, 使用者不知道"
      },
      "colors": {
        "act": "--c-green",
        "wait": "--c-blue",
        "bg": "--c-gray"
      }
    },
    {
      "id": "dev",
      "label": "Dev",
      "cap": "動到哪一邊",
      "colorKey": "sideK",
      "who": "哪支 controller / service 在跑",
      "labels": {
        "fe": "前端",
        "be": "後端",
        "ext": "外部金流"
      },
      "colors": {
        "fe": "--c-blue",
        "be": "--c-purple",
        "ext": "--c-orange"
      },
      "extra": {
        "field": "devNotes",
        "title": "Dev 細節"
      }
    },
    {
      "id": "risk",
      "label": "風險",
      "cap": "風險等級",
      "colorKey": "riskK",
      "who": "只列真的會出事的地方",
      "labels": {
        "high": "高 — 錢收不到或重複收",
        "mid": "中 — 體驗變差"
      },
      "colors": {
        "high": "--c-red",
        "mid": "--c-orange"
      }
    }
  ],
  "layout": null,
  "bands": [
    {
      "rows": [
        "side"
      ],
      "toCol": 1,
      "label": "前提",
      "full": "前提 — 不在主線的先後順序上"
    },
    {
      "rows": [
        "main"
      ],
      "label": "結帳主線 ({n})",
      "full": "主線 — 由左至右就是使用者實際經歷的順序"
    }
  ],
  "nodes": [
    {
      "id": "login",
      "col": 0,
      "row": "side",
      "title": "登入",
      "actK": "act",
      "sideK": "fe",
      "riskK": null,
      "m": {
        "user": [
          "使用者要動手",
          "沒登入無法結帳",
          "訪客會被導去登入頁"
        ],
        "dev": [
          "前端",
          "AuthController · session"
        ],
        "risk": null
      },
      "why": "結帳需要收件資訊與付款紀錄綁在帳號上, 所以登入是前提而不是主線的一步.",
      "facts": [
        "未登入點結帳會被導向 /login 並帶 redirect 參數"
      ],
      "devNotes": [
        "session 逾時 30 分鐘"
      ],
      "ev": [
        "app/Http/Controllers/AuthController.php"
      ]
    },
    {
      "id": "cart",
      "num": "1",
      "col": 0,
      "row": "main",
      "title": "確認購物車",
      "actK": "act",
      "sideK": "fe",
      "riskK": null,
      "m": {
        "user": [
          "使用者要動手",
          "檢查品項與金額",
          "按下前往結帳"
        ],
        "dev": [
          "前端",
          "CartPage · 金額由後端重算"
        ],
        "risk": null
      },
      "why": "金額最終以後端重算為準, 前端顯示只是預覽, 避免前端被改價.",
      "facts": [
        "前端金額僅供顯示, 送出時後端會重新計算"
      ],
      "devNotes": [
        "購物車存在 localStorage, 登入後合併到帳號"
      ],
      "ev": [
        "resources/js/pages/Cart.tsx"
      ]
    },
    {
      "id": "pay",
      "num": "2",
      "col": 1,
      "row": "main",
      "title": "送出付款",
      "actK": "act",
      "sideK": "be",
      "riskK": "high",
      "m": {
        "user": [
          "使用者要動手",
          "填卡號並送出",
          "送出後不能按上一頁"
        ],
        "dev": [
          "後端",
          "PaymentController@charge",
          "先建 pending 訂單再送金流"
        ],
        "risk": [
          "高 — 錢收不到或重複收",
          "重複送出會建兩筆 pending",
          "靠 idempotency key 擋"
        ]
      },
      "why": "先落地一筆 pending 訂單再呼叫金流, 這樣就算金流回應掉了也有紀錄可以對帳.",
      "facts": [
        "idempotency key = user_id + cart hash",
        "pending 訂單 15 分鐘未付款自動取消"
      ],
      "devNotes": [
        "charge() 逾時 20 秒, 逾時不重試只標記 unknown"
      ],
      "ev": [
        "app/Http/Controllers/PaymentController.php"
      ]
    },
    {
      "id": "gateway",
      "num": "3",
      "col": 2,
      "row": "main",
      "title": "金流處理中",
      "actK": "wait",
      "sideK": "ext",
      "riskK": "mid",
      "m": {
        "user": [
          "只是等待",
          "轉圈畫面",
          "銀行 3D 驗證可能跳出"
        ],
        "dev": [
          "外部金流",
          "第三方 gateway",
          "回應非同步"
        ],
        "risk": [
          "中 — 體驗變差",
          "3D 驗證跳窗被瀏覽器擋掉"
        ]
      },
      "why": "第三方金流的結果不會同步回來, 頁面只能等 webhook 或輪詢.",
      "facts": [
        "3D 驗證在新分頁開啟, 被擋掉會停在轉圈"
      ],
      "devNotes": [
        "輪詢 fallback 每 3 秒一次, 上限 60 秒"
      ],
      "ev": [
        "services/gateway/client.php"
      ]
    },
    {
      "id": "webhook",
      "num": "4",
      "col": 3,
      "row": "main",
      "title": "webhook 回寫訂單",
      "actK": "bg",
      "sideK": "be",
      "riskK": "high",
      "m": {
        "user": [
          "背景發生, 使用者不知道",
          "畫面只看到狀態變了"
        ],
        "dev": [
          "後端",
          "WebhookController@handle",
          "驗簽後改訂單狀態"
        ],
        "risk": [
          "高 — 錢收不到或重複收",
          "webhook 重送會重複扣庫存",
          "要用事件 id 去重"
        ]
      },
      "why": "訂單真正變成已付款是在這一步, 不是使用者看到成功頁的那一刻.",
      "facts": [
        "同一事件 id 會重送最多 5 次",
        "驗簽失敗直接回 400 不改狀態"
      ],
      "devNotes": [
        "處理走 queue, 失敗進 failed_jobs"
      ],
      "ev": [
        "app/Http/Controllers/WebhookController.php"
      ]
    },
    {
      "id": "done",
      "num": "5",
      "col": 4,
      "row": "main",
      "title": "看到訂單完成",
      "actK": "wait",
      "sideK": "fe",
      "riskK": null,
      "m": {
        "user": [
          "只是等待",
          "訂單完成頁 + 通知信"
        ],
        "dev": [
          "前端",
          "OrderPage · 輪詢訂單狀態"
        ],
        "risk": null
      },
      "why": "完成頁只是反映訂單狀態, 沒有任何寫入動作, 重新整理是安全的.",
      "facts": [
        "通知信由 queue 寄出, 可能晚幾秒"
      ],
      "devNotes": [
        "完成頁純讀取, 不觸發任何寫入"
      ],
      "ev": [
        "resources/js/pages/Order.tsx"
      ]
    }
  ],
  "edges": [
    {
      "id": "e1",
      "from": "cart",
      "to": "pay",
      "label": "按下付款",
      "kind": "main"
    },
    {
      "id": "e2",
      "from": "pay",
      "to": "gateway",
      "label": "送去金流",
      "kind": "main"
    },
    {
      "id": "e3",
      "from": "gateway",
      "to": "webhook",
      "label": "金流回呼",
      "kind": "main"
    },
    {
      "id": "e4",
      "from": "webhook",
      "to": "done",
      "label": "狀態改成已付款",
      "kind": "main"
    },
    {
      "id": "e5",
      "from": "login",
      "to": "cart",
      "label": "登入後才進得來",
      "kind": "side"
    },
    {
      "id": "e6",
      "from": "gateway",
      "to": "pay",
      "label": "刷卡失敗退回重填",
      "kind": "gated"
    }
  ],
  "flowTags": {
    "ok": {
      "label": "主線",
      "tone": "good"
    },
    "bad": {
      "label": "卡關點",
      "tone": "bad"
    }
  },
  "flows": [
    {
      "id": "happy",
      "name": "順利付款",
      "status": "ok",
      "summary": "從購物車到訂單完成, 全部都對的那條路",
      "insight": "使用者只動手兩次 (確認、送出), 其餘都是在等或在背景跑",
      "signal": "訂單狀態在 30 秒內從 pending 變成 paid",
      "steps": [
        "cart",
        "pay",
        "gateway",
        "webhook",
        "done"
      ],
      "branch": [
        "e6"
      ]
    },
    {
      "id": "money",
      "name": "會出錢的兩個地方",
      "status": "bad",
      "mode": "set",
      "summary": "重複扣款與重複扣庫存都只可能發生在這兩步",
      "signal": "對帳時 pending 筆數異常增加, 或同一 order_id 出現兩筆扣庫存",
      "nodes": [
        "pay",
        "webhook"
      ]
    }
  ],
  "primer": {
    "title": "這張圖是什麼",
    "blocks": [
      {
        "q": "怎麼看",
        "ul": [
          "主線 <b>1 → 5 由左至右</b>, 上面那帶是前提, 不在順序上",
          "「卡片內容」按鈕換視角, <b>標題與位置不動</b> (數字鍵 1~3 也可切)",
          "某視角對某張卡沒有值得寫的東西時, 那張卡<b>淡化只留標題</b>"
        ]
      },
      {
        "q": "最反直覺的一件事",
        "p": [
          "使用者看到「付款成功」的時間點, 不是訂單真正變成已付款的時間點."
        ],
        "box": {
          "title": "訂單狀態的真正來源是 webhook",
          "ul": [
            "前端只是輪詢訂單狀態, 它不決定任何事",
            "webhook 沒進來, 畫面就會一直停在處理中"
          ]
        }
      }
    ]
  },
  "openQuestions": [
    "webhook 重送 5 次之後的人工補單流程還沒查",
    "3D 驗證被瀏覽器擋掉的比例沒有實際數據"
  ]
}
;
