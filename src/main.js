// const logger = require('./application/logging.js')
// const web = require('./application/web.js')
import {web} from './application/web.js'
import {logger} from './application/logging.js'

web.listen(3000, () => {
  logger.info("App start");
});
