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
    insertFolders(db, newFolder) {
        return db.insert(newFolder)
            .into('folders')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
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
        console.log(folderData)
        return {
            id: folderData.id,
            name: xss(folderData.name),
            date_created: folderData.date_created,
            date_modified: folderData.date_modified,
            user_id: folderData.user || {},
        }
    },
    deleteFolder(db, id) {
        return db('folders').where({ id }).delete()
    },
    updateFolder(db, id, newFolderFields) {
        return db('folders').where({ id }).update(newFolderFields)
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