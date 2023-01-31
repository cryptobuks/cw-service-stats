const getBackgroundStats = {
  schema: {
    tags: ['stats', 'background'],
    summary: 'Get background stats',
    security: [
      {
        authorization: ['report.contact.read']
      }
    ],
    body: {

    }
  }
}

const getCountryStats = {
  schema: {
    tags: ['stats', 'countries'],
    summary: 'Get Countries stats',
    security: [
      {
        authorization: ['report.contact.read']
      }
    ],
    body: {

    }
  }
}

const getSportInterestStats = {
  schema: {
    tags: ['stats', 'sportInterest'],
    summary: 'Get sports interest stats',
    security: [
      {
        authorization: []
      }
    ],
    body: {

    }
  }
}

const getContactsMonth = {
  schema: {
    tags: ['stats', 'contacts'],
    summary: 'Get Contacts months',
    security: [
      {
        authorization: ['report.contact.read']
      }
    ],
    body: {

    }
  }
}

const getContactsStats = {
  schema: {
    tags: ['stats', 'contacts'],
    summary: 'Get Contacts stats',
    security: [
      {
        authorization: ['report.contact.read']
      }
    ],
    body: {
      type: 'object',
      required: ['periods'],
      properties: {
        periods: {
          type: 'array',
          items: {
            type: 'object',
            required: ['year', 'month'],
            properties: {
              year: {
                type: 'number'
              },
              month: {
                type: 'number'
              }
            }
          }
        },
        type: {
          type: 'string',
          enum: ['year', 'month']
        }
      }
    }
  }
}

const getSportContactsMonth = {
  schema: {
    tags: ['stats', 'contacts', 'sports'],
    summary: 'Get Contacts months',
    security: [
      {
        authorization: ['report.contact.read']
      }
    ],
    body: {

    }
  }
}

const getSportContactsStats = {
  schema: {
    tags: ['stats', 'contacts', 'sports'],
    summary: 'Get Contacts stats',
    security: [
      {
        authorization: ['report.contact.read']
      }
    ],
    body: {
      type: 'object',
      required: ['periods'],
      properties: {
        periods: {
          type: 'array',
          items: {
            type: 'object',
            required: ['year', 'month'],
            properties: {
              year: {
                type: 'number'
              },
              month: {
                type: 'number'
              }
            }
          }
        }
      }
    }
  }
}

const getTrendContactsMonth = {
  schema: {
    tags: ['stats', 'contacts', 'trend'],
    summary: 'Get Contacts months',
    security: [
      {
        authorization: ['report.contact.read']
      }
    ],
    body: {

    }
  }
}

const getTrendContactsStats = {
  schema: {
    tags: ['stats', 'contacts', 'trend'],
    summary: 'Get Contacts stats',
    security: [
      {
        authorization: ['report.contact.read']
      }
    ],
    body: {
      type: 'object',
      required: ['periods'],
      properties: {
        periods: {
          type: 'array',
          items: {
            type: 'object',
            required: ['year', 'month'],
            properties: {
              year: {
                type: 'number'
              },
              month: {
                type: 'number'
              }
            }
          }
        },
        type: {
          type: 'string',
          enum: ['year', 'month']
        }
      }
    }
  }
}

const getAcquisitionContactsMonth = {
  schema: {
    tags: ['stats', 'contacts', 'trend'],
    summary: 'Get Contacts months',
    security: [
      {
        authorization: ['report.contact.read']
      }
    ],
    body: {

    }
  }
}

const getAcquisitionContactsStats = {
  schema: {
    tags: ['stats', 'contacts', 'trend'],
    summary: 'Get Contacts stats',
    security: [
      {
        authorization: ['report.contact.read']
      }
    ],
    body: {
      type: 'object',
      required: ['periods'],
      properties: {
        periods: {
          type: 'array',
          items: {
            type: 'object',
            required: ['year', 'month'],
            properties: {
              year: {
                type: 'number'
              },
              month: {
                type: 'number'
              }
            }
          }
        },
        type: {
          type: 'string',
          enum: ['year', 'month']
        }
      }
    }
  }
}

const cardStats = {
  schema: {
    tags: ['stats', 'cards'],
    summary: 'Get cards stats',
    security: [
      {
        authorization: ['report.contact.read']
      }
    ],
    body: {

    }
  }
}
module.exports = {
  getContactsMonth,
  getContactsStats,
  getSportInterestStats,
  getBackgroundStats,
  getCountryStats,
  getSportContactsMonth,
  getSportContactsStats,
  getTrendContactsMonth,
  getTrendContactsStats,
  getAcquisitionContactsMonth,
  getAcquisitionContactsStats,
  cardStats
}
