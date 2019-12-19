const uuidv4 = require('uuid/v4');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

function makeUsersArray() {
    return [{
            email: 'test-user-1@aol.com',
            full_name: 'TU1',
            password: '$2a$12$3JY0O7bXmhkizMdVwBQd5uVVKNVi4TYTjClJyFgBs/ZJyNVoIzM76',
        },
        {
            email: 'test-user-2@gm.com',
            full_name: 'Test user 2',
            password: '$2a$12$3JY0O7bXmhkizMdVwBQd5uVVKNVi4TYTjClJyFgBs/ZJyNVoIzM76',
        },
        {
            email: 'test-user-3@out.com',
            full_name: 'Test user 3',
            password: '$2a$12$3JY0O7bXmhkizMdVwBQd5uVVKNVi4TYTjClJyFgBs/ZJyNVoIzM76',
        },
        {
            email: 'test-user-4@out.com',
            full_name: 'Test user 4',
            password: '$2a$12$3JY0O7bXmhkizMdVwBQd5uVVKNVi4TYTjClJyFgBs/ZJyNVoIzM76',
        },
    ];
}

function makeRecipesArray(users, folders) {
    return [{
            "name": "Apple Pie",
            "folder_id": 1,
            "ingredients": '[{ name: "peach", quantity: 1, unit: "cup" }, { name: "sugar", quantity: 1, unit: "cup" }, { name: "crust", quantity: 1, unit: "package" }]',
            "instructions": "Corporis accusamus placeat quas non voluptas. Harum fugit molestias qui. Velit ex animi reiciendis quasi. Suscipit totam delectus ut voluptas aut qui rerum. Non veniam eius molestiae rerum quam.",
            "link": "http://www.notArealSite.com",
            "created_by": "Oprah",
            "note": "enjoy",
            user_id: 1,
        },
        {
            "name": "Pumpkin Pie",
            "folder_id": 1,
            "ingredients": '[{ name: "pumpkin", quantity: 2, unit: "cup" }, { name: "sugar", quantity: 1, unit: "cup" }, { name: "crust", quantity: 1, unit: "package" }]',
            "instructions": "Corporis accusamus placeat quas non voluptas. Harum fugit molestias qui. Velit ex animi reiciendis quasi. Suscipit totam delectus ut voluptas aut qui rerum. Non veniam eius molestiae rerum quam.",
            "link": "http://www.notArealSite.com",
            "created_by": "Barb",
            "note": "enjoy",
            user_id: 1,
        },
        {
            "name": "Peach Pie",
            "folder_id": 1,
            "ingredients": '[{ name: "peach", quantity: 1, unit: "cup" }, { name: "sugar", quantity: 1, unit: "cup" }, { name: "crust", quantity: 1, unit: "package" }]',
            "instructions": "Corporis accusamus placeat quas non voluptas. Harum fugit molestias qui. Velit ex animi reiciendis quasi. Suscipit totam delectus ut voluptas aut qui rerum. Non veniam eius molestiae rerum quam.",
            "link": "http://www.notArealSite.com",
            "created_by": "Mom",
            user_id: 1,
        },
        {
            "name": "Sweet Potato Pie",
            "folder_id": 1,
            "ingredients": '[{ name: "sweet potatoes", quantity: 3, unit: "cup" }, { name: "sugar", quantity: 1.5, unit: "cup" }, { name: "crust", quantity: 1, unit: "package" }]',
            "instructions": "Corporis accusamus placeat quas non voluptas. Harum fugit molestias qui. Velit ex animi reiciendis quasi. Suscipit totam delectus ut voluptas aut qui rerum. Non veniam eius molestiae rerum quam.",
            "link": "http://www.notArealSite.com",
            "created_by": "Coolio",
            "note": "enjoy",
            user_id: 1,
        }
    ];
}

function makeFoldersArray(users) {
    return [{
            id: 1,
            name: 'First Folder',
            user_id: 1,

        },
        {
            id: 2,
            name: 'Second Folder',
            user_id: 1,

        },
        {
            id: 3,
            name: 'Third Folder',
            user_id: 1,

        },
        {
            id: 4,
            name: 'Fourth Folder',
            user_id: 1,

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

function makeRecipeFixtures() {
    const testUsers = makeUsersArray();
    const testFolders = makeFoldersArray(testUsers);
    const testRecipes = makeRecipesArray(testUsers, testFolders).map(recipe => { JSON.stringify(recipe.ingredients); });
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

function seedFolders(db, folders) {
    return db.into('recipebox_folders').insert(folders);
}

function seedUsers(db, users) {
    const preppedUsers = users.map(user => ({
        ...user,
        password: bcrypt.hashSync(user.password, 1)
    }));
    return db.into('recipebox_users').insert(preppedUsers);
    // .then(() =>
    //     //update the auto sequence to stay in sync
    //     db.raw(
    //         `SELECT setval('recipebox_users_id_seq',?)`, [users[users.length - 1].id],
    //     ));
}

function seedRecipesTables(db, users, recipes, folders) {
    return db.transaction(async trx => {
        await seedUsers(trx, users);
        await seedFolders(trx, folders);
        await trx.into('recipebox_recipes').insert(recipes);
        // await trx.raw(
        //     `SELECT setval('recipebox_recipes_id_seq',?)`, [recipes[recipes.length - 1].id]
        // );
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
    const token = jwt.sign({ user_id: 1 }, secret, {
        subject: user.email,
        algorithm: 'HS256',
    });
    return `Bearer ${token}`;
}

module.exports = {
    makeUsersArray,
    makeRecipesArray,
    makeExpectedRecipe,
    makeExpectedFolder,
    makeFoldersArray,
    makeAuthHeader,
    makeRecipeFixtures,
    cleanTables,
    seedRecipesTables,
    seedMaliciousRecipe,
    seedUsers,
};