const moment = require('moment');

module.exports = class SchoolCalendar {

  constructor({
    startDate,
    endDate
  }) {
    this.startDate = moment(startDate);
    this.endDate = moment(endDate);
    this.currentDate = moment(new Date());
  }

  getDetail() {
    const { startDate, endDate, currentDate } = this;
    const { abs, floor, ceil } = Math;
    const passedDays = ceil(abs(currentDate.diff(startDate, 'days', true)));
    const remainingDays = ceil(abs(currentDate.diff(endDate, 'days', true)));
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
