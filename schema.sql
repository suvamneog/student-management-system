CREATE TABLE users (
    id VARCHAR(50) PRIMARY KEY,
    fullname VARCHAR(60) UNIQUE,
    rollnumber VARCHAR(60) UNIQUE,
    class VARCHAR(50) NOT NULL,
    grade VARCHAR(50) NOT NULL
);