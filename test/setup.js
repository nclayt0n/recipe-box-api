process.env.TZ = 'UTC'
process.env.NODE_ENV = 'test'
process.env.JWT_SECRET = 'test-jwt-secret'
require('dotenv').config()
const { expect } = require('chai')
const supertest = require('supertest')
process.env.JWT_EXPIRY = '30s'
global.expect = expect
global.supertest = supertest