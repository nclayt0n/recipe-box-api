CREATE TABLE recipebox_recipes(
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        date_created TIMESTAMP NOT NULL DEFAULT now(),
        date_modified TIMESTAMP,
        ingredients TEXT NOT NULL,
        instructions TEXT NOT NULL,
        link text,
        created_by TEXT,
        note TEXT,
        folder_id INTEGER 
            REFERENCES recipebox_folders(id) ON DELETE CASCADE NOT NULL,
        user_id INTEGER
            REFERENCES recipebox_users(id) ON DELETE CASCADE NOT NULL
);