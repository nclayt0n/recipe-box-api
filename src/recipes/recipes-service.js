const xss = require('xss');
const Treeize = require('treeize');
const atob = require('atob');
const RecipesService = {
    decodeAuthToken(header) {
        let token = header.authorization;
        let base64Url = token.split('.')[1];
        let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        let jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        let user_id = JSON.parse(jsonPayload).user_id;

        return user_id;
    },
    getAllRecipes(db, user_id) {
        return db
            .from('recipebox_recipes AS rb')
            .select(
                'rb.id',
                'rb.name',
                'rb.date_created',
                'rb.date_modified',
                'rb.ingredients',
                'rb.instructions',
                'rb.link',
                'rb.created_by',
                'rb.note',
                'rb.folder_id',
                ...userFields,
            )
            .where({ 'rb.user_id': user_id })
            .leftJoin(
                'recipebox_folders AS f',
                'f.id',
                'rb.folder_id',
            )
            .leftJoin(
                'recipebox_users AS usr',
                'rb.user_id',
                'usr.id',
            )
            .groupBy('rb.id', 'usr.id');
    },

    getById(db, id, userId) {
        return RecipesService.getAllRecipes(db, userId)
            .where('rb.id', id)
            .first();
    },
    serializeRecipes(recipes) {

        return recipes.map(this.serializeRecipe);
    },

    serializeRecipe(recipe) {
        const recipeTree = new Treeize();

        // Some light hackiness to allow for the fact that `treeize`
        // only accepts arrays of objects, and we want to use a single
        // object.
        const recipeData = recipeTree.grow([recipe]).getData()[0];
        let r = {
            id: recipeData.id,
            name: xss(recipeData.name),
            date_created: recipeData.date_created,
            date_modified: recipeData.date_modified,
            ingredients: JSON.parse(recipeData.ingredients),
            instructions: xss(recipeData.instructions),
            link: xss(recipeData.link),
            created_by: xss(recipeData.created_by),
            note: xss(recipeData.note),
            folder_id: recipeData.folder_id,
            user: recipeData.user || {},
        };
        return r;
    },
    insertRecipe(db, newRecipe) {
        newRecipe.ingredients = JSON.stringify(newRecipe.ingredients);
        return db.insert(newRecipe)
            .into('recipebox_recipes')
            .returning('*')
            .then(rows => {
                return rows[0];
            });
    },
    deleteRecipe(db, id) {
        return db('recipebox_recipes').where({ id }).delete();
    },
    updateRecipe(db, id, newRecipeField) {
        id = parseInt(id);
        newRecipeField.ingredients = JSON.stringify(newRecipeField.ingredients);
        return db('recipebox_recipes').where({ id }).update(newRecipeField);
    },
};

const userFields = [
    'usr.id AS user:id',
    'usr.email AS user:email',
    'usr.full_name AS user:full_name',
    'usr.date_created AS user:date_created',
    'usr.date_modified AS user:date_modified',
];

module.exports = RecipesService;