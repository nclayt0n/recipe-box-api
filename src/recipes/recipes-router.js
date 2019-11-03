const express = require('express')
const RecipesService = require('./recipes-service')
const { requireAuth } = require('../middleware/jwt-auth')

const recipesRouter = express.Router()
recipesRouter
    .route('/')
    .all(requireAuth)
    .get((req, res, next) => {
        RecipesService.getAllRecipes(req.app.get('db'))
            .then(recipes => {
                res.json(RecipesService.serializeRecipes(
                    recipes))
            })
            .catch(next)

    })

recipesRouter
    .route('/:recipe_id')
    .all(requireAuth)
    .all(checkRecipeExists)
    .get((req, res) => {
        res.json(RecipesService.serializeRecipe(res.recipe))
    })

async function checkRecipeExists(req, res, next) {
    try {
        const recipe = await RecipesService.getById(req.app.get('db'), req.params.recipe_id, )
        if (!recipe)
            return res.status(404).json({
                error: 'Recipe does not exist'
            })
        res.recipe = recipe
        next()
    } catch (error) {
        next(error)
    }
}
module.exports = recipesRouter