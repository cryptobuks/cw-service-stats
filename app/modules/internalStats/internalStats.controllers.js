const { db, _, dayjs } = require('@cowellness/cw-micro-service')()

/**
 * @class InternalStatsController
 * @classdesc Controller InternalStats
 */
class InternalStatsController {
  constructor () {
    this.Contacts = db.stats.model('Contacts')
    this.Acquisition = db.stats.model('Acquisition')
    this.Sportcontacts = db.stats.model('Sportcontacts')
  }

  async cardStats ({ _user }) {
    const current = new Date()
    const cYear = current.getFullYear()
    const cMonth = current.getMonth() + 1
    const cDay = current.getDate()
    const last30Days = dayjs().subtract(30, 'day')
    const contacts = await this.Contacts.findOne({
      ownerId: _user.profileId,
      year: cYear,
      month: cMonth
    })
    const sportContacts = await this.Sportcontacts.findOne({
      ownerId: _user.profileId,
      year: cYear,
      month: cMonth
    })
    const acquisition = await this.Acquisition.find({
      ownerId: _user.profileId,
      $or: [{
        year: last30Days.format('YYYY'),
        month: last30Days.format('M')
      }, {
        year: cYear,
        month: cMonth
      }]
    })
    const channelData = []
    // acquisition: group dates so that we can easily loop over
    _.orderBy(acquisition, 'month', 'asc').forEach(item => {
      Object.keys(item.data).forEach(day => {
        if (dayjs(`${item.year}-${item.month}-${day}`).format() >= last30Days.format()) {
          channelData.push({
            date: `${item.year}-${item.month}-${day}`,
            data: item.data[day]
          })
        }
      })
    })
    const channels = {}
    // acquisition: group channels for easy counting
    channelData.forEach(item => {
      item.data.active.forEach(ch => {
        if (!channels[ch.channel]) channels[ch.channel] = 0
        channels[ch.channel] += ch.count
      })
      item.data.cold.forEach(ch => {
        if (!channels[ch.channel]) channels[ch.channel] = 0
        channels[ch.channel] += ch.count
      })
    })
    const sportContactsData = _.get(sportContacts, `data.${cDay}`, [])
    const result = {
      contacts: {
        active: _.get(contacts, `data.${cDay}.active.count`, 0),
        cold: _.get(contacts, `data.${cDay}.cold.count`, 0),
        companies: _.get(contacts, `data.${cDay}.companies.count`, 0)
      },
      sportContacts: _.orderBy(sportContactsData, 'count', 'desc').slice(0, 10),
      channels: Object.keys(channels).map(channel => ({ channel, count: channels[channel] }))
    }
    return result
  }
}

module.exports = InternalStatsController
