const xss = require('xss')
const Treeize = require('treeize')

const FoldersService = {
    getAllFolders(db) {
        return db
            .from('recipebox_folders AS f')
            .select(
                'f.id',
                'f.name',
                ...userFields,
            )
            .leftJoin(
                'recipebox_recipes AS rb',
                'f.id',
                'rb.id',
            )
            .leftJoin(
                'recipebox_users AS usr',
                'f.user_id',
                'usr.id',
            )
            .groupBy('f.id', 'usr.id')
    },

    getById(db, id) {
        return FoldersService.getAllFolders(db)
            .where('f.id', id)
            .first()
    },

    serializeFolders(folders) {
        return folders.map(this.serializeFolder)
    },

    serializeFolder(folder) {
        const folderTree = new Treeize()

        // Some light hackiness to allow for the fact that `treeize`
        // only accepts arrays of objects, and we want to use a single
        // object.
        const folderData = folderTree.grow([folder]).getData()[0]

        return {
            id: folderData.id,
            name: xss(folderData.name),
            date_created: folderData.date_created,
            date_modified: folderData.date_modified,
            user: folderData.user || {},
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

module.exports = FoldersService