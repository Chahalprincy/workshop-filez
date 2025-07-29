CREATE TABLE folders (
  id serial PRIMARY KEY,
  name text UNIQUE not null
);

CREATE TABLE files (
  id serial PRIMARY KEY,
  name text not null,
  size int not null,
  folder_id int not null REFERENCES folders(id) ON DELETE CASCADE,
  UNIQUE(name, folder_id)
);
