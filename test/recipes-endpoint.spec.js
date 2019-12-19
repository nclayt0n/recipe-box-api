const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe.only('Recipe Endpoint', () => {
    let db;
    const { testUsers, testRecipes, testFolders } = helpers.makeRecipeFixtures();
    const testUser = testUsers[0];

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL,
        });
        app.set('db', db);

    });

    after('disconnect from db', () => db.destroy());

    before('cleanup', () => helpers.cleanTables(db));

    afterEach('cleanup', () => helpers.cleanTables(db));


    describe(`GET /api/recipes`, () => {
        context('Given there are recipes in the database', () => {
            beforeEach('insert recipes', () => {
                return helpers.seedRecipesTables(
                    db,
                    testUsers,
                    testRecipes,
                    testFolders
                );
            });

            it('responds with 200 and all of the recipes', () => {
                // const expectedRecipes = testRecipes.map(recipe => {
                //     return helpers.makeExpectedRecipe(
                //         testUsers,
                //         testFolders,
                //         testRecipes,
                //     );
                // });
                return supertest(app)
                    .get('/api/recipes')
                    .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                    .expect(200);
            });
        });

        // it('responds with 200', () => {
        //     beforeEach('insert users', () =>
        //         helpers.seedUsers(
        //             db,
        //             testUsers,
        //         )
        //     );
        // });
    });

});