const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

function makeUsersArray() {
    return [{
            id: 1,
            email: 'test-user-1@aol.com',
            full_name: 'TU1',
            password: 'password',
            date_created: '2029-01-22T16:28:32.615Z',
        },
        {
            id: 2,
            email: 'test-user-2@gm.com',
            full_name: 'Test user 2',
            password: 'password',
            date_created: '2029-01-22T16:28:32.615Z',
        },
        {
            id: 3,
            email: 'test-user-3@out.com',
            full_name: 'Test user 3',
            password: 'password',
            date_created: '2029-01-22T16:28:32.615Z',
        },
        {
            id: 4,
            email: 'test-user-4',
            full_name: 'Test user 4',
            password: 'password',
            date_created: '2029-01-22T16:28:32.615Z',
        },
    ];
}

function makeRecipesArray(users, folders) {
    return [{
            "id": 1,
            "name": "Apple Pie",
            "date_modified": "2019-01-03T00:00:00.000Z",
            "folder_id": folders[1].id,
            "ingredients": [{ name: "peach", quantity: 1, unit: "cup" }, { name: "sugar", quantity: 1, unit: "cup" }, { name: "crust", quantity: 1, unit: "package" }],
            "instructions": "Corporis accusamus placeat quas non voluptas. Harum fugit molestias qui. Velit ex animi reiciendis quasi. Suscipit totam delectus ut voluptas aut qui rerum. Non veniam eius molestiae rerum quam.\n \rUnde qui aperiam praesentium alias. Aut temporibus id quidem recusandae voluptatem ut eum. Consequatur asperiores et in quisquam corporis maxime dolorem soluta. Et officiis id est quia sunt qui iste reiciendis saepe. Ut aut doloribus minus non nisi vel corporis. Veritatis mollitia et molestias voluptas neque aspernatur reprehenderit..",
            "link": "http://www.notArealSite.com",
            "created_by": "Oprah",
            "note": "enjoy",
            user_id: users[1].id,
        },
        {
            "id": 2,
            "name": "Pumpkin Pie",
            "date_modified": "2018-08-15T23:00:00.000Z",
            "folder_id": folders[0].id,
            "ingredients": [{ name: "pumpkin", quantity: 2, unit: "cup" }, { name: "sugar", quantity: 1, unit: "cup" }, { name: "crust", quantity: 1, unit: "package" }],
            "instructions": "Corporis accusamus placeat quas non voluptas. Harum fugit molestias qui. Velit ex animi reiciendis quasi. Suscipit totam delectus ut voluptas aut qui rerum. Non veniam eius molestiae rerum quam.\n \rUnde qui aperiam praesentium alias. Aut temporibus id quidem recusandae voluptatem ut eum. Consequatur asperiores et in quisquam corporis maxime dolorem soluta. Et officiis id est quia sunt qui iste reiciendis saepe. Ut aut doloribus minus non nisi vel corporis. Veritatis mollitia et molestias voluptas neque aspernatur reprehenderit..",
            "link": "http://www.notArealSite.com",
            "created_by": "Barb",
            "note": "enjoy",
            user_id: users[1].id,
        },
        {
            "id": 3,
            "name": "Peach Pie",
            "date_modified": "2018-03-01T00:00:00.000Z",
            "folder_id": folders[1].id,
            "ingredients": [{ name: "peach", quantity: 1, unit: "cup" }, { name: "sugar", quantity: 1, unit: "cup" }, { name: "crust", quantity: 1, unit: "package" }],
            "instructions": "Corporis accusamus placeat quas non voluptas. Harum fugit molestias qui. Velit ex animi reiciendis quasi. Suscipit totam delectus ut voluptas aut qui rerum. Non veniam eius molestiae rerum quam.\n \rUnde qui aperiam praesentium alias. Aut temporibus id quidem recusandae voluptatem ut eum. Consequatur asperiores et in quisquam corporis maxime dolorem soluta. Et officiis id est quia sunt qui iste reiciendis saepe. Ut aut doloribus minus non nisi vel corporis. Veritatis mollitia et molestias voluptas neque aspernatur reprehenderit..",
            "link": "http://www.notArealSite.com",
            "created_by": "Mom",
            user_id: users[1].id,
        },
        {
            "id": 4,
            "name": "Sweet Potato Pie",
            "date_modified": "2019-01-04T00:00:00.000Z",
            "folder_id": folders[0].id,
            "ingredients": [{ name: "sweet potatoes", quantity: 3, unit: "cup" }, { name: "sugar", quantity: 1.5, unit: "cup" }, { name: "crust", quantity: 1, unit: "package" }],
            "instructions": "Corporis accusamus placeat quas non voluptas. Harum fugit molestias qui. Velit ex animi reiciendis quasi. Suscipit totam delectus ut voluptas aut qui rerum. Non veniam eius molestiae rerum quam.\n \rUnde qui aperiam praesentium alias. Aut temporibus id quidem recusandae voluptatem ut eum. Consequatur asperiores et in quisquam corporis maxime dolorem soluta. Et officiis id est quia sunt qui iste reiciendis saepe. Ut aut doloribus minus non nisi vel corporis. Veritatis mollitia et molestias voluptas neque aspernatur reprehenderit..",
            "link": "http://www.notArealSite.com",
            "created_by": "Coolio",
            "note": "enjoy",
            user_id: users[1].id,
        }
    ];
}

function makeFoldersArray(users) {
    return [{
            id: 1,
            name: 'First Folder',
            user_id: users[0].id,
            date_created: '2029-01-22T16:28:32.615Z',
        },
        {
            id: 2,
            name: 'Second Folder',
            user_id: users[1].id,
            date_created: '2029-01-22T16:28:32.615Z',
        },
        {
            id: 3,
            name: 'Third Folder',
            user_id: users[2].id,
            date_created: '2029-01-22T16:28:32.615Z',
        },
        {
            id: 4,
            name: 'Fourth Folder',
            user_id: users[3].id,
            date_created: '2029-01-22T16:28:32.615Z',
        }
    ];
}

function makeExpectedRecipe(users, recipe, folders = []) {
    const user = users
        .find(user => user.id === recipe.user_id);

    return {
        id: recipe.id,
        name: recipe.name,
        instructions: recipe.instuctions,
        date_created: recipe.date_created,
        user: {
            id: user.id,
            email: user.email,
            full_name: user.full_name,
            date_created: user.date_created,
        },
    };
}


function makeExpectedFolder(users, folderId, folders) {
    const expectedFolders = folders
        .filter(folder => folder.id === folderId);

    return expectedFolders.map(folder => {
        const folderUser = users.find(user => user.id === folder.user_id);
        return {
            id: folder.id,
            name: folder.name,
            date_created: folder.date_created,
            user: {
                id: folderUser.id,
                email: folderUser.email,
                full_name: folderUser.full_name,
                date_created: folderUser.date_created,
            }
        };
    });
}

function makeMaliciousRecipe(user) {
    const maliciousRecipe = {
        id: 911,
        link: 'http://www.placehold.com',
        date_created: new Date().toISOString(),
        name: 'Naughty naughty very naughty <script>alert("xss");</script>',
        user_id: user.id,
        instructions: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
        ingredients: [{ name: 'bad apple' }],
        folder_id: 1
    };
    const expectedRecipe = {
        ...makeExpectedRecipe([user], maliciousRecipe),
        name: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
        instuctions: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`,
        ingredients: [{ name: 'bad apple' }],
        folder_id: 1
    };
    return {
        maliciousRecipe,
        expectedRecipe,
    };
}

function makeRecipeFixtures() {
    const testUsers = makeUsersArray();
    const testFolders = makeFoldersArray(testUsers);
    const testRecipes = makeRecipesArray(testUsers, testFolders);
    return { testUsers, testRecipes, testFolders };
}

function cleanTables(db) {
    return db.raw(
        `TRUNCATE
      recipebox_recipes,
      recipebox_folders,
      recipebox_users
      RESTART IDENTITY CASCADE`
    );
}

function seedUsers(db, users) {
    const preppedUsers = users.map(user => ({
        ...user,
        password: bcrypt.hashSync(user.password, 1)
    }));
    return db.into('recipebox_users').insert(preppedUsers)
        .then(() =>
            //update the auto sequence to stay in sync
            db.raw(
                `SELECT setval('recipebox_users_id_seq',?)`, [users[users.length - 1].id],
            ));
}

function seedRecipesTables(db, users, recipes, folders = []) {
    //use a transaction to group the queries and auto rollback on any failure

    return db.transaction(async trx => {
        await seedUsers(trx, users);
        await trx.into('recipebox_recipes').insert(recipes);
        await trx.raw(
            `SELECT setval('recipebox_recipes_id_seq',?)`, [recipes[recipes.length - 1].id]
        );
    });
}

function seedMaliciousRecipe(db, user, recipe) {
    return seedUsers(db, [user])
        .then(() =>
            db
            .into('recipebox_recipes')
            .insert([recipe])
        );
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
    const token = jwt.sign({ user_id: user.id }, secret, {
        subject: user.email,
        algorithm: 'HS256',
    });
    return `Bearer ${token}`;
}

module.exports = {
    makeUsersArray,
    makeRecipesArray,
    makeExpectedFolder,
    makeMaliciousRecipe,
    makeFoldersArray,
    makeAuthHeader,
    makeRecipeFixtures,
    cleanTables,
    seedRecipesTables,
    seedMaliciousRecipe,
    seedUsers,
};