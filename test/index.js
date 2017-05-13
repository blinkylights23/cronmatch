import cronmatch from '../src';
import getRange from '../src/getRange';
import { expect } from 'chai';

describe('The getRange function', () => {

  it('should produce the correct range', () => {
    let testRange = [1, 10];
    let result = getRange(testRange[0], testRange[1]);
    expect(result).to.be.an('array').of.length(10);
    expect(result).to.eql([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });
  it('should tolerate out-of-order values', () => {
    let testRange = [15, 10];
    let result = getRange(testRange[0], testRange[1]);
    expect(result).to.be.an('array').of.length(6);
    expect(result).to.eql([10, 11, 12, 13, 14, 15]);
  });

});

describe('The cron expression parser\'s', () => {

  describe('minutes field', () => {
    it('should correctly parse * * * * *', () => {
      let cronExpr = '* * * * *';
      let date1 = new Date('January 20, 2020 12:00:00');
      let date2 = new Date('January 20, 2020 12:01:00');
      let date3 = new Date('January 20, 2020 12:13:00');
      expect(cronmatch(cronExpr, date1)).to.be.true;
      expect(cronmatch(cronExpr, date2)).to.be.true;
      expect(cronmatch(cronExpr, date3)).to.be.true;
    });
    it('should correctly use a step of 1 for */0 * * * *', () => {
      let cronExpr = '*/0 * * * *';
      let date1 = new Date('January 20, 2020 12:00:00');
      let date2 = new Date('January 20, 2020 12:01:00');
      let date3 = new Date('January 20, 2020 12:13:00');
      expect(cronmatch(cronExpr, date1)).to.be.true;
      expect(cronmatch(cronExpr, date2)).to.be.true;
      expect(cronmatch(cronExpr, date3)).to.be.true;
    });
    it('should correctly parse 20-29 * * * *', () => {
      let cronExpr = '20-29 * * * *';
      let date1 = new Date('January 20, 2020 12:01:00');
      let date2 = new Date('January 20, 2020 12:22:00');
      let date3 = new Date('January 20, 2020 12:31:00');
      expect(cronmatch(cronExpr, date1)).to.be.false;
      expect(cronmatch(cronExpr, date2)).to.be.true;
      expect(cronmatch(cronExpr, date3)).to.be.false;
    });
    it('should correctly parse 30-40/2 * * * *', () => {
      let cronExpr = '30-40/2 * * * *';
      let date1 = new Date('January 20, 2020 12:01:00');
      let date2 = new Date('January 20, 2020 12:30:00');
      let date3 = new Date('January 20, 2020 12:31:00');
      let date4 = new Date('January 20, 2020 12:32:00');
      let date5 = new Date('January 20, 2020 12:40:00');
      let date6 = new Date('January 20, 2020 12:50:00');
      expect(cronmatch(cronExpr, date1)).to.be.false;
      expect(cronmatch(cronExpr, date2)).to.be.true;
      expect(cronmatch(cronExpr, date3)).to.be.false;
      expect(cronmatch(cronExpr, date4)).to.be.true;
      expect(cronmatch(cronExpr, date5)).to.be.true;
      expect(cronmatch(cronExpr, date6)).to.be.false;
    });
    it('should correctly parse */3 * * * *', () => {
      let cronExpr = '*/3 * * * *';
      let date1 = new Date('January 20, 2020 12:00:00');
      let date2 = new Date('January 20, 2020 12:01:00');
      let date3 = new Date('January 20, 2020 12:02:00');
      let date4 = new Date('January 20, 2020 12:03:00');
      let date5 = new Date('January 20, 2020 12:04:00');
      let date6 = new Date('January 20, 2020 12:05:00');
      let date7 = new Date('January 20, 2020 12:06:00');
      expect(cronmatch(cronExpr, date1)).to.be.true;
      expect(cronmatch(cronExpr, date2)).to.be.false;
      expect(cronmatch(cronExpr, date3)).to.be.false;
      expect(cronmatch(cronExpr, date4)).to.be.true;
      expect(cronmatch(cronExpr, date5)).to.be.false;
      expect(cronmatch(cronExpr, date6)).to.be.false;
      expect(cronmatch(cronExpr, date7)).to.be.true;
    });
    it('should correctly parse 0,13,29,51 * * * *', () => {
      let cronExpr = '0,13,29,51 * * * *';
      let date1 = new Date('January 20, 2020 12:00:00');
      let date2 = new Date('January 20, 2020 12:01:00');
      let date3 = new Date('January 20, 2020 12:13:00');
      let date4 = new Date('January 20, 2020 12:29:00');
      let date5 = new Date('January 20, 2020 12:51:00');
      let date6 = new Date('January 20, 2020 12:05:00');
      let date7 = new Date('January 20, 2020 12:55:00');
      expect(cronmatch(cronExpr, date1)).to.be.true;
      expect(cronmatch(cronExpr, date2)).to.be.false;
      expect(cronmatch(cronExpr, date3)).to.be.true;
      expect(cronmatch(cronExpr, date4)).to.be.true;
      expect(cronmatch(cronExpr, date5)).to.be.true;
      expect(cronmatch(cronExpr, date6)).to.be.false;
      expect(cronmatch(cronExpr, date7)).to.be.false;
    });
    it('should correctly parse 20-30,48 * * * *', () => {
      let cronExpr = '20-30,48 * * * *';
      let date1 = new Date('January 20, 2020 12:01:00');
      let date2 = new Date('January 20, 2020 12:20:00');
      let date3 = new Date('January 20, 2020 12:29:00');
      let date4 = new Date('January 20, 2020 12:30:00');
      let date5 = new Date('January 20, 2020 12:47:00');
      let date6 = new Date('January 20, 2020 12:48:00');
      let date7 = new Date('January 20, 2020 12:49:00');
      expect(cronmatch(cronExpr, date1)).to.be.false;
      expect(cronmatch(cronExpr, date2)).to.be.true;
      expect(cronmatch(cronExpr, date3)).to.be.true;
      expect(cronmatch(cronExpr, date4)).to.be.true;
      expect(cronmatch(cronExpr, date5)).to.be.false;
      expect(cronmatch(cronExpr, date6)).to.be.true;
      expect(cronmatch(cronExpr, date7)).to.be.false;
    });
  });

});
