
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./hwc.cjs.production.min.js')
} else {
  module.exports = require('./hwc.cjs.development.js')
}
