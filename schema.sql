
CREATE DATABASE IF NOT EXISTS sRMS;
USE sRMS;


CREATE OR ALTER TABLE Users (
    id CHAR(36) PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    passwordHash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'staff') NOT NULL
);

CREATE TABLE MenuItems (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(50)
);

CREATE TABLE Orders (
    id CHAR(36) PRIMARY KEY,
    userId CHAR(36),
    status ENUM('pending', 'complete', 'expired') DEFAULT 'pending',
    FOREIGN KEY (userId) REFERENCES Users(id)
);

CREATE TABLE OrderItems (
    id CHAR(36) PRIMARY KEY,
    orderId CHAR(36),
    menuItemId CHAR(36),
    quantity INT DEFAULT 1,
    FOREIGN KEY (orderId) REFERENCES Orders(id),
    FOREIGN KEY (menuItemId) REFERENCES MenuItems(id)
);
