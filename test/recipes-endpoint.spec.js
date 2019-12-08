const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Recipes Endpoints', function() {
    let db;

    const {
        testUsers,
        testRecipes,
        testFolders,
    } = helpers.makeRecipeFixtures();

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
            beforeEach('insert recipes', () =>
                helpers.seedRecipesTables(
                    db,
                    testUsers,
                    testRecipes,
                    testFolders,
                )
            );

            it('responds with 200 and all of the recipes', () => {
                const expectedRecipes = testRecipes.map(recipe =>
                    helpers.makeExpectedRecipe(
                        testUsers,
                        recipe,
                        testFolders,
                    )
                );
                return supertest(app)
                    .get('/api/recipe')
                    .expect(200, expectedRecipes);
            });
        });

        context(`Given an XSS attack recipe`, () => {
            const testUser = helpers.makeUsersArray()[1];
            const {
                maliciousRecipe,
                expectedRecipe,
            } = helpers.makeMaliciousRecipe(testUser);

            beforeEach('insert malicious recipe', () => {
                return helpers.seedMaliciousRecipe(
                    db,
                    testUser,
                    maliciousRecipe,
                );
            });

            it('removes XSS attack content', () => {
                return supertest(app)
                    .get(`/api/recipes`)
                    .set('Authorization', helpers.makeAuthHeader(testUser))
                    .expect(200)
                    .expect(res => {
                        expect(res.body[0].title).to.eql(expectedRecipe.name);
                        expect(res.body[0].instrucitons).to.eql(expectedRecipe.instructions);
                    });
            });
        });
    });

    describe(`GET /api/recipes/:recipe_id`, () => {
        context(`Given no recipes`, () => {
            beforeEach(() => helpers.seedUsers(db, testUsers));
            it(`responds with 404`, () => {
                const recipeId = 123456;
                return supertest(app)
                    .get(`/api/recipes/${recipeId}`)
                    .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                    .expect(404, { error: `Recipe does not exist` });
            });
        });

        context('Given there are recipes in the database', () => {
            beforeEach('insert recipes', () =>
                helpers.seedRecipesTables(
                    db,
                    testUsers,
                    testRecipes,
                    testFolders,
                )
            );

            it('responds with 200 and the specified recipe', () => {
                const recipeId = 2;
                const expectedRecipe = helpers.makeExpectedRecipe(
                    testUsers,
                    testRecipes[recipeId - 1],
                    testFolders,
                );

                return supertest(app)
                    .get(`/api/recipes/${recipeId}`)
                    .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                    .expect(200, expectedRecipe);
            });
        });

        context(`Given an XSS attack recipe`, () => {
            const testUser = helpers.makeUsersArray()[1];
            const {
                maliciousRecipe,
                expectedRecipe,
            } = helpers.makeMaliciousRecipe(testUser);

            beforeEach('insert malicious recipe', () => {
                return helpers.seedMaliciousRecipe(
                    db,
                    testUser,
                    maliciousRecipe,
                );
            });

            it('removes XSS attack content', () => {
                return supertest(app)
                    .get(`/api/recipes/${maliciousRecipe.id}`)
                    .set('Authorization', helpers.makeAuthHeader(testUser))
                    .expect(200)
                    .expect(res => {
                        expect(res.body.name).to.eql(expectedRecipe.name);
                        expect(res.body.instructions).to.eql(expectedRecipe.instructions);
                    });
            });
        });
    });
});