const knex = require('knex')
const bcrpyt = require('bcryptjs')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Users Endpoints', function() {
    let db;

    const { testUsers } = helpers.makeRecipeFixtures();
    const testUser = testUsers[0];
    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL,
        });
        app.set('db', db);
    });

    after('disconnect from db', () => db.destroy());

    before('cleanup', () => helpers.cleanTables(db))

    afterEach('cleanup', () => helpers.cleanTables(db))

    describe(`POST /api/users`, () => {
        context(`User Validation`, () => {
            beforeEach('insert users', () =>
                helpers.seedUsers(
                    db,
                    testUsers,
                )
            );
            context('Happy path', () => {
                it(`responds 201,seralized user,storing bcryped password`, () => {
                    const newUser = {
                        email: 'testemail@sol.com',
                        password: '11AAaa!!',
                        full_name: 'test full_name',
                    };
                    return supertest(app)
                        .post('/api/users')
                        .send(newUser)
                        .expect(201)
                        .expect(res => {
                            expect(res.body).to.have.property('id');
                            expect(res.body.email).to.eql(newUser.email);
                            expect(res.body.full_name).to.eql(newUser.full_name);
                            expect(res.body).to.not.have.property('password');
                            expect(res.headers.location).to.eql(`/api/users/${res.body.id}`);
                            const expectedDate = new Date().toLocaleString('en', { timeZone: 'UTC' });
                            const actualDate = new Date(res.body.date_created).toLocaleString();
                            expect(actualDate).to.eql(expectedDate);
                        })
                        .expect(res =>
                            db
                            .from('recipebox_users')
                            .select('*')
                            .where({ id: res.body.id })
                            .first()
                            .then(row => {
                                expect(row.email).to.eql(newUser.email);
                                expect(row.full_name).to.eql(newUser.full_name);
                                const expectedDate = new Date().toLocaleString('en', { timeZone: 'UTC' });
                                const actualDate = new Date(row.date_created).toLocaleString();
                                expect(actualDate).to.eql(expectedDate);
                            })
                        );

                });
            });
        });
    });
});