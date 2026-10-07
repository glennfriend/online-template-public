// 放假日曆的資料. 換年份 / 換地區只改這個檔.
// 日期一律寫成字串 "YYYY-MM-DD" (西元); 星期幾不用寫, 引擎會算.
// 連假只寫第一天 + days, 不逐日展開 (逐日由引擎算).
window.HOLIDAY = {
  title: "2027 台灣/美國 放假日",
  updatedAt: "2026-10-07",

  // regions: 順序 = 顯示順序 (合併區塊同一天時也照這個順序)
  //   prefix: 合併顯示時加在說明前面 (不寫就不加). 假期加 "{prefix}假期 ", 資訊日加 "{prefix} "
  // events:
  //   name: 假期名稱 (連假第二天起只顯示這個)
  //   note: 補充說明, 只在第一天顯示, 引擎會包成 " (note)"
  //   days: 連假天數, 不寫 = 1
  //   type: "info" = 非放假的資訊日 (例如時區切換), 不寫 = 放假
  regions: [
    {
      name: "台灣",
      events: [
        { date: "2027-01-01", name: "開國紀念日", days: 3 },
        { date: "2027-02-04", name: "農曆春節", note: "含小年夜/除夕, 初一初二補假 2/9-2/10", days: 7 },
        { date: "2027-02-27", name: "和平紀念日", note: "2/28 逢日, 3/1 補假", days: 3 },
        { date: "2027-04-03", name: "兒童節及清明節", note: "4/4 逢日, 4/6 補假", days: 4 },
        { date: "2027-04-30", name: "勞動節", note: "5/1 逢六, 4/30 補假", days: 3 },
        { date: "2027-06-09", name: "端午節" },
        { date: "2027-09-15", name: "中秋節" },
        { date: "2027-09-28", name: "教師節" },
        { date: "2027-10-09", name: "國慶日", note: "10/10 逢日, 10/11 補假", days: 3 },
        { date: "2027-10-23", name: "臺灣光復暨金門古寧頭大捷紀念日", days: 3 },
        { date: "2027-12-24", name: "行憲紀念日", note: "12/25 逢六, 12/24 補假", days: 3 },
        { date: "2027-12-31", name: "2028 開國紀念日補假", note: "1/1 逢六, 連假 12/31-1/2" }
      ]
    },
    {
      name: "美國",
      prefix: "美國",
      events: [
        { date: "2027-01-01", name: "New Year's Day" },
        { date: "2027-01-18", name: "Martin Luther King Jr. Day" },
        { date: "2027-02-15", name: "Washington's Birthday", note: "Presidents' Day" },
        { date: "2027-03-14", name: "夏令時間開始 DST starts", note: "02:00 撥快 1 小時", type: "info" },
        { date: "2027-05-31", name: "Memorial Day" },
        { date: "2027-06-18", name: "Juneteenth", note: "observed, 6/19 逢六" },
        { date: "2027-07-05", name: "Independence Day", note: "observed, 7/4 逢日" },
        { date: "2027-09-06", name: "Labor Day" },
        { date: "2027-10-11", name: "Columbus Day" },
        { date: "2027-11-07", name: "標準時間開始 DST ends", note: "02:00 撥慢 1 小時", type: "info" },
        { date: "2027-11-11", name: "Veterans Day" },
        { date: "2027-11-25", name: "Thanksgiving Day" },
        { date: "2027-12-24", name: "Christmas Day", note: "observed, 12/25 逢六" },
        { date: "2027-12-31", name: "New Year's Day 2028", note: "observed, 1/1 逢六" }
      ]
    }
  ],

  // 資料來源, 列在頁面最後 (讓讀者核對)
  sources: [
    { label: "ETtoday: 2027年行事曆出爐 (116年辦公日曆表)", url: "https://www.ettoday.net/news/20260521/3169805.htm" },
    { label: "104 職場力: 2027 台灣政府行事曆", url: "https://blog.104.com.tw/2027-taiwan-government-calendar/" },
    { label: "行政院人事行政總處", url: "https://www.dgpa.gov.tw" },
    { label: "OPM Federal Holidays", url: "https://www.opm.gov/Operating_Status_Schedules/fedhol" },
    { label: "FedPayScale 2027 Federal Holiday Schedule", url: "https://fedpayscale.org/holidays/2027/" }
  ]
};
