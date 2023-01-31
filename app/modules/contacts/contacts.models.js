const { db } = require('@cowellness/cw-micro-service')()

const Schema = db.stats.Schema

const newSchema = new Schema(
  {
    ownerId: String,
    year: String,
    month: String,
    data: Object
  },
  { timestamps: true }
)

module.exports = db.stats.model('Contacts', newSchema)
