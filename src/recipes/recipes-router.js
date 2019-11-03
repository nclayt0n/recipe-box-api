const express = require('express')
const RecipesService = require('./recipes-service')
    // const { requireAuth } = require('../middleware/jwt-auth')

const recipesRouter = express.Router()
recipesRouter
    .route('/api/recipes')
    .get((req, res, next) => {
        RecipesService.getAllRecipes(req.app.get('db'))
            .then(recipes => {
                res.json(recipes)
            })
            .catch(next)

    })
module.exports = recipesRouter