// 歷史時間軸地圖的資料. 換主題只改這個檔 (和海岸線 land.js).
// 日期一律寫成字串 "YYYY", "YYYY-MM" 或 "YYYY-MM-DD" (西元), 引擎會換算成時間軸上的位置.
// 同一個日期只寫一次: 政權的起訖由 start / end 決定, 時間軸底色, 色塊, 長條都從這裡推出來.
window.HISTORY = {
  title: "台灣歷史地圖",
  heading: "台灣歷史地圖: 1624 到 1996",
  range: ["1600", "2000"],          // 時間軸範圍
  axisStep: 50,                      // 時間軸刻度間隔 (年)
  text: {
    statusTitle: "誰在統治",
    barNote: "長條 = 大約控制了台灣本島多少地方 (示意).",
    mapNote: "色塊只表示大約的統治範圍, 不是真實疆界",
    erasTitle: "台灣的六個時期"
  },

  map: {
    parallels: [22, 26],             // 投影的標準緯線, 取地圖範圍的上下緣附近
    graticule: 1,                    // 經緯線間隔 (度)
    views: [                         // 地圖範圍按鈕, 第一個是預設. 事件地點不在目前範圍內時, 自動換成第一個放得下的範圍
      { id: "near", label: "台灣與澎湖", extent: [[119.25, 21.85], [122.05, 25.35]] },
      { id: "wide", label: "含金門馬祖", extent: [[118.0, 21.85], [122.1, 26.35]] }
    ]
  },

  // 地圖圖層 (地圖左上的開關), on = 預設開或關. 可用的圖層:
  //   focus     = 事件焦點: 只畫當前事件相關的政權範圍 (事件的 p 與 involves). 適合講事件故事
  //   territory = 統治範圍: 畫當年所有政權的範圍. 適合講勢力消長
  layers: [
    { id: "focus", label: "事件焦點", on: true },
    { id: "territory", label: "統治範圍", on: false }
  ],

  // 地圖名稱的類別. rank 越小越先放 (事件地點永遠最先). polity 是政權名稱 (固定類別, 一定顯示), 其他是地點的類別
  kinds: [
    { id: "polity", label: "政權", rank: 1 },
    { id: "site", label: "史蹟", rank: 3 },
    { id: "city", label: "城市", rank: 2 },
    { id: "region", label: "地區", rank: 4, centered: true }
  ],

  // 政權: color = [淺色, 深色]; share = [日期, 大約控制本島的比例] (示意, 到 end 時自動變 0);
  // areas = 統治範圍色塊 (圓心 [經度, 緯度], 半徑 km, from / to 不寫就跟政權起訖相同), 依各時期文字描述估計
  polities: [
    { id: "ind", name: "原住民族", color: ["#4f7a3a", "#8fbf6f"], start: "1600", end: "1915", goneText: "失去自主", labelAt: [121.2, 23.2],
      share: [["1600", 1], ["1624-08", .95], ["1662-02-01", .8], ["1683-07-16", .75], ["1723", .65], ["1812", .6], ["1875", .5], ["1910", .45]],
      areas: [{ c: [120.95, 23.65], r: 190, to: "1624-08" }, { c: [121.1, 23.6], r: 120, from: "1624-08", to: "1875" }, { c: [121.05, 23.75], r: 90, from: "1875" }] },
    { id: "nl", name: "荷蘭", color: ["#c4661a", "#ef9a4e"], start: "1624-08", end: "1662-02-01", goneText: "已離開",
      share: [["1624-08", .05], ["1636", .25], ["1642", .3], ["1661-04", .3]],
      areas: [{ c: [120.30, 23.20], r: 70 }, { c: [121.6, 25.15], r: 20, from: "1642-08-26" }] },
    { id: "es", name: "西班牙", color: ["#7a4f9a", "#b892d6"], start: "1626-05", end: "1642-08-26", goneText: "已離開",
      share: [["1626-05", .03], ["1629", .06], ["1637", .04]],
      areas: [{ c: [121.60, 25.12], r: 28 }] },
    { id: "zh", name: "明鄭", color: ["#1f7f78", "#5cc2b9"], start: "1662-02-01", end: "1683-09-05", goneText: "已結束",
      share: [["1662-02-01", .2], ["1683-07-16", .25]],
      areas: [{ c: [120.30, 23.10], r: 55 }, { c: [119.56, 23.56], r: 22 }] },
    { id: "qing", name: "清朝", color: ["#8a6a1f", "#d3b45a"], start: "1683-07-16", end: "1895-05-08", goneText: "已結束",
      share: [["1683-07-16", .25], ["1723", .35], ["1812", .4], ["1875", .5], ["1895", .5]],
      areas: [{ c: [120.40, 23.20], r: 70 }, { c: [120.75, 24.45], r: 65, from: "1723" }, { c: [121.75, 24.70], r: 25, from: "1812" },
        { c: [121.15, 22.75], r: 25, from: "1875" }, { c: [121.55, 23.95], r: 25, from: "1875" }, { c: [120.75, 22.0], r: 20, from: "1875" },
        { c: [119.56, 23.56], r: 25 }] },
    { id: "jp", name: "日本", color: ["#b0353b", "#ec7a7f"], start: "1895-05-08", end: "1945-10-25", goneText: "已離開",
      share: [["1895-05-08", .5], ["1910", .55], ["1915", 1], ["1945", 1]],
      areas: [{ c: [120.40, 23.20], r: 70, to: "1915" }, { c: [120.75, 24.45], r: 65, to: "1915" }, { c: [121.75, 24.70], r: 25, to: "1915" },
        { c: [121.35, 23.30], r: 70, to: "1915" }, { c: [120.95, 23.65], r: 200, from: "1915" }, { c: [119.56, 23.56], r: 25 }] },
    { id: "roc", name: "中華民國", color: ["#2f5f8a", "#7fb0de"], start: "1945-10-25", goneText: "已結束",
      share: [["1945-10-25", 1]],
      areas: [{ c: [120.95, 23.65], r: 200 }, { c: [119.56, 23.56], r: 25 }, { c: [118.35, 24.45], r: 15 }, { c: [119.95, 26.15], r: 15 }] }
  ],

  // 時期: 時間軸底色 + 頁面下方的簡介卡. 起點 = 該政權的 start (第一個時期從時間軸起點開始), 終點 = 下一個時期的起點
  eras: [
    { polity: "ind", name: "原住民族", title: "原住民族", years: "很久以前 起",
      desc: "原住民族很早就住在台灣, 有許多不同的族群和部落. 外來的人來之前, 整座島由各個部落自己管理. 後來外來政權一步步擴大, 山地部落到 1915 年前後才被日本完全控制." },
    { polity: "nl", name: "荷西", title: "荷蘭與西班牙",
      desc: "歐洲人為了和中國、日本做生意而來. 荷蘭在南部的大員 (台南), 西班牙在北部的基隆和淡水. 1642 年荷蘭趕走西班牙." },
    { polity: "zh", name: "明鄭", title: "明鄭",
      desc: "鄭成功打敗荷蘭, 以台南為中心建立政權. 他的家族統治了 21 年, 帶著士兵開墾土地." },
    { polity: "qing", name: "清朝", title: "清朝",
      desc: "統治時間最長, 共 212 年. 從西部平原開始, 慢慢擴大到宜蘭和東部. 1885 年台灣成為一個省." },
    { polity: "jp", name: "日本", title: "日本",
      desc: "清朝打輸甲午戰爭, 把台灣割讓給日本. 日本統治 50 年, 修了縱貫鐵路, 也用武力控制了山地." },
    { polity: "roc", name: "中華民國", title: "中華民國",
      desc: "二戰結束後接收台灣. 經歷二二八事件和 38 年的戒嚴, 1987 年解嚴, 1996 年人民第一次直接選總統." }
  ],

  // 地點: k = 類別 (kinds 的 id). 史蹟座標取自維基百科條目, 多數另以 OpenStreetMap 核對; 標 "約" 者為近似位置
  places: {
    zeelandia: { n: "熱蘭遮城 (安平古堡)", lon: 120.1605, lat: 23.0011, k: "site" },
    luermen:   { n: "鹿耳門 (約)", lon: 120.1245, lat: 23.0373, k: "site" },
    salvador:  { n: "聖薩爾瓦多城 (和平島)", lon: 121.7720, lat: 25.1590, k: "site" },
    magong:    { n: "澎湖天后宮 (馬公)", lon: 119.5639, lat: 23.5648, k: "site" },
    dali:      { n: "大里杙 (約)", lon: 120.6778, lat: 24.0990, k: "site" },
    shimen:    { n: "石門古戰場", lon: 120.7606, lat: 22.1113, k: "site" },
    huwei:     { n: "滬尾砲台", lon: 121.4296, lat: 25.1790, k: "site" },
    shiqiu:    { n: "獅球嶺砲台", lon: 121.7350, lat: 25.1203, k: "site" },
    zhongshan: { n: "中山堂", lon: 121.5101, lat: 25.0432, k: "site" },
    aodi:      { n: "澳底", lon: 121.9272, lat: 25.0426, k: "site" },
    tcpark:    { n: "台中公園", lon: 120.6833, lat: 24.1450, k: "site" },
    wushe:     { n: "霧社", lon: 121.1323, lat: 24.0213, k: "site" },
    tianma:    { n: "天馬茶房 (原址)", lon: 121.5122, lat: 25.0540, k: "site" },
    president: { n: "總統府", lon: 121.5120, lat: 25.0400, k: "site" },
    taipei:    { n: "台北", lon: 121.5650, lat: 25.0330, k: "city" },
    keelung:   { n: "基隆", lon: 121.7420, lat: 25.1280, k: "city" },
    yilan:     { n: "宜蘭", lon: 121.7530, lat: 24.7570, k: "city" },
    taichung:  { n: "台中", lon: 120.6470, lat: 24.1630, k: "city" },
    tainan:    { n: "台南", lon: 120.2130, lat: 22.9970, k: "city" },
    kaohsiung: { n: "高雄", lon: 120.3010, lat: 22.6270, k: "city" },
    hualien:   { n: "花蓮", lon: 121.6010, lat: 23.9770, k: "city" },
    taitung:   { n: "台東", lon: 121.1440, lat: 22.7560, k: "city" },
    mountains: { n: "中央山脈", lon: 120.9500, lat: 23.8500, k: "region" },
    plain:     { n: "嘉南平原", lon: 120.2800, lat: 23.5500, k: "region" },
    penghu:    { n: "澎湖", lon: 119.4300, lat: 23.4300, k: "region" },
    kinmen:    { n: "金門", lon: 118.3600, lat: 24.3700, k: "region" },
    matsu:     { n: "馬祖", lon: 119.9500, lat: 26.0800, k: "region" }
  },

  // 事件: date 決定時間軸位置; when 是顯示用的文字; p = 事件發生時的政權; involves = 其他相關的政權 (事件焦點圖層會一起畫);
  // places = 地圖上要標出的地點;
  // b = 重點 (每行一句); s = 補充說明 (來源說法不一致之處); ref = 出處 [網址, 顯示文字]
  events: [
    { date: "1624-08", when: "1624 年 8 月", t: "荷蘭人在大員蓋城堡", p: "nl", places: ["zeelandia"],
      b: ["荷蘭人想找一個能和中國、日本做生意的基地, 選中了台南的大員.", "他們開始蓋熱蘭遮城, 1634 年才全部完工.", "這座城堡也是荷蘭人管理台灣的辦公中心."],
      s: "現在的安平古堡大多是後來重建的, 地圖標的是遺址位置.",
      ref: [["https://zh.wikipedia.org/wiki/安平古堡", "維基: 安平古堡"], ["https://en.wikipedia.org/wiki/Dutch_Formosa", "Wikipedia: Dutch Formosa"]] },
    { date: "1626-05", when: "1626 年 5 月", t: "西班牙人來到北台灣", p: "es", places: ["salvador"],
      b: ["西班牙人從菲律賓的馬尼拉坐船來, 在基隆外的和平島上岸.", "他們蓋了聖薩爾瓦多城, 想保護貿易, 也想傳教.", "幾年後, 他們又在淡水蓋了另一座城."],
      s: "上岸的日子有 5 月 11、12、16 日幾種說法, 這裡只寫月份.",
      ref: [["https://zh.wikipedia.org/wiki/聖薩爾瓦多城", "維基: 聖薩爾瓦多城"], ["https://en.wikipedia.org/wiki/Spanish_Formosa", "Wikipedia: Spanish Formosa"]] },
    { date: "1642-08-26", when: "1642 年 8 月下旬", t: "荷蘭趕走西班牙", p: "nl", involves: ["es"], places: ["salvador"],
      b: ["西班牙把不少士兵調回菲律賓, 北台灣的防守變弱了.", "荷蘭派船攻打基隆, 西班牙守軍投降後被送回馬尼拉.", "從此荷蘭同時掌握台灣南部和北部的海岸."],
      s: "投降日有 8 月 26 日和 28 日兩種說法.",
      ref: [["https://zh.wikipedia.org/wiki/臺灣西班牙統治時期", "維基: 臺灣西班牙統治時期"], ["https://en.wikipedia.org/wiki/Battle_of_San_Salvador_(1642)", "Wikipedia: Battle of San Salvador"]] },
    { date: "1662-02-01", when: "1662 年 2 月 1 日", t: "鄭成功打敗荷蘭人", p: "zh", places: ["luermen", "zeelandia"],
      b: ["1661 年 4 月, 鄭成功帶著約 2 萬 5 千名士兵從金門出發, 經鹿耳門進入台江內海.", "他先拿下赤崁, 再把熱蘭遮城圍了大約九個月.", "荷蘭人簽下投降書後離開, 明鄭時期開始."],
      s: "2 月 1 日是簽投降書, 2 月 9 日是交出城堡. 鹿耳門的水道後來被泥沙填平, 位置是大約.",
      ref: [["https://zh.wikipedia.org/wiki/鄭成功攻臺之役", "維基: 鄭成功攻臺之役"], ["https://en.wikipedia.org/wiki/Siege_of_Fort_Zeelandia", "Wikipedia: Siege of Fort Zeelandia"]] },
    { date: "1683-07-16", when: "1683 年 7 月 16 日", t: "澎湖海戰, 清朝統治台灣", p: "qing", involves: ["zh"], places: ["magong"],
      b: ["清朝的施琅帶領水師攻打澎湖, 和明鄭的水軍在海上決戰.", "明鄭打輸後決定投降, 明鄭時期結束.", "隔年 (1684) 清朝設立台灣府, 府城就在今天的台南."],
      s: "7 月 16 日是決戰日. 明鄭正式投降的日子, 有 9 月到 10 月好幾種說法.",
      ref: [["https://zh.wikipedia.org/wiki/澎湖海战", "維基: 澎湖海戰"], ["https://en.wikipedia.org/wiki/Kingdom_of_Tungning", "Wikipedia: Kingdom of Tungning"]] },
    { date: "1787-01-16", when: "1787 年 1 月 16 日", t: "林爽文事件", p: "qing", places: ["dali"],
      b: ["林爽文在大里杙 (今台中大里) 起事, 很快攻下彰化.", "不同移民群體各有立場, 也有人幫清軍守城.", "清朝派福康安來台, 1788 年抓到林爽文; 諸羅縣因守城有功改名嘉義."],
      s: "常說 \"1786 年林爽文事件\", 那是農曆的乾隆 51 年; 換成西曆是 1787 年 1 月 16 日起事. 大里杙的位置是大約.",
      ref: [["https://zh.wikipedia.org/wiki/林爽文事件", "維基: 林爽文事件"], ["https://en.wikipedia.org/wiki/Lin_Shuangwen_rebellion", "Wikipedia: Lin Shuangwen rebellion"]] },
    { date: "1874-05-22", when: "1874 年 5 月 22 日", t: "牡丹社事件", p: "qing", involves: ["ind"], places: ["shimen"],
      b: ["1871 年底, 一艘琉球的船被颱風吹到台灣南部, 54 名船員被當地排灣族殺害.", "1874 年日本以此為理由派兵上岸, 5 月 22 日和排灣族在石門交戰.", "這件事讓清朝開始重視台灣南部和東部."],
      s: "石門戰役是 5 月 22 日; 臺灣大百科寫 5 月 23 日.",
      ref: [["https://zh.wikipedia.org/wiki/牡丹社事件", "維基: 牡丹社事件"], ["https://en.wikipedia.org/wiki/Mudan_incident", "Wikipedia: Mudan incident"]] },
    { date: "1884-10-08", when: "1884 年 10 月 8 日", t: "清法戰爭: 滬尾之役", p: "qing", places: ["huwei", "shiqiu"],
      b: ["清朝和法國為了越南打仗, 戰火延燒到台灣.", "法軍佔領了基隆, 但在淡水 (滬尾) 被清軍打退.", "戰後清朝更看重台灣這個地方."],
      s: "法軍 8 月起攻打基隆, 10 月 2 日佔領基隆, 1885 年 6 月才撤走.",
      ref: [["https://zh.wikipedia.org/wiki/滬尾之役", "維基: 滬尾之役"], ["https://en.wikipedia.org/wiki/Battle_of_Tamsui", "Wikipedia: Battle of Tamsui"]] },
    { date: "1885-10-12", when: "1885 年 10 月 12 日", t: "台灣建省", p: "qing", places: ["zhongshan", "tcpark"],
      b: ["清朝決定讓台灣成為一個省, 劉銘傳是第一位巡撫.", "劉銘傳修鐵路、架電報線, 推動很多新建設.", "原本計畫把省城蓋在台中, 但沒有完成, 巡撫一直在台北辦公."],
      s: "10 月 12 日是清朝下令建省; 正式分開成省是 1887 到 1888 年. 巡撫辦公的地方是今天的中山堂一帶.",
      ref: [["https://zh.wikipedia.org/wiki/臺灣建省", "維基: 臺灣建省"], ["https://zh.wikipedia.org/wiki/臺灣布政使司衙門", "維基: 臺灣布政使司衙門"]] },
    { date: "1895-06-17", when: "1895 年 4–6 月", t: "馬關條約, 日本統治台灣", p: "jp", places: ["aodi", "zhongshan"],
      b: ["清朝打輸甲午戰爭, 4 月 17 日在日本下關簽下馬關條約, 把台灣和澎湖割讓給日本.", "5 月 29 日日軍從澳底上岸, 台灣各地抵抗了大約 5 個月.", "6 月 17 日日本在台北舉行始政式, 開始 50 年的統治."],
      s: "簽條約的下關在日本, 不在這張地圖的範圍內. 時間軸上的位置是 6 月 17 日始政式.",
      ref: [["https://zh.wikipedia.org/wiki/馬關條約", "維基: 馬關條約"], ["https://zh.wikipedia.org/wiki/乙未戰爭", "維基: 乙未戰爭"]] },
    { date: "1908-04-20", when: "1908 年 4 月 20 日", t: "縱貫鐵路全線通車", p: "jp", places: ["tcpark"],
      b: ["日本從 1899 年起, 由南北兩端同時開始修鐵路.", "1908 年基隆到高雄的鐵路接通, 南北往來快了很多.", "同年 10 月在台中公園辦慶祝典禮, 公園的湖心亭就是為典禮蓋的."],
      s: "慶典日 (10 月 24 日) 只找到二手資料.",
      ref: [["https://zh.wikipedia.org/wiki/縱貫線", "維基: 縱貫線"], ["https://zh.wikipedia.org/wiki/臺中公園", "維基: 臺中公園"]] },
    { date: "1930-10-27", when: "1930 年 10 月 27 日", t: "霧社事件", p: "jp", places: ["wushe"],
      b: ["賽德克族人長期受到日本警察的壓迫和勞役.", "在莫那魯道帶領下, 他們在運動會當天襲擊日本人.", "日本出動軍隊和警察鎮壓, 事後也檢討了對原住民的統治方式."],
      s: "雙方紀錄的傷亡人數差很多, 這裡不寫數字.",
      ref: [["https://zh.wikipedia.org/wiki/霧社事件", "維基: 霧社事件"], ["https://en.wikipedia.org/wiki/Musha_Incident", "Wikipedia: Musha Incident"]] },
    { date: "1945-10-25", when: "1945 年 10 月 25 日", t: "中華民國接收台灣", p: "roc", places: ["zhongshan"],
      b: ["1945 年 8 月日本宣布投降, 第二次世界大戰結束.", "10 月 25 日在台北公會堂 (今中山堂) 舉行受降典禮, 陳儀代表中華民國接受.", "台灣從此由中華民國政府管理."],
      ref: [["https://zh.wikipedia.org/wiki/臺灣光復", "維基: 臺灣光復"], ["https://en.wikipedia.org/wiki/Retrocession_Day", "Wikipedia: Retrocession Day"]] },
    { date: "1947-02-27", when: "1947 年 2 月 27–28 日", t: "二二八事件", p: "roc", places: ["tianma"],
      b: ["戰後物價飛漲, 很多人對政府不滿.", "2 月 27 日查緝私菸時發生衝突, 隔天民眾抗議, 事件擴大到全台灣.", "政府派軍隊鎮壓, 很多人遇難或失蹤; 這段歷史後來被公開討論和紀念."],
      s: "天馬茶房的原建築已拆除, 地圖標的是原址. 遇難人數各方估計差很多, 這裡不寫數字.",
      ref: [["https://zh.wikipedia.org/wiki/二二八事件", "維基: 二二八事件"], ["https://en.wikipedia.org/wiki/February_28_incident", "Wikipedia: February 28 incident"]] },
    { date: "1949-05-20", when: "1949 年 5 月 20 日", t: "戒嚴開始, 政府遷台", p: "roc", places: ["president"],
      b: ["國共內戰中國民政府節節敗退, 台灣從 5 月 20 日開始戒嚴, 集會和結社都受到限制.", "12 月 7 日, 中華民國政府決定遷到台北.", "戒嚴一共持續了 38 年."],
      s: "戒嚴令 5 月 19 日公布, 5 月 20 日生效.",
      ref: [["https://zh.wikipedia.org/wiki/臺灣戒嚴時期", "維基: 臺灣戒嚴時期"], ["https://zh.wikipedia.org/wiki/中華民國政府遷臺", "維基: 中華民國政府遷臺"]] },
    { date: "1987-07-15", when: "1987 年 7 月 15 日", t: "解除戒嚴", p: "roc", places: ["president"],
      b: ["蔣經國總統宣布, 從 7 月 15 日起解除台灣的戒嚴.", "人民可以更自由地集會、組織團體、發表意見.", "台灣的民主化從此加快."],
      s: "金門、馬祖的戰地政務是另外結束的.",
      ref: [["https://zh.wikipedia.org/wiki/解嚴", "維基: 解嚴"], ["https://en.wikipedia.org/wiki/Martial_law_in_Taiwan", "Wikipedia: Martial law in Taiwan"]] },
    { date: "1996-03-23", when: "1996 年 3 月 23 日", t: "第一次總統直選", p: "roc", places: ["president"],
      b: ["以前總統是由國民大會代表選出, 人民不能直接投票.", "1996 年 3 月 23 日, 台灣人民第一次自己投票選總統.", "李登輝當選, 這是台灣民主化的重要一步."],
      ref: [["https://zh.wikipedia.org/wiki/1996年中華民國總統選舉", "維基: 1996年總統選舉"], ["https://en.wikipedia.org/wiki/1996_Taiwanese_presidential_election", "Wikipedia: 1996 election"]] }
  ],

  // 頁尾 "資料來源", 每行一件事
  sources: [
    "事件的日期和地點, 以中文與英文維基百科交叉比對; 每則事件卡下方有連結.",
    "遺址座標另外用 OpenStreetMap 核對.",
    "來源之間說法不一致的地方, 寫在事件卡的 \"補充說明\".",
    "統治範圍的色塊和長條, 是依各時期的文字描述估計的示意, 不是真實疆界.",
    "地圖: Natural Earth 10m 海岸線."
  ]
};
