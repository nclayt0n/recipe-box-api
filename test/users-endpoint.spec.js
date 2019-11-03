const knex = require('knex')
const bcrpyt = require('bcryptjs')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Users Endpoints', function() {
    let db

    const { testUsers } = helpers.makeRecipeFixtures()
    const testUser = testUsers[0]
    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        })
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())

    before('cleanup', () => helpers.cleanTables(db))

    afterEach('cleanup', () => helpers.cleanTables(db))

    describe(`POST /api/users`, () => {
        context(`User Validation`, () => {
            beforeEach('insert users', () =>
                helpers.seedUsers(
                    db,
                    testUsers,
                )
            )

            const requiredFields = ['email', 'password', 'full_name']

            requiredFields.forEach(field => {
                const registerAttemptBody = {
                    email: 'test email',
                    password: 'test password',
                    full_name: 'test full_name',
                }

                it(`responds with 400 required error when '${field}' is missing`, () => {
                    delete registerAttemptBody[field]

                    return supertest(app)
                        .post('/api/users')
                        .send(registerAttemptBody)
                        .expect(400, {
                            error: `Missing '${field}' in request body`,
                        })
                })
                it(`responds 400'Password must be less than 72 characters' when long password`, () => {
                    const userLongPassword = {
                            email: 'test email',
                            password: '*'.repeat(73),
                            full_name: 'test full_name',
                        }
                        //console.log(userLongPassword)
                        //console.log(userLongPassword.length)
                    return supertest(app)
                        .post('/api/users')
                        .send(userLongPassword)
                        .expect(400, { error: `Password must be less than 72 characters` })
                })
                it(`responds 400 error when password ends with spaces`, () => {
                    const userPasswordEndsSpaces = {
                        email: 'test email',
                        password: '1Aa!2Bb@ ',
                        full_name: 'test full_name',
                    }
                    return supertest(app)
                        .post('/api/users')
                        .send(userPasswordEndsSpaces)
                        .expect(400, { error: `Password must not start or end with empty spaces` })
                })
                it(`responds 400 error when password isn't complex enough`, () => {
                    const userPasswordNotComplex = {
                        email: 'test email',
                        password: '11AAaabb',
                        full_name: 'test full_name',
                    }
                    return supertest(app)
                        .post('/api/users')
                        .send(userPasswordNotComplex)
                        .expect(400, { error: `Password must contain 1 upper case, lower case, number and special character` })
                })
                it(`it responds 400 'User already taken' when email isn't unique`, () => {
                    const duplicateUser = {
                        email: testUser.email,
                        password: '11AAaa!!',
                        full_name: 'test full_name',
                    }
                    return supertest(app)
                        .post('/api/users')
                        .send(duplicateUser)
                        .expect(400, { error: 'Email is already in use' })
                })
            })
            context('Happy path', () => {
                it(`responds 201,seralized user,storing bcryped password`, () => {
                    const newUser = {
                        email: 'test email',
                        password: '11AAaa!!',
                        full_name: 'test full_name',
                    }
                    return supertest(app)
                        .post('/api/users')
                        .send(newUser)
                        .expect(201)
                        .expect(res => {
                            expect(res.body).to.have.property('id')
                            expect(res.body.email).to.eql(newUser.email)
                            expect(res.body.full_name).to.eql(newUser.full_name)
                            expect(res.body).to.not.have.property('password')
                            expect(res.headers.location).to.eql(`/api/users/${res.body.id}`)
                            const expectedDate = new Date().toLocaleString('en', { timeZone: 'UTC' })
                            const actualDate = new Date(res.body.date_created).toLocaleString()
                            expect(actualDate).to.eql(expectedDate)
                        })
                        .expect(res =>
                            db
                            .from('recipebox_users')
                            .select('*')
                            .where({ id: res.body.id })
                            .first()
                            .then(row => {
                                expect(row.email).to.eql(newUser.email)
                                expect(row.full_name).to.eql(newUser.full_name)
                                const expectedDate = new Date().toLocaleString('en', { timeZone: 'UTC' })
                                const actualDate = new Date(row.date_created).toLocaleString()
                                expect(actualDate).to.eql(expectedDate)
                            })
                        )

                })
            })
        })
    })
})