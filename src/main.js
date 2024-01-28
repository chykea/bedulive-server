
const { APP_PORT } = require('./config/config.default.js')
const { getIpAddress } = require('./lib/IP/index.js')

const app = require('./app')

app.listen(APP_PORT, () => {
  console.log(`server is running on http://localhost:${APP_PORT}`)
  console.log(`server is running on http://${getIpAddress()}:${APP_PORT}`)
})