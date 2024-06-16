DROP TABLE IF EXISTS user;


-- for sqlite


-- 作者表
CREATE TABLE user (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL, -- 作者名字
    password TEXT NOT NULL
);
