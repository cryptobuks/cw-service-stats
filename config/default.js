const path = require('path')
const basepath = path.join(__dirname, '..', 'app')

module.exports = {
  service: 'stats',
  fastify: { active: false, port: 3013, prefix: '/api/stats', sessionSecret: 'cw-micro-service-fastify-session-secret' },
  rabbitmq: { active: true, server: 'localhost:15672', user: 'dev', password: 'dev123' },
  redis: { active: false, server: 'localhost', port: 16379 },
  elasticSearch: { active: false, server: 'localhost:9200', timeout: 0, version: '7.6' },
  swagger: { active: false, exposeRoute: true },
  logger: { level: 'debug' },
  basepath,
  mongodb: {
    active: true,
    server: 'localhost',
    port: '',
    user: '',
    password: '',
    debug: true,
    databases: [
      {
        name: 'stats',
        db: 'stats',
        options: {}
      }
    ]
  }
}
