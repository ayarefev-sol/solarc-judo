CREATE TABLE judokas (
id INTEGER PRIMARY KEY AUTOINCREMENT,
name TEXT,
belt TEXT,
weight_class TEXT
);

CREATE TABLE randori (
id INTEGER PRIMARY KEY AUTOINCREMENT,
judoka_id INTEGER,
opponent TEXT,
throws_attempted INTEGER,
throws_scored INTEGER,
ippon INTEGER,
waza_ari INTEGER,
shido INTEGER,
osaekomi_seconds INTEGER
);