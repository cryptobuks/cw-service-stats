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
    backgroundId: {
      type: Schema.ObjectId,
      required: true
    },
    data: {
      type: Schema.Types.Mixed,
      required: true
    }
  },
  { timestamps: true }
)

module.exports = db.stats.model('background', newSchema)
