const { db, rabbitmq, _ } = require('@cowellness/cw-micro-service')()

/**
 * @class SportcontactsController
 * @classdesc Controller Sportcontacts
 */
class SportcontactsController {
  constructor () {
    this.Sportcontacts = db.stats.model('Sportcontacts')
  }

  async getContactsMonth ({ _user }) {
    const contacts = await this.Sportcontacts.find({
      ownerId: _user.profileId
    })
    const result = {}

    contacts.forEach(entry => {
      result[`${entry.year}.${entry.month}`] = { year: entry.year, month: entry.month }
    })
    return Object.values(result)
  }

  async getContactsStats ({ _user, periods }) {
    const contactData = await this.Sportcontacts.find({
      ownerId: _user.profileId,
      $or: periods
    }).lean()
    return contactData.map(c => _.pick(c, ['data', 'month', 'year'])).map(item => {
      Object.keys(item.data).forEach(day => {
        item.data[day] = _.orderBy(item.data[day], 'count', 'desc').slice(0, 10)
      })
      return item
    })
  }

  async collectStats () {
    const { data } = await rabbitmq.sendAndRead('/auth/stats/getContactBySports')

    return Promise.all(data.map(entry => {
      const date = new Date()
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const day = date.getDate()

      return this.updateOrCreate({
        year,
        month,
        day,
        entry
      })
    }))
  }

  async updateOrCreate (data) {
    const sports = Object.keys(data.entry.sports).map(sportInterestId => ({ sportInterestId, count: data.entry.sports[sportInterestId] }))
    if (!sports.length) {
      return
    }
    const contactData = await this.Sportcontacts.findOne({
      ownerId: data.entry.ownerId,
      year: data.year,
      month: data.month
    })

    if (contactData) {
      contactData.data = {
        ...contactData.data,
        [data.day]: sports
      }
      return contactData.save()
    }
    return this.Sportcontacts.create({
      ownerId: data.entry.ownerId,
      year: data.year,
      month: data.month,
      data: {
        [data.day]: sports
      }
    })
  }
}

module.exports = SportcontactsController
