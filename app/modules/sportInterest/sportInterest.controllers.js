const { db, rabbitmq, _ } = require('@cowellness/cw-micro-service')()

/**
 * @class SportinterestController
 * @classdesc Controller Sportinterest
 */
class SportinterestController {
  constructor () {
    this.SportInterest = db.stats.model('sportinterest')
  }

  async getStats () {
    const current = new Date()
    const previous = new Date()
    previous.setMonth(current.getMonth() - 1)
    const cYear = current.getFullYear()
    const cMonth = current.getMonth() + 1
    const cDay = current.getDate()
    const pYear = previous.getFullYear()
    const pMonth = previous.getMonth() + 1
    const [stats, list] = await Promise.all([this.SportInterest.find({ $or: [{ year: cYear, month: cMonth }, { year: pYear, month: pMonth }] }).lean().exec(), rabbitmq.sendAndRead('/settings/sportInterest/get', {})])
    let result = []
    if (stats && stats.length) {
      result = stats.map((s) => {
        const record = {
          year: s.year,
          month: s.month,
          data: {}
        }
        let day = parseInt(cDay)
        while (day > 0) {
          if (s.data[day.toString()]) {
            const data = { ...record.data }
            data[day.toString()] = s.data[day.toString()]
            record.data = data
            break
          }
          day--
        }
        return record
      })
    }
    return { stats: result, list: list.data }
  }

  async collectStats () {
    const stats = await rabbitmq.sendAndRead('/auth/stats/sportinterest')

    if (stats && stats.data && stats.data.length) {
      const d = new Date()
      const year = d.getFullYear()
      const month = d.getMonth() + 1
      const day = d.getDate()
      const data = stats.data.map(i => ({ sportInterestId: i._id, count: i.count }))
      const sportinterest = await this.SportInterest.findOne({
        year,
        month
      })

      if (!sportinterest) {
        return this.SportInterest.create({
          year,
          month,
          data: {
            [day]: data
          }
        })
      }

      sportinterest.data = {
        ...sportinterest.data,
        [day]: data
      }

      return sportinterest.save()
    }
  }

  async getSportInterestStats () {
    const current = new Date()
    const previous = new Date()
    previous.setMonth(current.getMonth() - 1)
    const cYear = current.getFullYear()
    const cMonth = current.getMonth() + 1
    const cDay = current.getDate()
    const sportInterests = await this.SportInterest.findOne({
      year: cYear,
      month: cMonth
    })
    return _.get(sportInterests, `data.${cDay}`)
  }
}

module.exports = SportinterestController
