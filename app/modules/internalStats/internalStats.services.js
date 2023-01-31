const { ctr, rabbitmq } = require('@cowellness/cw-micro-service')()

rabbitmq.consume('/stats/countries/generate', () => {
  return ctr.countries.collectStats()
})

rabbitmq.consume('/stats/background/generate', () => {
  return ctr.background.collectStats()
})

rabbitmq.consume('/stats/sportInterest/generate', () => {
  return ctr.sportInterest.collectStats()
})

rabbitmq.consume('/stats/contacts/generate', () => {
  return ctr.contacts.collectStats()
})

rabbitmq.consume('/stats/sportContacts/generate', () => {
  return ctr.sportContacts.collectStats()
})

rabbitmq.consume('/stats/trendContacts/generate', () => {
  return ctr.trendContacts.collectStats()
})

rabbitmq.consume('/stats/acquisition/generate', () => {
  return ctr.acquisition.collectStats()
})
// schedule cron
rabbitmq.send('/cron/append', {
  name: 'stats:countries:collect',
  type: 'cron',
  update: true,
  crontab: '10 1 * * *',
  commands: [{
    type: 'rabbitmq',
    queue: '/stats/countries/generate',
    msg: 'generate country stats'
  }]
})

rabbitmq.send('/cron/append', {
  name: 'stats:background:collect',
  type: 'cron',
  update: true,
  crontab: '5 1 * * *',
  commands: [{
    type: 'rabbitmq',
    queue: '/stats/background/generate',
    msg: 'generate background stats'
  }]
})

rabbitmq.send('/cron/append', {
  name: 'stats:sportInterest:collect',
  type: 'cron',
  update: true,
  crontab: '10 1 * * *',
  commands: [{
    type: 'rabbitmq',
    queue: '/stats/sportInterest/generate',
    msg: 'generate sportInterert stats'
  }]
})

rabbitmq.send('/cron/append', {
  name: 'stats:contacts:collect',
  type: 'cron',
  update: true,
  crontab: '10 1 * * *',
  commands: [{
    type: 'rabbitmq',
    queue: '/stats/contacts/generate',
    msg: 'generate contacts stats'
  }]
})

rabbitmq.send('/cron/append', {
  name: 'stats:sportContacts:collect',
  type: 'cron',
  update: true,
  crontab: '10 1 * * *',
  commands: [{
    type: 'rabbitmq',
    queue: '/stats/sportContacts/generate',
    msg: 'generate sportContacts stats'
  }]
})

rabbitmq.send('/cron/append', {
  name: 'stats:trendContacts:collect',
  type: 'cron',
  update: true,
  crontab: '10 1 * * *',
  commands: [{
    type: 'rabbitmq',
    queue: '/stats/trendContacts/generate',
    msg: 'generate trendContacts stats'
  }]
})

rabbitmq.send('/cron/append', {
  name: 'stats:acquisition:collect',
  type: 'cron',
  update: true,
  crontab: '10 1 * * *',
  commands: [{
    type: 'rabbitmq',
    queue: '/stats/acquisition/generate',
    msg: 'generate acquisition stats'
  }]
})
