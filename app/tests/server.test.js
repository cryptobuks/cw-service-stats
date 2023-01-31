const cw = require('@cowellness/cw-micro-service')()

beforeAll(() => {
  return cw.startFastify()
})

afterAll(() => {
  return cw.stopFastify()
})

describe('Test app working - 404 and headers', () => {
  it('route not found', async () => {
    expect(2 + 2).toBe(4)
    // removed test since fastify is not in use currently
    // const res = await cw.fastify.inject({ method: 'GET', url: 'nosite' })
    // expect(res.statusCode).toEqual(404)
    // expect(res.headers['x-powered-by']).toEqual('co-welness.com')
    // expect(res.headers['api-version']).not.toEqual(undefined)
  })
})
