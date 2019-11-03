const xss = require('xss')
const bcrypt = require('bcryptjs')
const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/

const UsersService = {
    validatePassword(password) {
        if (password.length < 8) {
            return 'Password must be longer than 8 characters'
        }
        if (password.length > 72) {
            return 'Password must be less than 72 characters'
        }
        if (password.startsWith(' ') || password.endsWith(' ')) {
            return 'Password must not start or end with empty spaces'
        }
        if (!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
            return 'Password must contain 1 upper case, lower case, number and special character'
        }
        return null
    },
    hasUserWithEmail(db, email) {
        return db('recipebox_users')
            .where({ email })
            .first()
            .then(email => !!email)
    },
    hashPassword(password) {
        return bcrypt.hash(password, 12)
    },

    insertUser(db, newUser) {
        return db
            .insert(newUser)
            .into('recipebox_users')
            .returning('*')
            .then(([user]) => user)

    },
    serializeUser(user) {
        return {
            id: user.id,
            full_name: xss(user.full_name),
            email: xss(user.email),
            date_created: new Date(user.date_created)
        }
    },
}
module.exports = UsersService