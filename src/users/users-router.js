const express = require('express')
const path = require('path')
const UsersService = require('./users-service')
const usersRouter = express.Router()
const jsonBodyParser = express.json()

usersRouter
    .post('/', jsonBodyParser, (req, res, next) => {

        const { password, email, full_name } = req.body
        for (const field of['full_name', 'email', 'password'])
            if (!req.body[field])
                return res.status(400).json({
                    error: `Missing '${field}' in request body`
                })
        const passwordError = UsersService.validatePassword(password)
        if (passwordError)
            return res.status(400).json({ error: passwordError })
        UsersService.hasUserWithEmail(
                req.app.get('db'),
                email
            )
            .then(hasUserwithEmail => {
                if (hasUserwithEmail)
                    return res.status(400).json({ error: `Email is already in use` })
                return UsersService.hashPassword(password)
                    .then(hashedPassword => {
                        const newUser = {
                            password: hashedPassword,
                            email,
                            full_name,
                            date_created: 'now()',
                        }
                        return UsersService.insertUser(
                                req.app.get('db'),
                                newUser
                            )
                            .then(user => {
                                res.status(201)
                                    .location(path.posix.join(req.originalUrl, `${user.id}`))
                                    .json(UsersService.serializeUser(user))
                            })
                    })
            })
            .catch(next)
    })
module.exports = usersRouter