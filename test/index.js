const expect = require('expect')
const proxyquire = require('proxyquire')
const {createRobot} = require('probot')

const uaEvent = expect.createSpy().andCall((event, cb) => cb())
const uaStub = function (id, uid, options) {
  return {id, uid, options, event: uaEvent}
}

const event = require('./fixtures/issues.opened')

describe('metrics', () => {
  let robot
  let plugin

  beforeEach(() => {
    uaEvent.restore()

    process.env.GOOGLE_ANALYTICS_ID = 'test'
    plugin = proxyquire('..', {'universal-analytics': uaStub})
    robot = createRobot()
    plugin(robot)

    // Mock out GitHub App authentication and return a mock client
    robot.auth = () => Promise.resolve({})
  })

  it('reports a metric for received events', async () => {
    await robot.receive(event)
    expect(uaEvent).toHaveBeenCalled()
    expect(uaEvent.calls[0].arguments[0]).toEqual({
      ec: 'issues',
      ea: 'opened'
    })
  })
})
