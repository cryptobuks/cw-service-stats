
const { ctr } = require('@cowellness/cw-micro-service')()

class internalStats {
  async getCountryStats (data, reply) {
    try {
      const stats = await ctr.countries.getCountryStats()
      reply.cwSendSuccess({
        data: stats,
        message: 'reply.stats.countries.success'
      })
    } catch (e) {
      reply.cwSendFail({
        message: 'reply.stats.countries.error',
        data: e.message
      })
    }
  }

  async getBackgroundStats (data, reply) {
    try {
      const stats = await ctr.background.getBackgroundStats()
      reply.cwSendSuccess({
        data: stats,
        message: 'reply.stats.background.success'
      })
    } catch (e) {
      reply.cwSendFail({
        message: 'reply.stats.background.error',
        data: e.message
      })
    }
  }

  async getSportInterestStats (data, reply) {
    try {
      const stats = await ctr.sportInterest.getSportInterestStats()
      reply.cwSendSuccess({
        data: stats,
        message: 'reply.stats.sportInterest.success'
      })
    } catch (e) {
      reply.cwSendFail({
        message: 'reply.stats.sportInterest.error',
        data: e.message
      })
    }
  }

  async getContactsMonth (data, reply) {
    try {
      const stats = await ctr.contacts.getContactsMonth(data)
      reply.cwSendSuccess({
        data: stats,
        message: 'reply.stats.contacts.success'
      })
    } catch (e) {
      reply.cwSendFail({
        message: 'reply.stats.contacts.error',
        data: e.message
      })
    }
  }

  async getContactsStats (data, reply) {
    try {
      const stats = await ctr.contacts.getContactsStats(data)
      reply.cwSendSuccess({
        data: stats,
        message: 'reply.stats.contacts.success'
      })
    } catch (e) {
      reply.cwSendFail({
        message: 'reply.stats.contacts.error',
        data: e.message
      })
    }
  }

  async getSportContactsMonth (data, reply) {
    try {
      const stats = await ctr.sportContacts.getContactsMonth(data)
      reply.cwSendSuccess({
        data: stats,
        message: 'reply.stats.sportContacts.success'
      })
    } catch (e) {
      reply.cwSendFail({
        message: 'reply.stats.sportContacts.error',
        data: e.message
      })
    }
  }

  async getSportContactsStats (data, reply) {
    try {
      const stats = await ctr.sportContacts.getContactsStats(data)
      reply.cwSendSuccess({
        data: stats,
        message: 'reply.stats.sportContacts.success'
      })
    } catch (e) {
      reply.cwSendFail({
        message: 'reply.stats.sportContacts.error',
        data: e.message
      })
    }
  }

  async getTrendContactsMonth (data, reply) {
    try {
      const stats = await ctr.trendContacts.getContactsMonth(data)
      reply.cwSendSuccess({
        data: stats,
        message: 'reply.stats.trendContacts.success'
      })
    } catch (e) {
      reply.cwSendFail({
        message: 'reply.stats.trendContacts.error',
        data: e.message
      })
    }
  }

  async getTrendContactsStats (data, reply) {
    try {
      const stats = await ctr.trendContacts.getContactsStats(data)
      reply.cwSendSuccess({
        data: stats,
        message: 'reply.stats.trendContacts.success'
      })
    } catch (e) {
      reply.cwSendFail({
        message: 'reply.stats.trendContacts.error',
        data: e.message
      })
    }
  }

  async getAcquisitionContactsMonth (data, reply) {
    try {
      const stats = await ctr.acquisition.getContactsMonth(data)
      reply.cwSendSuccess({
        data: stats,
        message: 'reply.stats.acquisition.success'
      })
    } catch (e) {
      reply.cwSendFail({
        message: 'reply.stats.acquisition.error',
        data: e.message
      })
    }
  }

  async getAcquisitionContactsStats (data, reply) {
    try {
      const stats = await ctr.acquisition.getContactsStats(data)
      reply.cwSendSuccess({
        data: stats,
        message: 'reply.stats.acquisition.success'
      })
    } catch (e) {
      reply.cwSendFail({
        message: 'reply.stats.acquisition.error',
        data: e.message
      })
    }
  }

  async cardStats (data, reply) {
    try {
      const stats = await ctr.internalStats.cardStats(data)
      reply.cwSendSuccess({
        data: stats,
        message: 'reply.stats.cards.success'
      })
    } catch (e) {
      reply.cwSendFail({
        message: 'reply.stats.cards.error',
        data: e.message
      })
    }
  }
}

module.exports = internalStats
