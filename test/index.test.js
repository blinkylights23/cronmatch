import cronmatch from '../src'
import getRange from '../src/getRange'

jest.useFakeTimers()

describe('The getRange function', () => {
  it('should produce the correct range', () => {
    let testRange = [1, 10]
    let result = getRange(testRange[0], testRange[1])
    expect(result).toHaveLength(10)
    expect(result).toStrictEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
  })
  it('should tolerate out-of-order values', () => {
    let testRange = [15, 10]
    let result = getRange(testRange[0], testRange[1])
    expect(result).toHaveLength(6)
    expect(result).toStrictEqual([10, 11, 12, 13, 14, 15])
  })
})

describe('The date argument', () => {
  it('should accept a Date object', () => {
    let cronExpr = '* * * * *'
    let date = new Date('January 20, 2020 12:00:00')
    expect(cronmatch(cronExpr, date)).toBe(true)
  })
  it('should accept a valid date string', () => {
    let cronExpr = '* * * * *'
    let date = 'January 20, 2020 12:00:00'
    expect(cronmatch(cronExpr, date)).toBe(true)
  })
  it('should use current time when dateArg is missing', () => {
    var date1 = new Date('January 20, 2020 12:00:00')
    var date2 = new Date('January 20, 2020 12:01:00')
    let cronExpr = '0 * * * *'
    jest.setSystemTime(date1)
    expect(cronmatch(cronExpr)).toBe(true)
    jest.setSystemTime(date2)
    expect(cronmatch(cronExpr)).toBe(false)
  })
  it('should return false when dateArg is invalid', () => {
    let cronExpr = '* * * * *'
    let date = 'January 40, 202 27:00:00'
    expect(cronmatch(cronExpr, date)).toBe(false)
  })
})

describe("The cron expression parser's", () => {
  describe('minutes field', () => {
    it('should correctly parse * * * * *', () => {
      let cronExpr = '* * * * *'
      let date1 = new Date('January 20, 2020 12:00:00')
      let date2 = new Date('January 20, 2020 12:01:00')
      let date3 = new Date('January 20, 2020 12:13:00')
      expect(cronmatch(cronExpr, date1)).toBe(true)
      expect(cronmatch(cronExpr, date2)).toBe(true)
      expect(cronmatch(cronExpr, date3)).toBe(true)
    })
    it('should correctly use a step of 1 for */0 * * * *', () => {
      let cronExpr = '*/0 * * * *'
      let date1 = new Date('January 20, 2020 12:00:00')
      let date2 = new Date('January 20, 2020 12:01:00')
      let date3 = new Date('January 20, 2020 12:13:00')
      expect(cronmatch(cronExpr, date1)).toBe(true)
      expect(cronmatch(cronExpr, date2)).toBe(true)
      expect(cronmatch(cronExpr, date3)).toBe(true)
    })
    it('should correctly parse 20-29 * * * *', () => {
      let cronExpr = '20-29 * * * *'
      let date1 = new Date('January 20, 2020 12:01:00')
      let date2 = new Date('January 20, 2020 12:22:00')
      let date3 = new Date('January 20, 2020 12:31:00')
      expect(cronmatch(cronExpr, date1)).toBe(false)
      expect(cronmatch(cronExpr, date2)).toBe(true)
      expect(cronmatch(cronExpr, date3)).toBe(false)
    })
    it('should correctly parse 30-40/2 * * * *', () => {
      let cronExpr = '30-40/2 * * * *'
      let date1 = new Date('January 20, 2020 12:01:00')
      let date2 = new Date('January 20, 2020 12:30:00')
      let date3 = new Date('January 20, 2020 12:31:00')
      let date4 = new Date('January 20, 2020 12:32:00')
      let date5 = new Date('January 20, 2020 12:40:00')
      let date6 = new Date('January 20, 2020 12:50:00')
      expect(cronmatch(cronExpr, date1)).toBe(false)
      expect(cronmatch(cronExpr, date2)).toBe(true)
      expect(cronmatch(cronExpr, date3)).toBe(false)
      expect(cronmatch(cronExpr, date4)).toBe(true)
      expect(cronmatch(cronExpr, date5)).toBe(true)
      expect(cronmatch(cronExpr, date6)).toBe(false)
    })
    it('should correctly parse */3 * * * *', () => {
      let cronExpr = '*/3 * * * *'
      let date1 = new Date('January 20, 2020 12:00:00')
      let date2 = new Date('January 20, 2020 12:01:00')
      let date3 = new Date('January 20, 2020 12:02:00')
      let date4 = new Date('January 20, 2020 12:03:00')
      let date5 = new Date('January 20, 2020 12:04:00')
      let date6 = new Date('January 20, 2020 12:05:00')
      let date7 = new Date('January 20, 2020 12:06:00')
      expect(cronmatch(cronExpr, date1)).toBe(true)
      expect(cronmatch(cronExpr, date2)).toBe(false)
      expect(cronmatch(cronExpr, date3)).toBe(false)
      expect(cronmatch(cronExpr, date4)).toBe(true)
      expect(cronmatch(cronExpr, date5)).toBe(false)
      expect(cronmatch(cronExpr, date6)).toBe(false)
      expect(cronmatch(cronExpr, date7)).toBe(true)
    })
    it('should correctly parse 0,13,29,51 * * * *', () => {
      let cronExpr = '0,13,29,51 * * * *'
      let date1 = new Date('January 20, 2020 12:00:00')
      let date2 = new Date('January 20, 2020 12:01:00')
      let date3 = new Date('January 20, 2020 12:13:00')
      let date4 = new Date('January 20, 2020 12:29:00')
      let date5 = new Date('January 20, 2020 12:51:00')
      let date6 = new Date('January 20, 2020 12:05:00')
      let date7 = new Date('January 20, 2020 12:55:00')
      expect(cronmatch(cronExpr, date1)).toBe(true)
      expect(cronmatch(cronExpr, date2)).toBe(false)
      expect(cronmatch(cronExpr, date3)).toBe(true)
      expect(cronmatch(cronExpr, date4)).toBe(true)
      expect(cronmatch(cronExpr, date5)).toBe(true)
      expect(cronmatch(cronExpr, date6)).toBe(false)
      expect(cronmatch(cronExpr, date7)).toBe(false)
    })
    it('should correctly parse 20-30,48 * * * *', () => {
      let cronExpr = '20-30,48 * * * *'
      let date1 = new Date('January 20, 2020 12:01:00')
      let date2 = new Date('January 20, 2020 12:20:00')
      let date3 = new Date('January 20, 2020 12:29:00')
      let date4 = new Date('January 20, 2020 12:30:00')
      let date5 = new Date('January 20, 2020 12:47:00')
      let date6 = new Date('January 20, 2020 12:48:00')
      let date7 = new Date('January 20, 2020 12:49:00')
      expect(cronmatch(cronExpr, date1)).toBe(false)
      expect(cronmatch(cronExpr, date2)).toBe(true)
      expect(cronmatch(cronExpr, date3)).toBe(true)
      expect(cronmatch(cronExpr, date4)).toBe(true)
      expect(cronmatch(cronExpr, date5)).toBe(false)
      expect(cronmatch(cronExpr, date6)).toBe(true)
      expect(cronmatch(cronExpr, date7)).toBe(false)
    })
  })
})
