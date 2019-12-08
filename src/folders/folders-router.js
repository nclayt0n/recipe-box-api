const express = require('express');
const FoldersService = require('./folders-service');
const { requireAuth } = require('../middleware/jwt-auth');
const path = require('path');
const jsonParser = express.json();
const foldersRouter = express.Router();
foldersRouter
    .route('/api/folders')
    .get((req, res, next) => {
        let user_id = FoldersService.decodeAuthToken(req.headers);
        FoldersService.getAllFolders(req.app.get('db'), user_id)
            .then(folder => {
                res.status(200).json(FoldersService.serializeFolders(folder));
            })
            .catch(next);
    })
    .post(jsonParser, (req, res, next) => {
        const { name, user_id } = req.body;
        const newFolder = { name, user_id };
        for (const [key, value] of Object.entries(newFolder)) {
            if (value === null) {
                return res.status(400).json({
                    error: { message: `Missing '${key}' in request body` }
                });
            }
        }
        FoldersService.insertFolder(req.app.get('db'), newFolder)
            .then(folder => {
                res.status(201)
                    .location(path.posix.join(req.originalUrl, `/${folder.id}`))
                    .json(FoldersService.serializeFolder(folder));
            })
            .catch(next);

    });
foldersRouter
    .route('/api/folder/:folder_id')
    .get((req, res) => {
        res.json(FoldersService.serializeFolder(res.folder));
    })
    .patch(jsonParser, (req, res, next) => {
        const { name } = req.body;
        const folderToUpdate = { name }
        const numberOfValues = Object.values(folderToUpdate).filter(Boolean).length;
        if (numberOfValues === 0) {
            return res.status(400).json({ error: { message: `Request body must contain name, instructions, and ingredients` } });
        }
        FoldersService.updateFolder(req.app.get('db'), req.params.folder_id, folderToUpdate)
            .then(numRowsAffected => {
                res.status(204).end();
            })
            .catch(next);
    })

.delete((req, res, next) => {
    FoldersService.deleteFolder(req.app.get('db'), req.params.folder_id)
        .then(numRowsAffected => {
            res.status(204).end();
        })
        .catch(next);
});

/* async/await syntax for promises */
async function checkFolderExists(req, res, next) {
    try {
        const folder = await FoldersService.getById(
            req.app.get('db'),
            req.params.folder_id
        );

        if (!folder) {
            return res.status(404).json({
                error: `Folder doesn't exist`
            });
        }
        res.folder = folder;
        next();
    } catch (error) {
        next(error);
    }
}

module.exports = foldersRouter;