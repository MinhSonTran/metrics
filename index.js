const ua = require('universal-analytics')

const GOOGLE_ANALYTICS_ID = process.env.GOOGLE_ANALYTICS_ID
const agentOptions = {strictCidFormat: false, https: true}

module.exports = robot => {
  if (!GOOGLE_ANALYTICS_ID) {
    robot.log.trace('Set `GOOGLE_ANALYTICS_ID` to track metrics with Google Analytics')
    return
  }

  robot.log.trace({id: GOOGLE_ANALYTICS_ID}, 'Tracking metrics with Google Analytics')

  robot.on('*', async context => {
    const uid = context.payload.installation.id
    const visitor = ua(GOOGLE_ANALYTICS_ID, uid, agentOptions)

    const params = {
      ec: context.event,
      ea: context.payload.action
    }

    robot.log.trace(params, 'Reporting metric')

    return new Promise((resolve, reject) => {
      visitor.event(params, err => err ? reject(err) : resolve())
    })
  })
}
