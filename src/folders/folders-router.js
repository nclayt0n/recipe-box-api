const express = require('express')
const FoldersService = require('./folders-service')
const { requireAuth } = require('../middleware/jwt-auth')
const jsonParser = express.json()
const foldersRouter = express.Router()
foldersRouter
    .route('/api/folders')
    // .all(requireAuth)
    .get((req, res, next) => {
        FoldersService.getAllFolders(req.app.get('db'))
            .then(folder => {
                res.json(FoldersService.serializeFolders(folder))
            })
            .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        const { name, user_id } = req.body
        const newFolder = { name, user_id }
        for (const [key, value] of Object.entries(newFolder))
            if (value == null)
                return res.status(400).json({
                    error: { message: `Missing '${key}' in request body` }
                })
        console.log(newFolder)
        FoldersService.insertFolders(req.app.get('db'), newFolder)

        .then(folder => {
                res.status(201)
                    .location(path.posix.join(req.originalUrl, `/${folder.id}`))
                    .json(FoldersService.serializeFolder(folder))
            })
            .catch(next)
    })

foldersRouter
    .route('/api/folder:folder_id')
    // .all(requireAuth)
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