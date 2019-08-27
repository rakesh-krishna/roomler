const mongoose = require('mongoose')
class InviteFilter {
  constructor (options) {
    this.filter = options.filter || {}
    if (options.id) {
      if (mongoose.Types.ObjectId.isValid(options.id)) {
        this.filter._id = mongoose.Types.ObjectId(options.id)
      } else {
        throw new TypeError('Invalid invite id!')
      }
    }
    this.aggregate = []
  }

  addLookup () {
    this.aggregate.push({
      $lookup: {
        from: 'rooms',
        localField: 'room',
        foreignField: '_id',
        as: 'room'
      }
    })
    return this
  }

  addMatch (userid) {
    this.aggregate.push({
      $match: userid ? {
        $and: [{
          $or: [{
            'room.owner': mongoose.Types.ObjectId(userid)
          },
          {
            'room.moderators': mongoose.Types.ObjectId(userid)
          }
          ]
        },
        this.filter
        ]
      } : this.filter
    })
    return this
  }

  addSort ($sort) {
    this.aggregate.push({
      $sort
    })
    return this
  }

  addSkip ($skip) {
    this.aggregate.push({
      $skip
    })
    return this
  }

  addLimit ($limit) {
    this.aggregate.push({
      $limit
    })
    return this
  }

  getFilter () {
    return this.filter
  }

  getAggregate () {
    return this.aggregate
  }
}

module.exports = InviteFilter
