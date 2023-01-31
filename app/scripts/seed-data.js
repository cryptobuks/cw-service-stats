process.env.NODE_ENV = 'production'
const config = require('config')
config.fastify.port = 0
const cw = require('@cowellness/cw-micro-service')(config)
const dayjs = cw.dayjs
const _ = cw._
cw.autoStart().then(async () => {
  try {
    countries()
    contacts()
  } catch (error) {
    console.log(error)
  }
})
async function contacts () {
  const result = await cw.es.search({
    index: cw.envPrefix + 'profiles',
    body: {
      query: {
        bool: {
          must: [{
            match: {
              typeCode: ['CH', 'CW', 'CU', 'GH', 'GY', 'GU', 'SI'].join(' OR ')
            }
          }]
        }
      }
    }
  })
  const profiles = _.get(result, 'hits.hits', []).map(profile => profile._id)
  const Contacts = cw.db.stats.model('Contacts')
  const date = new Date()
  const cYear = date.getFullYear()
  const pYear = date.getFullYear() - 1
  const monthStart = 0
  const monthEnd = 11
  const contacts = []
  for (let currentMonth = monthStart; currentMonth <= monthEnd; currentMonth++) {
    const days = dayjs().month(currentMonth).daysInMonth()
    const daysObjectCurrent = {}
    const daysObjectPrevious = {}
    _.times(days, index => {
      daysObjectCurrent[index + 1] = {
        active: {
          budget: _.random(0, 10),
          count: _.random(0, 10)
        },
        cold: {
          budget: _.random(0, 10),
          count: _.random(0, 10)
        },
        companies: {
          budget: _.random(0, 10),
          count: _.random(0, 10)
        }
      }
      daysObjectPrevious[index + 1] = {
        active: {
          budget: _.random(0, 10),
          count: _.random(0, 10)
        },
        cold: {
          budget: _.random(0, 10),
          count: _.random(0, 10)
        },
        companies: {
          budget: _.random(0, 10),
          count: _.random(0, 10)
        }
      }
    })
    profiles.forEach(ownerId => {
      contacts.push({
        ownerId,
        year: cYear,
        month: currentMonth + 1,
        data: daysObjectCurrent
      })
      contacts.push({
        ownerId,
        year: pYear,
        month: currentMonth + 1,
        data: daysObjectPrevious
      })
    })
  }
  await Contacts.deleteMany()
  await Contacts.create(contacts)
}
async function countries () {
  const Countries = cw.db.stats.model('countries')
  const date = new Date()
  const year = date.getFullYear()
  const monthStart = 0
  const monthEnd = date.getMonth()
  const countries = []
  for (let currentMonth = monthStart; currentMonth <= monthEnd; currentMonth++) {
    const days = dayjs().month(currentMonth).daysInMonth()
    const daysObject = {}
    _.times(days, index => {
      daysObject[index + 1] = {}
      const typeCodes = ['GH', 'GY', 'GU', 'SI', 'IN', 'TU']
      typeCodes.forEach(typeCode => {
        const active = _.random(0, 10)
        const temporary = _.random(0, 10)
        const draft = _.random(0, 10)
        const suspended = _.random(0, 10)
        const total = active + temporary + draft + suspended
        daysObject[index + 1][typeCode] = {
          active,
          temporary,
          draft,
          suspended,
          total
        }
      })
    })
    countries.push({
      year,
      month: currentMonth + 1,
      country: 'it',
      data: daysObject
    })
  }
  await Countries.deleteMany()
  await Countries.create(countries)
}
