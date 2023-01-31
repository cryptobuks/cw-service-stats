const { db, rabbitmq, _ } = require('@cowellness/cw-micro-service')()

/**
 * @class ContactsController
 * @classdesc Controller Contacts
 */
class ContactsController {
  constructor () {
    this.Contacts = db.stats.model('Contacts')
  }

  async getContactsMonth ({ _user }) {
    const contacts = await this.Contacts.find({
      ownerId: _user.profileId
    })
    const result = {}

    contacts.forEach(entry => {
      result[`${entry.year}.${entry.month}`] = { year: entry.year, month: entry.month }
    })
    return Object.values(result)
  }

  async getContactsStats ({ _user, periods, type = 'year' }) {
    let previousPeriods = null

    if (type === 'year') {
      previousPeriods = periods.map(period => ({ year: period.year - 1, month: period.month }))
    } else if (type === 'month') {
      previousPeriods = periods.map(period => ({ year: period.year, month: period.month - 1 }))
    }
    const currentPeriod = await this.Contacts.find({
      ownerId: _user.profileId,
      $or: periods
    })
    const previousPeriod = await this.Contacts.find({
      ownerId: _user.profileId,
      $or: previousPeriods
    })
    return {
      current: currentPeriod.map(c => _.pick(c, ['data', 'month', 'year'])),
      previous: previousPeriod.map(c => _.pick(c, ['data', 'month', 'year']))
    }
  }

  async collectStats () {
    const { data } = await rabbitmq.sendAndRead('/auth/stats/getContactStats')

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
    const contactData = await this.Contacts.findOne({
      ownerId: data.entry.ownerId,
      year: data.year,
      month: data.month
    })

    if (contactData) {
      contactData.data = {
        ...contactData.data,
        [data.day]: data.entry.contacts
      }
      return contactData.save()
    }
    return this.Contacts.create({
      ownerId: data.entry.ownerId,
      year: data.year,
      month: data.month,
      data: {
        [data.day]: data.entry.contacts
      }
    })
  }
}

module.exports = ContactsController
