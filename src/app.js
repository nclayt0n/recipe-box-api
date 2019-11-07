require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const app = express()
const morganOptions = (NODE_ENV === 'production') ? 'tiny' : 'dev';
const usersRouter = require('./users/users-router')
const recipesRouter = require('./recipes/recipes-router')
const foldersRouter = require('./folders/folders-router')
const authRouter = require('./auth/auth-router')
app.use(morgan(morganOptions))
app.use(helmet())
app.use(cors())

app.use('/api/users', usersRouter)
app.use('/api/recipes', recipesRouter)
app.use('/api/folders', foldersRouter)
app.use('/api/auth/login', authRouter)
app.use(function userId(req, res, next) {
    JWT.verify(req.cookies['token'], 'YOUR_SECRET', function(err, decodedToken) {
        if (err) { /* handle token err */ } else {
            req.userId = decodedToken.id; // Add to req object
            next();
        }
    });
});
app.use(function errorHandler(error, req, res, next) {
    let response
    if (NODE_ENV === 'production') {
        response = { error: { message: 'Server Error' } }
    } else {
        console.error(error)
        response = { message: error.message, error }
    }
    res.status(500).json(response)
})
module.exports = app