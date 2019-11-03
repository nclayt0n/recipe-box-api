CREATE TABLE recipebox_folders(
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    user_id INTEGER
        REFERENCES recipebox_users(id) ON DELETE CASCADE NOT NULL
);
