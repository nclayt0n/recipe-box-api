BEGIN;

TRUNCATE
recipebox_users,
recipebox_folders,
recipebox_recipes
RESTART IDENTITY CASCADE;

 
INSERT INTO recipebox_users(email,full_name,password)
VALUES
('dunder@hotmail.com', 'Dunder Mifflin','$2a$12$y0TIxHPEr0bGX6DH2QIL4ewA2Y44dsHi5Jb7gS7fhnYHCW2uAVPZK'),
  ('b.deboop@outlook.com', 'Bodeep Deboop', '$2a$12$S.rA/AVE7xqVxJSRnhILm.YpkxUn0M.xI/W7j87GmCLZ6jcZPA29O'),
  ('c.bloggs@gmail.com', 'Charlie Bloggs','$2a$12$3JY0O7bXmhkizMdVwBQd5uVVKNVi4TYTjClJyFgBs/ZJyNVoIzM76');

 INSERT INTO recipebox_folders(name,user_id)
  VALUES
  ('Pie',1),
  ('Food',2);

  INSERT INTO recipebox_recipes(name,ingredients,instructions,link,created_by,note,user_id,folder_id)
  VALUES
  ('ApplePie', ARRAY['{"name": "apple", "quantity": 1, "unit": "cup" }', '{ "name": "sugar", "quantity": 1, "unit": "cup" }', '{ "name": "crust", "quantity": 1, "unit": "package" }'],'preheat oven, mix ingredients, bake,enjoy',null,'Momma Rock','Easy as Pie',1,1),
  ('PeachPie', ARRAY['{"name": "peach", "quantity": 1, "unit": "cup" }', '{ "name": "sugar", "quantity": 1, "unit": "cup" }', '{ "name": "crust", "quantity": 1, "unit": "package" }'],'preheat oven, mix ingredients, bake,enjoy',null,'Momma Clay','Easy as Pie',2,1);

  COMMIT;