const { db, rabbitmq, _ } = require('@cowellness/cw-micro-service')()

/**
 * @class BackgroundController
 * @classdesc Controller Background
 */
class BackgroundController {
  constructor () {
    this.Background = db.stats.model('background')
  }

  async getStats (hostName) {
    const current = new Date()
    const previous = new Date()
    previous.setMonth(current.getMonth() - 1)
    const cYear = current.getFullYear()
    const cMonth = current.getMonth() + 1
    const cDay = current.getDate()
    const pYear = previous.getFullYear()
    const pMonth = previous.getMonth() + 1
    const [stats, list] = await Promise.all([this.Background.find({ $or: [{ year: cYear, month: cMonth }, { year: pYear, month: pMonth }] }).lean().exec(), rabbitmq.sendAndRead('/settings/background/public/list', { hostname: hostName })])
    let result = []
    if (stats && stats.length) {
      result = stats.map((s) => {
        const record = {
          year: s.year,
          month: s.month,
          _id: s.backgroundId.toString(),
          data: {}
        }
        let day = parseInt(cDay)
        while (day > 0) {
          if (s.data[day.toString()]) {
            record.data[day.toString()] = s.data[day.toString()]
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
    const stats = await rabbitmq.sendAndRead('/auth/stats/background/image')
    if (stats && stats.data && stats.data.length) {
      const d = new Date()
      const year = d.getFullYear()
      const month = d.getMonth() + 1
      const day = d.getDate()
      for (let i = 0; i < stats.data.length; i++) {
        const backgrd = await this.Background.findOne({ year: year, month: month, backgroundId: stats.data[i]._id.toString() }).exec()
        if (backgrd) {
          const data = { ...backgrd.data }
          data[day.toString()] = stats.data[i].count
          backgrd.data = data
          await backgrd.save()
        } else {
          const data = {}
          data[day.toString()] = stats.data[i].count
          await this.Background.create({ year: year, month: month, backgroundId: stats.data[i]._id.toString(), data: data })
        }
      }
    }
  }

  async getBackgroundStats () {
    const current = new Date()
    const previous = new Date()
    previous.setMonth(current.getMonth() - 1)
    const cYear = current.getFullYear()
    const cMonth = current.getMonth() + 1
    const cDay = current.getDate()
    const backgrounds = await this.Background.find({
      year: cYear,
      month: cMonth
    })
    return backgrounds.map(bg => ({ backgroundId: bg.backgroundId, count: _.get(bg, `data.${cDay}`, 0) }))
  }
}

module.exports = BackgroundController
