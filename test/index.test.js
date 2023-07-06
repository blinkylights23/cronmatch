import cronmatch from '../src/index.js'
import getRange from '../src/getRange.js'

jest.useFakeTimers()

describe('The getRange function', () => {
  it('should produce the correct range', () => {
    const testRange = [1, 10]
    const result = getRange(testRange[0], testRange[1])
    expect(result).toHaveLength(10)
    expect(result).toStrictEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
  })
  it('should tolerate out-of-order values', () => {
    const testRange = [15, 10]
    const result = getRange(testRange[0], testRange[1])
    expect(result).toHaveLength(6)
    expect(result).toStrictEqual([10, 11, 12, 13, 14, 15])
  })
})

describe('The date argument', () => {
  it('should accept a Date object', () => {
    const cronExpr = '* * * * *'
    const date = new Date('January 20, 2020 12:00:00')
    expect(cronmatch(cronExpr, date)).toBe(true)
  })
  it('should accept a valid date string', () => {
    const cronExpr = '* * * * *'
    const date = 'January 20, 2020 12:00:00'
    expect(cronmatch(cronExpr, date)).toBe(true)
  })
  it('should use current time when dateArg is missing', () => {
    const date1 = new Date('January 20, 2020 12:00:00')
    const date2 = new Date('January 20, 2020 12:01:00')
    const cronExpr = '0 * * * *'
    jest.setSystemTime(date1)
    expect(cronmatch(cronExpr)).toBe(true)
    jest.setSystemTime(date2)
    expect(cronmatch(cronExpr)).toBe(false)
  })
  it('should throw when dateArg is invalid', () => {
    const cronExpr = '* * * * *'
    const date = 'January 40, 202 27:00:00'
    const invoke = () => cronmatch(cronExpr, date)
    expect(invoke).toThrow()
  })
})

describe("The cron expression parser's", () => {
  describe('minutes field', () => {
    it('should correctly parse * * * * *', () => {
      const cronExpr = '* * * * *'
      const date1 = new Date('January 20, 2020 12:00:00')
      const date2 = new Date('January 20, 2020 12:01:00')
      const date3 = new Date('January 20, 2020 12:13:00')
      expect(cronmatch(cronExpr, date1)).toBe(true)
      expect(cronmatch(cronExpr, date2)).toBe(true)
      expect(cronmatch(cronExpr, date3)).toBe(true)
    })
    it('should correctly use a step of 1 for */0 * * * *', () => {
      const cronExpr = '*/0 * * * *'
      const date1 = new Date('January 20, 2020 12:00:00')
      const date2 = new Date('January 20, 2020 12:01:00')
      const date3 = new Date('January 20, 2020 12:13:00')
      expect(cronmatch(cronExpr, date1)).toBe(true)
      expect(cronmatch(cronExpr, date2)).toBe(true)
      expect(cronmatch(cronExpr, date3)).toBe(true)
    })
    it('should correctly parse 20-29 * * * *', () => {
      const cronExpr = '20-29 * * * *'
      const date1 = new Date('January 20, 2020 12:01:00')
      const date2 = new Date('January 20, 2020 12:22:00')
      const date3 = new Date('January 20, 2020 12:31:00')
      expect(cronmatch(cronExpr, date1)).toBe(false)
      expect(cronmatch(cronExpr, date2)).toBe(true)
      expect(cronmatch(cronExpr, date3)).toBe(false)
    })
    it('should correctly parse 30-40/2 * * * *', () => {
      const cronExpr = '30-40/2 * * * *'
      const date1 = new Date('January 20, 2020 12:01:00')
      const date2 = new Date('January 20, 2020 12:30:00')
      const date3 = new Date('January 20, 2020 12:31:00')
      const date4 = new Date('January 20, 2020 12:32:00')
      const date5 = new Date('January 20, 2020 12:40:00')
      const date6 = new Date('January 20, 2020 12:50:00')
      expect(cronmatch(cronExpr, date1)).toBe(false)
      expect(cronmatch(cronExpr, date2)).toBe(true)
      expect(cronmatch(cronExpr, date3)).toBe(false)
      expect(cronmatch(cronExpr, date4)).toBe(true)
      expect(cronmatch(cronExpr, date5)).toBe(true)
      expect(cronmatch(cronExpr, date6)).toBe(false)
    })
    it('should correctly parse */3 * * * *', () => {
      const cronExpr = '*/3 * * * *'
      const date1 = new Date('January 20, 2020 12:00:00')
      const date2 = new Date('January 20, 2020 12:01:00')
      const date3 = new Date('January 20, 2020 12:02:00')
      const date4 = new Date('January 20, 2020 12:03:00')
      const date5 = new Date('January 20, 2020 12:04:00')
      const date6 = new Date('January 20, 2020 12:05:00')
      const date7 = new Date('January 20, 2020 12:06:00')
      expect(cronmatch(cronExpr, date1)).toBe(true)
      expect(cronmatch(cronExpr, date2)).toBe(false)
      expect(cronmatch(cronExpr, date3)).toBe(false)
      expect(cronmatch(cronExpr, date4)).toBe(true)
      expect(cronmatch(cronExpr, date5)).toBe(false)
      expect(cronmatch(cronExpr, date6)).toBe(false)
      expect(cronmatch(cronExpr, date7)).toBe(true)
    })
    it('should correctly parse 0,13,29,51 * * * *', () => {
      const cronExpr = '0,13,29,51 * * * *'
      const date1 = new Date('January 20, 2020 12:00:00')
      const date2 = new Date('January 20, 2020 12:01:00')
      const date3 = new Date('January 20, 2020 12:13:00')
      const date4 = new Date('January 20, 2020 12:29:00')
      const date5 = new Date('January 20, 2020 12:51:00')
      const date6 = new Date('January 20, 2020 12:05:00')
      const date7 = new Date('January 20, 2020 12:55:00')
      expect(cronmatch(cronExpr, date1)).toBe(true)
      expect(cronmatch(cronExpr, date2)).toBe(false)
      expect(cronmatch(cronExpr, date3)).toBe(true)
      expect(cronmatch(cronExpr, date4)).toBe(true)
      expect(cronmatch(cronExpr, date5)).toBe(true)
      expect(cronmatch(cronExpr, date6)).toBe(false)
      expect(cronmatch(cronExpr, date7)).toBe(false)
    })
    it('should correctly parse 20-30,48 * * * *', () => {
      const cronExpr = '20-30,48 * * * *'
      const date1 = new Date('January 20, 2020 12:01:00')
      const date2 = new Date('January 20, 2020 12:20:00')
      const date3 = new Date('January 20, 2020 12:29:00')
      const date4 = new Date('January 20, 2020 12:30:00')
      const date5 = new Date('January 20, 2020 12:47:00')
      const date6 = new Date('January 20, 2020 12:48:00')
      const date7 = new Date('January 20, 2020 12:49:00')
      expect(cronmatch(cronExpr, date1)).toBe(false)
      expect(cronmatch(cronExpr, date2)).toBe(true)
      expect(cronmatch(cronExpr, date3)).toBe(true)
      expect(cronmatch(cronExpr, date4)).toBe(true)
      expect(cronmatch(cronExpr, date5)).toBe(false)
      expect(cronmatch(cronExpr, date6)).toBe(true)
      expect(cronmatch(cronExpr, date7)).toBe(false)
    })
  })
  describe('hours field', () => {
    it('should correctly parse * * * * *', () => {
      const cronExpr = '* * * * *'
      const date1 = new Date('January 20, 2020 02:00:00')
      const date2 = new Date('January 20, 2020 12:00:00')
      const date3 = new Date('January 20, 2020 18:00:00')
      expect(cronmatch(cronExpr, date1)).toBe(true)
      expect(cronmatch(cronExpr, date2)).toBe(true)
      expect(cronmatch(cronExpr, date3)).toBe(true)
    })
    it('should correctly use a step of 1 for * */0 * * *', () => {
      const cronExpr = '* */0 * * *'
      const date1 = new Date('January 20, 2020 02:00:00')
      const date2 = new Date('January 20, 2020 12:00:00')
      const date3 = new Date('January 20, 2020 18:00:00')
      expect(cronmatch(cronExpr, date1)).toBe(true)
      expect(cronmatch(cronExpr, date2)).toBe(true)
      expect(cronmatch(cronExpr, date3)).toBe(true)
    })
    it('should correctly parse * 3-14 * * * *', () => {
      const cronExpr = '* 3-14 * * * *'
      const date1 = new Date('January 20, 2020 02:00:00')
      const date2 = new Date('January 20, 2020 12:00:00')
      const date3 = new Date('January 20, 2020 18:00:00')
      expect(cronmatch(cronExpr, date1)).toBe(false)
      expect(cronmatch(cronExpr, date2)).toBe(true)
      expect(cronmatch(cronExpr, date3)).toBe(false)
    })
    it('should correctly parse * 03-15/2 * * * *', () => {
      const cronExpr = '* 03-15/2 * * * *'
      const date1 = new Date('January 20, 2020 01:00:00')
      const date2 = new Date('January 20, 2020 03:00:00')
      const date3 = new Date('January 20, 2020 04:00:00')
      const date4 = new Date('January 20, 2020 12:00:00')
      const date5 = new Date('January 20, 2020 13:00:00')
      const date6 = new Date('January 20, 2020 16:00:00')
      expect(cronmatch(cronExpr, date1)).toBe(false)
      expect(cronmatch(cronExpr, date2)).toBe(true)
      expect(cronmatch(cronExpr, date3)).toBe(false)
      expect(cronmatch(cronExpr, date4)).toBe(false)
      expect(cronmatch(cronExpr, date5)).toBe(true)
      expect(cronmatch(cronExpr, date6)).toBe(false)
    })
    it('should correctly parse * */3 * * *', () => {
      const cronExpr = '* */3 * * *'
      const date1 = new Date('January 20, 2020 11:00:00')
      const date2 = new Date('January 20, 2020 12:00:00')
      const date3 = new Date('January 20, 2020 13:00:00')
      const date4 = new Date('January 20, 2020 14:00:00')
      const date5 = new Date('January 20, 2020 15:00:00')
      const date6 = new Date('January 20, 2020 16:00:00')
      const date7 = new Date('January 20, 2020 17:00:00')
      expect(cronmatch(cronExpr, date1)).toBe(false)
      expect(cronmatch(cronExpr, date2)).toBe(true)
      expect(cronmatch(cronExpr, date3)).toBe(false)
      expect(cronmatch(cronExpr, date4)).toBe(false)
      expect(cronmatch(cronExpr, date5)).toBe(true)
      expect(cronmatch(cronExpr, date6)).toBe(false)
      expect(cronmatch(cronExpr, date7)).toBe(false)
    })
    it('should correctly parse * 0,3,18 * * *', () => {
      const cronExpr = '* 0,3,18 * * *'
      const date1 = new Date('January 20, 2020 00:00:00')
      const date2 = new Date('January 20, 2020 02:00:00')
      const date3 = new Date('January 20, 2020 03:00:00')
      const date4 = new Date('January 20, 2020 18:00:00')
      const date5 = new Date('January 20, 2020 22:00:00')
      expect(cronmatch(cronExpr, date1)).toBe(true)
      expect(cronmatch(cronExpr, date2)).toBe(false)
      expect(cronmatch(cronExpr, date3)).toBe(true)
      expect(cronmatch(cronExpr, date4)).toBe(true)
      expect(cronmatch(cronExpr, date5)).toBe(false)
    })
    it('should correctly parse * 2-3,18 * * *', () => {
      const cronExpr = '* 2-3,18 * * *'
      const date1 = new Date('January 20, 2020 00:00:00')
      const date2 = new Date('January 20, 2020 02:00:00')
      const date3 = new Date('January 20, 2020 03:00:00')
      const date4 = new Date('January 20, 2020 18:00:00')
      const date5 = new Date('January 20, 2020 22:00:00')
      expect(cronmatch(cronExpr, date1)).toBe(false)
      expect(cronmatch(cronExpr, date2)).toBe(true)
      expect(cronmatch(cronExpr, date3)).toBe(true)
      expect(cronmatch(cronExpr, date4)).toBe(true)
      expect(cronmatch(cronExpr, date5)).toBe(false)
    })
  })
})
