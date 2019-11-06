const express = require('express')
const RecipesService = require('./recipes-service')
const { requireAuth } = require('../middleware/jwt-auth')
const path = require('path')
const jsonParser = express.json()
const recipesRouter = express.Router()
recipesRouter
    .route('/api/recipes')
    // .all(requireAuth)
    .get((req, res, next) => {
        RecipesService.getAllRecipes(req.app.get('db'))
            .then(recipes => {
                console.log(recipes)
                res.json(RecipesService.serializeRecipes(
                    recipes))
            })
            .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        console.log(req.body)
        const { name, date_created, ingredients, instructions, link, created_by, note, folder_id, user_id } = req.body

        const newRecipe = { name, date_created, ingredients, instructions, link, created_by, note, folder_id, user_id }
        for (const [key, value] of Object.entries(newRecipe))
        // if (value == null)
        //     return res.status(400).json({
        //         error: { message: `Missing '${key}' in request body` }
        //     });
            console.log(newRecipe)
        RecipesService.insertRecipe(req.app.get('db'), newRecipe)
            .then(recipe => {
                res.status(201)
                    .location(path.posix.join(req.originalUrl, `/${recipe.id}`))
                    .json(RecipesService.serializeRecipe(recipe))
            })
            .catch(next)
    })
recipesRouter
    .route('/api/recipe/:recipe_id')
    // .all(requireAuth)
    .all(checkRecipeExists)
    .get((req, res) => {
        res.json(RecipesService.serializeRecipe(res.recipe))
    })
    .delete((req, res, next) => {
        RecipesService.deleteRecipe(req.app.get('db'), req.params.recipe_id)
            .then(numRowsAffected => {
                res.status(204).end()
            })
            .catch(next)
    })
    .patch(jsonParser, (req, res, next) => {
        const { id, name, date_created, ingredients, instructions, link, created_by, note, folder_id, } = req.body
        const recipeToUpdate = { id, name, date_created, ingredients, instructions, link, created_by, note, folder_id, }
        const numberOfValues = Object.values(recipeToUpdate).filter(Boolean).length
        if (numberOfValues === 0) {
            return res.status(400).json({ error: { message: `Request body must contain name, instructions, and ingredients` } })
        }
        RecipesService.updateRecipe(req.app.get('db'), req.params.recipe_id, recipeToUpdate)
            .then(numRowsAffected => {
                res.status(204).end()
            })
            .catch(next)
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