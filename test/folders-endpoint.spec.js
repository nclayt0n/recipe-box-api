const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Folders Endpoints', () => {
    let db;
    const { testUsers, testFolders } = helpers.makeRecipeFixtures();
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

    describe(`POST /api/folders`, () => {
        context(`Happy Path`, () => {
            beforeEach('insert folders', () =>
                helpers.seedFoldersTable(
                    db,
                    testUsers,
                    testFolders
                )
            );
            it(`responds 201, POST folder`, () => {
                const newFolder = {
                    name: 'First',
                    user_id: 1,
                };
                return supertest(app)
                    .post('/api/folders')
                    .send(newFolder)
                    .expect(201);

            });
        });
    });

    describe(`GET /api/folders`, () => {
        context('Given there are recipes in the database', () => {
            beforeEach('insert folders', () =>
                helpers.seedFoldersTable(
                    db,
                    testUsers,
                    testFolders
                )
            );

            it('responds with 200 and all of the recipes', () => {

                return supertest(app)
                    .get('/api/folders')
                    .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                    .expect(200);
            });
        });
    });
    describe(`DELETE /api/folder/:folder_id`, () => {
        context(`Given no recipes`, () => {
            it(`responds with 404`, () => {
                const folderId = 1;
                return supertest(app)
                    .delete(`/api/folder/${folderId}`)
                    .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                    .expect(404);
            });
        });
        context('Given there are folders in the database', () => {
            const testFolders = helpers.makeFoldersArray();
            beforeEach('insert folders', () =>
                helpers.seedFoldersTable(
                    db,
                    testUsers,
                    testFolders
                )
            );
            it('removes the recipe by ID', () => {
                const idToRemove = 1;
                return supertest(app)
                    .delete(`/api/folder/${idToRemove}`)
                    .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                    .expect(204);
            });
        });
    });
    describe(`PATCH /api/folder/:folder_id`, () => {
        context(`Given no folders`, () => {
            it(`responds with 404`, () => {
                const folderId = 123456;
                return supertest(app)
                    .patch(`/api/recipe/${folderId}`)
                    .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                    .expect(404);
            });
        });
        context(`With folders`, () => {
            const testUsers = helpers.makeUsersArray();
            const testFolders = helpers.makeFoldersArray();
            beforeEach('insert folders', () =>
                helpers.seedFoldersTable(
                    db,
                    testUsers,
                    testFolders
                )
            );
            it(`responds with 204`, () => {
                const folderId = 1;
                const updatedFolder = {
                    name: 'First Test Folder',
                    user_id: 1,
                };
                return supertest(app)
                    .patch(`/api/folder/${folderId}`)
                    .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                    .send(updatedFolder)

                .expect(204);
            });
        });
    });


});