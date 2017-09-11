const moment = require('moment');

module.exports = class SchoolCalendar {

  constructor({
    startDate,
    endDate
  }) {
    const now = new Date();
    this.startDate = moment(startDate || now);
    this.endDate = moment(endDate || now);
    this.currentDate = moment(now);
  }

  diffDays(m1, m2) {
    // 仅年月日参与天数间隔计算, 以免产生误差
    return moment(m2.format('YYYY-MM-DD')).diff(
      moment(m1.format('YYYY-MM-DD')),
      'days'
    );
  }

  getDetail() {
    const { startDate, endDate, currentDate } = this;
    const { abs, floor, ceil } = Math;
    const passedDays = abs(this.diffDays(startDate, currentDate));
    const remainingDays = abs(this.diffDays(currentDate, endDate));
    const passedWeeks = passedDays / 7;

    return {
      year: currentDate.get('year'),
      month: currentDate.get('month') + 1,
      date: currentDate.get('date'),
      week: floor(passedWeeks) === passedWeeks ? passedWeeks + 1 : ceil(passedWeeks),
      day: passedDays % 7 + 1,
      passedDays,
      remainingDays
    };
  }

  parseText(text) {
    const textToKey = {
      '年': 'year',
      '月': 'month',
      '日': 'date',
      '校历周': 'week',
      '星期': 'day',
      '已开学天数': 'passedDays',
      '距放假天数': 'remainingDays'
    };
    const toChineseDay = ['一', '二', '三', '四', '五', '六', '日'];
    const schoolCalendar = this.getDetail();
    schoolCalendar.day = toChineseDay[schoolCalendar.day - 1];
    Object.keys(textToKey).forEach(t => {
      let value = schoolCalendar[textToKey[t]];
      text = text.replace(
        new RegExp(`\\[${t}\\]`, 'g'),
        isNaN(value) && toChineseDay.indexOf(value) === -1 ? '(参数未设置)' : value
      );
    });
    return text;
  }

};
