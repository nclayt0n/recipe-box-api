const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Recipes Endpoints', () => {
    let db;
    const { testUsers, testRecipes, testFolders } = helpers.makeRecipeFixtures();
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

    describe(`POST /api/recipes`, () => {
        context(`Happy Path`, () => {
            beforeEach('insert recipes', () =>
                helpers.seedRecipesTables(
                    db,
                    testUsers,
                    testRecipes,
                    testFolders
                )
            );
            it(`responds 201, POST recipe`, () => {
                const newRecipe = {
                    "name": "Sweet Potato Pie",
                    "folder_id": 1,
                    "ingredients": '[{ name: "sweet potatoes", quantity: 3, unit: "cup" }, { name: "sugar", quantity: 1.5, unit: "cup" }, { name: "crust", quantity: 1, unit: "package" }]',
                    "instructions": "Corporis accusamus placeat quas non voluptas. Harum fugit molestias qui. Velit ex animi reiciendis quasi. Suscipit totam delectus ut voluptas aut qui rerum. Non veniam eius molestiae rerum quam.",
                    "link": "http://www.notArealSite.com",
                    "created_by": "Coolio",
                    "note": "enjoy",
                    user_id: 1
                };
                return supertest(app)
                    .post('/api/recipes')
                    .send(newRecipe)
                    .expect(201)
                    .expect(res => {
                        expect(res.body).to.have.property('id');
                        expect(res.body.name).to.eql(newRecipe.name);
                        expect(res.body.instructions).to.eql(newRecipe.instructions);
                        expect(res.headers.location).to.eql(`/api/recipes/${res.body.id}`);
                        const expectedDate = new Date().toLocaleString('en', { timeZone: 'UTC' });
                        const actualDate = new Date(res.body.date_created).toLocaleString();
                        expect(actualDate).to.eql(expectedDate);
                    })
                    .expect(res =>
                        db
                        .from('recipebox_recipes')
                        .select('*')
                        .where({ id: res.body.id })
                        .first()
                        .then(row => {
                            expect(row.name).to.eql(newRecipe.name);
                            expect(row.instructions).to.eql(newRecipe.instructions);
                            const expectedDate = new Date().toLocaleString('en', { timeZone: 'UTC' });
                            const actualDate = new Date(row.date_created).toLocaleString();
                            expect(actualDate).to.eql(expectedDate);
                        })
                    );

            });
        });
    });

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

                return supertest(app)
                    .get('/api/recipes')
                    .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                    .expect(200);
            });
        });
    });
    describe(`DELETE /api/recipe/:recipe_id`, () => {
        context(`Given no recipes`, () => {
            it(`responds with 404`, () => {
                const recipeId = 1;
                return supertest(app)
                    .delete(`/api/recipe/${recipeId}`)
                    .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                    .expect(404);
            });
        });
        context('Given there are recipes in the database', () => {
            const testRecipes = helpers.makeRecipesArray();
            beforeEach(() => helpers.seedRecipesTables(
                db,
                testUsers,
                testRecipes,
                testFolders
            ));

            it('removes the recipe by ID', () => {
                const idToRemove = 1;
                return supertest(app)
                    .delete(`/api/recipe/${idToRemove}`)
                    .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                    .expect(204);
            });
        });
    });
    describe(`PATCH /api/recipe/:recipe_id`, () => {
        context(`Given no recipes`, () => {
            beforeEach(() => helpers.seedUsers(db, testUsers));
            it(`responds with 404`, () => {
                const recipeId = 123456;
                return supertest(app)
                    .patch(`/api/recipe/${recipeId}`)
                    .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                    .expect(404);
            });
        });
        context(`With recipes`, () => {
            const testUsers = helpers.makeUsersArray();
            const testFolders = helpers.makeFoldersArray();
            const testRecipes = helpers.makeRecipesArray();
            beforeEach(() => helpers.seedRecipesTables(
                db,
                testUsers,
                testRecipes,
                testFolders
            ));
            it(`responds with 204`, () => {
                const recipeId = 1;
                const updatedRecipe = {
                    "name": "Sweet Potato Pie",
                    "folder_id": 1,
                    "ingredients": '[{ name: "sweet potatoes", quantity: 3, unit: "cup" }, { name: "sugar", quantity: 1.5, unit: "cup" }, { name: "crust", quantity: 1, unit: "package" }]',
                    "instructions": "Corporis accusamus placeat quas non voluptas.",
                    "link": "http://www.notArealSite.com",
                    "created_by": "Coolio",
                    "note": "enjoy",
                    user_id: 1
                };

                return supertest(app)
                    .patch(`/api/recipe/${recipeId}`)
                    .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                    .send(updatedRecipe)

                .expect(204);
            });
        });
    });
});