const xss = require('xss')
const Treeize = require('treeize')

const RecipesService = {
    getAllRecipes(db) {

        return db.from('recipebox_recipes AS rb')
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
            .groupBy('rb.id', 'usr.id')
    },
    getById(db, id) {
        return RecipeService.getAllRecipes(db)
            .where('rb.id', id)
            .first()
    },
    serializeRecipes(recipes) {
        return recipes.map(this.serializeRecipe)
    },

    serializeRecipe(recipe) {
        const recipeTree = new Treeize()

        // Some light hackiness to allow for the fact that `treeize`
        // only accepts arrays of objects, and we want to use a single
        // object.
        const recipeData = recipeTree.grow([recipe]).getData()[0]

        return {
            id: recipeData.id,
            name: xss(recipeData.name),
            date_created: recipeData.date_created,
            date_modified: recipeData.date_modified,
            ingredients: xss(recipeData.ingredients),
            instructions: xss(recipeData.instructions),
            link: xss(recipeData.link),
            created_by: xss(recipeData.created_by),
            note: xss(recipeData.note),
            user: recipeData.user || {},
        }
    },
}
const userFields = [
    'usr.id AS user:id',
    'usr.email AS user:email',
    'usr.full_name AS user:full_name',
    'usr.date_created AS user:date_created',
    'usr.date_modified AS user:date_modified',
]

module.exports = RecipesService