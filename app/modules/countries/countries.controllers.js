const { db, rabbitmq, _ } = require('@cowellness/cw-micro-service')()

/**
 * @class CountriesController
 * @classdesc Controller Countries
 */
class CountriesController {
  constructor () {
    this.Countries = db.stats.model('countries')
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
    const [stats, list] = await Promise.all([this.Countries.find({ $or: [{ year: cYear, month: cMonth }, { year: pYear, month: pMonth }] }).lean().exec(), rabbitmq.sendAndRead('/settings/countries/get', { })])
    let result = []
    if (stats && stats.length) {
      result = stats.map((s) => {
        const record = {
          year: s.year,
          month: s.month,
          country: s.country,
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

  assign (obj, keyPath, value) {
    const lastKeyIndex = keyPath.length - 1
    for (var i = 0; i < lastKeyIndex; ++i) {
      const key = keyPath[i]
      if (!(key in obj)) {
        obj[key] = {}
      }
      obj = obj[key]
    }
    obj[keyPath[lastKeyIndex]] = value
  }

  /**
   * Finds and updates / creates a record if not exist
   * @param {*} statData data to update/create
   * @returns record
   */
  async updateOrCreate (statData) {
    const countryStat = await this.Countries.findOne({
      year: statData.year,
      month: statData.month,
      country: statData.country
    })

    if (countryStat) {
      countryStat.data = {
        ...countryStat.data,
        ...statData.data
      }
      return countryStat.save()
    }
    return this.Countries.create(statData)
  }

  /**
   * Save country stats from auth service
   * @returns created stats
   */
  async collectStats () {
    const { data } = await rabbitmq.sendAndRead('/auth/stats/countries', { })
    const countries = Object.keys(data)

    return Promise.all(countries.map(country => {
      const countryData = data[country]
      Object.keys(countryData).forEach(typeCode => {
        countryData[typeCode].total = Object.values(countryData[typeCode]).reduce((previous, current) => previous + current, 0)
      })
      const date = new Date()
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const day = date.getDate()
      const record = {
        year,
        month,
        country,
        data: {
          [day]: countryData
        }
      }
      return this.updateOrCreate(record)
    }))
  }

  /**
   * Format stats from database
   * @returns formatted
   */
  async getCountryStats () {
    const current = new Date()
    const previous = new Date()
    previous.setMonth(current.getMonth() - 1)
    const cYear = current.getFullYear()
    const cMonth = current.getMonth() + 1
    const cDay = current.getDate()
    const pYear = previous.getFullYear()
    const pMonth = previous.getMonth() + 1
    const currentMonthData = await this.Countries.find({
      $or: [
        {
          year: cYear,
          month: cMonth
        },
        {
          year: pYear,
          month: pMonth
        }
      ]
    })
    const countryData = {}

    currentMonthData.forEach(record => {
      const recordDate = _.get(record, `data.${cDay}`, {})

      Object.keys(recordDate).forEach(typeCode => {
        const isGym = ['GH', 'GY', 'GU', 'SI'].includes(typeCode)
        const contactKey = isGym ? 'gym' : 'contact'
        const timeKey = cMonth === record.month ? 'current' : 'previous'

        _.set(countryData, `${record.country}.${contactKey}.${timeKey}.year`, record.year)
        _.set(countryData, `${record.country}.${contactKey}.${timeKey}.month`, record.month)
        const active = _.get(countryData, `${record.country}.${contactKey}.${timeKey}.active`, 0)
        const draft = _.get(countryData, `${record.country}.${contactKey}.${timeKey}.draft`, 0)
        const suspended = _.get(countryData, `${record.country}.${contactKey}.${timeKey}.suspended`, 0)
        const temporary = _.get(countryData, `${record.country}.${contactKey}.${timeKey}.temporary`, 0)
        const total = _.get(countryData, `${record.country}.${contactKey}.${timeKey}.total`, 0)
        _.set(countryData, `${record.country}.${contactKey}.${timeKey}.active`, active + recordDate[typeCode].active)
        _.set(countryData, `${record.country}.${contactKey}.${timeKey}.draft`, draft + recordDate[typeCode].draft)
        _.set(countryData, `${record.country}.${contactKey}.${timeKey}.suspended`, suspended + recordDate[typeCode].suspended)
        _.set(countryData, `${record.country}.${contactKey}.${timeKey}.temporary`, temporary + recordDate[typeCode].temporary)
        _.set(countryData, `${record.country}.${contactKey}.${timeKey}.total`, total + recordDate[typeCode].total)
      })
    })

    return Object.keys(countryData).map(country => ({
      ...countryData[country],
      country
    }))
  }
}

module.exports = CountriesController
