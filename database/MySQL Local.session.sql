CREATE TABLE profile (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    country VARCHAR(100),
    district VARCHAR(100)
);

CREATE TABLE running_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    profile_id INT,
    date DATE,
    distance_km FLOAT,
    FOREIGN KEY (profile_id) REFERENCES profile(id)
);

ALTER TABLE running_log
    ADD COLUMN submitted_at DATETIME DEFAULT NULL,
    ADD COLUMN is_valid_run BOOLEAN NOT NULL DEFAULT FALSE;

ALTER TABLE running_log
	 Drop COLUMN submitted_at;


