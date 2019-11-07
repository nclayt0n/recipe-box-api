const xss = require('xss')
const Treeize = require('treeize')
const atob = require('atob')

const FoldersService = {
    decodeAuthToken(header) {
        let token = header.authorization
        let base64Url = token.split('.')[1];
        let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        let jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        let user_id = JSON.parse(jsonPayload).user_id;

        return user_id
    },
    getAllFolders(db, user_id) {
        return db
            .from('recipebox_folders AS f')
            .select(
                'f.id',
                'f.name',
                ...userFields,
            )
            .where({ 'f.user_id': user_id })
            .rightJoin(
                'recipebox_recipes AS rb', 'rb.folder_id',
                'f.id',

            )
            .rightJoin(
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
            user: folderData.user || {},
        }
    },
    insertFolder(db, newFolder) {
        return db.insert(newFolder)
            .into('recipebox_folders')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    deleteFolder(db, id) {
        return db('recipebox_folders').where({ id }).delete()
    },
    updateFolder(db, id, newFolderFields) {
        return db('recipebox_folders').where({ id }).update(newFolderFields)
    },
}
const recipefields = [
    'rb.id AS recipe:id',
    'rb.name AS recipe:name ',
    'rb.date_created AS recipes:date_created',
    'rb.date_modified AS recipes:date_modified',
    'rb.ingredients AS recipes:ingredients',
    'rb.instructions AS recipes:instructions',
    'rb.link AS recipes:link',
    'rb.created_by AS recipes:created_by',
    'rb.note AS recipes:note',
    'rb.folder_id AS recipes:folder_id',
]
const userFields = [
    'usr.id AS user:id',
    'usr.email AS user:email',
    'usr.full_name AS user:full_name',
    'usr.date_created AS user:date_created',
    'usr.date_modified AS user:date_modified',
]

module.exports = FoldersService