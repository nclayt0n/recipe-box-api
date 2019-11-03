const express = require('express')
const FoldersService = require('./folders-service')
const { requireAuth } = require('../middleware/jwt-auth')
const foldersRouter = express.Router()
foldersRouter
    .route('/')
    .get((req, res, next) => {
        FoldersService.getAllFolders(req.app.get('db'))
            .then(folder => {
                res.json(FoldersService.serializeFolders(folder))
            })
            .catch(next)
    })

foldersRouter
    .route('/:folder_id')
    .all(requireAuth)
    .all(checkFolderExists)
    .get((req, res) => {
        res.json(FoldersService.serializeFolder(res.folder))
    })

/* async/await syntax for promises */
async function checkFolderExists(req, res, next) {
    try {
        const folder = await FoldersService.getById(
            req.app.get('db'),
            req.params.folder_id
        )

        if (!folder)
            return res.status(404).json({
                error: `Folder doesn't exist`
            })

        res.folder = folder
        next()
    } catch (error) {
        next(error)
    }
}

module.exports = foldersRouter