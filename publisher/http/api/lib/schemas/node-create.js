module.exports = {
  type: 'object',
  properties: {
    farm: { type: 'integer' },
    node: { type: 'string' },
    capacity: {
      sru: { type: 'integer' },
      mru: { type: 'integer' },
      cru: { type: 'integer' },
      hru: { type: 'integer' }
    },
    location: {
      longitude: { type: 'string' },
      latitude: { type: 'string' }
    },
    twin: { type: 'integer' },
    city: { type: 'integer' },
    country: { type: 'integer' }
  },
  required: ['farm', 'node', 'capacity', 'location', 'twin', 'city', 'country'],
  additionalProperties: false
}
