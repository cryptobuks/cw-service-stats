const { db } = require('@cowellness/cw-micro-service')()

const Schema = db.stats.Schema

const newSchema = new Schema(
  {
    year: {
      type: Number,
      required: true
    },
    month: {
      type: Number,
      required: true
    },
    data: {
      type: Object,
      required: true
    }
  },
  { timestamps: true }
)

module.exports = db.stats.model('sportinterest', newSchema)
