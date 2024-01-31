var data = { a: 100 }
var vm = new Vue({
  el: '#app',
  data: {
    today: {
        date: new Date(),
        year: 0,
        month: 0,
        day: 0,
        fullStr: ""
    },
    tom: {
        fullStr: ""
    },
    model_date: new Date("2023-7-02"),
    table: []
  },
  created() {
    // this.today.date.setDate(this.today.date.getDate() + 7)

    // 获取年份
    this.today.year = this.today.date.getFullYear();
    // 获取月份（注意，月份从0开始计数，所以需要加1）
    this.today.month = this.today.date.getMonth() + 1;
    // 获取日期
    this.today.day = this.today.date.getDate();
    this.today.fullStr = this.getDateString(this.today.date)

    var li = this.generateDateList(this.today.date)
    this.generateTable(li)
    this.gettom()

  },
  methods: {
    gettom() {
        const date = new Date();
        date.setDate(this.today.date.getDate() + 1);
        const tomFullStr = this.getDateString(date);

        const tomstatus = this.table.find((element) => {
            return element.dateStr === tomFullStr;
        });

        this.tom.fullStr = tomFullStr
        this.tom.status = tomstatus
    },
    daysBetweenDates(date1, date2) {
        const diffInMilliseconds = Math.abs(date2 - date1);
        // 计算相差的天数
        return Math.ceil(diffInMilliseconds / (1000 * 60 * 60 * 24))
    },
    getDateString(date) {
        const year = date.getFullYear();
        const month = ("0" + (date.getMonth() + 1)).slice(-2);
        const day = ("0" + date.getDate()).slice(-2);
        return year + "-" + month + "-" + day;
    },
    getWeekNumStr(date) {
        // 获取星期几
        let dayOfWeek = date.getDay();
        // 将数字转换为相应的星期几字符串
        let weekdays = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
        // 打印结果
        return weekdays[dayOfWeek]
    },
    generateDateList(date) {
        // 获取今天日期对象
        let today = date;

        // 创建一个空数组来存储日期字符串列表
        let dateStrings = [];
        let mondayFlag = false;

        // 循环生成今天前后14天的日期字符串列表
        for (let i = -6; i <= 30; i++) {
            let date = new Date(today);
            date.setDate(today.getDate() + i);
            let weekNumStr = this.getWeekNumStr(date)
            if(weekNumStr !== "星期一" && !mondayFlag) {
                continue
            } else {
                mondayFlag = true
            }
            let dateString = this.getDateString(date);
            dateStrings.push(dateString);
        }

        return dateStrings
    },
    getBan(date) {
        const ban_status = ["xiawu", "shangwu_wanshang", "zhengchang"];
        const days = (this.daysBetweenDates(date, this.model_date) - 1) % 3;
        console.log(this.daysBetweenDates(date, this.model_date))
        return ban_status[days]
    },
    generateTable(dateList) {
        dateList.forEach(d => {
            this.table.push({
                dateStr: d,
                weekNumStr: this.getWeekNumStr(new Date(d)),
                ban: this.getBan(new Date(d))
            })
        });
        this.table.forEach(d => {
            const date = new Date(d.dateStr);
            if(date < new Date(this.today.fullStr)) {
                d['outdate'] = true
            }

            d['xiuxi'] = (d.weekNumStr === "星期二" || d.weekNumStr === "星期三" || d.weekNumStr === "星期四")
                && (d.ban === "zhengchang" || d.ban === "qingjia");

            if(d.ban === "zhengchang") {
                d.ban = "qingjia"
            }
        })
    },
    continueLoad() {
        const lastday = this.table[this.table.length - 1];
        // 获取今天日期对象
        const today = new Date(lastday.dateStr);
        const dateStrings = [];
        for (var i = 1; i <= 30; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            const dateString = this.getDateString(date);
            dateStrings.push(dateString);
        }
        this.generateTable(dateStrings)
    }
  }
})