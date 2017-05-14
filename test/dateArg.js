import cronmatch from '../src';
import { expect } from 'chai';
import sinon from 'sinon';

describe('The date argument', () => {
  var ce;

  beforeEach(() => {
    ce = sinon.stub(console, 'error');
  });

  afterEach(() => {
    ce.restore();
  });

  it('should accept a Date object', () => {
    let cronExpr = '* * * * *';
    let date = new Date('January 20, 2020 12:00:00');
    expect(cronmatch(cronExpr, date)).to.be.true;
    expect(ce.called).to.be.false;
  });

  it('should accept a valid date string', () => {
    let cronExpr = '* * * * *';
    let date = 'January 20, 2020 12:00:00';
    expect(cronmatch(cronExpr, date)).to.be.true;
    expect(ce.called).to.be.false;
  });

  it('should use current time when dateArg is missing', () => {
    var date1 = new Date('January 20, 2020 12:00:00');
    var date2 = new Date('January 20, 2020 12:01:00');
    let cronExpr = '0 * * * *';
    sinon.useFakeTimers(date1);
    expect(cronmatch(cronExpr)).to.be.true;
    sinon.useFakeTimers(date2);
    expect(cronmatch(cronExpr)).to.be.false;
    expect(ce.called).to.be.false;
  });

  it('should return false when dateArg is invalid', () => {
    let cronExpr = '* * * * *';
    let date = 'January 40, 202 27:00:00';
    expect(cronmatch(cronExpr, date)).to.be.false;
    expect(ce.calledOnce).to.be.true;
  });

});
