DROP DATABASE IF EXISTS employee_db;     -- DELETE DATABASE
CREATE DATABASE IF NOT EXISTS employee_db; -- CREATE DATABASE

USE employee_db; -- USE DATABASE

-- department table
CREATE TABLE department (
    id INT AUTO_INCREMENT PRIMARY KEY, -- dept id
    name VARCHAR(30)                   -- department name
);  

-- role table
CREATE TABLE role (
    id INT AUTO_INCREMENT PRIMARY KEY, -- role id
    title VARCHAR(30),  -- role title
    salary DECIMAL,     -- role salary
    department_id INT,  -- dept role belongs to
    FOREIGN KEY (department_id) REFERENCES department(id) -- foreign key
);

-- employee table
CREATE TABLE employee (
    id INT AUTO_INCREMENT PRIMARY KEY, -- employee id
    first_name VARCHAR(30),      -- employee fname
    last_name VARCHAR(30),       -- employee lname
    role_id INT,                 -- references employee role
    manager_id INT DEFAULT NULL, -- manager of current employee
    FOREIGN KEY (role_id) REFERENCES role(id),       -- foreign key
    FOREIGN KEY (manager_id) REFERENCES employee(id) -- foreign key
);