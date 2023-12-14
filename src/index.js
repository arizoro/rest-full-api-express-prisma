import express from 'express'
import {logger} from './application/logging.js'

const app = express()


app.listen(3000, () => {
    logger.info('succes')
})